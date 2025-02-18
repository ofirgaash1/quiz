"use client"
import { useState } from "react"
import { CgMenuGridO } from "react-icons/cg"
import MenuOptions from "./MenuOptions"

const UserMenu = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const useMenuHandler = () => {
    setOpenUserMenu(!openUserMenu)
  }
  
  return (
    <div className="text-xl mt-1 cursor-pointer p-2"
      onClick={useMenuHandler}
      >
      <div className="relative">
        <CgMenuGridO />
        {openUserMenu && ( <MenuOptions/> )}
      </div>
    </div>
  )
}

export default UserMenu