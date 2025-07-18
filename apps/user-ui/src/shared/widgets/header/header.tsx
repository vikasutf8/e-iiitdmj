import Link from 'next/link'
import React from 'react'
import {HeartCrack, Search, ShoppingBag} from 'lucide-react'
import HeaderBottom from './header-bottom'

const Header = () => {
  return (
    <div className='w-full bg-white border-b-2 border-gray-200 shadow-md'
    >
      <div className='w-[80%] mx-auto py-5 flex justify-between items-center'>
        <div>
          <Link href='/'>
            {/* <img src='/logo.png' alt='logo'/> */}
            <span className='text-2xl font-bold'>E-Shop</span>
          </Link>
        </div>
        <div className='w-[50%] relative'>
          <input type='text' placeholder='Search for Products'
          className='w-full px-4 font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px] font-poppins'/>
          <div className='absolute top-0 right-0 w-[60px] h-[55px] bg-[#3489FF] flex justify-center items-center cursor-pointer'>
            <Search color='white' size={40}/>
          </div>
         
        </div> 
        <div className='flex items-center gap-4'>
            <Link href='/'>
              <span className='text-poppins font-medium text-xl'>Login</span>
              {/* <ProfileIcon/> */}
            </Link>
            <Link href='/'>
              <span className='text-poppins font-medium text-xl'>Register</span>
            </Link>
            <Link href='/Wishlist' >
            <HeartCrack size={30} />
            </Link>
            <Link href='/Cart'>
            <ShoppingBag size={30} />
            <div className='w-6 h-6 bg-red-500 rounded-full flex justify-center items-center border-white border-[2px] absolute top-[1.5rem] right-[11.5rem]'>
              <span className='text-white font-medium text-sm'>0</span>
            </div>
            </Link>
          </div>

      </div>

      <div className='border-b border-b-slate-200 w-full h-[5px]'/>
    <HeaderBottom/>


    </div>
  )
}

export default Header