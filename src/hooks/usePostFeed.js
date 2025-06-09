import { useQuery } from '@tanstack/react-query';
import API from '../api';
// your custom axios with baseURL + cookie

const fetchPostFeed = async () => {
  const response = await API.get('/postFeed');
    console.log(response.data.data)
  return response.data.data;

};

const usePostFeed = () => {
  return useQuery({
    queryKey: ['postFeed'],
    queryFn: fetchPostFeed,
  });
};

export default usePostFeed;
