import { Link, useLocation } from "wouter";
import { useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export default function Layout({ children, title }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="bg-white py-5 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">{title}</h1>
        </div>
      </header>
      
      <nav className="bg-[#eaeaea] border-b border-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-center md:justify-start">
            <Link to="/find-players" className={`py-3.5 px-5 font-bold border-r border-gray-300 ${location === '/find-players' ? 'text-blue-600' : 'text-black'}`}>
              Find Players
            </Link>
            <Link to="/my-profile" className={`py-3.5 px-5 font-bold border-r border-gray-300 ${location === '/my-profile' ? 'text-blue-600' : 'text-black'}`}>
              My Profile
            </Link>
            <Link to="/join-a-game" className={`py-3.5 px-5 font-bold border-r border-gray-300 ${location === '/join-a-game' ? 'text-blue-600' : 'text-black'}`}>
              Join a Game
            </Link>
            <Link to="/organize-a-game" className={`py-3.5 px-5 font-bold ${location === '/organize-a-game' ? 'text-blue-600' : 'text-black'}`}>
              Organize a Game
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
