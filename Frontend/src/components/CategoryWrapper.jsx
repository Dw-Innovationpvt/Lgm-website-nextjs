"use client";
import { usePathname } from "next/navigation";
import CategoryBar from "./CategoryBar";

export default function CategoryWrapper() {
  const pathname = usePathname();

  // ✅ Inline routes
  const inlineRoutes = [
    "/inline-skates",
    "/fleet-altra-package",
    "/raptor-flash-package",
    "/rapid-wrap-package",
    "/inline-frames",
    "/inline-shoes",
    "/inline-wheels",
    "/inline-practice-wheel",
    "/bearings",
    "/bags",
    "/guardset-ezeefit",
    "/helmets",
    "/skinsuits",
    "/spacers-axle-adapter",
    "/sunglasses",
  ];

  // ✅ Quad routes
  const quadRoutes = [
    "/quad-skates",
    "/basic-full-set-package",
    "/hq-quad-package",
    "/shoes",
    "/quad-frame",
    "/shoes-frame",
    "/wheel-set",
    "/quad-rink-wheel",
    "/hangers",
  ];

  // Check which category bar to show
  const showInline = inlineRoutes.some((route) => pathname?.startsWith(route));
  const showQuad = quadRoutes.some((route) => pathname?.startsWith(route));

  if (showInline) {
    return <CategoryBar type="inline" />;
  }

  if (showQuad) {
    return <CategoryBar type="quad" />;
  }

  return null;
}
