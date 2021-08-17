import React, {Component} from 'react';
import MyTabBar from "../../components/Home/MyTabBar/MyTabbar";
import "./home.scss"

class Home extends Component {


    render() {
        return (
            <div id="home">
                {/*TabBar组件*/}
                <MyTabBar/>
            </div>
        );
    }
}

export default Home;