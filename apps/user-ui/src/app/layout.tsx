
import Header from '../shared/widgets/header';
import './global.css';
import {Poppins,Roboto} from 'next/font/google'
export const metadata = {
  title: 'Welcome to E-Shop Freelance Platform',
  description: 'E-Shop is a platform where users can post and find freelance work',
};

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-roboto',
})

const poppins = Poppins({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable}`}>
        <Header/>
        {children}</body>
    </html>
  );
}
