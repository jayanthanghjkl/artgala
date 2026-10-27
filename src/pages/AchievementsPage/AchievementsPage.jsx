import React from 'react';
import FlowingMenu from '../../components/ui/FlowingMenu';
import { achievementsList } from '../../data/atchivemenet';

export default function AchievementsPage() {
  return (
    <div
      className="relative w-full h-full min-h-screen bg-transparent text-white flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* Flowing Menu Container centered on the screen */}
      <div className="relative z-10 w-full border-y border-white/10 flex flex-col justify-center items-center">
        <div className="w-full">
          <FlowingMenu
            items={achievementsList}
            speed={15}
            textColor="#ffffffff"
            bgColor="transparent"
            marqueeBgColor="#e60026"
            marqueeTextColor="#ffffff"
            borderColor="rgba(255, 255, 255, 0.1)"
          />
        </div>
      </div>
    </div>
  );
}
