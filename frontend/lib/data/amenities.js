import {
  Wifi,
  Snowflake,
  Power,
  Zap,
  BookOpen,
  Coffee,
  Video,
  Timer,
  Armchair,
  Droplet,
} from 'lucide-react';

export const busAmenities = [
  { icon: Wifi, label: 'WiFi', available: true },
  { icon: Snowflake, label: 'AC', available: true },
  { icon: Power, label: 'Charging Point', available: true },
  { icon: Zap, label: 'Water Bottle', available: true },
  { icon: BookOpen, label: 'Reading Light', available: true },
  { icon: Coffee, label: 'Snacks', available: true },
  { icon: Video, label: 'CCTV', available: true },
  { icon: Timer, label: 'Track ETA', available: true },
  { icon: Armchair, label: 'Pushback Seats', available: true },
  { icon: Droplet, label: 'Water Facility', available: true },
];

export const busPhotos = [
  '/volvo-exterior.jpeg',
  '/seater-interior.webp',
  '/sleeper-interior.webp',
  '/ac-with-reading-light.webp',
];