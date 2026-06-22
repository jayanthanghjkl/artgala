import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// Import your custom Blender model component from its file location
// import MyBlenderModel from './components/MyBlenderModel'; 

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 bg-pure-black">
      
      {/* LAYER 1: Your exact CSS Crimson Glow Circle (Base) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,0,38,0.22)_0%,transparent_60%)] pointer-events-none z-[1]" />

      {/* LAYER 2: The Transparent 3D Canvas Layer for your imported model */}
      <div className="absolute inset-0 z-[2] pointer-events-auto">
        <Canvas camera={{ position: [0,0,0], fov: 45 }}>
          
          {/* Important lighting to reveal your Blender model textures */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[-5, -5, 2]} intensity={0.5} color="#e60026" />
          
          {/* Suspense handles the loading state of your external 3D file safely */}
          <Suspense fallback={null}>
            {/* 
              👉 PLACE YOUR IMPORTED BLENDER MODEL COMPONENT RIGHT HERE:
              <MyBlenderModel /> 
            */}
            
          </Suspense>

          {/* Optional: Allows users to look around your 3D model */}
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          
        </Canvas>
      </div>

    </div>
  );
}
