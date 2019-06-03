from uuid import uuid4,UUID
from controllers.database import Database
from flask import Flask, request, jsonify, render_template

app = Flask(__name__,
        template_folder="template",
        static_url_path="/static")

@app.route("/api/upload",methods=["POST"])
def upload():
    db = Database()
    fid = str(uuid4())
    content = request.json
    if not content["limit"].isnumeric() or int(content["limit"]) <= 0:
        content["limit"] = 1
    db.insert(content["fname"],content["fcontent"],int(content["limit"]),fid) 
    return jsonify({"fid":fid})

@app.route("/api/download",methods=["POST"])
def download():
    db = Database()
    content = request.json
    result = db.get(content["fid"])
    if not result:
        return jsonify(content)
    limit = int(result["limit"]) - 1
    if limit <= 0:
        db.delete(content["fid"])
    else:
        db.updateLimit(content["fid"],limit)
    if result:
        return jsonify({"fcontent":result["fcontent"],"fname":result["fname"]})
    return jsonify(content)

@app.route("/")
def indexPage():
    return render_template("index.html")

@app.route("/<fid>")
def downloadPage(fid):
    try:
        UUID(fid)
        return render_template("download.html",fid=fid)
    except:
        return render_template("404.html"), 404

@app.errorhandler(404)
def page_not_found(e):
    print(e)
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
