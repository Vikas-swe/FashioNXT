
import { useState, useRef, useContext } from 'react'
import { PlusCircle } from 'lucide-react'
import UserContext from '@/context/userContext'
import axios from 'axios'
import { BASE_URL } from '@/constants'

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { userData } = useContext(UserContext)


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
      }
    };

    // Read the file as base64
    reader.readAsDataURL(file);
  };

  return (
    <>
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
    </>
  )
}

