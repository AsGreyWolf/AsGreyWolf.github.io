"use strict";
function getShader(gl, id) {
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
}
function handleLoadedTexture(texture, filter = false) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
	              texture.image);
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
}
var textures = [];
function addTexture(src, uniform, filter = false) {
	var texture = gl.createTexture();
	texture.image = new Image();
	texture.image.onload = function() {
		handleLoadedTexture(texture, filter)
	} texture.image.src = src;
	texture.uniform = uniform;
	textures.push(texture);
}
var buffers = [];
function addBuffer(data, itemSize, attribute) {
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	buffer.itemSize = itemSize;
	buffer.numItems = data.length / itemSize;
	buffer.attribute = attribute;
	buffers.push(buffer);
}
function drawBuffers() {
	for (var i = 0; i < textures.length; i++) {
		gl.activeTexture(gl.TEXTURE0 + i);
		gl.bindTexture(gl.TEXTURE_2D, textures[i]);
		gl.uniform1i(textures[i].uniform, i);
	}

	for (var i = 0; i < buffers.length; i++) {
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
		gl.vertexAttribPointer(buffers[i].attribute, buffers[i].itemSize, gl.FLOAT,
		                       false, 0, 0);
	}
	gl.drawArrays(gl.TRIANGLES, 0, buffers[0].numItems);
}

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
	gl.drawBuffers=drawBuffers;
	gl.addBuffer=addBuffer;
	gl.addTexture=addTexture;
	gl.getShader=getShader;
	return gl;
}
