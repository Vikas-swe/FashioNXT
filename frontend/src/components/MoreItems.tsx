import { fetchProducts } from "@/apiService";
import { useEffect, useState } from "react";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CZdBrY2M6K7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Component() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then((res)=>{
            setProducts(res);
        })
    }, []);
    return (
      <main className="flex flex-col overflow-hidden justify-center py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Related Products</h2>
        <div className="mt-10 max-w-2xl mx-auto overflow-x-scroll">
          <div className="flex space-x-4">
            {
                products?.map((product) => (
                    <div className="flex-shrink-0 w-[20%]">
                        <img
                            src={product?.images}
                            alt="Related Product Image"
                            width={150}
                            height={150}
                            className="mx-auto h-20 w-20 rounded-lg"
                            style={{ aspectRatio: "150/150", objectFit: "cover" }}
                        />
                        <h3 className="mt-2 text-sm leading-5 font-medium text-gray-900">{product?.title}</h3>
                        <p className="mt-1 text-sm leading-5 text-gray-500">{product?.price}</p>
                    </div>
                ))
            }
          </div>
        </div>
      </main>
    )
  }