import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "@/components/providers/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Propyto - Real Estate Tokenization",
  description: "Propyto allows you to list, tokenize, and trade real estate assets on the blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <Header />
          <Toaster position="top-right" reverseOrder={false} />
          <div style={{paddingTop: '120px'}}>
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
