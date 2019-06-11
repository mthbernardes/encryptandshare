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

#@app.route("/")
#def indexPage():
#    return render_template("index.html")
#
#@app.route("/<fid>")
#def downloadPage(fid):
#    try:
#        UUID(fid)
#        return render_template("download.html",fid=fid)
#    except:
#
#        return render_template("404.html"), 404
#
#@app.errorhandler(404)
#def page_not_found(e):
#    print(e)
#    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
