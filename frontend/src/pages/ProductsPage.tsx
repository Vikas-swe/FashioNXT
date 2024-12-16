import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Filter, FilterIcon, FilterX, ListFilterPlus, ListOrderedIcon, MoveRight, ShoppingBag, SlidersHorizontal, UserRound } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { DialogFooter, DialogHeader,Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger  } from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {   DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem ,DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import UserContext, { UserMeta } from '@/context/userContext';
// imoprt {ShoppingBag} from "@radix-ui/react-icons"
import { Link, useNavigate } from 'react-router-dom';
import { ClothingTabs } from '@/components/ClothingTabs';
import { fetchProducts } from '@/apiService';
import { Grid, ShirtIcon as ShirtRound, Shirt, PinIcon as PantsIcon } from 'lucide-react'
import { cn } from '@/lib/utils';
import WarningMessage from '@/components/WarningCard';
import Logo from '../assets/fashioNXT.svg';
import FilterDialog from '@/components/ProductsFilter';
const tabs: Tab[] = [
  {
    id: "all",
    label: "All Items",
    icon: Grid,
  },
  {
    id: "one-pieces",
    label: "One Piece",
    icon: ShirtRound,
  },
  {
    id: "tops",
    label: "Tops",
    icon: ShirtRound,
  },
  {
    id: "bottoms",
    label: "Bottoms",
    icon: ShirtRound,
  },
]

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { userData } = React.useContext(UserContext);
  const {userMeta, setUserMeta} = React.useContext(UserMeta);
  const navigate = useNavigate();

    useEffect(() => {
        fetchProducts().then((res)=>{
          console.log(res)
          setProducts(res);
        })
    }, []);

    const [sortBy, setSortBy] = useState("price")
    const handleSortChange = (value) => {
      setSortBy(value)
    }
    const [activeTab, setActiveTab] = React.useState("all")

  return (
    <div className="flex flex-col items-center p-4 mt-4">
      {/* <h1 className="text-2xl font-semibold mb-4">Shop Our Products</h1> */}
      <header className="flex items-center justify-between pb-8 w-full">
      {/* <h1 className="text-3xl font-medium text-slate-600">FashionNXT</h1> */}
      <img src={Logo} alt="FashioNXT" className="w-30"/>
      <div className="flex items-center gap-2">
        {/* <span className="text-lg">{userData.email?.split('.')[0] }</span> */}
        {
          
            userMeta?.data ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border">
                <img
                  src={userMeta?.data?.front_image_url}
                  alt="Profile picture"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>)
            :
            <UserRound />
          }
        
        
      </div>
    </header>
    {
      (userMeta?.status && userMeta?.status != 'success') ? <WarningMessage title={'Profile not completed'} buttonText={"Finish onboarding"} buttonAction={()=>{navigate('/about')}}>
      <p className="text-sm">Please complete your profile to get the best recommendations.</p>
    </WarningMessage> : null
    }
    

      <div className="flex justify-between items-center gap-4 w-full">
        <div className='rounded-[20.61px] bg-[#F4C600] w-1/2 px-8 py-4 pb-0' onClick={()=>navigate('/suggestive-stylemate')}>
          <span className='text-white font-medium tracking-wider leading-6 text-xl'>Suggestive StyleMate</span>
          <MoveRight className='ml-auto font-bold text-white ' size={50} />
        </div>
        <div className='rounded-[20.61px] w-1/2 bg-[#EB6434] px-8 py-4  pb-0' onClick={()=>navigate('/try-on')}>
        <span className='text-white font-medium tracking-wider leading-6 text-xl'>Wardrobe Fusion</span>
          <MoveRight className='ml-auto font-bold text-white ' size={50} />
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 py-4">
      <div className="flex gap-2 p-2 overflow-x-auto scroll-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 border-2",
                    activeTab === tab.id &&
                      "bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white border-0"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </Button>
              )
            })}
          </div>
     
      
      </div>
      
      <div className="py-2 flex w-full items-center justify-end">
        <FilterDialog/>
      {/* <Dialog >
        <DialogTrigger asChild>
          <Button  variant="outline" size="icon">
            <ListFilterPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80%] rounded-[16px]">
          <DialogHeader>
            <DialogTitle>Filter Items</DialogTitle>
            <DialogDescription>Select your desired filters and click apply.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="category" className="">
                Category
              </Label>
              <Select >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Category 1</SelectItem>
                  <SelectItem value="category2">Category 2</SelectItem>
                  <SelectItem value="category3">Category 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="sub-category" className="">
                Sub-Category
              </Label>
              <Select >
                <SelectTrigger id="sub-category">
                  <SelectValue placeholder="Select a sub-category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub-category1">Sub-Category 1</SelectItem>
                  <SelectItem value="sub-category2">Sub-Category 2</SelectItem>
                  <SelectItem value="sub-category3">Sub-Category 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="keyword" className="">
                Keyword
              </Label>
              <Input id="keyword" className="col-span-2" placeholder="Enter a keyword" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Apply</Button>
            <div className="mt-2"></div>
            <Button variant="outline">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ListOrderedIcon className="w-4 h-4" />
                Sort by: {sortBy === "price" ? "Price" : "Rating"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
                <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rating">Rating</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
       
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {products?.filter(product=>{return (activeTab=='all' || product.meta.cloth_type == activeTab)})?.map((product) => (
            <ProductCard
            key={product?.id}
            product={product}
            buttonText="Buy Now"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
