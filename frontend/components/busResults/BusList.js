import BusCard from './BusCard';

export default function BusList({ buses }) {
  return (
    <div className="space-y-3">
      {buses?.map((bus) => (
        <BusCard key={bus.id} bus={bus} />
      ))}
    </div>
  );
}
