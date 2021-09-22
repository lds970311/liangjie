import axios from "axios";

//默认请求路径
axios.defaults.baseURL = "http://8.210.122.12:8080"
//添加请求拦截器
axios.interceptors.request.use((config) => {
    const url = config.url;
    //判断添加请求头的条件
    if (url.startsWith("/user") && !(url.startsWith("/user/login") || url.startsWith("/user/registered"))) {
        config.headers.authorization = localStorage.getItem("token");
    }
    return config
})

//添加响应拦截器
axios.interceptors.response.use((resp) => {
    if (resp.data.status === 400) {
        //token失效
        localStorage.removeItem("token")
    }
    return resp;
})
