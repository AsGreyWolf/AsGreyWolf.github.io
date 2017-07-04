import imageio
import numpy as np
import itertools
import math

image = np.array(imageio.imread('env.exr'))
image = image ** 2.2
w, h, dims = image.shape
result = np.zeros(image.shape).astype(np.float32)
for x, y in itertools.product(range(w), range(h)):
	for xi, yi in itertools.product(range(-w//2, w//2+1), range(-h//4, h//4+1)):
		xt = xi * 3.14159/2 / (w//2)
		yt = yi * 3.14159/2 / (h//4)
		theta = 3.14159/2 - max(abs(xt), abs(yt))
		xi = x + xi
		if xi >= w:
			xi = w - (1 + xi - w)
			yi += h//2
		elif xi < 0:
			xi = -xi
			yi += h//2
		yi = (y + yi) % h
		result[x, y, ...] += image[xi, yi, ...] * abs(math.cos(theta) * math.sin(theta)) / (w * h // 2)
	print(x, y, result[x, y, ...])
result = result ** (1/2.2)
imageio.imwrite('output1.exr', result)



#
#
# brightness = 0.2126 * image[..., 0] + \
#              0.7152 * image[..., 1] + \
#              0.0722 * image[..., 2]
# image[..., 0] /= brightness
# image[..., 1] /= brightness
# image[..., 2] /= brightness
# print('mean %s' % np.mean(brightness))
# print(np.mean(brightness) + 3*(np.var(brightness)**0.5))
# maxbr = 30
# factor = 1000
# brightness = np.log(brightness * factor + 1) / np.log(maxbr * factor + 1)
# w, h, dims = image.shape
# result = np.zeros((w, h, 4))
# result[..., 0:3] = (image ** (1 / 2.2)) * 255
# result[..., 3] = brightness * 255
#
# result = np.rint(np.minimum(result, 255.0))
#
# imageio.imwrite('output1.png', result)
