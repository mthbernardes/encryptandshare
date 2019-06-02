from models.database import Models

class Database(object):
    def insert(self,fname,fcontent,fid):
        db = Models()
        db.files.insert(fname=fname,fcontent=fcontent,fid=fid)
        db.commit()

    def get(self,fid):
        db = Models()
        row = db(db.files.fid == fid).select().first()
        return row

