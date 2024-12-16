import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import UserContext from "@/context/userContext";
import './clothesComp.css'
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CZdBrY2M6K7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component({productSelected}) {
    const {userData,setData} = useContext(UserContext)
    const [selectedProduct, setSelectedProduct] = useState(null);


    const [selected, setSelected] = useState<string>('tops'); // State to track the selected option

  const handleToggle = (value: string) => {
    setSelected(value); // Update the selected value
  };
    return (
      <main className="flex flex-col overflow-hidden justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2">
      {/* Tops Button */}
      <Button
        variant={selected === 'tops' ? 'solid' : 'outline'}
        onClick={() => handleToggle('tops')}
        className={`w-28 rounded-[8px] ${selected === 'tops' ? 'bg-[#292526] text-white' : 'bg-white text-[#292526]'}`}
      >
        Tops
      </Button>

      {/* Bottoms Button */}
      <Button
        variant={selected === 'bottoms' ? 'solid' : 'outline'}
        onClick={() => handleToggle('bottoms')}
        className={`w-28 rounded-[8px] ${selected === 'bottoms' ? 'bg-[#292526] text-white' : 'bg-white text-[#292526]'}`}
      >
        Bottoms
      </Button>

      {/* One Piece Button */}
      <Button
        variant={selected === 'one-pieces' ? 'solid' : 'outline'}
        onClick={() => handleToggle('one-pieces')}
        className={`w-28 rounded-[8px] ${selected === 'one-pieces' ? 'bg-[#292526] text-white' : 'bg-white text-[#292526]'}`}
      >
        One Piece
      </Button>
    </div>
        <div className="mt-4 max-w-2xl  overflow-x-scroll scroll-hide">
          <div className="flex space-x-4 p-2">
            {
                userData?.favourites?.filter(product=>product.meta.cloth_type == selected)?.map((product) => (
                    <div className={`flex-shrink-0 w-[30%] bg-muted rounded-lg cloth-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}>
                        <img
                            onClick={() => {productSelected(product);setSelectedProduct(product)}}
                            src={product?.images}
                            alt="Related Product Image"
                            width={150}
                            height={150}
                            className="mx-auto h-36 w-36 rounded-lg"
                            style={{ aspectRatio: "150/150", objectFit: "cover" }}
                        />
                    </div>
                ))
            }
          </div>
        </div>
      </main>
    )
  }