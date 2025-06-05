import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Helmet } from "react-helmet";

export default function ForOrganizers() {
  return (
    <Layout title="For Organizers">
      <Helmet>
        <title>For Organizers - Virtual League</title>
        <meta name="description" content="Resources and tools for game organizers. Browse player database and create game listings." />
      </Helmet>
      
      <div className="max-w-3xl mx-auto text-center">
        <div className="top-buttons flex justify-center gap-5 mb-8">
          <Link to="/player-database" className="inline-block border border-black py-3.5 px-6 font-bold rounded bg-white">
            Player Database
          </Link>
          <Link to="/organize-a-game" className="inline-block border border-black py-3.5 px-6 font-bold rounded bg-white">
            Organize a Game
          </Link>
        </div>
        
        <div className="placeholder text-gray-500 italic mt-10">
          Select an option above to get started.
        </div>
      </div>
    </Layout>
  );
}
