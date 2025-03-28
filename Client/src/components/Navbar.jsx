import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <div className='w-full px-4 py-2 flex justify-between text-white absolute top-0' >
        <img src={assets.logo} alt="logo" className='w-28 sm:w-32' />
        <button className='text-2xl border border-gray-400 rounded-md px-4 py-2 flex gap-2 items-center bg-slate-500 hover:bg-slate-700 transition-all'
        onClick={()=>navigate('/lo')} 
        >Login <img src={assets.arrow_icon} alt="arrow-icon" className='bg-transparent' /> </button>
    </div>
  )
}

export default Navbar