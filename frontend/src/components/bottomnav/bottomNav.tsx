"use client"

import { Home, Search, Percent, ShoppingCart, User ,Heart} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Favourites", href: "/try-on", icon: Heart },
  // { name: "Deals", href: "/try-on", icon: Percent },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Profile", href: "/user-profile", icon: User },
]

export function BottomNav() {
  const pathname = useLocation()
  const [currentRoute, setCurrentRoute] = useState(pathname.pathname)

  useEffect(() => {
    console.log(pathname.pathname)
  }, [pathname])

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full p-2">
      <nav className="mx-auto max-w-lg rounded-full bg-[#292526] px-2 py-2 shadow-lg">
        <ul className="flex items-center justify-between">
          {navigation.map((item) => {
            const isActive = pathname.pathname === item.href
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                    isActive && "bg-white text-black",
                    !isActive && "text-gray-400 hover:text-gray-300"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {isActive && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            )}
          )}
        </ul>
      </nav>
    </div>
  )
}

