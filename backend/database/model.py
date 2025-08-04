from pydantic import BaseModel
from typing import Optional, Dict, Any

class UserData(BaseModel):
    username:str
    email:str
    uid:str
    photoURL:str
    emailVerified:bool
    analysis:Optional[Dict[str, Any]] = None
    file:Optional[Any] = None
    
class updateEmailVerified(BaseModel):
    uid:str
    emailVerified:bool

