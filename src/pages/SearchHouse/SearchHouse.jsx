import React, {Component} from 'react';
import styles from "./searchHouse.module.scss"
import {SearchBar, Toast} from "antd-mobile";
import axios from "axios";
import {getCityInfo} from "../../utils/handleCityStorage";

class SearchHouse extends Component {
    constructor() {
        super();
        this.state = {
            searchText: "",
            searchResults: [],
        }
    }

    handleInputChange = async val => {
        clearTimeout(this.timer)
        if (val.trim() === "") {
            this.setState({
                searchText: "",
                searchResults: [],
            })
            return
        }
        this.setState({
            searchText: val
        })

        this.timer = setTimeout(async () => {
            await this.getCommunities()
        }, 500)
    }

    selectItem(result) {
        const {id, name} = result
        this.props.history.replace("/home/findhouse", {
            id,
            name
        })
    }

    //渲染结果列表
    renderItems() {
        const {searchResults} = this.state
        return searchResults.map((result) => {
            return (
                <li key={result.id} className={styles.listItem}
                    onClick={this.selectItem.bind(this, result)}>{result.name}</li>
            )
        })
    }

    getCommunities = async () => {
        const {searchText} = this.state
        try {
            let res = await axios.get("/area/community", {
                params: {
                    name: searchText,
                    id: getCityInfo().value
                }
            })
            let list = []
            res.data.body.forEach(item => {
                list.push({
                    id: item.community,
                    name: item.communityName,
                })
            })
            this.setState({
                searchResults: list
            })
        } catch (e) {
            Toast.fail("请求数据失败!", 1.5, null, false)
            console.log(e)
        }
    }

    render() {
        const {searchText, searchResults} = this.state
        return (
            <div className={styles.root}>
                <SearchBar
                    placeholder="请输入小区或地址"
                    value={searchText}
                    showCancelButton={true}
                    onCancel={() => this.props.history.replace('/home/findhouse')}
                    onChange={this.handleInputChange}
                    maxLength={10}
                />
                <ul className={styles.list}>{this.renderItems()}</ul>
            </div>
        );
    }
}

export default SearchHouse;