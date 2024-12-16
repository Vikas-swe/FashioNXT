import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

import { supabase } from './supabase';

const ImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Handle file change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Upload the image to Supabase Storage
  const uploadImage = async () => {
    //generate a random file name
    const randomFileName = Math.random().toString(36).substring(7);
    if (!imageFile) return;

    setUploading(true);

    const filePath = `images/${imageFile.name}/${randomFileName}`; // File path in the Supabase bucket
    const { data, error } = await supabase.storage
      .from('matrix_public') // Replace with your actual bucket name
      .upload(filePath, imageFile, {
        cacheControl: '3600', // Optional: Cache for 1 hour
        upsert: false, // If file exists, don't overwrite
      });

    if (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
      return;
    }

    // Get the public URL for the uploaded image
    const publicUrl = await supabase.storage
      .from('matrix_public') // Replace with your actual bucket name
      .getPublicUrl(filePath).data.publicUrl;

    setImageUrl(publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadImage} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" width="300" />
          <p>Public URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
