'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Inline Skates', path: '/inline-skates' },
    { name: 'Roller Skates', path: '/roller-skates' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Accessories', path: '/accessories' },
    { name: 'Baby & Tenacity Skate', path: '/baby-tenacity-skates' },
    { name: 'Bags', path: '/bags' },
    { name: 'GuardSet & Ezeefit', path: '/guard-set' },
    { name: 'Hangers', path: '/hangers' },
    { name: 'Helmets', path: '/helmets' },
    { name: 'Spacers-Axle-Adapter', path: '/spacers-axle-adapter' },
    { name: 'Quad & Inline Bearings', path: '/bearings' },
    { name: 'QuadSkates & Accessories', path: '/quad-skates-accessories' },
    { name: 'Shoes & Frame', path: '/shoes-frame' },
    { name: 'SkinSuits', path: '/skinsuits' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 ">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-500">LGM Sports</h3>
            <p className="text-gray-400">
              Your premier destination for professional skating equipment and accessories.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/lgm.sports?igsh=MW5lOXQ2dGFjcmZ3cA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/1AFW5ucGBg/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebookF size={20} />
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-500">Quick Links</h3>
            <ul className="space-y-2">
              {mainNavLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-gray-400 hover:text-blue-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4 col-span-1 lg:col-span-2">
            <h3 className="text-xl font-bold text-blue-500">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  href={category.path}
                  className="text-gray-400 hover:text-blue-500 transition-colors text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Center-Aligned Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-1">
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">LGM SPORTS</span>. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">Developed by <span className="text-blue-400 font-medium">DW INNOVATION PVT.LTD.</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
