//地图
import React, {Component} from 'react';
import NavHeader from "../../components/NavHeader/NavHeader";
import MapStyle from "./map.module.scss"
import {getCityInfo} from "../../utils/handleCityStorage"
import getPosition from "../../utils/CurrentPosition";
import axios from "axios";
import HouseList from "../../components/HouseList/HouseList";
import {Toast} from 'antd-mobile';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: "",
            houseList: [],
            houseCount: 0,
            label: "",
            isHouseListShow: false //是否显示房屋列表
        }
    }

    async componentDidMount() {
        this.setMapStyle();
        await this.getCurrentCity()
        await this.loadUserPosition()
    }


    getCurrentCity = async () => {
        const city = getCityInfo();
        if (city) {
            this.setState({
                currentCity: city
            })
        } else {
            try {
                let result = await getPosition()
                this.setState({
                    currentCity: result.res.data.body
                })
            } catch (e) {
                console.log(e)
            }
        }
    }


    setMapStyle() {
        const mapContainer = document.getElementById("map-container")
        mapContainer.style.height = window.screen.height - 45 + 'px'
    }


    loadUserPosition = async () => {
        const map = new window.BMapGL.Map("map-container");
        this.map = map;
        //添加地图移动时房源列表隐藏的事件
        map.addEventListener("movestart", ({}) => {
            this.setState({
                isHouseListShow: false
            })
        })
        //创建地址解析器实例
        const geoCoder = new window.BMapGL.Geocoder();
        geoCoder.getPoint(this.state.currentCity.cityName, async point => {
            if (point) {
                map.centerAndZoom(point, 11);
                // 添加比例尺控件
                const scaleCtrl = new window.BMapGL.ScaleControl();
                map.addControl(scaleCtrl);
                // 添加比例尺控件
                const zoomCtrl = new window.BMapGL.ZoomControl()
                map.addControl(zoomCtrl);
                //获取区域数据
                await this.renderOverlays(this.state.currentCity.value)
                //循环创建覆盖
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, this.state.currentCity)

        // 创建定位控件
        const locationControl = new window.BMapGL.LocationControl({
            anchor: 0,
            // 控件基于停靠位置的偏移量（可选）
            offset: new window.BMapGL.Size(20, 20)
        });
        map.addControl(locationControl);
    }

    //获取地图数据
    async renderOverlays(id) {
        try {
            Toast.loading("数据加载中...", 0, null, true)
            let result = await axios.get("/area/map", {
                params: {
                    id: id
                }
            })
            const {nextZoom, type} = this.getTypeAndZoom()
            await this.createOverlay(type, result.data.body, nextZoom);
            Toast.hide()
        } catch (error) {
            console.log(error)
        }
    }

    //获取下级缩放级别和要渲染的覆盖物类型
    getTypeAndZoom() {
        const zoom = this.map.getZoom()
        let nextZoom;
        let type; //要渲染的覆盖物类型
        if (zoom >= 10 && zoom < 12) {
            //设置下一级的缩放级别
            nextZoom = 13;
            type = 'circle';
        } else if (zoom >= 12 && zoom < 14) {
            nextZoom = 15;
            type = 'circle';
        } else {
            //对应小区
            nextZoom = 16;
            type = 'rect';
        }
        return {nextZoom, type}
    }

    //创建覆盖物
    async createOverlay(overlayType, data, nextZoom) {
        if (overlayType === 'circle') {
            this.createCircle(data, nextZoom)
        } else {
            await this.createRect(data, nextZoom)
        }
    }

    createCircle(data, nextZoom) {
        data.forEach(item => {
            let content = 'label';
            let point = new window.BMapGL.Point(item.coord.longitude, item.coord.latitude)
            const label = new window.BMapGL.Label(content, {       // 创建文本标注
                position: point,
                offset: new window.BMapGL.Size(-35, -35)
            });
            label.setContent(`
                     <div class="${MapStyle.bubble}">
                        <p class="${MapStyle.name}">${item.label}</p>
                        <p>${item.count}</p>
                      </div>
                     `)
            this.map.addOverlay(label);
            label.addEventListener('click', () => {
                //清除原有覆盖物
                this.map.clearOverlays()
                //渲染下一级数据
                this.map.centerAndZoom(point, nextZoom);
                this.renderOverlays(item.value)
            })
            label.setStyle({                              // 设置label的样式
                cursor: 'pointer',
                border: '0px solid rgb(255, 0, 0)',
                padding: '0px',
                whiteSpace: 'nowrap',
                fontSize: '12px',
                color: 'rgb(255, 255, 255)',
                textAlign: 'center'
            })
        })
    }

    async createRect(data, nextZoom) {
        data.forEach(item => {
            let content = 'label';
            let point = new window.BMapGL.Point(item.coord.longitude, item.coord.latitude)
            const label = new window.BMapGL.Label(content, {       // 创建文本标注
                position: point,
                offset: new window.BMapGL.Size(-40, -10)
            });
            label.setContent(`
                     <div class="${MapStyle.rect}">
                        <span class="${MapStyle.housename}">${item.label}</span>
                        <span class="${MapStyle.housenum}">${item.count}套</span>
                        <i class="${MapStyle.arrow}"></i>
                      </div>
                     `)
            label.addEventListener('click', () => {
                //清除原有覆盖物
                //渲染下一级数据
                this.setState({
                    label: item.label
                })
                this.map.centerAndZoom(point, nextZoom);
                this.getHousesDetail(item.value)
                this.toggleStyle(label)
                Toast.info(`共${item.count}套房源`, 2);
                this.moveMap(window.event)
            })
            label.setStyle({                              // 设置label的样式
                cursor: 'pointer',
                border: '0px solid rgb(255, 0, 0)',
                padding: '0px',
                whiteSpace: 'nowrap',
                fontSize: '12px',
                color: 'rgb(255, 255, 255)',
                textAlign: 'center'
            })
            this.map.addOverlay(label);
        })
    }

    getHousesDetail = async id => {
        try {
            let result = await axios.get("/houses", {
                params: {
                    cityId: id
                }
            })
            this.setState({
                houseList: result.data.body.list,
                houseCount: result.data.body.count,
                isHouseListShow: true
            })
        } catch (e) {
            console.log("获取房源信息失败!", e)
        }
    }


    moveMap(event) {
        let {clientX, clientY} = event.changedTouches[0]
        clientX = Math.round(clientX)
        clientY = Math.round(clientY)
        let targetY = (window.innerHeight - 375) / 2
        let targetX = (window.innerWidth) / 2
        let moveX = targetX - clientX
        let moveY = targetY - clientY;
        this.map.panBy(moveX, moveY)
    }


    //切换选中时的样式
    toggleStyle(target) {
        let labels = document.getElementsByClassName("map_rect__wTpU7")
        for (let i = 0; i < labels.length; i++) {
            labels[i].style.backgroundColor = "rgb(51, 163, 244)"
        }
        target.className = `${MapStyle.rectRed}`
    }

    render() {
        return (
            <div className={MapStyle.map}>
                <NavHeader>地图找房</NavHeader>
                <div id="map-container">
                </div>
                {/*房源列表结构*/}
                <HouseList data={this.state.houseList} count={this.state.houseCount} isShow={this.state.isHouseListShow}
                           label={this.state.label}/>
            </div>
        );
    }
}

export default Map;
