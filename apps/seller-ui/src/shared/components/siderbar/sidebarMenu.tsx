import React from 'react'

interface Props {
  title: string
  children: React.ReactNode
}


const SidebarMenu = ({title, children}:Props) => {
  return (
    <div className='block'>
        
    <h3 className='text-md tracking-[0.04rem] pl-1'>{title}</h3>
    <div className='mt-2 block'>
      {children}
      </div>
    </div>
  )
}

export default SidebarMenu