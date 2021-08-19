import React, {Component} from 'react';
import FilterTitle from "../FilterTitle/FilterTitle";
import Styles from "./filter.module.scss"
import FilterPicker from "../FilterPicker/FilterPicker";
import FilterMore from "../FilterMore/FilterMore";
import axios from "axios";
import {getCityInfo} from "../../../utils/handleCityStorage";
import PropTypes from "prop-types"
import {animated, Spring} from 'react-spring'

//按照条件选择房源的父组件
const titleSelectedStatus = {
    // false 表示不亮；true 表示高亮
    area: false,
    mode: false,
    price: false,
    more: false
}

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleSelectedStatus,
            // 表示展示对话框的类型（ 有可能展示 FilterPicker 组件，有可能展示 FilterMore 组件 ）
            openType: '',
            filterConditions: {}, //房源所有的搜索条件,
            selectedValues: {
                area: [],
                mode: [],
                price: [],
                more: []
            } //默认选中值
        }
        this.htmlBody = document.body
    }

    async componentDidMount() {
        this.initStatus();
        await this.getFilterConditions()
        this.fetchHousesData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.openType !== this.state.openType) {
            this.changeTitleState(prevState.openType)
        }
    }

    /**
     * 获取全部房源的搜索条件
     */
    getFilterConditions = async () => {
        const cityInfo = getCityInfo();
        try {
            let res = await axios.get("/houses/condition", {
                params: {
                    id: cityInfo.value
                }
            })
            this.setState({
                filterConditions: res.data.body
            })
        } catch (e) {
            console.log(e)
        }
    }

    //传给filterPicker的方法,当选中值改变,更改selectedValues
    changeSelectedValues = (type, value) => {
        const {selectedValues} = this.state;
        selectedValues[type] = value;
        this.setState({
            selectedValues
        })
    }


    //渲染filterPicker组件
    renderFilterPicker = () => {
        const {openType, filterConditions} = this.state
        if (openType !== "") {
            this.htmlBody.className = "hidden"
        } else {
            this.htmlBody.className = ""
        }
        if (openType === "more" || openType === "") {
            return null;
        }
        let filterData;
        switch (openType) {
            case "area":
                filterData = [filterConditions["area"], filterConditions["subway"]];
                break;
            case "mode":
                filterData = filterConditions["rentType"]
                break
            case "price":
                filterData = filterConditions["price"];
                break
            default:
                filterData = [];
                break;
        }
        return (
            <FilterPicker key={openType} onCancel={this.onCancel} onSave={this.onSave} filterArray={filterData}
                          type={openType} onValueChange={this.changeSelectedValues}
                          defaultValue={this.state.selectedValues[this.state.openType] || []}/>
        )
    }


    //渲染filterMore组件
    renderFilterMore() {
        const {openType, filterConditions} = this.state

        const data = [filterConditions["characteristic"], filterConditions["floor"], filterConditions["oriented"], filterConditions["roomType"]]
        if (openType === "more") {
            return (
                <FilterMore onSave={this.onSave} onCancel={this.onCancel} filterModeData={data}
                            defaultValues={this.state.selectedValues[this.state.openType] || []}
                />

            )
        }

    }

    // 隐藏对话框
    onCancel = (e) => {
        // const obj = this.disableAllStatus();
        this.setState({
            openType: '',
        })
    }

    initStatus = () => {
        const obj = this.disableAllStatus();
        this.setState({
            openType: '',
            titleSelectedStatus: obj
        })
    }

    // 保存数据
    onSave = async (type, value) => {
        const {selectedValues} = this.state;
        selectedValues[type] = value;
        this.setState({
            openType: '',
            selectedValues
        })
        this.changeTitleState(type)
        //查询数据
        this.fetchHousesData()
    }

    //根据查询条件获取房源数据
    fetchHousesData() {
        const cityId = getCityInfo().value
        let areaInfo;
        const area = this.state.selectedValues["area"]
        if (area.length === 2 || area.length === 0) {
            areaInfo = "null"
        } else {
            if (area[2] === "null") {
                areaInfo = area[1]
            } else {
                areaInfo = area[2]
            }
        }
        const subway = this.state.selectedValues["area"]
        let subwayInfo;
        if (subway.length === 2) {
            subwayInfo = "null"
        } else {
            if (subway[2] === "null") {
                subwayInfo = subway[1]
            } else {
                subwayInfo = subway[2]
            }
        }
        const rentType = this.state.selectedValues["mode"][0]
        const price = this.state.selectedValues["price"][0]
        const more = this.state.selectedValues["more"].join(",")
        try {
            let queryParams;
            if (this.state.selectedValues["area"][0] === "area") {
                queryParams = {
                    cityId,
                    area: areaInfo,
                    rentType,
                    price,
                    more,
                }
                this.props.handleHouseData(queryParams)
            } else {
                queryParams = {
                    cityId,
                    subway: subwayInfo,
                    rentType,
                    price,
                    more,
                }
                this.props.handleHouseData(queryParams)
            }
        } catch (e) {
            console.log(e)
        }
    }

    //判断是否改变filterTitle的状态
    changeTitleState = (type) => {
        const {selectedValues, titleSelectedStatus} = this.state;
        switch (type) {
            case "area":
                if (selectedValues[type].length === 0 || selectedValues[type][1] === "null") {
                    titleSelectedStatus["area"] = false;
                    this.setState({
                        titleSelectedStatus
                    })
                }
                break
            case "mode":
                if (selectedValues[type].length === 0 || selectedValues[type][0] === "null") {
                    titleSelectedStatus[type] = false;
                    this.setState({
                        titleSelectedStatus
                    })
                }
                break
            case "price":
                if (selectedValues[type].length === 0 || selectedValues[type][0] === "null") {
                    titleSelectedStatus[type] = false;
                    this.setState({
                        titleSelectedStatus
                    })
                }
                break
            case "more":
                if (selectedValues[type].length > 0) {
                    titleSelectedStatus[type] = true;
                    this.setState({
                        titleSelectedStatus
                    })
                } else {
                    titleSelectedStatus[type] = false;
                    this.setState({
                        titleSelectedStatus
                    })
                }
                break
            default:

        }
    }

    setTitleSelectedStatus = (item) => {
        const obj = titleSelectedStatus;
        obj[item] = true;
        return obj;
    }

    disableAllStatus() {
        const obj = titleSelectedStatus;
        Object.keys(obj).forEach(item => {
            obj[item] = false;
        })
        return obj;
    }

    changeActiveItem = item => {
        const obj = this.setTitleSelectedStatus(item);
        this.setState({
            openType: item,
            titleSelectedStatus: obj
        })
    }

    handleToAnimate = async (next, cancel) => {
        console.log(window.outerHeight)
        const height = window.innerHeight;
        const {openType} = this.state
        let isHide = openType === 'more' || openType === ''
        if (isHide) {
            await next({opacity: 0, height: height, display: 'none'})
        } else {
            await next({opacity: 1, height: height, display: 'block'})
        }
    }

    //渲染遮罩层
    renderMask() {
        const {openType} = this.state
        let isHide = openType === 'more' || openType === ''

        return (
            <Spring from={{opacity: 0, height: 0}} to={this.handleToAnimate}>
                {props => {
                    return (
                        <animated.div className={isHide ? Styles.unmask : Styles.mask} onClick={(e) => {
                            this.onCancel(e)
                        }}
                                      style={props}/>
                    )
                }}

            </Spring>
        )
    }

    render() {
        return (
            <div className={Styles.filter}>
                {/*前三个菜单的遮罩层*/}
                {this.renderMask()}
                {/* {openType === "area" || openType === "mode" || openType === "price" ? this.renderMask() : null}*/}
                <FilterTitle selectedStatus={this.state.titleSelectedStatus} changeStatus={this.changeActiveItem}/>
                {/* 前三个菜单对应的内容： */}
                {this.renderFilterPicker()}

                {/* 最后一个菜单对应的内容： */}
                {this.renderFilterMore()}
            </div>
        );
    }
}

Filter.propTypes = {
    handleHouseData: PropTypes.func.isRequired,
}

export default Filter;
