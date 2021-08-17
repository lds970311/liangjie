import React, {Component, Fragment} from 'react';
import {Flex} from 'antd-mobile';
import {Link} from "react-router-dom";
import "./indexMenu.scss"

//导入图片
import nav1 from "../../../assets/imgs/nav-1.png"
import nav2 from "../../../assets/imgs/nav-2.png"
import nav3 from "../../../assets/imgs/nav-3.png"
import nav4 from "../../../assets/imgs/nav-4.png"


class IndexMenu extends Component {

    render() {
        return (
            <Fragment>
                <Flex justify="center" align="center" alignContent="center">
                    <Flex.Item>
                        <Link to="/home/findhouse">
                            <img src={nav1} alt="整租"/>
                            <p>整租</p>
                        </Link>
                    </Flex.Item>
                    <Flex.Item>
                        <Link to="/home/findhouse">
                            <img src={nav2} alt="合租"/>
                            <p>合租</p>
                        </Link>
                    </Flex.Item>
                    <Flex.Item>
                        <Link to="/map">
                            <img src={nav3} alt="地图找房"/>
                            <p>地图找房</p>
                        </Link>
                    </Flex.Item>
                    <Flex.Item>
                        <Link to="/rent/add">
                            <img src={nav4} alt="去出租"/>
                            <p>去出租</p>
                        </Link>
                    </Flex.Item>
                </Flex>
            </Fragment>
        );
    }
}

export default IndexMenu;
