//找房页
import React, {PureComponent} from 'react';
import {getCityInfo, setCityInfo} from "../../utils/handleCityStorage";
import CurrentPosition from "../../utils/CurrentPosition";
import SearchHeader from "../../components/FindHouse/SearchHeader/SearchHeader";
import {Flex, Toast} from "antd-mobile";
import Styles from "./findHouse.module.scss"
import Filter from "../../components/FindHouse/Filter/Filter";
import HouseListItem from "../../components/HouseListItem/HouseListItem";
import axios from "axios";
import {AutoSizer, InfiniteLoader, List, WindowScroller} from "react-virtualized";
import Sticky from "../../components/FindHouse/Sticky/Sticky";
import HouseNotFind from "../../components/FindHouse/HouseNotFind/HouseNotFind";

class FindHouse extends PureComponent {
    constructor() {
        super();
        this.queryConditions = {}
        this.state = {
            currentCity: "", //当前城市
            searchHeaderClassName: "findHousePage",
            dataCount: 0, //数据条数
            houseData: [], //房屋数据,
            isLoaded: false, //数据是否加载完成
            firstEnter: true
        }
    }

    async componentDidMount() {
        this.getPositionData();
    }

    getPositionData = () => {
        //判断本地存储中有无城市数据,若有,则使用本地数据
        const info = getCityInfo()
        if (!info) {
            CurrentPosition().then(res => {
                this.setState({
                    currentCity: res.res.data.body.label
                })
                //存储当前城市数据
                setCityInfo({
                    cityName: res.res.data.body.label,
                    value: res.res.data.body.value
                })
            })
        } else {
            this.setState({
                currentCity: info.cityName
            })
        }
    }

    handleFilterData = async data => {
        const {firstEnter} = this.state
        if (!this.props.history.location.state || (this.props.history.location.state && !firstEnter)) {
            this.queryConditions = data;
            await this.fetchHouseListData()
            window.scrollTo(0, 0);
        } else {
            //根据location的值查询数据
            await this.getCommunityDataByState()
        }
    }

    getCommunityDataByState = async () => {
        Toast.loading('加载中...', 0, null, false)
        const {id, name} = this.props.history.location.state
        try {
            let res = await axios.get("/houses", {
                params: {
                    area: id
                }
            })
            this.setState({
                dataCount: res.data.body.count,
                houseData: res.data.body.list,
                isLoaded: true,
                firstEnter: false
            })
            Toast.hide()
        } catch (e) {
            Toast.fail("请求数据失败", 1.5, null, false)
            console.log(e)
        }
    }

    fetchHouseListData = async (start = 1, end = 20) => {
        Toast.loading('加载中...', 0, null, false)
        try {
            let res = await axios.get("/houses", {
                params: {
                    ...this.queryConditions,
                    start: start,
                    end: end
                }
            })
            this.setState({
                dataCount: res.data.body.count,
                houseData: res.data.body.list,
                isLoaded: true
            })
            Toast.hide()
            if (res.data.body.count > 0) {
                await Toast.info(`共找到${res.data.body.count}套房源`, 2, null, false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    renderList = ({key, style, index}) => {
        const {houseData} = this.state
        const data = houseData[index]

        if (!data) {
            return (
                <div>
                    <p className={Styles.loading}/>
                </div>
            )

        }
        return (
            <HouseListItem houseData={data} key={key} style={style}/>
        )

    }

    isRowLoaded = ({index}) => {
        return !!this.state.houseData[index]
    }

    loadMoreRows = ({startIndex, stopIndex}) => {
        return new Promise(async resolve => {
            Toast.loading("数据加载中...", 0, null, false)
            let res = await axios.get("/houses", {
                params: {
                    ...this.queryConditions,
                    start: startIndex + 1,
                    end: stopIndex
                }
            })
            resolve()

            this.setState({
                houseData: [...this.state.houseData, ...res.data.body.list]
            })
            Toast.hide()
        })
    }

    renderHouseList() {
        const {dataCount, isLoaded} = this.state
        if (dataCount === 0 && isLoaded) {
            return (
                <HouseNotFind/>
            )
        } else {
            return (
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.loadMoreRows}
                    rowCount={this.state.dataCount}
                    minimumBatchSize={21} //每次加载的最小条数
                >
                    {({onRowsRendered, registerChild}) => {
                        return (<WindowScroller>
                                {({height, isScrolling, onChildScroll, scrollTop}) => {
                                    return <AutoSizer>
                                        {({width}) => (
                                            <List
                                                autoHeight={true}
                                                width={width}
                                                height={height}
                                                rowCount={this.state.dataCount}
                                                rowHeight={120}
                                                rowRenderer={this.renderList}
                                                scrollToAlignment="start"
                                                scrollTop={scrollTop}
                                                isScrolling={isScrolling}
                                                onRowsRendered={onRowsRendered}
                                                ref={registerChild}
                                                id={"list"}
                                            />
                                        )}
                                    </AutoSizer>
                                }}

                            </WindowScroller>
                        )
                    }}

                </InfiniteLoader>
            )
        }
    }

    render() {
        return (
            <div className={Styles.findHouse}>
                {/*顶部搜索导航栏*/}
                <Flex className={Styles.searchHeader}>
                    <i className={"iconfont icon-back"} onClick={() => {
                        this.props.history.go(-1)
                    }}/>
                    <SearchHeader currentCity={this.state.currentCity} className={Styles.searchHeaderList}/>
                </Flex>
                {/*找房数据过滤组件*/}
                <Sticky height={40}>
                    <Filter handleHouseData={this.handleFilterData}/>
                </Sticky>
                {/*房源列表*/}
                <div className={Styles.houseList}>
                    {this.renderHouseList()}
                </div>
            </div>
        );
    }
}

FindHouse.propTypes =
    {}
;

export default FindHouse;
