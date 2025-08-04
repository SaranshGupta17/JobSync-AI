import { Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Main from './components/Main'
import EmailVerification from './components/EmailVerification'
import Analyzer from './components/Analyzer'

const App = () => {
  return (
    
    <>
    <div className='overflow-hidden w-screen h-screen font-mono'>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/Main" element={<Main/>}/>
        <Route path="/EmailVerification" element={<EmailVerification/>}/>
        <Route path="/Analysis" element={<Analyzer/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
