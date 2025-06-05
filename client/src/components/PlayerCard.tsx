type PlayerCardProps = {
  name: string;
  sport: string;
  level: string;
};

export default function PlayerCard({ name, sport, level }: PlayerCardProps) {
  const dataSport = sport.toLowerCase().replace(' ', '');
  
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-md mb-4" data-sport={dataSport}>
      <div className="font-bold">{name}</div>
      <div className="text-gray-600">{sport} – {level}</div>
    </div>
  );
}
