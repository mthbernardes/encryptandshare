from jinja2 import FileSystemLoader, Environment

template_engine = Environment(loader=FileSystemLoader("template"))

def get_template(name):
    return template_engine.get_template(name)
