'use client'
import Link from "next/link"
import { MdQuiz } from "react-icons/md"
import UserMenu from "./UserMenu"

import {
  SignInButton,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
const Navbar = () => {
  return (
    <div className="pt-5">
      <div className="max-w-[1500px] mx-auto w-[95%] flex justify-between items-center border-b pb-3">
        <div>
          <Link href="/" className="bg-blue-100 p-2 rounded-xl flex gap-1 items-center text-2xl" >
            <h1 className="text-dark font-bold">
              Home
            </h1>
            <MdQuiz className="text-primary" />
          </Link>
        </div>

        <div className="md:block hidden justify-center items-center text-nowrap">
          <span className="bg-orange-200 text-black px-5 py-1 rounded-md">
            Lets improve your English!
          </span>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <UserMenu />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

        </div>
      </div>
    </div>
  )
}

export default Navbar