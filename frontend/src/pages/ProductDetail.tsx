
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import MoreItems from "@/components/MoreItems"
import ProductDescription from "@/components/ProductDescription"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronLeft, Heart, Loader } from "lucide-react"
import UserContext from "@/context/userContext"
import { fetchProductsById } from "@/apiService"

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState(null)
  const navigate = useNavigate();
  const {userData,setData} = useContext(UserContext)
//fetch id from url product/:id



  useEffect(() => {
    fetchProductsById(id).then((res)=>{
      console.log(res);
      setProduct(res);
    } )
  },[])

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if(!product) return
    if(userData.favourites.find((item)=>item.id===product.id)){
      setIsFavorite(true)
    }
    else{
      setIsFavorite(false)
    }
}
,[userData.favourites,product])

const setFavourites = () => {
  //check if the product is already in favourites
  if(userData.favourites.find((item)=>item.id===product.id)){
    //remove the product from favourites
    let newFavourites = userData.favourites.filter((item)=>item.id!==product.id)
    setData({favourites:newFavourites})
  }
  else{
    //add the product to favourites
    let newFavourites = [...userData.favourites,product]
    setData({favourites:newFavourites})
  }
}
  const loader = (
    <div className="h-screen flex justify-center items-center">
      <Loader size={50}/>
    </div>
  )
  if (!product) return loader
  return (
    
    <div className="flex flex-col mt-8">
      <section className="">
        <div className="container  px-4 md:px-6">
          <div className="bg-muted rounded-[16px] flex flex-col items-start gap-6 relative">
            <img
              src={product?.images}
              alt="Product Image"
              width={600}
              height={600}
              className="rounded-lg w-full aspect-square object-cover"
            />
            <button
            onClick={() => {navigate(-1)}}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={`w-5 h-5 text-gray-500}`}
            />
          </button>
            <button
            onClick={() => setFavourites()}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
          </div>
          {/* <div className="flex flex-col items-start gap-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Acme Prism T-Shirt</h1>
            <p className="text-muted-foreground text-lg">
              Crafted with a meticulous composition of 60% combed ringspun cotton and 40% polyester jersey, this tee is
              soft, breathable, and stylish.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-primary" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">4.3 (120 reviews)</p>
            </div>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold">$49.99</h2>
              <Button size="lg">Add to Cart</Button>
            </div>
          </div> */}
        </div>
      </section>

      <ProductDescription id={product?.id} title={product?.title} description={product?.description} price={product?.price}/> 

      
      <MoreItems/>
    </div>
  )
}

function StarIcon(props) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}