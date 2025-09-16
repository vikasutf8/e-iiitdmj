import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
}


const sidebarMenu = ({title, children}:Props) => {
  return (
    <div className='block'>
        
    <h3 className='text-xs tracking-[0.04rem] pl-1'>{title}</h3>
    </div>
  )
}

export default sidebarMenu