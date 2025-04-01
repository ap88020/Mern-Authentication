import React, { useState , useRef, useContext} from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [IsEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState('');

  const navigate = useNavigate();
  const inputRef = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRef.current.map((input) => input.value);
      const otp = otpArray.join('');
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-otp`, { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{email});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
        const otpArray = inputRef.current.map((e) => e.value);
        const enteredOtp = otpArray.join('');
        setOtp(enteredOtp);
        setIsOtpSubmited(true);
    } catch (error) {
        toast.error(error.message);
    }
};


const onSubmitNewPassword = async (e) => {
  e.preventDefault();
  try {
      const otpArray = inputRef.current.map((e) => e.value);
      const enteredOtp = otpArray.join('');
      setOtp(enteredOtp);

    const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword: password 
    });
    

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');

      
  console.log("Email:", email);
  console.log("OTP:", otp);
  console.log("Password:", password);

  } catch (error) {
      toast.error(error.message);
  }
};


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0'>
      <img
              src={assets.logo}
              onClick={() => navigate('/')}
              alt="Logo"
              className='absolute left-5 cursor-pointer sm:left-20 top-5 w-28 sm:w-32 bg-transparent'
            />
{
  !IsEmailSent && 
      <div className='border border-gray-400 p-6 w-fit h-full rounded-md transition-all'>
        <h1 className='text-2xl font-bold text-center'>Reset Password</h1>
        <br />
        <p>Enter your registered Email address</p>
        <br />
        <form onSubmit={onSubmitEmail} className='bg-transparent'>
          <div className='flex py-2 px-5 bg-slate-700 items-center gap-3 w-full mb-4 rounded-full'>
                    <img src={assets.mail_icon} alt=""  className='bg-transparent' />
                    <input type="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email} 
                    placeholder="Email id" 
                    required className='outline-none border-none bg-transparent text-white px-2 placeholder-white' />
                  </div>
          <button className='w-full rounded-full py-2.5 bg-gradient-to-r from-violet-400 to-blue-400 font-medium'>
            Submit
          </button>
        </form>
      </div>
}
      {/* {reset otp} */}
{
!isOtpSubmited && IsEmailSent &&   

      <div className='border border-gray-400 p-6 w-fit h-full rounded-md transition-all'>
        <h1 className='text-2xl font-bold text-center'>Verify Email</h1>
        <br />
        <p>Enter your 6-digit OTP sent to your Gmail</p>
        <form onSubmit={onSubmitOtp} className='bg-transparent'>
          <div
            className='flex py-2 px-5 bg-slate-700 items-center gap-1 w-full mb-4 rounded'
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  required
                  ref={(el) => (inputRef.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className='w-10 h-12 text-center text-xl border border-gray-300'
                />
              ))}
          </div>
          <button className='w-full rounded-full py-2.5 bg-gradient-to-r from-violet-400 to-blue-400 font-medium'>
            Submit
          </button>
        </form>
      </div>
}
      {/* {enter your new email} */}
{
  isOtpSubmited && IsEmailSent &&
      <div className='border border-gray-400 p-6 w-fit h-full rounded-md transition-all'>
        <h1 className='text-2xl font-bold text-center'>New Password</h1>
        <br />
        <p>Create a new Password</p>
        <br />
        <form onSubmit={onSubmitNewPassword} className='bg-transparent'>
          <div className='flex py-2 px-5 bg-slate-700 items-center gap-3 w-full mb-4 rounded-full'>
                    <img src={assets.lock_icon} alt=""  className='bg-transparent' />
                    <input type="text"
                    onChange={e => setPassword(e.target.value)}
                    value={password} 
                    placeholder="enter your new password" 
                    required className='outline-none border-none bg-transparent text-white px-2 placeholder-white' />
                  </div>
          <button className='w-full rounded-full py-2.5 bg-gradient-to-r from-violet-400 to-blue-400 font-medium'>
            Submit
          </button>
        </form>
      </div>
}
    </div>
  )
}

export default ResetPassword