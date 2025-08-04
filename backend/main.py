from database.model import UserData
from database.config_mongo import collection
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database.schema import all_data
from database.model import updateEmailVerified
from database.config_mongo import db
from Analyser import analyze


app = FastAPI()

resume_bytes=""
job_description=""

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # replace with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def read_root():
#     resp = collection.find()
#     return all_data(resp)

# Save User info if email not present in database


@app.post("/signup/Firebase")
def RegisterUser(user:UserData):
    try:
        user = dict(user)
        is_present = collection.find_one({"email": user["email"]})
        if is_present:
            return {"status_code":200, "message": "User already exists"}  
        collection.insert_one(user)
        return {"status_code":200, "message": "User registered successfully"} 
    except Exception as e:
        return {"status_code":500, "message": str(e)}

@app.post("/updateEmailVerified")
def updateEmailVerified(user:updateEmailVerified):
    try:
        user = dict(user)
        collection.update_one({"uid": user["uid"]}, {"$set": {"emailVerified": user["emailVerified"]}})
        return {"status_code":200, "message": "Email verification status updated successfully"}
    except Exception as e:
        return {"status_code":500, "message": str(e)}
    
@app.post("/CheckEmail")
def checkEmail(email:dict):
    print(email)
    try:
        is_present = collection.find_one({"email": email["email"]})
        print(is_present)
        if is_present:
            return True
        return False
    except Exception as e:  
        return {"status_code":500, "message": str(e)}
    
@app.post('/uploadResume')
async def uploadFile(
    resume_file:UploadFile = File(...),
    job_description: str = Form(...),
    uid:str=Form(...)
):
    resume_bytes = await resume_file.read()
    
    if not resume_bytes:
        raise HTTPException(status_code=400, detail="Empty file")
   
    
    job_description = job_description
    result = analyze(resume_bytes,job_description)   
    collection.update_one({'uid':uid},{'$set':{'analysis':result}})
    
    return {'status_code':200,"analysis":result}


@app.get('/Analysis/{uid}')
def analysis(uid:str):
    user = collection.find_one({'uid':uid})
    return {"analysis":user["analysis"]}

# @app.get('/GenerateResume/{uid}')
# async def generate_resume(uid:str):
#     user = collection.find_one({'uid':uid})
#     grid_file = fs.get(ObjectId(user['resume_id']))
#     resume_bytes = await grid_file.read()
#     analysis = user['analysis']
#     return generator(resume_bytes,analysis,user['file'])
    