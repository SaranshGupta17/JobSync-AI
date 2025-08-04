def individual_data(userData):
     return {
        "id":str(userData["_id"]),
        "username":userData["username"],
        "email":userData["email"],
        "photoURL":userData["photoURL"],
        "uid":userData["uid"],
        "emailVerified":userData["emailVerified"],
        "analysis":userData["analysis"]
    }

def all_data(users):
    return [individual_data(user) for user in users]