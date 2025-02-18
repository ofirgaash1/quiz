import Link from "next/link"
const MenuOptions = () => {
    const links = [
        {
          name: "Favorites", path: "/favorites"
        },
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
    <ul className="absolute bg-white text-black z-[99] top-7 sm:left-[-60px] left-[-80px] shadow-md rounded-md">
            {links.map((link, index) => (
              <Link key={index} href={link.path} onClick={() => setOpenUserMenu(false)}>
                <li className="p-2 hover:bg-primary hover:text-white rounded-md">
                  {link.name}
                </li>
              </Link>
            ))}
          </ul>
  )
}

export default MenuOptions