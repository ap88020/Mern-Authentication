import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const {userData,backendUrl,setUserData,setisLoggedIn} = useContext(AppContent);

  const sendEmailVerificationOtp = async () => {
    try {
      const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp');
      if(data.success){
        navigate('/email-verify');
        toast.success(data.message);
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+'/api/auth/logout');
      data.success && setUserData(false);
      data.success && setisLoggedIn(false);
      navigate('/');
      toast.success(data.message);
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div className='w-full px-4 py-2 flex justify-between text-white absolute top-0' >
        <img src={assets.logo} alt="logo" className='w-28 sm:w-32' />
        {
          userData ? 
          <div className="border border-gray-300 rounded-full w-8 h-8 items-center flex justify-center font-bold relative group">
            {userData.name[0].toUpperCase()} 
            <div className="absolute hidden group-hover:block top-8 right-0 z-10 rounded p-1 border border-gray-300 w-fit ">
              <ul className="p-1">
                {!userData.isAccountVerified &&
                 <li
                  onClick={sendEmailVerificationOtp} 
                  className="py-1 px-2 w-full hover:bg-gray-400 cursor-pointer whitespace-nowrap">
                  Verify Email
                </li> }
                <li
                onClick={logout} 
                className="py-1 px-2 hover:bg-gray-400 cursor-pointer">Logout</li>
              </ul>
            </div>
          </div> :
          <button 
          onClick={()=>navigate('/login')}
          className='text-2xl border border-gray-400 rounded-md px-4 py-2 flex gap-2 items-center bg-slate-500 hover:bg-slate-700 transition-all' 
          >Login <img src={assets.arrow_icon} alt="arrow-icon" className='bg-transparent' /> </button>
        }
    </div>
  )
}

export default Navbar