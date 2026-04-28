import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <div className="w-full lg:w-[25%] flex flex-col justify-center max-sm:px-3 px-6 sm:px-8 md:px-10 overflow-y-auto">
        <div className="w-full">{children}</div>
      </div>

      <div className="hidden lg:block relative flex-1">
        <Image
          src="/child.webp"
          alt="Illustration"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
