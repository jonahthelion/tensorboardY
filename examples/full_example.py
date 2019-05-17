import tensorboardY as ty
import os


def forward(z):
    return z


image_list = [os.path.join(os.path.os.path.dirname(__file__), '../imgs/curve.jpg')]

inputs = [ty.Widget("z", name="Choose your input",
                    camera=True,
                    image_upload=True,
                    image_list=image_list, image_names=['Curve example'],
                    text_input=True,
                    text_list=['This is an example text!'], text_names=['Random'],
                    option_list=["This is an example option!"], option_names=['Resnet50'],
                    boolean=True,
                    slider=(5, 20, 0.5), slider_default=10.3)]

ty.show(forward, inputs)
