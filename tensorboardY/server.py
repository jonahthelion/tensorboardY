from tornado import web, ioloop
import os
import simplejson as json

from .tools import check_type
from .widgets import Widget
from .output import decode


class NoCacheStaticFileHandler(web.StaticFileHandler):

    def set_extra_headers(self, path):
        self.set_header('Cache-Control',
                        'no-store, no-cache, must-revalidate, max-age=0')


class MainHandler(web.RequestHandler):

    def initialize(self, forward, inputs, title, github_url):
        self.forward = forward
        self.inputs = inputs
        self.title = title
        self.github_url = github_url

    def get(self):
        self.render("./frontend/index.html", inputs=self.inputs,
                    title=self.title, github_url=self.github_url)

    def post(self):
        cmd = json.loads(self.request.body)
        if cmd['cmd'] == 'get_data':
            assert(0 <= cmd['tyid'] < len(self.inputs)),\
                'tyid {} not in [0,{})'.format(cmd['tyid'], len(self.inputs))
            data = self.inputs[cmd['tyid']].get_data(**cmd['info'])
            if data is not None:
                self.write(json.dumps(data))
            else:
                self.send_error()
        if cmd['cmd'] == 'arg_delivery':
            assert(len(cmd['args']) == len(self.inputs)),\
                'client args {} != num inputs {}'\
                .format(len(cmd['args']), len(self.inputs))
            feed = {inp.var: inp.decode(arg)
                    for inp, arg in zip(self.inputs, cmd['args'])}
            data = self.forward(**feed)
            data = decode(data)
            if data is not None:
                self.write(json.dumps(data))
            else:
                self.send_error()


def show(forward, inputs, port=5000, debug=True, title='Run',
         github_url=None):
    r"""
    Starts a server at `port` that visualizes the function `forward`.
    Args:
        forward (callable): The function to be visualized. `forward` should
            return a string of html, a PIL.Image.Image, or a matplotlib figure.
        inputs (list): List of `ty.Widget`s (one `ty.Widget` for each argument
            to `forward`) that dictate how the user is able to feed inputs
            to the function
        port (int): The port where the model is served
        debug (bool): Run the server in debug mode
        title (str): Submit button text
        github_url (str): url to link to a github page
    """
    check_type(inputs, Widget, islist=True)
    check_type(title, str)
    assert(callable(forward)), '{} is not callable'.format(forward)
    loop = ioloop.IOLoop.instance()
    app = web.Application([
            (r"/", MainHandler, {'forward': forward,
                                 'inputs': inputs, 'title': title,
                                 'github_url': github_url}),
            (r"/(.*)", NoCacheStaticFileHandler, {
                "path":
                os.path.join(os.path.dirname(__file__), "./frontend/")})
            ], debug=debug)
    print('view @ http://localhost:{}'.format(port))
    app.listen(port)
    loop.start()
