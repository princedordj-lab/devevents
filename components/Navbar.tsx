'use client'
import { MenuIcon } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import posthog from "posthog-js";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  const handleNavClick = (link: string) => {
    posthog.capture("nav_link_clicked", { link });
  };

  const handleMenuToggle = () => {
    const next = !toggle;
    setToggle(next);
    posthog.capture("mobile_menu_toggled", { open: next });
  };

  return (
    <div className="sticky top-0 z-10">
      <nav className=" flex items-center justify-between bg-black/40 py-4 max-sm:py-5 px-4 backdrop-blur-md">
        <Link href={"/"} className="flex items-center gap-1" onClick={() => handleNavClick("home")}>
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={50}
            height={50}
            className="rounded-lg max-sm:w-9 max-sm:h-9"
          />
          <p className="text-3xl max-sm:text-xl font-bold">DevEvent</p>
        </Link>

        <div className="flex space-x-4 max-md:space-x-2 max-sm:hidden">
          <Link href={"/"} onClick={() => handleNavClick("home")}>Home</Link>
          <Link href={"/events"} onClick={() => handleNavClick("events")}>Events</Link>
          <Link href={"/create"} onClick={() => handleNavClick("create")}>Create Event</Link>
        </div>

        <button onClick={handleMenuToggle} className="lg:hidden sm:hidden">
          <MenuIcon className="text-white" />
        </button>

        {toggle && (
          <div className="absolute left-0 top-19 w-full bg-black/70 backdrop-blur-2xl rounded-b-lg p-4 flex flex-col space-y-2 max-sm:space-y-7 items-center justify-center lg:hidden sm:hidden">
            <Link href={"/"} onClick={() => { handleNavClick("home"); setToggle(false); }}>Home</Link>
            <Link href={"/events"} onClick={() => { handleNavClick("events"); setToggle(false); }}>Events</Link>
            <Link href={"/create"} onClick={() => { handleNavClick("create"); setToggle(false); }}>Create Event</Link>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar