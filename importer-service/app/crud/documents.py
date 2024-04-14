from pymongo.database import Database

def upload_document_extraction(db:Database,workflow_id:int,document_extraction:dict):
    #TODO: Store metadata about the workflow to which the document belongs
    collection = db["documents"]
    collection.insert_one(document_extraction)
