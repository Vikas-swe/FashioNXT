import "./index.css";
import { useState, useEffect, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Test from "./Test";
import { Button } from "./components/ui/button";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import TellUsPage from "./pages/tellUsPage";
import Layout from "./components/layout";
import { supabase } from "./supabase";
import About from "./app/About/page";
import ImageUpload from "./ImageUpload";
import ProductList from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetail";
import TryOnPage from "./pages/TryOnPage";
import UserProvider from "./context/userProvider";
import UserContext, { UserMeta } from "./context/userContext";
import { fetchUserData } from "./apiService";
import { HomePage } from "./pages/HomePage";
import PhotosPage from "./pages/PhotosPage";
import ProfilePage from "./pages/ProfilePage";
import Questions from "./app/questions/page";
import SuggestionStylemate from "./pages/SuggestionPage";
import CartPage from "./pages/CartPage";
import Logo from "./assets/fashioNXT.svg";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout as a wrapper
    children: [
      {
        path: "/",
        element: <ProductList />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/about/:step",
        element: <About />,
      },
      {
        path: "/image-upload",
        element: <ImageUpload />,
      },
      {
        path: "/products",
        element: <ProductList />,
      },
      {
        path: "/product/:id",
        element: <ProductDetailPage />,
      },
      {
        path:'/try-on',
        element: <TryOnPage />
      },
      {
        path:'/try-on/:id',
        element: <TryOnPage />
      },
      {
        path: "/questions",
        element: <Questions />,
      },
      {
        path:'/photos',
        element:<PhotosPage/>
      },
      {
        path:'/user-profile',
        element:<ProfilePage/>
      },
      {
        path:'/suggestive-stylemate',
        element:<SuggestionStylemate/>
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
  },
]);

export default function App() {
  const [session, setSession] = useState(null);
  const { userData,setData } = useContext(UserContext);
  const { userMeta, setUserMeta,refetch } = useContext(UserMeta);

  async function setUserInfo(){
    console.log('setting user info')
    const { data: { user } } = await supabase.auth.getUser()
    if(user){
      setData(user)
    }
    console.log(user)
    refetch(user.id)
  }
  
  async function getUserInfo() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
  }
  
  // getUserInfo();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setUserInfo();
  }
  ,[session])

  if (!session) {
    // return (<div><Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} /></div>)
    // getUserInfo();
    return (
      <div className="relative h-screen flex flex-col justify-between lg:max-w-2xl md:max-w-xl mx-auto ">
        <img src={Logo} alt="FashioNXT" className="h-14 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
        <Drawer defaultOpen={true}>
          <DrawerTrigger>
            <div className="absolute bottom-0 w-full pb-12 px-4">
              <Button className="w-full" size={"lg"}>
                Get Started
              </Button>
            </div>
          </DrawerTrigger>
          <DrawerContent className="lg:max-w-2xl md:max-w-xl mx-auto">
            <DrawerTitle className="px-4 heading-f">Welcome</DrawerTitle>
            <div className="p-4">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "black",
                        brandAccent: "black",
                      },
                    },
                  },
                }}
                providers={[]}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  } else {
    return <RouterProvider router={router} />
  }
}
