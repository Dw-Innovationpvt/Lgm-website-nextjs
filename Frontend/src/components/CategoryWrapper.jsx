"use client";
import { usePathname } from "next/navigation";
import CategoryBar from "./CategoryBar";

export default function CategoryWrapper() {
  const pathname = usePathname();

  const categoryRoutes = [
    "/inline-skates",
    "/workout-gear",
    "/hockey-skates",
    "/roller-quad-skates",
    "/twister-inline-skates",
    "/wheels",
    "/bearings",
    "/skinsuits",
    "/bags",
    "/guardset-ezeefit",
    "/helmets",
    "/accessories",
    "/shoes-frame",
    "/baby-tenacity",
    "/hangers",
    "/spacers-axle-adapter",
    "/quad-skates",
  ];

  const showCategoryBar = categoryRoutes.some(route =>
    pathname?.startsWith(route)
  );

  return showCategoryBar ? <CategoryBar /> : null;
}
