import type { Metadata } from "next";
import { Inter } from "next/font/google";  // Import the Inter font
import "./globals.css";

// Apply Inter font globally
const inter = Inter({
  variable: "--font-inter",  // Custom variable for the font
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LiveSQLBench",
  description: "A Dynamic and Contamination-Free Benchmark for Evaluating LLMs on Real-World SQL Tasks",
  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' }
    ],
    apple: [
      { url: '/apple-icon.png' }
    ],
    shortcut: ['/favicon.ico']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}  // Apply the Inter font here
      >
        {children}
      </body>
    </html>
  );
}