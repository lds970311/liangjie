import React, {lazy, PureComponent, Suspense} from 'react';
import {BrowserRouter, Redirect, Route} from "react-router-dom";
import Home from "./pages/Home/Home";
// import CityList from "./pages/CityList/CityList";
// import Map from "./pages/Map/Map";
// import Detail from "./pages/Detail/Detail";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
// import AuthRoute from "./components/AuthRoute/AuthRoute";
// import RentAdd from "./pages/Rent/RentAdd/RentAdd";
// import RentList from "./pages/Rent/RentList/RentList";
// import RentSearch from "./pages/Rent/RentSearch/RentSearch";
// import Favourite from "./pages/Favourite/Favourite";
// import SearchHouse from "./pages/SearchHouse/SearchHouse";

const CityList = lazy(() => import("./pages/CityList/CityList"))
const Map = lazy(() => import("./pages/Map/Map"))
const Detail = lazy(() => import("./pages/Detail/Detail"))
const Login = lazy(() => import("./pages/Login/Login"))
const Register = lazy(() => import("./pages/Register/Register"));
const AuthRoute = lazy(() => import("./components/AuthRoute/AuthRoute"))
const RentAdd = lazy(() => import("./pages/Rent/RentAdd/RentAdd"))
const RentList = lazy(() => import("./pages/Rent/RentList/RentList"));
const RentSearch = lazy(() => import("./pages/Rent/RentSearch/RentSearch"))
const Favourite = lazy(() => import("./pages/Favourite/Favourite"))
const SearchHouse = lazy(() => import("./pages/SearchHouse/SearchHouse"))

class App extends PureComponent {
    render() {
        return (
            <BrowserRouter>
                <Suspense fallback={<div>loading...</div>}>
                    <div id={"app"}>
                        <Route path={"/home"} component={Home}/>
                        <Route path={"/citylist"} component={CityList}/>
                        <Route path={"/map"} component={Map}/>
                        <Route path={"/details/:id"} component={Detail}/>
                        <Route path={"/login"} component={Login}/>
                        <Route path={"/register"} component={Register}/>
                        {/*需要鉴权后使用的组件*/}
                        <AuthRoute path="/rent/add" component={RentAdd}/>
                        <AuthRoute path="/rent/list" component={RentList}/>
                        <AuthRoute path="/rent/search" component={RentSearch}/>
                        <AuthRoute path="/favourite" component={Favourite}/>
                        <Route path="/search" component={SearchHouse}/>
                        <Route exact path={"/"} render={() => (
                            <Redirect to={"/home"}/>
                        )}/>
                    </div>
                </Suspense>
            </BrowserRouter>
        );
    }
}

export default App;
