import React from 'react'
import API from '../api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
useQueryClient
{useMutation}
const useUploadprofile = () => {
const queryClient = useQueryClient();

  return useMutation({
    mutationFn:async (formData)=>{
      const res = await API.post('/upload-photo',formData);
      return res.data
    },
    onSuccess:() =>{
      queryClient.invalidateQueries(['my-profile']);
    }
  }
  
  )
}

export default useUploadprofile