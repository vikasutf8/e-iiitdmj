"use client"

import React, { useEffect, useState } from 'react'

const HeaderBottom = () => {

    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    //track scroll position
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 100){
                setIsSticky(true);
            }else{
                setIsSticky(false);
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    
    },[])

  return (
    <div className={`w-full transition-all duration-300 ${isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" :"relative"}`}
    >
        
    <div className={`w-[80%] mx-auto ${isSticky ? "pt-3" : "py-0"} flex justify-between items-center`}>
{/* all dropdown */}

    
    </div>

    </div>
  )
}

export default HeaderBottom
