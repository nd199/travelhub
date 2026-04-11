import { FaWifi, FaCoffee } from 'react-icons/fa';
import { IoSnow, IoFlash, IoBook, IoTime, IoVideocam, IoWater } from 'react-icons/io5';
import { MdPower } from 'react-icons/md';
import { BsSquare } from 'react-icons/bs';

export const busAmenities = [
  { icon: FaWifi, label: 'WiFi', available: true },
  { icon: IoSnow, label: 'AC', available: true },
  { icon: MdPower, label: 'Charging Point', available: true },
  { icon: IoFlash, label: 'Water Bottle', available: true },
  { icon: IoBook, label: 'Reading Light', available: true },
  { icon: FaCoffee, label: 'Snacks', available: true },
  { icon: IoVideocam, label: 'CCTV', available: true },
  { icon: IoTime, label: 'Track ETA', available: true },
  { icon: BsSquare, label: 'Pushback Seats', available: true },
  { icon: IoWater, label: 'Water Facility', available: true },
];

export const busPhotos = [
  '/volvo-outer.png',
  '/Seat-interior.webp',
  '/Charging-Sockets.png',
  '/ac-with-reading-light.webp',
  '/regular-toilet.jpeg',
];
