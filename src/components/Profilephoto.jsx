import React, { useRef, useState, useEffect } from 'react';
import useMyProfile from '../hooks/useMyProfile';
import useUploadprofile from '../hooks/useUploadprofile';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query'; // ✅ add this

const Profilephoto = () => {
  const queryClient = useQueryClient(); // ✅ fix
  const fileInputRef = useRef();
  const { mutate, isPending } = useUploadprofile();
  const { data: user, isLoading: loadingProfile } = useMyProfile();
  const [localPhoto, setLocalPhoto] = useState(null);

  useEffect(() => {
    if (user?.photoUrl) {
      setLocalPhoto(user.photoUrl);
    }
  }, [user]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    const localUrl = URL.createObjectURL(file);
    setLocalPhoto(localUrl);

    mutate(formData, {
      onSuccess: (data) => {
        console.log("Upload success ✅");
        queryClient.invalidateQueries(['my-profile']);
        setLocalPhoto(data.photoUrl);
        toast.success("Successfully uploaded");
      },
      onError: () => {
        console.log("Upload failed ❌");
        queryClient.invalidateQueries(['my-profile']);
        setLocalPhoto(user.photoUrl);
        toast.error("Upload failed");
      },
    });
  };

  if (loadingProfile) return <p>Loading...</p>;

  return (
    <div className='relative group cursor-pointer'>
      <img
        onClick={() => fileInputRef.current.click()}
        src={localPhoto || '/default.png'}
        alt="profile"
        className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
      {isPending && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
};

export default Profilephoto;
