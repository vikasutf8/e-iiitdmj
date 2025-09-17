import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosinstance";


// fetch user data from api

const fetchSeller =async ()=>{
  const response = await axiosInstance.get("/api/v1/logged-in-seller");
console.log(response.data.seller,"user seller hooks");
  return response.data.seller;
}
const useSeller = () => {
  const {data:seller, isLoading,isError,refetch } = useQuery(
    {
        queryKey: ["seller"],
        queryFn: fetchSeller,
        staleTime: 1000 * 60 * 5,
        retry:1,
 
    },);

  return {seller,isLoading,isError,refetch};
}


export default useSeller;