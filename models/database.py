from pydal import DAL, Field

class Models(object):
    def __new__(self,):
        #dalString  = 'sqlite://encryptandshare.db'  #uncomment to use sqlite
        dalString  = 'mysql://root:my-secret-pw@127.0.0.1/encryptandshare'  #uncomment to use sqlite
        db = DAL(dalString,fake_migrate_all=True)
        db.define_table('files',
                Field('fname'),
                Field('limit'),
                Field('status','boolean'),
                Field('fid'))
        #db.commit()
        return db
