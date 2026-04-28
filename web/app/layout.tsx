import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PrimeReactProvider } from "primereact/api";
import { Toaster } from "react-hot-toast";
import SessionWrapper from "./components/Session";
import { toastConfig } from "./config/toast.config";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - Fripouilles",
    default: "Fripouilles",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${jakarta.className} bg-gray-100`}>
        <Toaster {...toastConfig} />
        <PrimeReactProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
