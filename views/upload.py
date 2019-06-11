import os
from uuid import uuid4,UUID
from flask import Blueprint, request, jsonify
from controllers.database import Database


upload = Blueprint('upload',__name__,url_prefix="/api/upload")

@upload.route("",methods=["POST"])
@upload.route("/<fid>",methods=["PATCH"])
@upload.route("/<fid>/<chunkid>",methods=["PUT"])
def main(fid=None,chunkid=None):
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

