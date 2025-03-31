import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContent);
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6 bg-black'/>
        <h1 className='flex text-center gap-3 text-xl sm:text-3xl text-yellow-100' >Hey {userData ? userData.name : "Developer"}!  <img src={assets.hand_wave} alt="" className='w-8 aspect-square  ' /> </h1>
        <h1 className='text-6xl text-white'>Welcome to our app</h1>
        <p className='text-white w-2/3'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque dolores libero soluta maxime minus quibusdam laboriosam expedita mollitia perspiciatis commodi?</p>
        <button className='font-semibold rounded-full border border-white py-2 px-4 text-white hover:bg-zinc-500 transition-all'>Get Started</button>
    </div>
  )
}

export default Header