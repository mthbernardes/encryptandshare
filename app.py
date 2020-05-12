# -*- encoding: utf-8 -*-

from views.upload import upload
from views.download import download
from views.templates import templates
from flask import Flask, jsonify, render_template, send_from_directory

app = Flask(__name__,
        template_folder="template",
        static_url_path="/static")

app.register_blueprint(upload)
app.register_blueprint(download)
app.register_blueprint(templates)

if __name__ == "__main__":
    app.run(debug=True)
