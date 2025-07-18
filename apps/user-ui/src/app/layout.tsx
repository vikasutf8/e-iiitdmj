
import Header from '../shared/widgets/header';
import './global.css';

export const metadata = {
  title: 'Welcome to E-Shop Freelance Platform',
  description: 'E-Shop is a platform where users can post and find freelance work',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header/>
        {children}</body>
    </html>
  );
}
