import Uploader from '@/components/uploader'
import { Toaster } from '@/components/toaster'

export default function Home() {
  return (
    <main className="py-10 relative flex flex-col items-center justify-center">
      <Toaster />
      <h1 className="pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Upload SRT file to the BLOB
      </h1>
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <Uploader />
      </div>
    </main>
  )
}