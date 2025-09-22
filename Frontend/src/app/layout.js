import "./globals.css";
import { Raleway } from "next/font/google";
import { CartProvider } from "../context/CartContext";
import ClientLayout from "./client-layout"; // 👈 client wrapper

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: '--font-raleway',
});

export const metadata = {
  title: "LGM Sports",
  icons: {
    icon: "/logo.jpg",
  },
  description: "LGM Sports is a leading manufacturer, supplier, and exporter of LGM Baby Roller Skates, LGM Quad Roller Skating Shoes, Skating Inline Skate Specers, PVC Head Guard Fluorescent, Skate Bag, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} bg-white`}>
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
