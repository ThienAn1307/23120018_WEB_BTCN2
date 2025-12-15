import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import { MoviesProvider } from '@/context/MovieContext';

const MAX_WIDTH_CLASS = 'max-w-[1200px] mx-auto w-full';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Header */}
      <div className={MAX_WIDTH_CLASS}>
        <Header />
      </div>

      <div className={MAX_WIDTH_CLASS}> 
        <Navbar />
      </div>

      {/* Nội dung chính*/}
      <MoviesProvider>
        <main className={`flex-grow ${MAX_WIDTH_CLASS} p-4`}>
          <Outlet />
        </main>
      </MoviesProvider>

      {/* Footer */}
      <div className={MAX_WIDTH_CLASS}>
        <Footer />
      </div>
    </div>
  );
};