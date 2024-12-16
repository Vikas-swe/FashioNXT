/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7gDl3KQt14t
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import PhotosPage from "@/pages/PhotosPage"
import { useState } from "react"
import { ChevronLeft, Images } from "lucide-react"

export default function BottomSheet({photoSelected}) {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button
            
            className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Images
              className={`w-5 h-5 text-gray-500`}
            />
          </button>
      </DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-gray-950 rounded-t-2xl shadow-2xl p-6 w-full max-h-[80%]">
        <div className="flex items-center justify-between mb-6">
          <DrawerTitle className="text-2xl font-bold">Photos</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <XIcon className="h-6 w-6" />
            </Button>
          </DrawerClose>
        </div>
        <div className="space-y-4 overflow-auto">
            <PhotosPage photoSelected={(p)=>{photoSelected(p);setIsOpen(false)}}/>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}