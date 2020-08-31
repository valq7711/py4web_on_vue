import json
import functools
from py4web import (
    action, request, response, URL
)


class SPA:
    def __init__(self):
        self.main_pg = None
        self.routes = []

    def main(self, func):
        if self.main_pg:
            raise RuntimeError('The main SPA-page can be set only once')
        self.main_pg = func
        return func

    def __call__(self, path = None):
        def decorator(func):
            nonlocal path
            if not path:
                name = path = func.__name__
            else:
                name = path.split('/')[0]
            if name not in self.routes:
                self.routes.append(name)
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                if request.query.get('is_spa'):
                    response.set_header('X-py4web-spa',name)
                    return func(*args, **kwargs)
                return self.main_pg()
            return action(path)(wrapper)
        return decorator


spa = SPA()

__static_version__ = '0.0.3'

@action("no_spa")
@action.uses("no_spa.html")
def no_spa():
    return dict(foo_url = URL('foo', 'bar', vars= dict(a='a-value')))

@spa('bar')
@spa('bar/<q:path>')
def bar(q=None):
    return dict(msg = 'This is bar!', path = q, query = request.query.items())

@spa('foo')
@spa('foo/<q:path>')
def foo(q=None):
    return dict(msg = 'This is foo!')

@spa.main
@action("index")
@action.uses("index.html")
def index():
    return dict(static_ver = __static_version__, routes = json.dumps(spa.routes))


