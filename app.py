# -*- encoding: utf-8 -*-

import os
import codecs
from uuid import uuid4,UUID
from controllers.database import Database
from flask import Flask, request, jsonify, render_template, send_from_directory

application = Flask(__name__,
        template_folder="template",
        static_url_path="/static")

@application.route("/api/upload",methods=["POST"])
@application.route("/api/upload/<fid>",methods=["PATCH"])
@application.route("/api/upload/<fid>/<chunkid>",methods=["PUT"])
def upload(fid=None,chunkid=None):
    if request.method == "POST":
        fid = str(uuid4())
        content = request.json
        content["limit"] = 1 if not content["limit"].isnumeric() or int(content["limit"]) <= 0 else int(content["limit"])
        db = Database()
        db.insert(content["fname"],content["limit"],fid,status=False) 
        os.mkdir("uploads/"+fid)
        return jsonify({"fid":fid})

    elif request.method == "PUT":
        db = Database()
        register = db.get(fid)
        data = request.data
        if register and not register["status"]:
            with open("uploads/"+register["fid"]+"/"+chunkid,"wb") as encfile:
                encfile.write(data)
                encfile.flush()
                encfile.close()
        return jsonify({"success": True})

    elif request.method == "PATCH":
        db = Database()
        db.updateStatus(fid)
        return jsonify({"success": True})
    
@application.route("/api/download/<fid>",methods=["POST"])
@application.route("/api/download/<fid>/<chunkid>",methods=["GET"])
def download(fid,chunkid=None):
    if request.method == "POST":
        db = Database()
        result = db.get(fid)
        if not result:
            return jsonify({"status":False})
        path, dirs, files = next(os.walk("uploads/"+"/"+result["fid"]))
        file_count = len(files)
        #limit = int(result["limit"]) - 1
        return jsonify({"chunks":file_count,"fname":result["fname"]})

    elif request.method == "GET":
        db = Database()
        result = db.get(fid)
        if not result:
            return jsonify({"status":False})
        return send_from_directory("uploads/"+result["fid"],chunkid)
   # with open("uploads/"+result["fid"],"r") as enc_file:
   #     return enc_file.read()
   #     return bytes(enc_file)
    #if limit <= 0:
    #    db.delete(result["fid"])
    #    os.remove("uploads/"+result["fid"])
    #else:
    #    db.updateLimit(content["fid"],limit)
    #if result:
    #    return jsonify({"fcontent":result["fcontent"],"fname":result["fname"]})
    #return jsonify(content)

@application.route("/")
def indexPage():
    return render_template("index.html")

@application.route("/<fid>")
def downloadPage(fid):
    try:
        UUID(fid)
        return render_template("download.html",fid=fid)
    except:
        return render_template("404.html"), 404


@application.route('/stream_data')
def stream_data():
   return 
@application.errorhandler(404)
def page_not_found(e):
    print(e)
    return render_template("404.html"), 404

if __name__ == "__main__":
    application.run(debug=True)
