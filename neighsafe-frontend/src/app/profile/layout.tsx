import Navbar from '@/components/home/NavBar/NavBar'
import FloatingButton from '@/components/home/FloatingButton/FloatingButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <FloatingButton />
      </body>
    </html>
  );
}