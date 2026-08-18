import { Geist, Geist_Mono, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "F1 Spatial Telemetry Hub | Real-time 3D Paddock Telemetry",
  description: "Real-time F1 3D telemetry visualization, spatial circuit render, G-force telemetry, and paddock standings.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${rajdhani.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050811] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">{children}</body>
    </html>
  );
}
