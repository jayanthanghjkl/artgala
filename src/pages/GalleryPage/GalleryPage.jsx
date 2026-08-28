import React from 'react';
import FloatingGallery3D from '../../components/FloatingGallery3D';
import { projectsList } from '../../data/projects';

export default function GalleryPage() {
  // Extract images and titles from projectsList to pass to our new 3D gallery
  const galleryItems = projectsList
    .filter(p => p.image)
    .map(p => ({
      image: p.image,
      text: p.title || 'Project'
    }));

  return (
    <div id="new-gallery" className="relative w-full z-20">
      <FloatingGallery3D items={galleryItems} />
    </div>
  );
}
