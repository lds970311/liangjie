import React, {Component} from 'react';
import styles from "./rentList.module.scss"
import NavHeader from "../../../components/NavHeader/NavHeader";
import HouseNotFind from "../../../components/FindHouse/HouseNotFind/HouseNotFind";
import {Link} from "react-router-dom";
import {List, SwipeAction, Toast} from "antd-mobile";
import HouseListItem from "../../../components/HouseListItem/HouseListItem";
import axios from "axios";

/**
 * 已发布房源列表
 */
class RentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 出租房屋列表
            recommendHouses: [],
            isLoaded: false
        }
    }

    async componentDidMount() {
        await this.getPostedHouses()
    }

    getPostedHouses = async () => {
        Toast.loading("房源数据加载中", 0, null, false)
        try {
            let res = await axios.get("/user/houses")
            if (res.data.status === 200) {
                Toast.hide()
                this.setState({
                    recommendHouses: res.data.body,
                    isLoaded: true
                })
            } else {
                Toast.hide()
                Toast.fail("房源数据加载失败!", 2, null, true)
            }
        } catch (e) {
            console.log(e)
        }
    }

    renderRentList() {
        const {recommendHouses, isLoaded} = this.state;
        if (recommendHouses.length === 0 && isLoaded) {
            return (
                <HouseNotFind>
                    <Link to={"/rent/add"} className={styles.releaseHouse}>去发布房源~</Link>
                </HouseNotFind>
            )
        }
        return (
            <List>
                {recommendHouses.map((item, index) => {
                    return (
                        <SwipeAction
                            key={index}
                            style={{backgroundColor: 'gray'}}
                            autoClose
                            right={[
                                {
                                    text: '取消',
                                    onPress: () => console.log(""),
                                    style: {backgroundColor: '#ddd', color: 'white'},
                                },
                                {
                                    text: '删除',
                                    onPress: () => this.deleteHouseItem(item.houseCode),
                                    style: {backgroundColor: '#F4333C', color: 'white'},
                                },
                            ]}
                        >
                            <List.Item
                                arrow="horizontal"
                            >
                                <HouseListItem houseData={item}/>
                            </List.Item>
                        </SwipeAction>
                    )
                })}

            </List>
        )
    }

    //删除房源数据
    async deleteHouseItem(id) {
        console.log(id)
        try {
            let res = await axios.patch(`/user/houses/${id}`, {
                params: {
                    shelf: false
                }
            })
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <div className={styles.root}>
                <NavHeader
                    className={styles.rentHeader}
                    onLeftClick={() => this.props.history.go(-1)}
                >
                    房屋管理
                </NavHeader>
                {this.renderRentList()}
            </div>
        );
    }
}

export default RentList;
