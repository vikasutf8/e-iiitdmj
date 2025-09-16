"use client"

import React from 'react'
import { useAtom } from 'jotai'
import { activeSidebarItemAtom } from '../configs/constant';

const useSidebar = () => {
    const  [activeSidebar, setActiveSidebar] = useAtom(activeSidebarItemAtom);
  return {
    activeSidebar,
    setActiveSidebar,
  }
}

export default useSidebar