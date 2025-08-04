import { useRef,useState } from 'react';
import axios from '../Config/axios';
import Sidebar from './Sidebar'
import { LuImagePlus } from "react-icons/lu";
import { useNavigate } from 'react-router';
import {auth} from "../Config/Firebase_config"
const Main = () => {

  const navigate = useNavigate() 

  const fileinput = useRef()
  const [resume,setresume] = useState(null)
  const [description,setdescription] = useState("")
  
  const HandleSubmit = async(e)=>{
    e.preventDefault()

    if (!resume || !description) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    // 1. Create a FormData object
    const formData = new FormData();
    console.log(auth.currentUser.uid)
    // 2. Append the file and the description
    formData.append('resume_file', resume); // The file object
    formData.append('job_description', description); // The text
    formData.append('uid',auth.currentUser.uid)
    try {
      // 3. Send the FormData object
      const response = await axios.post('/uploadResume',formData) 
      if(response.data.status_code == 200){
        navigate('/Analysis')
      }
      else{
        alert("Analysis could not be completed.");
      }
    } 
    catch (error) {
      console.error("Error uploading data:", error);
      alert("An error occurred while analyzing the data.");
    }

  }

  const HandleFileUpload = (e) => {
      setresume(e.target.files[0])
  }

  
  return (
    <>
      <div className='flex size-full'>
        <Sidebar/>
        <form 
          onSubmit={HandleSubmit}
          className='size-full sm:w-[80%] text-black flex-col justify-items-center place-content-center p-9'>
          
          <div 
            onClick={()=>{fileinput.current.click()}}
            className='h-[20%] w-[70%] border-2 border-dashed rounded-3xl flex-col justify-items-center place-content-center overflow-hidden p-4'>
              <input 
                className=' border-2 border-dotted w-[90%] hidden '
                type="file" 
                onChange={HandleFileUpload}
                name='resume'
                ref={fileinput}
                accept="application/pdf"/>
              <LuImagePlus className='text-4xl sm:text-5xl mb-2 '/>
              <h1 className='select-none'>Upload Your Updated Resume</h1>
          </div> 
          
          <h1 className='text-4xl mt-[5%]'>Write Job Description.</h1>
          
          <div className='h-[50%] w-[80%]'>
            <textarea type="text"
            onChange={(e)=>{setdescription(e.target.value)}} 
            name='description'
            className='size-full border-2 rounded-2xl border-dashed text-2xl focus:border-blue-700 focus:outline-none p-3'
            />
          </div>

          <button 
            className='w-[40%] h-[7%] border-1 rounded-2xl mt-3 ml-[30%] text-white bg-blue-600' 
            type='submit'>Analyze
          </button>

        </form>
      </div>
    </>
  )
}

export default Main
