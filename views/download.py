import os
from uuid import UUID
from controllers.database import Database
from flask import Blueprint, request, jsonify, send_from_directory

download = Blueprint('download',__name__,url_prefix="/api/download")

@download.route("/<fid>",methods=["POST"])
@download.route("/<fid>/<chunkid>",methods=["GET"])
def main(fid,chunkid=None):
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
        if not result or not chunkid.isnumeric():
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


