from models.database import Models

class Database(object):
    def insert(self,fname,limit,fid,status):
        db = Models()
        db.files.insert(fname=fname,limit=limit,fid=fid,status=status)
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

    def updateStatus(self,fid):
        db = Models()
        db(db.files.fid == fid).update(status=True)
        db.commit()
        return True


    def delete(self,fid):
        db = Models()
        db(db.files.fid == fid).delete()
        db.commit()
        return True
