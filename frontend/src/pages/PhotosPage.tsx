
import { ChevronLeft, PlusCircle } from 'lucide-react'
import UploadButton from './UploadButton'
import { useContext, useEffect, useRef, useState } from 'react';
import { getFileURL } from '@/utils';
import UserContext, { UserMeta } from '@/context/userContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/constants';


export default function PhotosPage({photoSelected}) {
    // const [photos,setPhotos] = useState([]);
    const {userData,setData} = useContext(UserContext);
    const {userMeta,refetch} = useContext(UserMeta);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true);

    const reader = new FileReader();
    
    reader.onloadend = async () => {
      // Extract the base64 string without the "data:image/*;base64," prefix
      const base64String = reader.result.split(',')[1];

      // Prepare the payload to send in the POST request
      const payload = {
        base64: base64String,
        fileType: file.type.split('/')[1],  // Get the file extension (e.g., "jpg", "png")
        type: 'image',
        userID: userData.id,
      };

      try {
        // Replace with your Flask backend URL
        const response = await axios.post(`${BASE_URL}/matrix/uploadAsset`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle the response from Flask (e.g., the uploaded file's URL)
        console.log(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
        refetch(userData.id);
      }
    };

    // Read the file as base64
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      {
        !photoSelected && (
          <div className='flex items-center gap-4'>
            <ChevronLeft  className="w-6 h-6 inline-block mb-4 cursor-pointer" onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold mb-4">Photos</h1>
          </div>
        )
      }
      <div className="grid grid-cols-2 gap-4">
        {userMeta?.data?.images?.map((photo) => (
          <div key={photo} className="relative aspect-square">
            <img
              src={photo}
              alt={photo}
              
              className="object-cover rounded-lg"
              onClick={() => photoSelected && photoSelected(photo)}
            />
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="fixed bottom-24 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Upload photo"
      >
        <PlusCircle className="w-6 h-6" />
      </button>
    </div>
  )
}

