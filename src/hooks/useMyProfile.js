
import { useQuery } from '@tanstack/react-query';
import API from '../api';

const useMyProfile = () => {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res = await API.get('/profile/view');
      console.log(res.data.data);
      return res.data.data;
    },
  });
};

export default useMyProfile;
