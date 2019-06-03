from models.database import Models

class Database(object):
    def insert(self,fname,fcontent,limit,fid):
        db = Models()
        db.files.insert(fname=fname,fcontent=fcontent,limit=limit,fid=fid)
        db.commit()

    def get(self,fid):
        db = Models()
        row = db(db.files.fid == fid).select().first()
        return row

    def updateLimit(self,fid,limit):
        db = Models()
        db(db.files.fid == fid).update(limit=limit)
        db.commit()
        return True

    def delete(self,fid):
        db = Models()
        db(db.files.fid == fid).delete()
        db.commit()
        return True
