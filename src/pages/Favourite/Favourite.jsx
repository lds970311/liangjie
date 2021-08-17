import React, {Component} from 'react';
import styles from "./favourite.module.scss"
import NavHeader from "../../components/NavHeader/NavHeader";
import {SwipeAction, Toast} from "antd-mobile";
import axios from "axios";
import HouseNotFind from "../../components/FindHouse/HouseNotFind/HouseNotFind";
import {AutoSizer, List} from "react-virtualized";
import HouseListItem from "../../components/HouseListItem/HouseListItem";


class Favourite extends Component {
    constructor() {
        super();
        this.state = {
            favoriteList: [],
            dataCount: 0,
            isLoaded: false
        }
    }

    async componentDidMount() {
        await this.getFavouriteList()
    }

    getFavouriteList = async () => {
        try {
            let result = await axios.get("/user/favorites")
            if (result.data.status === 200) {
                //请求成功
                this.setState({
                    favoriteList: result.data.body,
                    dataCount: result.data.body.length,
                    isLoaded: true
                })
            } else {
                Toast.fail("获取收藏数据失败!", 1.5, null, true)
            }
        } catch (e) {
            console.log(e)
        }
    }

    deleteFavouriteItem(id) {
        // console.log(id)
        axios.delete(`/user/favorites/${id}`).then(async res => {
            // console.log(res)
            if (res.data.status === 200) {
                Toast.success("删除收藏成功", 1.5, null, false)
                await this.getFavouriteList()
            } else {
                Toast.fail("删除收藏失败", 1.5, null, false)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    renderFavouriteList() {
        const {dataCount, isLoaded} = this.state
        if (dataCount === 0 && isLoaded) {
            return (
                <HouseNotFind/>
            )
        }
        return (
            <AutoSizer>
                {({width, height}) => {
                    return (
                        <List rowCount={dataCount}
                              rowHeight={120}
                              width={width}
                              height={height}
                              scrollToAlignment="start"
                              rowRenderer={this.renderDataList}
                        />
                    )
                }}
            </AutoSizer>
        )
    }

    renderDataList = ({key, index}) => {
        const {favoriteList} = this.state
        const data = favoriteList[index]

        if (!data) {
            return (
                <div>
                    <p className={styles.loading}/>
                </div>
            )
        }
        return (
            <SwipeAction
                key={key}
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
                        onPress: () => this.deleteFavouriteItem(data.houseCode),
                        style: {backgroundColor: '#F4333C', color: 'white'},
                    },
                ]}
            >

                <HouseListItem houseData={data}/>

            </SwipeAction>
        )
    }

    render() {
        return (
            <div className={styles.root}>
                <NavHeader className={styles.header}>我的收藏</NavHeader>
                {this.renderFavouriteList()}
            </div>
        );
    }
}

export default Favourite;
