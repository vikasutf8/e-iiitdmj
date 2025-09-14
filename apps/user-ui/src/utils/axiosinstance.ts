
import axios from "axios";

// custom axios instance 
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
});

// logic of refresh token
let isRefreshing = false;
let refreshSubscribers :(()=>void)[] = [];  //store all failed requests wait for new token

//handlin logout redirect to login page on protected routes
const handleLogout = () => {
  if(window.location.pathname !== "/login"){
    window.location.href = "/login";
  }
}

// handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback:()=>void)=>{
  refreshSubscribers.push(callback);
}

// exectiue queued requests after refresh 
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}

// handle api requests  RUN before every request
axiosInstance.interceptors.request.use((config) => config,(error)=>Promise.reject(error));

// handle expired token and refresh token
axiosInstance.interceptors.response.use(
  (response)=>response,
  async (error)=>{
    //handle failed request
    const originalRequest = error.config;

    // prevent inifinite loop
    if(error.response.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;
      if(isRefreshing){
        return new Promise((resolve)=>{
          subscribeTokenRefresh(()=>{
            resolve(axiosInstance(originalRequest));
          })
        }) 
      }
      isRefreshing = true;
      try {
        // const refreshToken = getCookies('refreshToken') as string;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/refresh-token-user`,{
          // refreshToken,
        },{
          withCredentials: true,
        });
      
        isRefreshing = false;
        onRefreshSuccess();
        return axiosInstance(originalRequest);
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);


export default axiosInstance;
