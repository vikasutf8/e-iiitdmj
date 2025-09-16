import Link from 'next/link'
import React from 'react'

interface props {
    title: string
    icons: React.ReactNode
    isActive: boolean
    href : string
}
const sidebarItem = ({icons, title, isActive, href} :props) => {
  return (
    <Link href={href} className='my-2 block'>
        <div className={`flex gap-2 w-full h-full items-center px-[13px] rounded-lg cursor-pointer transition justify-start ${isActive && "scale-[.98] bg-[#0f3158] fill-blue-200 hover: bg-[#0f3158d6]"}`}>
            {icons}
            <h5 className='text-lg text-slate-200'>
                {title}
            </h5>
        </div>
    </Link>
  )
}

export default sidebarItem