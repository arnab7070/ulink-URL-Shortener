import List from "./components/List"
import InputField from "./components/InputField"
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area"

export default function Home() {
  return (
    <div>
      <main className="flex justify-center items-center h-screen bg-gradient-to-t from-gray-700 via-gray-900 to-black">
        <div className="flex-col gap-5">
          <div className="font-mono font-extrabold text-7xl md:text-8xl flex justify-center my-2 mx-3 text-orange-500 drop-shadow-2xl">U-Link</div>
          <div className="font-serif font-extrabold text-xl flex justify-center mb-10 text-orange-500">Short URL Generator</div>
          <InputField />
          <ScrollArea className="h-96 max-w-sm md:min-w-max"><List /><ScrollBar orientation="horizontal" /></ScrollArea>
        </div>
      </main>
    </div>
  )
}
