import base64
import sys
from PIL import Image as PILImage
from matplotlib.backends.backend_agg import FigureCanvasAgg
if sys.version_info[0] >= 3:
    from io import BytesIO
else:
    import cStringIO


def check_type(val, type_names, islist=False):
    if not islist:
        vals = [val]
    else:
        vals = val
    if not isinstance(type_names, list):
        type_names = [type_names]
    for val in vals:
        match = []
        for type_name in type_names:
            match.append(isinstance(val, type_name))
        assert(any(match)), \
            "{} is type {} but expected {}"\
            .format(val, val.__class__.__name__,
                    'or'.join(map(str, type_names)))
    if islist:
        return vals


def pil_to_b64(img):
    if sys.version_info[0] >= 3:
        buffer = BytesIO()
    else:
        buffer = cStringIO.StringIO()
    img.save(buffer, 'PNG')
    return base64.b64encode(buffer.getvalue())


def b64_to_pil(b64):
    img = base64.b64decode(b64)
    if sys.version_info[0] >= 3:
        return PILImage.open(BytesIO(img)).convert('RGB')
    else:
        return PILImage.open(cStringIO.StringIO(img)).convert('RGB')


def mpl_to_pil(fig):
    canvas = FigureCanvasAgg(fig)
    canvas.draw()
    pil_image = PILImage.frombytes('RGB', canvas.get_width_height(),
                                   canvas.tostring_rgb()).convert('RGB')
    return pil_image
