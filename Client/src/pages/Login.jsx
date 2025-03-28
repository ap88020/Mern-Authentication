import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 flex-col' >
      <img src={assets.logo} alt="" className='absolute left-5 cursor-pointer sm:left-20 top-5 w-28 sm:w-32 bg-transparent' />

      <div className='border border-gray-400 p-6 w-fit h-full rounded-md transition-all'>
      <div className='mb-3'>
          <h2 className='text-3xl text-center font-semibold' >{state == 'Sign Up' ? "Create account" : "Login account"}</h2>
        <p className='text-center'>{state == 'Sign Up' ? "Create your account" : "Login your account"}</p>
      </div>
      
      <form className='bg-transparent'>
        {
          state == "Sign Up" && (
            <div className='flex py-2 px-5 bg-slate-700 items-center gap-3 w-full mb-4 rounded-full'>
              <img src={assets.person_icon} alt=""  className='bg-transparent' />
              <input type="text" placeholder="Full Name" required className='outline-none border-none bg-transparent text-white px-2 placeholder-white' />
          </div>
          )
        }
        <div className='flex py-2 px-5 bg-slate-700 items-center gap-3 w-full mb-4 rounded-full'>
          <img src={assets.mail_icon} alt=""  className='bg-transparent' />
          <input type="email" placeholder="Email id" required className='outline-none border-none bg-transparent text-white px-2 placeholder-white' />
        </div>

        <div className='flex py-2 px-5 bg-slate-700 items-center gap-3 w-full mb-4 rounded-full'>
          <img src={assets.lock_icon} alt=""  className='bg-transparent' />
          <input type="password" placeholder="Password" required className='outline-none border-none bg-transparent text-white px-2 placeholder-white' />
        </div>
        <p className='cursor-pointer text-blue-300 font-thin' >Forgot Password?</p>
        <button className='w-full rounded-full py-2.5 bg-gradient-to-r from-violet-400 to-blue-400 font-medium' >{state}</button>
      </form>
      {
        state == "Sign Up" ? (
          <p className='text-sm text-center mt-4' >Already have an account? {' '}
            <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline' >Login here</span>
          </p>
        )
        :
        (
          <p className='text-sm text-center mt-4' >Don't have an Account? {' '}
            <span onClick={()=>setState('Sign Up')} className='text-blue-400 cursor-pointer underline' >Sign Up</span>
          </p>
        )
      }

      </div>
    </div>
  )
}

export default Login;