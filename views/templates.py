import os
from uuid import uuid4,UUID
from flask import Blueprint, render_template

templates = Blueprint('templates',__name__,url_prefix="/")

@templates.route("/")
def indexPage():
    return render_template("index.html")

@templates.route("/<fid>")
def downloadPage(fid):
    try:
        UUID(fid)
        return render_template("download.html",fid=fid)
    except:

        return render_template("404.html"), 404

@templates.errorhandler(404)
def page_not_found(e):
    print(e)
    return render_template("404.html"), 404

