import axios from "axios";

const axiosIntance=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:false
})

export default axiosIntance