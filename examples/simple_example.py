import tensorboardY as ty
import matplotlib.pyplot as plt
import os
from glob import glob


def forward(x, title):
    plt.imshow(x)
    plt.title(title)
    return plt.gcf()


image_list = glob(os.path.join(os.path.os.path.dirname(__file__), '../imgs/*.jpg'))

inputs = [ty.Image(var='x', exs=image_list),
          ty.Text(var='title', exs=["Here's an image!", "EXAMPLE"])]

ty.show(forward, inputs)
