"use client"
import { usePathname } from 'next/navigation';
import useSidebar from '../../../hoooks/useSidebar'
import React, { useEffect } from 'react'
import useSeller from '../../../hoooks/useSeller';
import Box from '../box';
import { SideBarStyle } from './sidebarStyle';
import Link from 'next/link';
import SidebarItem from './sidebarItem';
import SidebarMenu from './sidebarMenu';



const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  // console.log(seller,"seller");
  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) => {
    if (route === activeSidebar) {
      return 'text-blue-500'
    } else {
      return '#969696'
    }
  };

  return (
    <Box
      css={{
        height: '100%',
        zIndex: 201,
        position: "sticky",
        padding: "8px",
        top: 0,
        overflowY: 'scroll',
        scrollbarWidth: 'none',
      }}
      className='sidebar-wrapper'
    >
      <SideBarStyle.Header >
        <Box>
          <Link href="/" className='flex  justify-between text-center gap-2 '>
            <span>VR</span>
            <Box>
              <h3 className='text-xl font-medium text-[#ecedee]'>{seller?.shops?.name}</h3>
              <h5 className='text-[#ecedeeca] pl-2 font-medium text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-['>{seller?.shops?.address}</h5>
            </Box>
          </Link>
        </Box>
      </SideBarStyle.Header>

      <div className='block my-3 h-full'>
        <SideBarStyle.Body>
          <SidebarItem title='Dashboard' icons={<i className="ri-home-3-line"></i>} isActive={activeSidebar === '/dashboard'} href='/dashboard' />

           <div className='mt-2 block'>
           <SidebarMenu title={"Main Menu"}>
             {[
               {
                 title: 'Orders',
                 icon: <i className="ri-file-list-3-line"></i>,
                 path: '/dashboard/orders'
               },
               {
                 title: 'Payment',
                 icon: <i className="ri-money-rupee-circle-fill"></i>,
                 path: '/dashboard/payment'
               },
               {
                 title: 'Account',
                 icon: <i className="ri-account-pin-box-line"></i>,
                 path: '/dashboard/account'
               },
               {
                 title: 'Cart',
                 icon: <i className="ri-shopping-cart-2-line"></i>,
                 path: '/dashboard/cart'
               }
             ].map((item, index) => (
               <SidebarItem
                 key={index}
                 title={item.title}
                 icons={item.icon}
                 isActive={activeSidebar === item.path}
                 href={item.path}
               />
             ))}
           </SidebarMenu>
{/* NOTE: routing will defined later */}
           <SidebarMenu title="Products">
             {[
               {
                 title: 'Create Product',
                 icon: <i className="ri-file-add-line"></i>,
                 path: '/dashboard/products/create'
               },
               {
                 title: 'Category',
                 icon: <i className="ri-menu-search-line"></i>,
                 path: '/dashboard/products/category'
               },
             ].map((item, index) => (
               <SidebarItem
                 key={index}
                 title={item.title}
                 icons={item.icon}
                 isActive={activeSidebar === item.path}
                 href={item.path}
               />
             ))}
           </SidebarMenu>

           <SidebarMenu title="Events">
             <SidebarItem title='Create Event' icons={<i className="ri-add-box-line"></i>} isActive={activeSidebar === '/dashboard/events/create'} href='/dashboard/events/create' />
             <SidebarItem title='All Events' icons={<i className="ri-calendar-event-line"></i>} isActive={activeSidebar === '/dashboard/events'} href='/dashboard/events' />
           </SidebarMenu>

           <SidebarMenu title="Controllers">
            <SidebarItem title='Inbox' icons={<i className="ri-mail-open-line"></i>} isActive={activeSidebar === '/dashboard/controllers/create'} href='/dashboard/controllers/create' />
            <SidebarItem title='Settings' icons={<i className="ri-tools-fill"></i>} isActive={activeSidebar === '/dashboard/controllers'} href='/dashboard/controllers' />
             <SidebarItem title='Notifications' icons={<i className="ri-notification-fill"></i>} isActive={activeSidebar === '/dashboard/controllers'} href='/dashboard/controllers' />
           </SidebarMenu>

           <SidebarMenu title="Extra">
             <SidebarItem title='Discount Code' icons={<i className="ri-discount-percent-line"></i>} isActive={activeSidebar === '/dashboard/extra/help'} href='/dashboard/extra/help' />
             <SidebarItem title='Help' icons={<i className="ri-questionnaire-line"></i>} isActive={activeSidebar === '/dashboard/extra/help'} href='/dashboard/extra/help' />
             <SidebarItem title='Logout' icons={<i className="ri-logout-box-r-line"></i>} isActive={activeSidebar === '/dashboard/extra/help'} href='/dashboard/extra/help' />
           </SidebarMenu>
        </div>
        </SideBarStyle.Body>
       
      </div>

    </Box>
  )
}

export default SidebarWrapper