import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Helmet>
        <title>Virtual League - Connect with Sports Enthusiasts</title>
        <meta name="description" content="Welcome to Virtual League - connecting sports enthusiasts and helping players find games and organizers find players." />
      </Helmet>
      
      <header className="bg-white py-5 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="italic mb-1">Get drafted, have a draft</p>
          <h1 className="text-3xl font-bold">Virtual League</h1>
          <p className="italic mt-1">Where it's draft night, every night.</p>
        </div>
      </header>
      
      <nav className="bg-[#eaeaea] border-b border-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <Link to="/" className="py-3.5 px-5 font-bold border-r border-gray-300 text-black">
              For Players
            </Link>
            <Link to="/for-organizers" className="py-3.5 px-5 font-bold border-r border-gray-300 text-black">
              For Organizers
            </Link>
            <Link to="/join-a-game" className="py-3.5 px-5 font-bold border-r border-gray-300 text-black">
              Join a Game
            </Link>
            <Link to="/organize-a-game" className="py-3.5 px-5 font-bold text-black">
              Organize a Game
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="about">
          <h2 className="text-2xl font-bold mb-4">"ABOUT US"</h2>
          <p className="text-lg mb-8">Welcome to the first player-focused casual player registry. Our goal is to connect players to time doing what they love: playing sports.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/for-organizers" className="inline-block border border-black bg-white py-3.5 px-6 font-bold rounded">
            For Players
          </Link>
          <Link to="/player-database" className="inline-block border border-black bg-white py-3.5 px-6 font-bold rounded">
            For Organizers
          </Link>
          <Link to="/organize-a-game" className="inline-block border border-black bg-white py-3.5 px-6 font-bold rounded">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
