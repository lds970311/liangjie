//TODO:原来使用H5navigator.geolocationAPI, 后因为chrome浏览器获取不稳定启用,改成百度api,以后看情况再改

import MY_API from "./Api";

function getPosition() {

    return new Promise((resolve, reject) => {
        //通过百度API获取用户定位
        const city = new window.BMapGL.LocalCity();
        city.get(async result => {
            const cityName = result.name
            try {
                let res = await MY_API.get("/area/info", {
                    params: {
                        name: cityName
                    }
                })
                resolve({res, result})
            } catch (e) {
                reject("获取城市失败!", e)
            }
        })
    })
}

export default getPosition;
