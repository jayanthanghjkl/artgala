import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen bg-pure-black text-pure-white font-body selection:bg-vivid-crimson selection:text-pure-white">
      <main className="relative z-10 w-full mx-auto max-w-[100vw] overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
