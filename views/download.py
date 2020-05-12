import os
import shutil
from uuid import UUID
from controllers.database import Database
from flask import Blueprint, request, jsonify, send_from_directory

download = Blueprint('download',__name__,url_prefix="/api/download")

def getchunkscount(fid):
    path, dirs, files = next(os.walk("uploads/"+fid))
    print(len(files))
    return len(files)

@download.route("/<fid>",methods=["POST"])
@download.route("/<fid>/<chunkid>",methods=["GET"])
def main(fid,chunkid=None):
    if request.method == "POST":
        db = Database()
        result = db.get(fid)
        if not result:
            return jsonify({"status":False})
        return jsonify({"chunks":getchunkscount(result["fid"]),"fname":result["fname"]})

    elif request.method == "GET":
        db = Database()
        result = db.get(fid)
        if not result or not chunkid.isnumeric():
            print("false")
            return jsonify({"status":False})

        if result["limit"] == 0:
            return jsonify({"status":False})
        enc_file = open("uploads/"+result["fid"]+"/"+chunkid,"r").read()
        print(int(chunkid) == getchunkscount(result["fid"]))
        print("chunkid: {}".format(chunkid))
        print("totalfiles: {}".format(getchunkscount(result["fid"])))
        if int(chunkid) == getchunkscount(result["fid"]):
            limit = int(result["limit"]) - 1
            if limit <= 0:
                db.delete(result["fid"])
                shutil.rmtree("uploads/"+result["fid"])
            else:
                db.updateLimit(result["fid"],limit)
        return enc_file
