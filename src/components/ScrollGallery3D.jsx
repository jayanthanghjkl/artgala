import React, { forwardRef } from 'react';
import CircularGallery from './CircularGallery';

const ScrollGallery3D = forwardRef(({ items }, ref) => {
  // Use provided items or fallback to some defaults if none provided
  const galleryItems = items && items.length > 0 ? items : [
    { image: 'https://picsum.photos/600/800?random=1', text: 'Gallery' },
    { image: 'https://picsum.photos/600/800?random=2', text: 'Photos' },
    { image: 'https://picsum.photos/600/800?random=3', text: 'Abstract' }
  ];

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans select-none">
      <div className="absolute inset-0 z-0">
        <CircularGallery
          ref={ref}
          bend={3}
          textColor="#F4F1EA"
          borderRadius={0.05}
          scrollSpeed={3}
          scrollEase={0.05}
          items={galleryItems}
        />
      </div>
    </div>
  );
});

export default ScrollGallery3D;
