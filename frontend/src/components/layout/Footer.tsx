// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container-app">
        <p className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Patient Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;