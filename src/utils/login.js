const isLogin = function () {
    return !!localStorage.getItem("token");
}

export {isLogin}
