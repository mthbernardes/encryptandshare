from pydal import DAL, Field

class Models(object):
    def __new__(self,):
        dalString  = 'sqlite://encryptandshare.db'  #uncomment to use sqlite
        db = DAL(dalString,migrate=True)
        db.define_table('files',
                Field('fname'),
                Field('fcontent'),
                Field('limit'),
                Field('fid'))
        return db
