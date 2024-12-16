
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import MoreItems from "@/components/MoreItems"
import ProductDescription from "@/components/ProductDescription"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronLeft, Heart, Loader, Play } from "lucide-react"
import ClothSection from '../components/Clothes'
import BottomSheet from "@/components/BottomSheet"
import PhotosPage from "./PhotosPage"
import { fetchProductsById } from "@/apiService"
import { UserMeta } from "@/context/userContext"
import { BASE_URL } from "@/constants"
export default function TryOnPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [modelImage, setModelImage] = useState(null);
  const {userMeta, setUserMeta} = useContext(UserMeta);
  

const navigate = useNavigate();


  useEffect(() => {
    if(!id) return;
    fetchProductsById(id).then((res)=>{
      console.log(res)
      setProduct(res);
    } )
  },[])
  

  useEffect(() => {
    if(userMeta?.status && userMeta?.status != 'success') navigate('/about');
    // console.log(userMeta.userMetaData.data.front_image_url)
    setModelImage(userMeta?.data?.front_image_url);
  } ,[userMeta])

  const tryNow = async (e) => {
      e.preventDefault();
      setLoading(true);
    const garmentImage = product?.images;
    const category = product?.meta?.cloth_type; // 'tops', 'bottoms', 'full_body', 'footwear', 'access

    // Ensure all fields are filled
    if (!modelImage || !garmentImage || !category) {
    //   setError('Please fill in all fields.');
      console.log('Please fill in all fields.');
      return;
    }

    // Prepare data to send to Flask API
    const data = {
      model_image: modelImage,
      garment_image: garmentImage,
      category: category,
    };

    try {
      const response = await fetch(`${BASE_URL}/try-on`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        //   'Authorization': `Bearer YOUR_API_KEY`,  // Replace with your actual API key
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const responseData = await response.json();
      if(responseData.error || !responseData.id) {
        throw new Error('Failed to get job id');
      }
      handleStatusCheck(responseData?.id);
    //   handleStatusCheck('4de822fb-7a69-43e9-80e2-2179fe33d33d-e1');
    //   setError(''); // Clear any previous errors
    } catch (err) {
        setLoading(false);
    //   setError('Error: ' + err.message);
    }
  };

  const handleStatusCheck = async (statusId) => {
    if (!statusId) {
      setError('Please provide a valid Job ID');
      return;
    }
    setError('');

    // Start polling the backend to get the job status
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${BASE_URL}/try-on-status/${statusId}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          clearInterval(interval);
          setLoading(false);
        } else {
          const taskStatus = data.status;

          if (taskStatus === 'completed') {
            // If task is completed, stop polling and show the result
            setResult(`data:image/png;base64,${data?.output}`);
            setModelImage(`data:image/png;base64,${data?.output}`);
            setLoading(false);
            clearInterval(interval); // Stop polling
          }
        }
      } catch (err) {
        console.error('Error polling status:', err);
        setError('An error occurred while checking the status.');
        clearInterval(interval);
        setLoading(false);
      }
    }, 5000); // Poll every 5 seconds
  };
  const [isFavorite, setIsFavorite] = useState(false)
  const loader = (
    <div className="h-screen flex justify-center items-center">
      <Loader size={50}/>
    </div>
  )
  // if (!product || loading) return loader
  return (
    <div className="flex flex-col mt-4">
      <section className="">
        <div className="container  px-4 md:px-6">
          <div className="bg-muted rounded-[16px] flex flex-col items-start gap-6 relative">
            <img
              src={result ? result : modelImage}
              alt="Product Image"
              className="rounded-lg w-full "
            />
            {
              loading &&  <div className="image-blend rounded-lg" style={{zIndex:100}}></div>
            }
           
            <button
            onClick={() => {navigate(-1)}}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
            <button
            onClick={tryNow}
            className="absolute bottom-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Play
              className={`w-5 h-5 'fill-red-500 text-red-500' : 'text-gray-500'`}
            />
          </button>
          <BottomSheet photoSelected={(image)=>{setModelImage(image)}}/>
           
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
      <div className="px-4">

      {/* <Button onClick={tryNow}>Try Now</Button>   */}
      </div>
      <ClothSection productSelected={(product) => setProduct(product)}/>
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