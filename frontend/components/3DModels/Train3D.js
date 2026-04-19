import React, { useState, useRef } from 'react';
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
  return (
    <group
      position={position}
      rotation={seat?.rotation || [0, 0, 0]}
      onClick={onClick}
    >
      {/* Seat Base (long bench) */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.4, 0.4, 2.8]} />
        <meshStandardMaterial color={isSelected ? '#22c55e' : '#c19a6b'} />
      </mesh>

      {/* Seat Division Lines */}
      <mesh position={[-0.9, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.3, 0.92]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      <mesh position={[0.9, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.3, 0.92]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      {/* Backrest */}
      <mesh position={[-0.45, 0.7, 0]}>
        <boxGeometry args={[0.3, 0.9, 2.8]} />
        <meshStandardMaterial color={isSelected ? '#16a34a' : '#8b5e3c'} />
      </mesh>
    </group>
  );
};

const Train3D = ({
  seatLayout,
  activeSelections,
  handleSeatSelection,
  setHoveredSeat,
  setCursorPosition,
  coachType = 'AC 3 Tier',
}) => {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [6, 9, 10], fov: 38 }}>
        <ambientLight intensity={0.4} />
        <hemisphereLight intensity={0.6} groundColor="#e5e7eb" />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 10, -5]} intensity={0.5} />
        <fog attach="fog" args={['#f3f4f6', 20, 60]} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />

        {/* General Coach Seat Layout */}
        {(() => {
          const compartments = 1;
          const aisleGap = 2;
          const compartmentWidth = 8;

          const seats = [];

          for (let c = 0; c < compartments; c++) {
            const baseZ = 0;

            // ROW 1
            seats.push({
              id: `ML-${c}-1`,
              position: [1.8, 0, baseZ],
              rotation: [0, 1.5, 0],
            });

            seats.push({
              id: `MR-${c}-1`,
              position: [compartmentWidth - 1.2, 0, baseZ],
              rotation: [0, 1.5, 0],
            });

            seats.push({
              id: `ML-${c}-2`,
              position: [1.8, 0, baseZ + 2],
              rotation: [0, -1.6, 0],
            });

            seats.push({
              id: `MR-${c}-2`,
              position: [compartmentWidth - 1.2, 0, baseZ + 2],
              rotation: [0, -1.6, 0],
            });
          }

          return (
            <>
              {/* Render Seats */}
              {seats.map((seat) => (
                <Seat3D
                  key={seat.id}
                  seat={seat}
                  position={seat.position}
                  isSelected={activeSelections.includes(seat.id)}
                  onClick={() => handleSeatSelection(seat.id)}
                />
              ))}

              {/* Left Side Divider (wall to seat) */}
              <mesh position={[1.8, 0.7, 1]}>
                <boxGeometry args={[2.7, 1.2, 0.1]} />
                <meshStandardMaterial color="#6b7280" />
              </mesh>

              {/* Right Side Divider (wall to seat) */}
              <mesh position={[compartmentWidth - 1.8, 0.7, 1]}>
                <boxGeometry args={[2.7, 1.2, 0.1]} />
                <meshStandardMaterial color="#6b7280" />
              </mesh>

              {/* Left Wall */}
              <mesh position={[0, 0.6, 6]}>
                <boxGeometry args={[0.2, 1.2, 6]} />
                <meshStandardMaterial color="#374151" />
              </mesh>

              {/* Right Wall */}
              <mesh position={[compartmentWidth, 0.6, 6]}>
                <boxGeometry args={[0.2, 1.2, 6]} />
                <meshStandardMaterial color="#374151" />
              </mesh>

              {/* Aisle */}
              <mesh position={[compartmentWidth / 2, -0.1, 6]}>
                <boxGeometry args={[1.2, 0.05, 6]} />
                <meshStandardMaterial color="#9ca3af" />
              </mesh>
            </>
          );
        })()}
      </Canvas>
    </div>
  );
};

export default Train3D;
