"use client"
import { usePathname } from 'next/navigation';
import useSidebar from '../../../hoooks/useSidebar'
import React, { useEffect } from 'react'
import useSeller from '../../../hoooks/useSeller';
import Box from '../box';
import { SideBarStyle } from './sidebarStyle';
import Link from 'next/link';



const SidebarWrapper = () => {
  const  {activeSidebar, setActiveSidebar} = useSidebar();
  const pathName = usePathname();
  const {seller} = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route:string) => {
    if(route === activeSidebar){
      return 'text-blue-500'
    }else{
      return '#969696'
    }
  };

  return (
    <Box
    css={{
      height: '100%',
      zIndex: 201,
      position:"sticky",
      padding:"8px",
      top:0,
      overflowY:'scroll',
      scrollbarWidth: 'none',
    }}
    className='sidebar-wrapper'
    >
      <SideBarStyle.Header>
        <Box>
           <Link href="/" className='flex  justify-center text-center gap-2 '>
           {/* <Logo/> Logog */}
           <Box>
              <h3 className='text-xl font-medium text-[#ecedee]'>{seller?.shop?.name}</h3>
           </Box>

           </Link>
        </Box>
      </SideBarStyle.Header>

    </Box>
  )
}

export default SidebarWrapper