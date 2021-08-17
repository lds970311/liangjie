import React, {Component} from 'react';
import {AutoSizer, List} from 'react-virtualized';
import axios from "axios";
import "./cityList.scss"
import getPosition from "../../utils/CurrentPosition";
import {setCityInfo} from "../../utils/handleCityStorage"
import NavHeader from "../../components/NavHeader/NavHeader";


// const SOURCE_CITY = ["北京", "上海", "广州", "深圳", "杭州", '成都', "济南", "郑州"]

class CityList extends Component {
    constructor() {
        super();
        this.state = {
            cityIndexes: [],
            cityObj: {},
            currentCity: "",
            currentIndex: 0 //当前高亮的索引号
        }
        this.listRef = React.createRef();
    }

    formatCityIndex = letter => {
        let newLetter = "";
        switch (letter) {
            case '#':
                newLetter = "当前定位"
                break;
            case "hot":
                newLetter = "热门城市"
                break;
            default:
                newLetter = letter.toUpperCase()
        }
        return newLetter;
    }
    rowRenderer = ({
                       key,
                       index,
                       style,
                   }) => {
        const cityIndex = this.state.cityIndexes[index]
        const cities = this.state.cityObj[cityIndex];
        return (
            <div key={key} style={style} className="city">
                <div className="title">{this.formatCityIndex(cityIndex)}</div>
                {cities.map(item => (
                    <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
                        {item.label}
                    </div>
                ))}

            </div>
        );
    }

    //点击城市名称切换城市
    changeCity({label, value}) {
        //判断当前城市是否有房源
        //有数据
        setCityInfo({
            cityName: label,
            value
        })
        this.props.history.go(-1)
    }

    async componentDidMount() {
        //this.setListHeight()
        await this.getCurrentCity()
        await this.fetchCityListData();
        //调用List组件的方法,提前计算每一行的高度,为右侧城市索引跳转打好基础
        this.listRef.current.measureAllRows()
    }

    setListHeight() {
        const list = document.querySelector(".cityList");
        list.style.height = window.screen.height + 'px'
        document.body.style.paddingBottom = 0 + 'px'
    }

    //获取城市列表数据
    fetchCityListData = async () => {
        try {
            let res = await axios.get("/area/city", {
                params: {
                    level: 1
                }
            })
            await this.handleCityListData(res.data.body)
        } catch (e) {
            console.log("获取城市列表数据失败", e)
        }
    }

    //处理城市列表数据
    async handleCityListData(cityData) {
        const list = []
        //给数据建立索引
        const cityObj = {};
        cityData.forEach(item => {
            const key = item.short.charAt(0)
            list.push(key)
            if (cityObj[key]) {
                cityObj[key].push(item)
            } else {
                cityObj[key] = []
                cityObj[key].push(item)
            }
        })
        //生成索引数组
        const indexes = [...new Set(list)]
        indexes.sort((a, b) => {
            return b.charCodeAt(0) - a.charCodeAt(0)
        }).reverse()
        this.setState({
            cityIndexes: indexes,
            cityObj
        })
        await this.getHotCities()
    }

    findCitiesByIndex(index, cityList) {
        return cityList[index];
    }

    getCurrentCity = () => {
        getPosition().then(result => {
            this.setState({
                currentCity: result.result.name.substring(0, result.result.name.indexOf("市"))
            })
        }).catch(error => console.log(error))

    }

    //获取热门城市数据
    getHotCities = async () => {
        try {
            const {cityIndexes, cityObj} = this.state;
            let res = await axios.get("/area/hot");
            cityIndexes.unshift('hot');
            cityObj['hot'] = res.data.body;
            cityIndexes.unshift('#');
            cityObj["#"] = [this.findCurrentCityInfo()]
            this.setState({
                cityIndexes: cityIndexes,
                cityObj: cityObj
            })
        } catch (e) {
            console.log("获取热门城市数据失败!", e)
        }
    }

    //从所有城市列表中查找当前城市信息,若没有默认为北京
    findCurrentCityInfo() {
        const {cityObj, currentCity} = this.state;
        let info = null;
        Object.keys(cityObj).forEach(key => {
            let isLoop = true;
            const list = cityObj[key];
            for (let i = 0; i < list.length; i++) {
                if (list[i].label === currentCity) {
                    info = {
                        label: list[i].label,
                        value: list[i].value
                    }
                    isLoop = false;
                    break;
                }
            }
        })
        if (info === null) {
            info = {
                label: "北京",
                value: "AREA|88cff55c-aaa4-e2e0"
            }
        }
        return info;
    }

    //下滑时切换右侧索引的高亮
    onRowsRendered = ({startIndex}) => {
        if (startIndex !== this.state.currentIndex) {
            this.setState({
                currentIndex: startIndex
            })
        }
    }


    goCityIndex = index => {
        this.listRef.current.scrollToRow(index)
    }

    render() {
        return (
            <div className="cityList">
                <NavHeader>城市选择</NavHeader>
                <AutoSizer>
                    {({height, width}) => (
                        <List
                            ref={this.listRef}
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndexes.length}
                            rowHeight={({index}) => {
                                const cityIndex = this.state.cityIndexes[index]
                                const cities = this.state.cityObj[cityIndex];
                                return 36 + 50 * cities.length;
                            }}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )}
                </AutoSizer>
                {/*右侧城市索引列表*/}
                <ul className="city-index">
                    {this.state.cityIndexes.map((item, index) => (
                        <li className="city-index-item" key={item} onClick={() => this.goCityIndex(index)}>
                            <span
                                className={index === this.state.currentIndex ? "index-active" : ""}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default CityList;
