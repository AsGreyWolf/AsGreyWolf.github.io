import imageio
import numpy as np

image = np.array(imageio.imread('output1.exr'))
image = image ** 2.2
brightness = 0.2126 * image[..., 0] + \
             0.7152 * image[..., 1] + \
             0.0722 * image[..., 2]
image[..., 0] /= brightness
image[..., 1] /= brightness
image[..., 2] /= brightness
print('mean %s' % np.mean(brightness))
print(np.mean(brightness) + 3*(np.var(brightness)**0.5))
maxbr = 5
factor = 1000
brightness = np.log(brightness * factor + 1) / np.log(maxbr * factor + 1)
w, h, dims = image.shape
result = np.zeros((w, h, 4))
result[..., 0:3] = (image ** (1 / 2.2)) * 255
result[..., 3] = brightness * 255

result = np.rint(np.minimum(result, 255.0))

imageio.imwrite('output1.png', result)
