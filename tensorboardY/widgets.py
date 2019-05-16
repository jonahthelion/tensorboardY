from PIL import Image as PILImage

from .tools import check_type, pil_to_b64, b64_to_pil


class Widget(object):
    def __init__(self, var, name="Widget",
                 camera=False,
                 image_upload=False,
                 image_list=[], image_names=None,
                 text_input=False,
                 text_list=[], text_names=None,
                 option_list=[], option_names=None,
                 boolean=False,
                 slider=None, slider_default=None):
        check_type(var, str)
        self.var = var

        self.name = name

        check_type(camera, bool)
        self.camera = camera

        check_type(image_upload, bool)
        self.image_upload = image_upload

        self.image_list = [ex for ex in check_type(image_list,
                                                   str, islist=True)]

        if image_names is None:
            image_names = ["Image {}".format(i)
                           for i in range(len(self.image_list))]
        self.image_names = [name for name in image_names]
        assert(len(self.image_list) == len(self.image_names)),\
            "{} != {}".format(len(self.image_list),
                              len(self.image_names))

        check_type(text_input, bool)
        self.text_input = text_input

        self.text_list = [ex for ex in text_list]

        if text_names is None:
            len_limit = 35
            text_names = [ex for ex in self.text_list]
            for i, ex in enumerate(text_names):
                if len(ex) > len_limit:
                    text_names[i] = "{}...".format(ex[:(len_limit - 3)])
        self.text_names = [name for name in text_names]
        assert(len(self.text_list) == len(self.text_names)),\
            "{} != {}".format(len(self.text_list),
                              len(self.text_names))

        self.option_list = [ex for ex in option_list]

        if option_names is None:
            option_names = ["Option {}".format(i)
                            for i in range(len(self.option_list))]
        self.option_names = [name for name in option_names]
        assert(len(self.option_list) == len(self.option_names)),\
            "{} != {}".format(len(self.option_list),
                              len(self.option_names))

        check_type(boolean, bool)
        self.boolean = boolean

        if slider is not None:
            assert(len(slider) == 3), "slider {} not length 3"\
                   .format(len(slider))
        self.slider = slider

        self.slider_default = slider_default

    def get_data(self, gui, opt_id):
        if gui == 'upload_img':
            assert(0 <= opt_id < len(self.image_list)),\
                "opt_id {} not in [0,{})".format(opt_id, len(self.image_list))
            img = PILImage.open(self.image_list[opt_id]).convert('RGB')
            b64 = pil_to_b64(img)
            return b64
        if gui == 'upload_txt':
            assert(0 <= opt_id < len(self.text_list)),\
                "opt_id {} not in [0,{})".format(opt_id, len(self.text_list))
            return self.text_list[opt_id]

    def decode(self, arg):
        if arg['kind'] == 'ignore':
            return arg['data']
        if arg['kind'] == 'opt_id':
            return self.option_list[arg['data']]
        if arg['kind'] == 'img':
            return b64_to_pil(arg['data'])
        if arg['kind'] == 'bool':
            if arg['data'] == 'True':
                return True
            return False
        assert(False), 'arg kind {} not understood'.format(arg['kind'])


class Image(Widget):
    def __init__(self, var, name="Image",
                 camera=True,
                 image_upload=True,
                 exs=[], ex_names=None, **kwargs):
        super(Image, self).__init__(var=var, name=name,
                                    camera=camera, image_upload=image_upload,
                                    image_list=exs, image_names=ex_names,
                                    **kwargs)


class Text(Widget):
    def __init__(self, var, name="Text",
                 text_input=True,
                 exs=[], ex_names=None, **kwargs):
        super(Text, self).__init__(var=var, name=name,
                                   text_input=text_input,
                                   text_list=exs, text_names=ex_names,
                                   **kwargs)
