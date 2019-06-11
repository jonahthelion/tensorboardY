import tensorboardY as ty
import os


def forward(z):
    return z


image_list = [os.path.join(os.path.os.path.dirname(__file__), '../imgs/curve.jpg')]

inputs = [ty.Widget("z", name="Choose your input",
                    camera=True,
                    image_upload=True,
                    image_list=image_list, image_names=['Curvy road'],
                    text_input=True,
                    text_list=['The text fed to the model'], text_names=['The text the user sees'],
                    option_list=["The text fed to the model"], option_names=['The text the user sees'],
                    boolean=True,
                    slider=(5, 20, 0.5), slider_default=10.3)]

ty.show(forward, inputs, port=5000)
