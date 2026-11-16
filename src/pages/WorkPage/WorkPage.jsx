import React, { useMemo } from 'react';
import InfiniteMenu from '../../components/ui/InfiniteMenu';
import { projectsList } from '../../data/projects';

/**
 * WorkPage component.
 * Integrates the InfiniteMenu 3D sphere component with modern widescreen rectangular cards.
 */
export default function WorkPage() {
  const items = useMemo(() => {
    return projectsList
      .filter(p => p.image)
      .map(p => ({
        image: p.image,
        link: p.link || p.git || '#',
        title: p.title,
        description: p.desc
      }));
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
      <div className="w-full h-full relative">
        <InfiniteMenu
          items={items}
          count={12}
          tileSize={0.63}
          aspectRatio={1.55}
          roundness={0.16}
          zoom={1.65}
          pullBack={0.35}
          stretch={0.15}
          inertia={0.65}
          autoplay={3}
          grayscale={true}
          dim={0.5}
          intro={true}
          showInfo={true}
          theme="dark"
          accentColor="#e60026"
          imageFit="fit"
        />
      </div>
    </div>
  );
}
