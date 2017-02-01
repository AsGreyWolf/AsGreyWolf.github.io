"use strict";

function initGL(canvas) {
	var gl;
	try {
		gl = WebGLUtils.setupWebGL(canvas);
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
	return gl;
}

function loadImage(url) {
	var image = new Image();
	image.src = url;
	return image;
}

function Texture(image, gl, filter = false) {
	this.gl = gl;
	var id = gl.createTexture();
	this.id = id;
	this.image = image;
	var onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, id);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
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
Texture.prototype.bind = function() {
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
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
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for (var i = 0; i < this.textures.length; i++) {
		gl.activeTexture(gl.TEXTURE0 + i);
		this.textures[i].bind();
	}
	for (var i = 0; i < this.buffers.length; i++) {
		if (this.buffers[i].attribute < 0)
			continue;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i]);
		gl.vertexAttribPointer(this.buffers[i].attribute, this.buffers[i].itemSize,
		                       gl.FLOAT, false, 0, 0);
	}
	gl.drawArrays(gl.TRIANGLES, 0, this.buffers[0].numItems);
	for (var i = 0; i < this.textures.length; i++) {
		gl.activeTexture(gl.TEXTURE0 + i);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
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
	} var fragmentShader = getShader(name + "-fs");
	var vertexShader = getShader(name + "-vs");
	this.id = gl.createProgram();
	gl.attachShader(this.id, vertexShader);
	gl.attachShader(this.id, fragmentShader);
	gl.linkProgram(this.id);
	if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	this.attribCount = 0;
};
ShaderProgram.prototype.bind = function() {
	this.gl.useProgram(this.id);
	for (var i = 0; i < this.textureUnifroms.length; i++)
		gl.uniform1i(this.textureUnifroms[i], i);
	this.setUniforms(this);
};
ShaderProgram.prototype.addAttribute = function(name) {
	this[name] = this.gl.getAttribLocation(this.id, name);
	this.gl.enableVertexAttribArray(this[name]);
};
ShaderProgram.prototype.addUniform = function(name) {
	this[name] = this.gl.getUniformLocation(this.id, name);
};
ShaderProgram.prototype.addTextureUniform = function(name) {
	this.addUniform(name);
	this.textureUnifroms.push(this[name]);
};
