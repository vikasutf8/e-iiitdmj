'use client'
import { AlignLeft, ChevronDown, Heart, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { navItems } from '../../configs/constant';
import Link from 'next/link';
import ProfileIcon from '../../assests/svgs/profile-icon';

const HeaderBottom = () => {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);


    // tracking scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {

                setIsSticky(true);
            }
            else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isSticky]);
    return (
        <div className={`w-full h-[65px] transition-all duration-500 ${isSticky ? 'fixed top-0 left-0 z-100 bg-white shadow-lg' : 'relative'}`}>
            <div className={`w-[80%] relative m-auto flex justify-between items-center ${isSticky ? 'pt-3' : 'py-0'}`}>
                {/* all dropdowns */}
                <div className={`w-[260px] ${isSticky && '-mb-2'} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489FF] `}
                    onClick={() => setShow(!show)}>
                    <div className='flex items-center gap-2'>
                        <AlignLeft color='white' size={20} />
                        <span className='text-white font-medium'>All Departments</span>
                    </div>
                    <ChevronDown color='white' size={20} />
                </div>
                {/* department dropdown */}
                {
                    show && (
                        <div className={`absolute left-0 ${isSticky ? 'top-[70px]' : 'top-[50px]'} w-[260px] h-[400px] bg-[#f5f5f5] shadow-lg rounded-b-md overflow-hidden`}>

                        </div>
                    )
                }

                {/* navigation Links */}
                <div className='flex items-center justify-center'>
                    {
                        navItems.map((item: NavItemTypes, index: number) => {
                            return (
                                <Link key={index} href={item.href} className='px-5 font-medium text-lg'>
                                    {item.title}
                                </Link>
                            )
                        })
                    }
                </div>

                {/* user profile */}
                {
                    isSticky && (
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
                    )
                }
                <div>

                </div>
            </div>
        </div>
    )
}

export default HeaderBottom