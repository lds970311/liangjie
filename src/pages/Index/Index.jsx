//首页内容
import React, {PureComponent} from 'react';
//引入轮播图组件
import {Carousel} from 'antd-mobile';
import axios from "axios";
import IndexMenu from "../../components/Home/Index/IndexMenu";
import RendGroups from "../../components/Home/RentGroups/RendGroups";
import LatestNews from "../../components/Home/LatestNews/LatestNews";
import "./homeIndex.scss"
import CurrentPosition from "../../utils/CurrentPosition";
import {getCityInfo, setCityInfo} from "../../utils/handleCityStorage"
import SearchHeader from "../../components/FindHouse/SearchHeader/SearchHeader";


class Index extends PureComponent {
    state = {
        swiper: [],
        imgHeight: 212,
        isSwiperLoading: true, //轮播图是否加载完成,
        latitude: "",
        longitude: "",
        currentCity: "" //当前城市

    }

    getCourselData() {
        axios.get("/home/swiper").then(res => {
            this.setState({
                swiper: res.data.body,
                isSwiperLoading: false
            })
        }).catch(err => {
            console.log(err)
        })
    }

    // 设置bodypadding
    setBodyPadding() {
        document.body.style.paddingBottom = 50 + 'px'
    }

    getPositionData = () => {
        //判断本地存储中有无城市数据,若有,则使用本地数据
        const info = getCityInfo()
        if (!info) {
            CurrentPosition().then(res => {
                console.log(res)
                this.setState({
                    latitude: res.result.center.lat,
                    longitude: res.result.center.lng,
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

    componentDidMount() {
        this.getCourselData();
        this.getPositionData();
    }

    renderSwiper() {
        return this.state.swiper.map(val => (
            <a
                key={val}
                href={axios.defaults.baseURL + val.imgSrc}
                style={{display: 'inline-block', width: '100%', height: this.state.imgHeight}}
            >
                <img
                    src={axios.defaults.baseURL + val.imgSrc}
                    alt={val.alt}
                    style={{width: '100%', verticalAlign: 'top', height: this.state.imgHeight, touchAction: 'none'}}
                    onLoad={() => {
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({imgHeight: 'auto'});
                    }}
                />
            </a>
        ))
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                {/*首页顶部导航*/}
                <div className="swiper">
                    <SearchHeader currentCity={this.state.currentCity}/>
                    {!this.state.isSwiperLoading && <Carousel
                        autoplay={true}
                        infinite
                        autoplayInterval={3000}
                    >
                        {this.renderSwiper()}
                    </Carousel>}
                </div>
                {/*导航菜单*/}
                <IndexMenu/>
                {/*租房小组*/}
                <RendGroups/>
                {/*最新资讯*/}
                <LatestNews/>
            </div>
        );
    }
}

Index.propTypes = {};

export default Index;
