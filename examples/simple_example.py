import tensorboardY as ty


def forward(z, z2):
    return z


inputs = [ty.Widget(var='z', name='something new',
          camera=True,
          image_upload=True,
          image_list=['../imgs/curve.jpg'],
          image_names=['helloooooo'],
          text_input=True,
          text_list=['here is one', 2324.4],
          text_names=['ok ok', 45],
          option_list=['something', 45566],
          option_names=['anotha oneeeee', 'yet another one'],
          boolean=True,
          slider=(0, 10, 1), slider_default=4),
          ty.Widget(var='z2', name='something new',
          camera=True,
          image_upload=True,
          image_list=['../imgs/curve.jpg'],
          image_names=['helloooooo'],
          text_input=True,
          text_list=['here is one', 2324.4],
          text_names=['ok ok', 45],
          option_list=['something', 45566],
          option_names=['anotha oneeeee', 'yet another one'],
          boolean=True,
          slider=(0, 10, 1), slider_default=4)
          ]


ty.show(forward, inputs)
