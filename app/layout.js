import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
           <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
