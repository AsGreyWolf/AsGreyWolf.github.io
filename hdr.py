import imageio
import numpy as np

image = np.array(imageio.imread('waterfall_Ref.exr'))

image = image ** 2.2
brightness = 0.2126 * image[..., 0] + \
             0.7152 * image[..., 1] + \
             0.0722 * image[..., 2]
image[..., 0] /= brightness
image[..., 1] /= brightness
image[..., 2] /= brightness
print(np.mean(brightness) + 3*(np.var(brightness)**0.5))
maxbr = 50
brightness = np.log(brightness * 1000 + 1) / np.log(maxbr * 1000 + 1)
w, h, dims = image.shape
result = np.zeros((w, h, 4))
result[..., 0:3] = image ** (1 / 2.2)
result[..., 3] = brightness

imageio.imwrite('output1.png', result)
