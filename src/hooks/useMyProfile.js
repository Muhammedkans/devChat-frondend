import { useQuery } from '@tanstack/react-query';
import API from '../api';

const useMyProfile = () => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res = await API.get('/profile/view', { withCredentials: true });
      return res.data.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0, // ✅ Add this line
  });
};

export default useMyProfile;



