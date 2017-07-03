"use strict";

function sphereV(size = 1.0) {
	var rings = 32;
	var sectors = 32;
	var R = 1. / (rings - 1);
	var S = 1. / (sectors - 1);
	var r, s;
	var buffer = [];
	for (r = 0; r < rings; r++)
		for (s = 0; s < sectors; s++) {
			var z = -Math.sin(-Math.PI / 2 + Math.PI * r * R);
			var x = Math.cos(2 * Math.PI * s * S) * Math.sin(Math.PI * r * R);
			var y = Math.sin(2 * Math.PI * s * S) * Math.sin(Math.PI * r * R);

			buffer.push(x);
			buffer.push(y);
			buffer.push(z);
		}
	var result = [];
	for (r = 0; r < rings; r++)
		for (s = 0; s < sectors; s++) {
			result.push(buffer[(r * sectors + s) * 3 + 0]);
			result.push(buffer[(r * sectors + s) * 3 + 1]);
			result.push(buffer[(r * sectors + s) * 3 + 2]);
			result.push(buffer[((r + 1) * sectors + s) * 3 + 0]);
			result.push(buffer[((r + 1) * sectors + s) * 3 + 1]);
			result.push(buffer[((r + 1) * sectors + s) * 3 + 2]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 0]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 1]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 2]);

			result.push(buffer[(r * sectors + s) * 3 + 0]);
			result.push(buffer[(r * sectors + s) * 3 + 1]);
			result.push(buffer[(r * sectors + s) * 3 + 2]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 0]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 1]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 2]);
			result.push(buffer[(r * sectors + s + 1) * 3 + 0]);
			result.push(buffer[(r * sectors + s + 1) * 3 + 1]);
			result.push(buffer[(r * sectors + s + 1) * 3 + 2]);
		}
	for (var i in result)
		result[i] *= size;
	return result;
}

function sphereN() {
	var rings = 32;
	var sectors = 32;
	var R = 1.0 / (rings - 1);
	var S = 1.0 / (sectors - 1);
	var r, s;
	var buffer = [];
	for (r = 0; r < rings; r++)
		for (s = 0; s < sectors; s++) {
			var z = -Math.sin(-Math.PI / 2 + Math.PI * r * R);
			var x = Math.cos(2 * Math.PI * s * S) * Math.sin(Math.PI * r * R);
			var y = Math.sin(2 * Math.PI * s * S) * Math.sin(Math.PI * r * R);

			buffer.push(x);
			buffer.push(y);
			buffer.push(z);
		}
	var result = [];
	for (r = 0; r < rings; r++)
		for (s = 0; s < sectors; s++) {
			result.push(buffer[(r * sectors + s) * 3 + 0]);
			result.push(buffer[(r * sectors + s) * 3 + 1]);
			result.push(buffer[(r * sectors + s) * 3 + 2]);
			result.push(buffer[((r + 1) * sectors + s) * 3 + 0]);
			result.push(buffer[((r + 1) * sectors + s) * 3 + 1]);
			result.push(buffer[((r + 1) * sectors + s) * 3 + 2]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 0]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 1]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 2]);

			result.push(buffer[(r * sectors + s) * 3 + 0]);
			result.push(buffer[(r * sectors + s) * 3 + 1]);
			result.push(buffer[(r * sectors + s) * 3 + 2]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 0]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 1]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 3 + 2]);
			result.push(buffer[(r * sectors + s + 1) * 3 + 0]);
			result.push(buffer[(r * sectors + s + 1) * 3 + 1]);
			result.push(buffer[(r * sectors + s + 1) * 3 + 2]);
		}
	return result;
}

function sphereT(size = 1.0) {
	var rings = 32;
	var sectors = 32;
	var R = 1. / (rings - 1);
	var S = 1. / (sectors - 1);
	var r, s;
	var buffer = [];
	for (r = 0; r < rings; r++)
		for (s = 0; s < sectors; s++) {
			buffer.push(s * S);
			buffer.push(r * R);
		}
	var result = [];
	for (r = 0; r < rings; r++)
		for (s = 0; s < sectors; s++) {
			result.push(buffer[(r * sectors + s) * 2 + 0]);
			result.push(buffer[(r * sectors + s) * 2 + 1]);
			result.push(buffer[((r + 1) * sectors + s) * 2 + 0]);
			result.push(buffer[((r + 1) * sectors + s) * 2 + 1]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 2 + 0]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 2 + 1]);

			result.push(buffer[(r * sectors + s) * 2 + 0]);
			result.push(buffer[(r * sectors + s) * 2 + 1]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 2 + 0]);
			result.push(buffer[((r + 1) * sectors + s + 1) * 2 + 1]);
			result.push(buffer[(r * sectors + s + 1) * 2 + 0]);
			result.push(buffer[(r * sectors + s + 1) * 2 + 1]);
		}
	for (var i in result)
		result[i] *= size / 2.0;
	return result;
}

function cubeV(size = 1.0) {
	var buffer = [
		1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,

		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0, -1.0, 1.0, -1.0,


		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,

		-1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,


		-1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,

		-1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0,


		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, 1.0, 1.0,

		1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,
		1.0, 1.0, 1.0,


		1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,

		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0, -1.0, 1.0, 1.0,


		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0, 1.0,

		-1.0, -1.0, 1.0, -1.0, -1.0, -1.0,
		1.0, -1.0, 1.0
	];
	for (var i in buffer)
		buffer[i] *= size;
	return buffer;
}

function cubeN() {
	return [
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,


		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,


		-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,

		-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,


		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,


		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,


		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,

		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0
	];
}

function cubeT(size = 1.0) {
	var buffer = [
		2.0, 0.0,
		0.0, 0.0,
		0.0, 2.0,

		2.0, 2.0,
		2.0, 0.0,
		0.0, 2.0,


		0.0, 0.0,
		2.0, 0.0,
		2.0, 2.0,

		0.0, 2.0,
		0.0, 0.0,
		2.0, 2.0,


		2.0, 0.0,
		0.0, 0.0,
		0.0, 2.0,

		2.0, 2.0,
		2.0, 0.0,
		0.0, 2.0,


		0.0, 0.0,
		2.0, 0.0,
		2.0, 2.0,

		0.0, 2.0,
		0.0, 0.0,
		2.0, 2.0,


		2.0, 0.0,
		0.0, 0.0,
		0.0, 2.0,

		2.0, 2.0,
		2.0, 0.0,
		0.0, 2.0,


		0.0, 0.0,
		2.0, 0.0,
		2.0, 2.0,

		0.0, 2.0,
		0.0, 0.0,
		2.0, 2.0
	];
	for (var i in buffer)
		buffer[i] *= size / 2.0;
	return buffer;
}

function generateTangent(vertices, texmap) {
	var tangents = [];
	var binormals = [];
	for (var i = 0; i < vertices.length; i += 9) {
		var v00 = vertices[i + 0];
		var v01 = vertices[i + 1];
		var v02 = vertices[i + 2];
		var v10 = vertices[i + 3];
		var v11 = vertices[i + 4];
		var v12 = vertices[i + 5];
		var v20 = vertices[i + 6];
		var v21 = vertices[i + 7];
		var v22 = vertices[i + 8];

		// Shortcuts for UVs
		var uv00 = texmap[i / 3 * 2 + 0];
		var uv01 = texmap[i / 3 * 2 + 1];
		var uv10 = texmap[i / 3 * 2 + 2];
		var uv11 = texmap[i / 3 * 2 + 3];
		var uv20 = texmap[i / 3 * 2 + 4];
		var uv21 = texmap[i / 3 * 2 + 5];

		// Edges of the triangle : postion delta
		var deltaPos10 = v10 - v00;
		var deltaPos11 = v11 - v01;
		var deltaPos12 = v12 - v02;
		var deltaPos20 = v20 - v00;
		var deltaPos21 = v21 - v01;
		var deltaPos22 = v22 - v02;

		// UV delta
		var deltaUV10 = uv10 - uv00;
		var deltaUV11 = uv11 - uv01;
		var deltaUV20 = uv20 - uv00;
		var deltaUV21 = uv21 - uv01;
		var r = 1.0 / (deltaUV10 * deltaUV21 - deltaUV11 * deltaUV20);
		var tangent0 = (deltaPos10 * deltaUV21 - deltaPos20 * deltaUV11) * r;
		var tangent1 = (deltaPos11 * deltaUV21 - deltaPos21 * deltaUV11) * r;
		var tangent2 = (deltaPos12 * deltaUV21 - deltaPos22 * deltaUV11) * r;
		tangents.push(tangent0);
		tangents.push(tangent1);
		tangents.push(tangent2);
		tangents.push(tangent0);
		tangents.push(tangent1);
		tangents.push(tangent2);
		tangents.push(tangent0);
		tangents.push(tangent1);
		tangents.push(tangent2);
		var binormal0 = (deltaPos20 * deltaUV10 - deltaPos10 * deltaUV20) * r;
		var binormal1 = (deltaPos21 * deltaUV10 - deltaPos11 * deltaUV20) * r;
		var binormal2 = (deltaPos22 * deltaUV10 - deltaPos12 * deltaUV20) * r;
		binormals.push(binormal0);
		binormals.push(binormal1);
		binormals.push(binormal2);
		binormals.push(binormal0);
		binormals.push(binormal1);
		binormals.push(binormal2);
		binormals.push(binormal0);
		binormals.push(binormal1);
		binormals.push(binormal2);
	}
	return {
		tangents: tangents,
		binormals: binormals
	};
}

function flip(positions) {
	for(var i = 0; i<positions.length; i+=9) {
		var b0 = positions[i+3];
		var b1 = positions[i+4];
		var b2 = positions[i+5];
		positions[i+3] = positions[i+6];
		positions[i+4] = positions[i+7];
		positions[i+5] = positions[i+8];
		positions[i+6] = b0;
		positions[i+7] = b1;
		positions[i+8] = b2;
	}
}
