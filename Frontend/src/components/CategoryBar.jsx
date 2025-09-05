// // components/CategoryBar.jsx
// import React from 'react';
// import Link from 'next/link';

// const categories = [
//   { name: "Inline Skates", link: "/inline-skates" },
//   { name: "Twister Inline Skates", link: "/twister-inline-skates" },
//   { name: "Roller/Quad Skates", link: "/roller-quad-skates" },
//   { name: "Hockey Skates", link: "/hockey-skates" },
//   { name: "Workout Gear", link: "/workout-gear" },
//   { name: "Wheels", link: "/wheels" },
//   { name: "Bearings", link: "/bearings" },
//   { name: "SkinSuits", link: "/skinsuits" },
//   { name: "Bags", link: "/bags" },
//   { name: "GuardSet & Ezeefit", link: "/guardset-ezeefit" },
//   { name: "Helmets", link: "/helmets" },
//   { name: "Accessories", link: "/accessories" },
//   { name: "Shoes & Frame", link: "/shoes-frame" },
//   { name: "Baby & Tenacity Skate", link: "/baby-tenacity" },
//   { name: "Hangers", link: "/hangers" },
//   { name: "Spacers-Axle-Adapter", link: "/spacers-axle-adapter" },
// ];

// export default function CategoryBar() {
//   return (
//     <div className="bg-blue-50 flex flex-wrap gap-2 p-3 shadow">
//       {categories.map((cat) => (
//         <Link key={cat.name} href={cat.link}>
//           <span className="px-3 py-1 bg-white rounded-md shadow cursor-pointer hover:bg-gray-100">
//             {cat.name}
//           </span>
//         </Link>
//       ))}
//     </div>
//   );
// }















// "use client";
// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const categories = [
//   { name: "Inline Skates", link: "/inline-skates" },
//   { name: "Twister Inline Skates", link: "/twister-inline-skates" },
//   { name: "Roller/Quad Skates", link: "/quad-skates" },
//   { name: "Hockey Skates", link: "/hockey-skates" },
//   { name: "Workout Gear", link: "/workout-gear" },
//   { name: "Wheels", link: "/wheels" },
//   { name: "Bearings", link: "/bearings" },
//   { name: "SkinSuits", link: "/skinsuits" },
//   { name: "Bags", link: "/bags" },
//   { name: "GuardSet & Ezeefit", link: "/guardset-ezeefit" },
//   { name: "Helmets", link: "/helmets" },
//   { name: "Accessories", link: "/accessories" },
//   { name: "Shoes & Frame", link: "/shoes-frame" },
//   { name: "Baby & Tenacity Skate", link: "/baby-tenacity" },
//   { name: "Hangers", link: "/hangers" },
//   { name: "Spacers-Axle-Adapter", link: "/spacers-axle-adapter" },
// ];

// export default function CategoryBar() {
//   const pathname = usePathname();

//   return (
//     <div className="bg-blue-50 shadow">
//       <div className="flex flex-wrap justify-center gap-5 p-4">
//         {categories.map((cat) => {
//           const isActive = pathname === cat.link;
//           return (
//             <Link key={cat.name} href={cat.link}>
//               <span
//                 className={`px-4 py-2 rounded-md border text-base font-medium transition-all duration-200 transform
//                   ${
//                     isActive
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
//                   }
//                   !hover:scale-105
//                 `}
//               >
//                 {cat.name}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }









"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Inline categories
const inlineCategories = [
  { name: "Fleet Altra Package", link: "/fleet-altra-package" },
  { name: "Raptor Flash Package", link: "/raptor-flash-package"},
  { name: "Rapid Wrap Package", link: "/rapid-wrap-package" },
  { name: "Inline Frames", link: "/inline-frames" },
  { name: "Inline Shoes", link: "/inline-shoes" },
  { name: "Professional Inline Wheels", link: "/professional-inline-wheels" },
  { name: "Inline Practice Wheels", link: "/inline-practice-wheels" },
  { name: "Bearings", link: "/bearings" },
  { name: "Bags", link: "/bags" },
  { name: "GuardSet & Ezeefit", link: "/guardset-ezeefit" },
  { name: "Helmets", link: "/helmets" },
  { name: "Skin Suits", link: "/skin-suits" },
  { name: "Spacer-Axle-Adapter", link: "/spacer-axle-adapter" },
  { name: "Sunglasses", link: "/sunglasses" },
];

// Quad categories
const quadCategories = [
  { name: "Basic Full Set Package", link: "/basic-full-set-package" },
  { name: "HQ Quad Package", link: "/hq-quad-package" },
  { name: "Shoes", link: "/shoes" },
  { name: "Quad Frame", link: "/quad-frame" },
  { name: "Shoes & Frame", link: "/shoes-frame" },
  { name: "Wheel Set", link: "/wheel-set" },
  { name: "Quad Rink Wheel", link: "/quad-rink-wheel" },
  { name: "Hangers", link: "/hangers" },
];

export default function CategoryBar({ type }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // ✅ Select correct category list based on type
  const categories = type === "quad" ? quadCategories : inlineCategories;

  return (
    <div className="bg-blue-50 shadow">
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {categories.map((cat) => {
          const isActive = pathname === cat.link;
          return (
            <Link key={cat.name} href={cat.link}>
              <span
                className={`px-4 py-2 rounded-md border text-base font-medium transition-transform duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 scale-105"
                      : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100 hover:scale-105"
                  }
                `}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
