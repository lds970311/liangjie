import axios from "axios";
import BASE_URL from "./url";

//创建并导出axios实例
const MY_API = axios.create({
    baseURL: BASE_URL
})

export default MY_API
