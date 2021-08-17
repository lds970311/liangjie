import React from 'react';
import {Redirect, Route} from "react-router-dom"


const AuthRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => {
            if (localStorage.getItem("token")) {
                //已经登录
                return (
                    <Component {...props}/>
                )
            } else {
                //没有登录
                return (
                    <Redirect to={{
                        pathname: "/login",
                        state: {
                            from: props.location
                        }
                    }}/>
                )
            }
        }}/>
    );
};

export default AuthRoute;
