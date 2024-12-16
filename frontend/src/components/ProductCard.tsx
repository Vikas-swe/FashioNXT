import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "@/context/userContext"

// Define props for the component
interface ProductCardProps {
    id: number
  imageSrc: string
  title: string
  price: string
  description: string
  buttonText?: string // Optional, defaults to 'Add to cart'
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const { id, images:imageSrc, title, price, description, buttonText = 'Add to cart' } = product
    const [isFavorite, setIsFavorite] = useState(false)
    const {userData,setData} = useContext(UserContext)
    const navigate = useNavigate();
    const goToProduct = (id: number) => {
        console.log('Go to product with id:', id)
        // move to route /product/:id
        navigate(`/product/${id}`);
    }

    useEffect(() => {
        if(userData.favourites.find((item)=>item.id===product.id)){
          setIsFavorite(true)
        }
        else{
          setIsFavorite(false)
        }
    }
    ,[userData.favourites])

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
  return (
    // <Card className="w-full max-w-xs rounded-xl border">
    //   <div className="grid gap-4 p-4 relative">
    //     <div  className="aspect-[4/5] w-full overflow-hidden rounded-xl">
    //       <img
    //         loading="lazy"
    //         onClick={_=>goToProduct(id)}
    //         src={imageSrc}
    //         alt={title}
    //         width="400"
    //         height="500"
    //         className="aspect-[4/5] object-cover w-full"
    //       />
    //       <button
    //         onClick={() => setFavourites()}
    //         className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
    //         aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    //       >
    //         <Heart
    //           className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
    //         />
    //       </button>
    //     </div>
    //     <div className="grid gap-1.5">
    //       <h3 className="font-semibold text-sm md:text-base">{title}</h3>
    //       <p className="text-sm md:text-base line-clamp-2 opacity-70">
    //         {description}
    //       </p>
    //       <p className="font-semibold text-sm md:text-base">₹{price}</p>
    //     </div>
    //     {/* <Button size="sm">{buttonText}</Button> */}
    //   </div>
    // </Card>
    
    <Card className="w-full max-w-[300px] overflow-hidden">
      <div className="relative">
        <img
          loading="lazy"
          onClick={_=>goToProduct(id)}
          src={imageSrc}
          width={300}
          height={400}
          className="w-full object-cover"
        />
        <button
            onClick={() => setFavourites()}
           className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
      </div>
      <CardHeader className="space-y-1 p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm md:text-base line-clamp-2 opacity-70">
            {description}
          </p>
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 pt-0">
        <span className="text-xl font-bold">{price}</span>
        <div className="flex items-center gap-1">
          <Star  className="h-5 w-5 fill-primary text-primary" />
          <span className="text-sm font-medium">5.0</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard;
