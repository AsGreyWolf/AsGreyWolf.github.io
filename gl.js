"use strict";

function initGL(canvas) {
	var gl;
	try {
		gl = WebGLUtils.setupWebGL(canvas);
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.drawBuffersExt = gl.getExtension('WEBGL_draw_buffers');
		gl.floatExt = gl.getExtension('OES_texture_half_float');
	} catch (e) {}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	} else if (!gl.drawBuffersExt) {
		alert("Could not initialise WEBGL_draw_buffers, sorry :-(");
	} else if (!gl.floatExt) {
		alert("Could not initialise OES_texture_float, sorry :-(");
	}
	return gl;
}

function loadImage(url) {
	var image = new Image();
	image.src = url;
	return image;
}

var TextureFlags = {
	FILTER: 1 << 0,
	DEPTH: 1 << 1,
	FLOAT: 1 << 2
};

function Texture(image, gl, flags = 0, width = undefined, height = undefined) {
	this.gl = gl;
	var id = gl.createTexture();
	this.id = id;
	this.image = image;
	var depth = (flags & TextureFlags.DEPTH) !== 0;
	this.depth = depth;
	var filter = (flags & TextureFlags.FILTER) !== 0;
	this.filter = filter;
	var float = (flags & TextureFlags.FLOAT) !== 0;
	this.float = float;
	if (image !== null) {
		width = image.width;
		height = image.height;
	}
	this.width = width;
	this.height = height;
	var onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, id);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		var format = gl.RGBA;
		var internalFormat = gl.RGBA;
		var type = gl.UNSIGNED_BYTE;
		if (depth) {
			format = gl.LUMINANCE;
			internalFormat = gl.LUMINANCE;
		}
		if (float) {
			type = gl.floatExt.HALF_FLOAT_OES;
		}
		if (image === null)
			gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format,
				type, null);
		else
			gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
			filter ? gl.LINEAR : gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
			filter ? gl.LINEAR_MIPMAP_NEAREST : gl.NEAREST);
		var ext = (gl.getExtension('EXT_texture_filter_anisotropic') ||
			gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
			gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic'));
		if (ext && filter) {
			var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
			gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
		}
		if (filter)
			gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	};
	if (this.image)
		this.image.onload = onload;
	else
		onload();
}
Texture.prototype.bind = function(channel) {
	this.channel = channel;
	this.gl.activeTexture(this.gl.TEXTURE0 + channel);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
};
Texture.prototype.unbind = function() {
	this.gl.activeTexture(this.channel);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

function Renderer(gl) {
	this.gl = gl;
	this.buffers = [];
	this.textures = [];
}
Renderer.prototype.addTexture = function(texture) {
	this.textures.push(texture);
};
Renderer.prototype.addBuffer = function(data, itemSize, attribute) {
	var gl = this.gl;
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	buffer.itemSize = itemSize;
	buffer.numItems = data.length / itemSize;
	buffer.attribute = attribute;
	this.buffers.push(buffer);
};
Renderer.prototype.draw = function() {
	var gl = this.gl;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for (var i = 0; i < this.textures.length; i++)
		this.textures[i].bind(i);
	for (var i = 0; i < this.buffers.length; i++) {
		if (this.buffers[i].attribute < 0)
			continue;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i]);
		gl.enableVertexAttribArray(this.buffers[i].attribute);
		gl.vertexAttribPointer(this.buffers[i].attribute, this.buffers[i].itemSize,
			gl.FLOAT, false, 0, 0);
	}
	gl.drawArrays(gl.TRIANGLES, 0, this.buffers[0].numItems);
	for (var i = 0; i < this.buffers.length; i++) {
		if (this.buffers[i].attribute < 0)
			continue;
		gl.disableVertexAttribArray(this.buffers[i].attribute);
	}
	for (var i = 0; i < this.textures.length; i++)
		this.textures[i].unbind();
};

function ShaderProgram(name, gl, setUniforms = function(shaderProgram) {}) {
	this.gl = gl;
	this.setUniforms = setUniforms;
	this.textureUnifroms = [];
	var getShader = function(id) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) {
			return null;
		}
		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}
			k = k.nextSibling;
		}
		var shader;
		if (shaderScript.type == "x-shader/x-fragment") {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			return null;
		}
		gl.shaderSource(shader, str);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	};
	var fragmentShader = getShader(name + "-fs");
	var vertexShader = getShader(name + "-vs");
	this.id = gl.createProgram();
	gl.attachShader(this.id, vertexShader);
	gl.attachShader(this.id, fragmentShader);
	gl.linkProgram(this.id);
	if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
		alert("Could not initialise shader " + name);
	}
};
ShaderProgram.prototype.bind = function() {
	this.gl.useProgram(this.id);
	for (var i = 0; i < this.textureUnifroms.length; i++)
		this.gl.uniform1i(this.textureUnifroms[i], i);
	this.setUniforms(this);
};
ShaderProgram.prototype.addAttribute = function(name) {
	this[name] = this.gl.getAttribLocation(this.id, name);
};
ShaderProgram.prototype.addUniform = function(name) {
	this[name] = this.gl.getUniformLocation(this.id, name);
};
ShaderProgram.prototype.addTextureUniform = function(name) {
	this.addUniform(name);
	this.textureUnifroms.push(this[name]);
};

function RenderBuffer(gl, width, height, depth = false) {
	this.gl = gl;
	this.id = gl.createRenderbuffer();
	this.depth = depth;
	this.width = width;
	this.height = height;
	this.bind();
	var format = gl.RGBA4;
	if (depth)
		format = gl.DEPTH_COMPONENT16;
	gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
	this.unbind();
};
RenderBuffer.prototype.bind = function() {
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.id);
};
RenderBuffer.prototype.unbind = function() {
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
};

var colorAttachmentBuffer = {};

function getColorAttachmentList(gl, count) {
	if (colorAttachmentBuffer[count])
		return colorAttachmentBuffer[count];
	colorAttachmentBuffer[count] = [];
	for (var i = 0; i < count; i++) {
		colorAttachmentBuffer[count].push(gl.drawBuffersExt.COLOR_ATTACHMENT0_WEBGL +
			i);
	}
	return colorAttachmentBuffer[count];
}

function FrameBuffer(gl) {
	this.gl = gl;
	this.colorTargets = [];
	this.depthTarget = null;
	this.id = gl.createFramebuffer();
};
FrameBuffer.prototype.bind = function() {
	if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !==
		this.gl.FRAMEBUFFER_COMPLETE) {
		alert("Could not create FBO, sorry :-(");
	}
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.id);
	if (this.colorTargets.length > 0)
		this.gl.viewport(0, 0, this.colorTargets[0].width,
			this.colorTargets[0].height);
	this.gl.drawBuffersExt.drawBuffersWEBGL(
		getColorAttachmentList(this.gl, this.colorTargets.length));
	if (this.depthTarget)
		this.gl.enable(this.gl.DEPTH_TEST);
	else
		this.gl.disable(this.gl.DEPTH_TEST);
};
FrameBuffer.prototype.unbind = function() {
	this.gl.disable(this.gl.DEPTH_TEST);
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
};
FrameBuffer.prototype.addTarget = function(texture) {
	this.bind();
	if (!texture.depth) {
		this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,
			this.gl.drawBuffersExt.COLOR_ATTACHMENT0_WEBGL +
			this.colorTargets.length,
			this.gl.TEXTURE_2D, texture.id, 0);
		this.colorTargets.push(texture);
	} else {
		this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT,
			this.gl.TEXTURE_2D, texture.id, 0);
		this.depthTarget = texture;
	}
	this.unbind();
};
FrameBuffer.prototype.addRenderbuffer = function(buffer) {
	this.bind();
	if (!buffer.depth) {
		this.gl.framebufferRenderbuffer(
			this.gl.FRAMEBUFFER,
			this.gl.drawBuffersExt.COLOR_ATTACHMENT0_WEBGL + this.colorTargets.length,
			this.gl.RENDERBUFFER, buffer.id);
		this.colorTargets.push(buffer);
	} else {
		this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT,
			this.gl.RENDERBUFFER, buffer.id);
		this.depthTarget = buffer;
	}
	this.unbind();
};

function Filter(textures, shaderName, gl,
	setUnifroms = function(shaderProgram) {}) {
	this.gl = gl;
	this.textures = textures;
	this.shader = new ShaderProgram(shaderName, gl, setUnifroms);
	this.shader.addAttribute("aVertexPosition");
	this.shader.addAttribute("aVertexTexmap");
	for (var i in textures)
		this.shader.addTextureUniform(i);
	this.renderer = new Renderer(gl);
	for (var i in textures)
		this.renderer.addTexture(textures[i]);
	var vertices = [-1.0, -1.0,
		1.0,

		-1.0, -1.0,
		1.0,

		1.0, -1.0,
		1.0,

		1.0, -1.0,
		1.0,
	];
	this.renderer.addBuffer(vertices, 2, this.shader.aVertexPosition);
	var texmap = [
		0.0,
		0.0,
		1.0,

		0.0,
		0.0,
		1.0,

		1.0,
		0.0,
		1.0,

		1.0,
		0.0,
		1.0,
	];
	this.renderer.addBuffer(texmap, 2, this.shader.aVertexTexmap);
};
Filter.prototype.draw = function() {
	this.shader.bind();
	this.renderer.draw();
};

function TextureFilter(width, height, textures, shaderName, gl,
	setUnifroms = function(shaderProgram) {}) {
	Filter.apply(this, [textures, shaderName, gl, setUnifroms]);
	this.fbo = new FrameBuffer(gl);
	this.output = new Texture(null, gl, 0, width, height);
	this.fbo.addTarget(this.output);
};
TextureFilter.prototype = Object.create(Filter.prototype);
TextureFilter.prototype.constructor = TextureFilter;
TextureFilter.prototype.draw = function() {
	this.fbo.bind();
	Filter.prototype.draw.apply(this, []);
	this.fbo.unbind();
};
