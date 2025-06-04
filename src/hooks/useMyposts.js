

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import API from '../api';


const fetchMyPosts = async () => {
  const res = await API.get('/posts/all',{
    withCredentials: true, // important if you’re using cookies
  });
  console.log(res);
  return res.data.posts;
};

const useMyPosts = () => {
  return useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts,
  });
};

export default useMyPosts;
