from matplotlib.figure import Figure
from tornado.template import Template
from PIL import Image as PILImage

from .tools import mpl_to_pil, pil_to_b64


htmltemplate = Template("{{ data }}")


def decode(out):
    if isinstance(out, str):
        return {'kind': 'html', 'data': htmltemplate.generate(data=out)}
    if isinstance(out, Figure):
        img = mpl_to_pil(out)
        out.clear()
        return {'kind': 'img', 'data': pil_to_b64(img)}
    if isinstance(out, PILImage.Image):
        return {'kind': 'img', 'data': pil_to_b64(out)}
    if isinstance(out, bool):
        return {'kind': 'html', 'data': out}
    else:
        assert(False), "decoding for type {} not supported {}"\
                .format(type(out), out)
