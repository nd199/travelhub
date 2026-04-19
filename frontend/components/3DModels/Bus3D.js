import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Seat3D = ({
  position,
  seat,
  isSelected,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const getColor = () => {
    if (seat?.type === 'booked') return 'gray';
    if (seat?.type === 'driver') return '#f59e0b';
    if (isSelected) return 'green';
    if (seat?.gender === 'ladies') return 'pink';
    return 'white';
  };

  return (
    <group
      position={position}
      rotation={[0, Math.PI / 2, 0]}
      onClick={seat?.type === 'driver' ? undefined : onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Seat Base */}
      <mesh>
        <boxGeometry args={[0.9, 0.3, 0.9]} />
        <meshStandardMaterial
          color={getColor()}
          roughness={0.5}
          metalness={0.2}
          emissive={isSelected ? '#22c55e' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>

      {/* Seat Back */}
      <mesh position={[0, 0.5, -0.3]}>
        <boxGeometry args={[0.9, 1, 0.2]} />
        <meshStandardMaterial
          color={getColor()}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};

const Bus3D = ({
  seatLayout,
  activeSelections,
  handleSeatSelection,
  setHoveredSeat,
  setCursorPosition,
}) => {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }} shadows>
        <ambientLight intensity={0.4} />
        <hemisphereLight intensity={0.6} groundColor="#bfc7d5" />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 10, -5]} intensity={0.5} />
        <fog attach="fog" args={['#f9fafb', 20, 60]} />
        <OrbitControls enablePan={false} />

        {/* Floor */}
        <mesh
          position={[4.0, 0.2, -1]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 8]} />
          <meshStandardMaterial
            color="#d1d5db"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Bottom Base (Chassis) */}
        <mesh position={[4.0, 0.2, -1]} castShadow receiveShadow>
          <boxGeometry args={[20, 0.6, 6]} />
          <meshStandardMaterial
            color="#6b7280"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* Bus Front Face */}
        <mesh position={[14, 1.2, -1]}>
          <boxGeometry args={[0.3, 2.5, 6]} />
          <meshStandardMaterial
            color="#6b7280"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* Bus Back Face */}
        <mesh position={[-6, 1.2, -1]}>
          <boxGeometry args={[0.3, 2.5, 6]} />
          <meshStandardMaterial
            color="#6b7280"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* Wheels */}
        {/* Front Left */}
        <mesh position={[-2, -0.2, -5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.8, 30]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.9}
            metalness={0.4}
          />
        </mesh>

        {/* Front Right */}
        <mesh position={[9, -0.2, 3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.8, 30]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.9}
            metalness={0.4}
          />
        </mesh>

        {/* Back Left */}
        <mesh position={[-2, -0.2, 3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.8, 30]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.9}
            metalness={0.4}
          />
        </mesh>

        {/* Back Right */}
        <mesh position={[9, -0.2, -5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.8, 30]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.9}
            metalness={0.4}
          />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-6.0, 1, -1]}>
          <boxGeometry args={[0.2, 2, 8]} />
          <meshStandardMaterial
            color="#93c5fd"
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Left Windows (Glass Panels) */}
        <mesh position={[-5.85, 1, -1]}>
          <boxGeometry args={[0.05, 1.6, 7]} />
          <meshStandardMaterial
            color="#bfdbfe"
            roughness={0.1}
            metalness={0.1}
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Right Wall */}
        <mesh position={[11.5, 1, -1]}>
          <boxGeometry args={[0.2, 2, 8]} />
          <meshStandardMaterial
            color="#93c5fd"
            roughness={0.3}
            metalness={0.1}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Right Windows (Glass Panels) */}
        <mesh position={[11.35, 1, -1]}>
          <boxGeometry args={[0.05, 1.6, 7]} />
          <meshStandardMaterial
            color="#bfdbfe"
            roughness={0.1}
            metalness={0.1}
            transparent
            opacity={0.25}
          />
        </mesh>

        {/* Steering Wheel */}
        <mesh position={[13.5, 1.0, 0.65]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.3, 0.08, 16, 100]} />
          <meshStandardMaterial
            color="#111827"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* Steering Stand */}
        <mesh position={[13.5, 0.6, 0.65]}>
          <cylinderGeometry args={[0.1, 0.1, 1.4, 20]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Driver Seat */}
        <Seat3D
          seat={{ type: 'driver', name: 'Driver Seat', price: 0 }}
          isSelected={false}
          position={[12.5, 0.5, 0.5]}
          onClick={() => {}}
        />

        {/* Seats */}
        {seatLayout?.map((row, rowIndex) =>
          row.map((seat, colIndex) => {
            const id = `${rowIndex}-${colIndex}`;
            const isSelected = activeSelections.includes(id);

            return (
              <Seat3D
                key={id}
                seat={seat}
                isSelected={isSelected}
                position={[-4 + colIndex * 2, 0.5, -3 + rowIndex * 1]}
                onClick={() => handleSeatSelection(rowIndex, colIndex)}
                onPointerOver={(e) => {
                  setHoveredSeat?.(seat);
                  setCursorPosition?.({
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onPointerOut={() => setHoveredSeat?.(null)}
              />
            );
          })
        )}
      </Canvas>
    </div>
  );
};

export default Bus3D;
