import {auth} from "../Config/Firebase_config"
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'


const Sidebar = () => {

  const navigate = useNavigate()

  const HandleSubmit = async(e) => {
  
    e.preventDefault()
    
    try{
      await signOut(auth)
      navigate("/")
    } catch(err){
      console.error(err)
    }
  }

  return (
    <div className='size-full absolute md:static md:left-[0] left-[-100%] md:w-[25%] lg:w-[20%] md:h-full border-2 md:shadow-xl px-3'>
      
      <div className='md:w-[125px] h-[10%] md:flex md:gap-2 md:justify-between md:items-center'>
        <img className='md:w-[55px] md:h-[55px] object-cover rounded-[50%]' src="https://imgs.search.brave.com/_DdkY-ax9rwa8i0zY-mOh6375mWX_CBZWCG4hpejI94/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8yOC81MS9p/bml0aWFscy12ZC1s/b2dvLW1vbm9ncmFt/LXdpdGgtc2ltcGxl/LWRpYW1vbmQtdmVj/dG9yLTQzMjgyODUx/LmpwZw" alt="" />
        <div className=' text-[25px] text-blue-600 font-semibold'>VDCaller </div>
      </div>

      <div className='w-full h-[90%] flex-col place-items-center mt-4'>
        
        <form 
          className="size-full"
          onSubmit={HandleSubmit} >
          <button type="submit" className='w-[80%] h-[6%] bg-blue-600 rounded-lg mt-8 text-white text-[15px]'>Logout</button>
        </form>
      </div>
      
    
    </div>
  )
}

export default Sidebar
