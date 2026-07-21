import type { Metadata } from "next";
import { Outfit, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Slice of Swadesh – Premium Indian Fusion Fast Food",
  description: "Order hand-stretched tandoori naan pizzas, cardamom craft burgers & saffron milkshakes. Fast delivery, real Indian flavours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Force light mode — never inherit OS dark preference
      style={{ colorScheme: "light" }}
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body style={{ background: "#FFFBF5", color: "#1A1208" }} className="min-h-full flex flex-col font-sans">
        <ErrorBoundary>
          <AppProviders>
            {children}
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
