import UserContext, { UserMeta } from "@/context/userContext";
import ProductList from "./ProductsPage";
import About from '../app/About/page';
import { useContext, useEffect } from "react";
import { Loader } from "lucide-react";
export const HomePage = () => {
    const { userMeta } = useContext(UserMeta);
    useEffect(() => {
        console.log(userMeta);
        
    }, [userMeta]);
    if(userMeta == null || userMeta == undefined){
        return <div className="h-screen flex justify-center items-center">
            <Loader size={50}/>
        </div>
    }
    if(userMeta?.status=='success'){
        return <ProductList/>
    }
    return <About/>
}