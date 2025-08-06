import Link from 'next/link'
import React from 'react'
import { Heart, Search, SearchCheck, ShoppingCart } from 'lucide-react';
import ProfileIcon from '../../assests/svgs/profile-icon';
import HeaderBottom from './header-bottom';



const Header = () => {
    return (
        <div className='w-full bg-white shadow-md  border-b-[#99999938]'
    >
            <div className='w-[80%] py-5 m-auto flex flex-row justify-between items-center  '>
                <div>
                    <Link href='/'>
                        <span className='text-2xl font-bold'>Eshop</span>
                    </Link>
                </div>
                <div className='w-[50%] relative'>
                    <input type="text" name="" id="" placeholder='Search for products...' className='w-full px-4 font-medium border-2 border-[#3489FF] outline-none h-[55px] ' />
                    <div className='w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF]  absolute right-0 top-0'>
                        <Search className='w-6 h-6 text-white' />
                    </div>

                </div>
                <div className='flex items-center gap-8'>
                    <div className='flex items-center gap-2 '>
                        <Link href={"/login"}
                            className='border-2 w-[50px] h-[50px] m-auto flex items-center justify-center rounded-full border-[#010f1c1a]'>
                            <ProfileIcon />
                        </Link>
                        <Link href={"/login"}>
                            <span className='block font-medium '>Hello'S</span>
                            <span className='font-semibold'>Sign IN</span>
                        </Link>
                    </div>
                    <div className='flex items-center gap-5'>
                        <Link href={"/wishlist"} className='relative'>
                         <Heart />
                         <div className='w-6 h-6 border-2 border-white bg-red-500 flex items-center justify-center absolute top-[-10px] right-[-10px] rounded-full'>
                            <span className='text-white font-white text-sm'>4</span>
                         </div>
                        </Link>
                          <Link href={"/cart"} className='relative'>
                        <ShoppingCart />
                         <div className='w-6 h-6 border-2 border-white bg-red-500 flex items-center justify-center absolute top-[-10px] right-[-10px] rounded-full'>
                            <span className='text-white font-white text-sm'>4</span>
                         </div>
                        </Link>
                    </div>
                    <div>
                    </div>
                </div>
            </div>

            <div className='border-b border-b-[#99999938]'/>
                <HeaderBottom />
           
        </div>
    )
}

export default Header

