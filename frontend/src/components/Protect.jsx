import { useNavigate } from 'react-router-dom'
import { auth } from '../Config/Firebase_config'
import { useEffect } from 'react'
const Protect = ({children})=> {
    const navigate = useNavigate();
    const user = auth.currentUser
    console.log(user)
    useEffect(()=>{
        if(!user){
        navigate("/")
      }
    },[navigate])
    return (
      auth.currentUser?children:null
    )
}

export default Protect
