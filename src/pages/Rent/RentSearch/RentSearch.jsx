import React, {Component} from 'react';
import styles from "./rentSearch.module.scss"
import {SearchBar} from "antd-mobile";
import {getCityInfo} from "../../../utils/handleCityStorage"
import axios from "axios";

class RentSearch extends Component {
    constructor() {
        super();
        this.state = {
            searchText: "",
            cityList: []
        }
    }

    //点击返回添加房源页,携带小区信息
    selectCommunity(city) {
        console.log(city.name)
        this.props.history.replace("/rent/add", {
            name: city.name,
            id: city.id,
        })
    }

    renderTips = () => {
        const {cityList} = this.state
        return (
            cityList.map((city, index) => {
                return (
                    <li key={city.id} className={styles.tip} onClick={() => this.selectCommunity(city)}>
                        {city.name}
                    </li>
                )
            })
        )
    }

    handleChange = value => {
        clearTimeout(this.timer)
        if (value === "") {
            this.setState({
                searchText: "",
                cityList: []
            })
            return
        }
        this.setState({
            searchText: value
        })
        //防抖 处理
        this.timer = setTimeout(async () => {
            await this.getCommunityInfo(value)
        }, 500)

    }

    getCommunityInfo = async (val) => {
        const cityId = getCityInfo().value
        try {
            let res = await axios.get("/area/community", {
                params: {
                    name: val,
                    id: cityId
                }
            })
            let newList = []
            res.data.body.forEach(item => {
                newList.push({
                    id: item.community,
                    name: item.communityName
                })
            })
            this.setState({
                cityList: newList
            })
        } catch (e) {
            console.log("获取小区数据失败", e)
        }
    }

    render() {
        const {searchText} = this.state
        return (
            <div className={styles.root}>
                <SearchBar
                    placeholder="请输入小区或地址"
                    value={searchText}
                    showCancelButton={true}
                    onCancel={() => this.props.history.replace('/rent/add')}
                    onChange={this.handleChange}
                    maxLength={10}
                />

                {/* 搜索提示列表 */}
                <ul className={styles.tips}>{this.renderTips()}</ul>
            </div>
        );
    }
}

export default RentSearch;
