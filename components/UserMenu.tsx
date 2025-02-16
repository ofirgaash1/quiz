import Link from "next/link"
import { useState } from "react"
import { CgMenuGridO } from "react-icons/cg"

const UserMenu = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const useMenuHandler = () => {
    setOpenUserMenu(!openUserMenu)
  }
  const links = [
    {
      name: "Upload Subtitles", path: "/upload"
    },
    {
      name: "Level", path: "/level"
    },
    {
      name: "Stats", path: "/stats"
    },
    {name: "Users", path: "/users"}
  ]
  return (
    <div className="text-xl mt-1 cursor-pointer p-2"
      onMouseEnter={() => setOpenUserMenu(true)}
      onMouseLeave={() => setOpenUserMenu(false)}>
      <div className="relative">
        <CgMenuGridO />
        {openUserMenu && (
          <ul className="absolute bg-white text-black z-[99] top-7 sm:left-[-60px] left-[-80px] shadow-md rounded-md">
            {links.map((link, index) => (
              <Link key={index} href={link.path} onClick={() => setOpenUserMenu(false)}>
                <li className="p-2 hover:bg-primary hover:text-white rounded-md">
                  {link.name}
                </li>
              </Link>
            ))}
          </ul>)}
      </div>
    </div>
  )
}

export default UserMenu