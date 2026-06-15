import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10">
      <nav className=" flex items-center justify-between bg-black/40 py-4 max-sm:py-5 px-4 backdrop-blur-md">
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={"/flow2.png"}
            alt="Logo"
            width={50}
            height={50}
            className="rounded-lg max-sm:w-9 max-sm:h-9"
          />
          <p className="text-3xl max-sm:text-xl font-bold">DevEvent</p>
        </Link>

        <div className="flex space-x-4 max-md:space-x-2">
          <Link href={"/"}>Home</Link>
          <Link href={"/events"}>Events</Link>
          <Link href={"/create"}>Create Event</Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar