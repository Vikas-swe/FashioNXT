
import * as React from "react"
import { Grid, ShirtIcon as ShirtRound, Shirt, PinIcon as PantsIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Dress from '../assets/svg/dress.svg'
import Tshirt from '../assets/svg/tshirt.svg'
import Jeans from '../assets/svg/jeans.svg'


const tabs = [
  {
    id: "all",
    label: "All Items",
    icon: Grid,
  },
  {
    id: "one-pieces",
    label: "One Piece",
    icon: Tshirt,
  },
  {
    id: "tops",
    label: "Tops",
    icon: Tshirt,
  },
  {
    id: "bottoms",
    label: "Bottoms",
    icon: Tshirt,
  },
]

export function ClothingTabs() {
  const [activeTab, setActiveTab] = React.useState("all")

  return (
    <div className="flex gap-2 p-2 overflow-x-auto scroll-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2",
              activeTab === tab.id &&
                "bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <img src={Icon} alt="icon" className="w-6 h-6" />
            <span className="font-medium">{tab.label}</span>
          </Button>
        )
      })}
    </div>
  )
}