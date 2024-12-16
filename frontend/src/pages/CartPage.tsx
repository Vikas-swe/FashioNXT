import { ArrowLeft, Menu, MoreVertical, Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from 'react-router-dom'

interface CartItem {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

const cartItems: CartItem[] = [
  // {
  //   id: 1,
  //   name: "Modern light clothes",
  //   description: "Dress modern",
  //   price: 212.99,
  //   quantity: 4,
  //   image: "/placeholder.svg"
  // },
  // {
  //   id: 2,
  //   name: "Modern light clothes",
  //   description: "Dress modern",
  //   price: 162.99,
  //   quantity: 1,
  //   image: "/placeholder.svg"
  // }
]

export default function CartPage() {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = 0
  const discount = 0
  const total = subtotal + shippingFee - discount

  return (
    <div className="min-h-screen bg-white lg:max-w-2xl md:max-w-xl lg:mx-auto">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container flex items-center gap-3 h-16 px-4">
          <Link to="/products" className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">Checkout</h1>
          {/* <button className="p-2">
            <Menu className="w-6 h-6" />
          </button> */}
        </div>
      </header>

      <main className="container p-4 pb-32">
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="mt-1 text-lg font-semibold">₹{item.price}</p>
                  </div>
                  <button className="p-1">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button className="p-1 border rounded-full">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button className="p-1 border rounded-full">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-8">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <Card className="mt-4">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 text-white bg-blue-600 rounded">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 36 36"
                    fill="currentColor"
                  >
                    <path d="M35 29a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v22z" />
                  </svg>
                </div>
                <div className="font-mono">**** **** **** 2143</div>
              </div>
              <ArrowLeft className="w-5 h-5 rotate-270" />
            </CardContent>
          </Card>
        </div> */}

        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-semibold">₹{shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="font-semibold">₹{discount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-gray-600">Sub Total</span>
            <span className="font-semibold">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </main>

      <div className=" p-4 bg-white border-t">
        <Button disabled className="w-full h-12 text-lg font-semibold rounded-full">
          Pay
        </Button>
      </div>
    </div>
  )
}

