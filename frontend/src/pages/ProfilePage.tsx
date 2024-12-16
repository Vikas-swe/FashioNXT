import { Camera, ChevronRight, CreditCard, LogOut, MapPin, ShoppingBag, UserRound } from 'lucide-react'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom'
import UserContext, { UserMeta } from '@/context/userContext'
import { useContext, useEffect, useState } from 'react'
import { getFileURL, logOut } from '@/utils'

export default function ProfilePage() {
  const [photos,setPhotos] = useState([]);
  const {userMeta, setUserMeta} = useContext(UserMeta);
  const navigate = useNavigate()
    
  const { userData } = useContext(UserContext)
  return (
    <div className="container max-w-md mx-auto p-4 space-y-6 lg:mx-w-2xl md:max-w-xl">
      {/* Header */}
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Profile Card */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16">
            {/* <img
              src="/placeholder.svg"
              alt="Profile picture"
              className="rounded-full object-cover"
              
              sizes="64px"
            /> */}
            <UserRound className="h-16 w-16 text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userData.email?.split('@')[0] }</h2>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>
        </div>
      </Card>

      {/* Tryon Gallery */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tryon Gallery</h2>
          <Camera className="h-6 w-6" />
        </div>
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {userMeta?.data?.images?.filter((_,i)=>i<3)?.map((photo,index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={photo}
                  alt={`Gallery image `}
                  className="rounded-lg object-cover h-[120px] w-full"
                    
                />
                {index === 2 && (
                  <div onClick={_=>navigate('/photos')} className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">{userMeta?.data?.images?.length - 2}</span>
                  </div> 
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Menu Items */}
      <Card>
        <div className="divide-y">
          <Link
            // to="/orders"
            className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              <span>My Orders</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link
            // to="/address"
            className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>My Address</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link
            // to="/cards"
            className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span>Saved Card</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 h-auto font-normal hover:bg-muted"
            onClick={logOut}
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-500" />
              <span className="text-red-500">Log out</span>
            </div>
            <ChevronRight className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

