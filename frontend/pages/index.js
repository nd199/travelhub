import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import {
  BusForm,
  TrainForm,
  FlightForm,
} from '../components/forms/BookingForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState('bus');
  const [currentTime, setCurrentTime] = useState('');
  const isHorizontal = activeTab === 'train' || activeTab === 'flight';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'train':
        return (
          <TrainForm onTabChange={handleTabChange} activeTab={activeTab} />
        );
      case 'flight':
        return (
          <FlightForm onTabChange={handleTabChange} activeTab={activeTab} />
        );
      default:
        return <BusForm onTabChange={handleTabChange} activeTab={activeTab} />;
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 object-cover w-full h-full -z-10 brightness-50"
      >
        <source src="/db_video.mp4" type="video/mp4" />
      </video>

      <Navbar variant="landing" />

      {isHorizontal ? (
        <div className="relative flex flex-col items-center w-full min-h-screen px-4 justify-evenly md:px-12">
          <div className="flex flex-col items-center justify-center w-full ">
            <p className="mt-4 text-lg md:text-xl text-white/80 drop-shadow">
              Your journey starts here. Book buses, trains and flights easily in
              one place.
            </p>
            <div className="mt-6 text-sm text-white/60">
              Fast booking • Best prices • Trusted travel partner
            </div>
            <div className="w-full mt-10">{renderForm()}</div>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-between min-h-screen px-6 md:flex-row md:px-16">
          {/* LEFT SIDE - TEXT */}
          <div className="flex flex-col justify-center max-w-xl">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-transparent md:text-7xl bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-lg">
              TravelHub
            </h1>

            <p className="mt-4 text-lg md:text-xl text-white/80 drop-shadow">
              Your journey starts here. Book buses, trains and flights easily in
              one place.
            </p>

            <div className="mt-6 text-sm text-white/60">
              Fast booking • Best prices • Trusted travel partner
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="flex items-center justify-end">{renderForm()}</div>
        </div>
      )}

      {/* Environment Details Footer */}
      <div className="fixed z-50 flex items-center gap-3 px-4 py-2 border rounded-full bottom-4 left-4 bg-black/40 backdrop-blur-md border-white/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex h-2.5 w-2.5 bg-green-500 rounded-full"></span>
          </span>
          <span className="text-xs font-medium text-white/70">Production</span>
        </div>
        <div className="w-px h-4 bg-white/20"></div>
        <div className="text-xs text-white/50">{currentTime}</div>
      </div>
    </div>
  );
}
