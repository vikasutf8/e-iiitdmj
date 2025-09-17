"use client"
import { usePathname } from 'next/navigation';
import useSidebar from '../../../hoooks/useSidebar'
import React, { useEffect } from 'react'
import useSeller from '../../../hoooks/useSeller';
import Box from '../box';
import SideBarStyle from './sidebarStyle';
import { Sidebar } from 'lucide-react';


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
        
      </SideBarStyle.Header>

    </Box>
  )
}

export default SidebarWrapper