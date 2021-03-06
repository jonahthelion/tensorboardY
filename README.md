# tensorboardY
The easier it is to interact with ML models, the faster we can determine their current limitations. This library seeks to automate the creation of cool ML demo websites like

* [style transfer](https://reiinakano.github.io/arbitrary-image-stylization-tfjs/)
* [Megadepth](http://megadepthdemo.pythonanywhere.com/)
* [Talk to transformer](https://talktotransformer.com/?ref=producthunt)
* [GLTR](http://gltr.io/dist/index.html)
* [Wayve demo](http://perception.wayve.ai/)
* [FUNIT](https://nvlabs.github.io/FUNIT/petswap.html)

Documentation is [here](https://jonahthelion.github.io/tensorboardY/) (generated using [pdoc3](https://pdoc3.github.io/pdoc/)).
The github repo is [here](https://github.com/jonahthelion/tensorboardY).

## Install
`pip install tensorboardY`

## Examples
* `python examples/simple_example.py`

```
import tensorboardY as ty
import matplotlib.pyplot as plt

def forward(x, title):
    plt.imshow(x)
    plt.title(title)
    return plt.gcf()

inputs = [ty.Image(var='x', exs=['imgs/curve.jpg']),
          ty.Text(var='title', exs=["EXAMPLE"])]

ty.show(forward, inputs)
```
<img src="https://github.com/jonahthelion/tensorboardY/raw/master/imgs/simple_example_site.png" width="800" />

* `python examples/full_example.py`

```
import tensorboardY as ty
import os

def forward(z):
    return z

inputs = [ty.Widget("z", name="Choose your input",
                    camera=True,
                    image_upload=True,
                    image_list=['imgs/curve.jpg'], image_names=['Curve example'],
                    text_input=True,
                    text_list=['This is an example text!'], text_names=['Random'],
                    option_list=["This is an example option!"], option_names=['Resnet50'],
                    boolean=True,
                    slider=(5, 20, 0.5), slider_default=10.3)]

ty.show(forward, inputs)
```
<img src="https://github.com/jonahthelion/tensorboardY/raw/master/imgs/full_example_site.png" width="800" />

* Live example displaying Yolact [here](https://silly-y2uuxajhsq-uc.a.run.app/)
