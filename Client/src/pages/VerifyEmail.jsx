import React, { useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContent);
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

  // Redirect to login if the user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 flex-col'>
      <img
        src={assets.logo}
        onClick={() => navigate('/')}
        alt="Logo"
        className='absolute left-5 cursor-pointer sm:left-20 top-5 w-28 sm:w-32 bg-transparent'
      />

      <div className='border border-gray-400 p-6 w-fit h-full rounded-md transition-all'>
        <h1 className='text-2xl font-bold text-center'>Verify Email</h1>
        <br />
        <p>Enter your 6-digit OTP sent to your Gmail</p>
        <form onSubmit={submitHandler} className='bg-transparent'>
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
    </div>
  );
};

export default VerifyEmail;
