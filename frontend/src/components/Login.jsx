import React,{useState} from 'react'
import { IoEyeOff,IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link,useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config/Firebase_config";
import axios from "../Config/axios"

const Login = () => {

	const navigate = useNavigate() //navigates to specific route


  // Handle password hidden state
  const [open,setOpen] = useState(false)
  const flag = () => {
    setOpen(!open)
  }

  var [email,setemail] = useState("")
  const [password,setpassword] = useState("")
  
  // Handle Email warnexisting state
  const EmailUncheck = async(e) => {
    e.preventDefault()
		document.querySelector(".warn").style.display = "none"
		document.querySelector(".email").style.borderColor = "#0080FF"
	}

	// Handle Email Availabilty
	const EmailCheck = async(e)=>{
    e.preventDefault
    var response = ""
    if(!email.includes("@")){
      response = await axios.post("/CheckEmail",{username:email})
    }
    else{
      response = await axios.post("/CheckEmail",{email})

    }
    document.querySelector(".pass").style.borderColor = "#0080FF"
		if(!response.data){
			document.querySelector(".email").style.borderColor = "red"
			document.querySelector(".warn").style.display = "initial"
			document.querySelector(".warn").style.color = "red"

		}
	}

  // Handle Submit
  const HandleSubmit = async(e) => {
    e.preventDefault
    try{
      
      signInWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        // Signed in 
        if(auth.currentUser.emailVerified){
          navigate("/Main")
        }else{
          navigate("/EmailVerification")
          await checkEmailVerification(userCredential.user)
        }
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        if(errorMessage =="Firebase: Error (auth/invalid-credential)."){
          document.querySelector(".warn").style.display = "initial"
          document.querySelector(".email").style.borderColor = "red"
          document.querySelector(".pass").style.borderColor = "red"
        }
      });
    } 
    catch(err){
      console.error(err)
    }
  }

  // Register user to mongo
  const RegisterUserToMongo = async(e) => {
    e.preventDefault
      try{
        const response = await axios.post("/signup/Firebase",{
          username:e.username,
          email:e.email,
          uid:e.uid,
          photoURL:e.photoURL,
          emailVerified:e.emailVerified
        }) 
        console.log(response.data.status_code)
        console.log(response.data.message)
        
      }catch(err){
        console.log(err)
      }
  }

  // Handle LoginWithGoogle
  const LoginWithGoogle = async() => {

    const provider = new GoogleAuthProvider();

    try{
      const result = await signInWithPopup(auth,provider)
      
      await RegisterUserToMongo({
        username:result.user.displayName,
        email: result.user.email,
        uid: result.user.uid,
        photoURL: result.user.photoURL,
        emailVerified:result.user.emailVerified
      })
      
      navigate("/Main")

    } catch(err){ 
      console.error(err)
    }
  }

  const checkEmailVerification = async (user) => {
    const intervalId = setInterval(async () => {
      try {
        await user.reload(); // Reload the user to get the latest status
        if (auth.currentUser.emailVerified){
          clearInterval(intervalId); // Stop the interval once verified
          await axios.post("/updateEmailVerified", {
            uid: user.uid,
            emailVerified: true,
          });
          navigate("/Main"); // Redirect to phone verification route
        
        }
      } catch (error) {
        if (error.code === 'auth/user-token-expired') {
          console.log("User token expired");
         
        } else {
          console.error("Error reloading user:", error);
        }
      }
        
    }, 10); // Check every 5 seconds
  };


  return (
    <>
      
      <div className='size-full sm:flex place-content-center'>
        <div className='flex-col justify-items-center place-content-center size-full sm:max-w-[50%] xl:max-w-[30%]'>
          <div className='w-[30%] h-[15%]'>
            <img className='w-full h-full object-cover rounded-[45%]' src="https://imgs.search.brave.com/_DdkY-ax9rwa8i0zY-mOh6375mWX_CBZWCG4hpejI94/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8yOC81MS9p/bml0aWFscy12ZC1s/b2dvLW1vbm9ncmFt/LXdpdGgtc2ltcGxl/LWRpYW1vbmQtdmVj/dG9yLTQzMjgyODUx/LmpwZw" alt="" />
          </div>
          <h1 className='mt-10 text-[26px] font-semibold'>Log In</h1>
          <div className='overflow-hidden sm:w-full'>
            
            <form onSubmit={HandleSubmit}>

              {/* Email */}
              <h1 className='text-[18px]'>Email/Username</h1>
              <input 
                onFocus={EmailUncheck}
                onBlur={()=>{
                  document.querySelector(".email").style.borderColor = "#94A3B8"
                }}
                onChange={(e)=>{
                  setemail(e.target.value) 
                  console.log(e.target.value)
                }}
                value={email}
                className='email w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none ' 
                type={"text"} 
                name={"email"}
                placeholder="Email or Username"/>
                <h1 className='warn hidden text-red-600 tracking-normal mt-1'>Invalid Email/Username or Password</h1>
                
              {/* Password */}
              <h1 className='text-[18px] mt-3'>Pasword</h1>
              <div className='relative w-full h-fit'>
                <input 
                required
                onBlur={()=>{
                  document.querySelector(".pass").style.borderColor = "#94A3B8"
                }}
                onFocus={email!="" ? EmailCheck:()=>{document.querySelector(".pass").style.borderColor = "#0080FF"}}
                onChange={(e)=>{
                  setpassword(e.target.value)
                  console.log(e.target.value)
                  
                }}
                value={password}
                className='pass w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none ' 
                type={(open === false)?"password":"text"} 
                name='password'
                placeholder='Password'/>

                {
                  (open === false)?<IoEyeOff onClick={flag} className='absolute text-[22px] top-[26%] right-3'/>:<IoEye onClick={flag} className='absolute text-[22px] top-[26%] right-3'/>
                }
              </div>
              
              {/* <Link className='text-blue-700 font-semibold' to='/ForgotPassword'>Forgot Password?</Link> */}
              <button type="submit" className='w-full h-[50px] bg-blue-700 rounded-lg mt-8 text-white text-[18px]'>Log in</button>
              <h1 className='ml-4 mt-1'>Dont have an account? <Link className='text-blue-700 font-semibold'  to='/SignUp'>Sign Up</Link></h1>
            
            </form>

            <button 
              className='flex justify-between items-center w-full h-[50px] border-2 border-zinc-500 px-5 rounded-lg mt-2'
              onClick={LoginWithGoogle}>
                Login with Google<FcGoogle className='w-[40px] h-full '/>
            </button>

          </div>
        </div>
      </div>

    </>
  )
}

export default Login
