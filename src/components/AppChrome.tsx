"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function isAuthPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/") ||
    pathname === "/auth" ||
    pathname.startsWith("/auth/")
  );
}

export default function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = isAuthPath(pathname);

  return (
    <>
      {!auth && <Navbar />}
      <main
        className={
          auth ? "flex min-h-0 flex-1 flex-col pt-0" : "flex-1 pt-14"
        }
      >
        {children}
      </main>
      {!auth && <Footer />}
    </>
  );
}
