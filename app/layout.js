import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import "./globals.css"
import { Toaster } from "sonner";
const inter = Inter({subsets:["latin"]});
export const metadata = {
  title: "SpendWise",
  description: "One stop finance platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`} >
          {/* {Header} */}
          <Header />
          <main className="min-h-screen flex-1">{children}</main>
           <Toaster richColors />
           {/* {footer} */}
           <footer className="bg-blue-950 py-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Made with 💕Love by Devanshi Awasthi</p>
            </div>
           </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
