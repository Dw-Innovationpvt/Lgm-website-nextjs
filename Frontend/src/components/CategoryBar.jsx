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
// Your category data
const categories = [
  { name: "Professional Inline Skates", link: "/inline-skates" },
  { name: "Twister Inline Skates", link: "/twister-inline-skates" },
  // { name: "Roller/Quad Skates", link: "/roller-quad-skates" },
  { name: "Quad Skates", link: "/quad-skates" },
  { name: "Hockey Skates", link: "/hockey-skates" },
  { name: "Workout Gear", link: "/workout-gear" },
  { name: "Wheels", link: "/wheels" },
  { name: "Bearings", link: "/bearings" },
  { name: "SkinSuits", link: "/skinsuits" },
  { name: "Bags", link: "/bags" },
  { name: "GuardSet & Ezeefit", link: "/guardset-ezeefit" },
  { name: "Helmets", link: "/helmets" },
  { name: "Accessories", link: "/accessories" },
  { name: "Shoes & Frame", link: "/shoes-frame" },
  { name: "Baby & Tenacity Skate", link: "/baby-tenacity" },
  { name: "Hangers", link: "/hangers" },
  { name: "Spacers-Axle-Adapter", link: "/spacers-axle-adapter" },
  { name: "Sunglasses", link: "/sunglasses" },
  { name: "Quad Rink Wheel", link: "/quad-rink-wheel" },
  { name: "Product", link: "/product" },
  { name: "Inline Practice Wheel", link: "/inline-practice-wheel" },
];
export default function CategoryBar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  // This ensures rendering happens only on the client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-blue-50 shadow">
      <div className="flex flex-wrap justify-center gap-3 p-4">
        {categories.map((cat) => {
          const isActive = pathname === cat.link;
          return (
            <Link key={cat.name} href={cat.link}>
              <span
                className={`px-4 py-2 rounded-md border text-base font-medium transition-transform duration-200
                  ${isActive
                    ? "bg-blue-600 text-white border-blue-600 scale-105"
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100 hover:scale-105"
                  }
                `}
                style={{ display: "inline-block" }}
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
