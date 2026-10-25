import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <div className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-lime/10 blur-[110px]" />
        <div className="absolute -left-48 top-[38rem] h-[30rem] w-[30rem] rounded-full bg-cyan/5 blur-[120px]" />
      </div>

      <Navbar />
      <main key={location.pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
