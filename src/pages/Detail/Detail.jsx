import React, {Component} from 'react';
import styles from "./detail.module.scss"
import NavHeader from "../../components/NavHeader/NavHeader";
import {Carousel, Flex, Modal, Toast} from "antd-mobile";
import HousePackage from "../../components/HouseDetails/HousePackage/HousePackage";
import HouseListItem from "../../components/HouseListItem/HouseListItem";
import URL from "../../utils/url"
import axios from "axios";
import {isLogin} from "../../utils/login"

const BASE_URL = URL


const recommendHouses = [
    {
        houseImg: "/newImg/7bkml1adc.jpg",
        title: "兰亭优壳 1室1厅 1500元",
        tags: [
            "近地铁"
        ],
        price: 1500,
        desc: "一室/85/东|西/兰亭优壳",
        houseCode: "5cc489031439630e5b4aa5e1"
    },
    {
        houseImg: "/newImg/7bki4i1h3.jpg",
        title: "东方新世界 1室0厅 1700元",
        tags: [
            "近地铁"
        ],
        price: 1700,
        desc: "一室/88/南/东方新世界",
        houseCode: "5cc4896f1439630e5b4abdc9"
    },

]

class Detail extends Component {
    constructor() {
        super();
        this.state = {
            isCollect: false, //房源是否收藏
            imgHeight: "",
            isLoading: true,
            //房源数据
            community: "",
            coord: {},
            description: "",
            floor: "",
            houseCode: "",
            houseImg: [],
            oriented: [],
            price: 0,
            roomType: "",
            size: "",
            supporting: [],
            tags: [],
            title: ""

        }
    }

    async componentDidMount() {
        await this.getHouseDetails()
        this.renderMap(this.state.community, this.state.coord)
        window.scrollTo(0, 0)
        await this.isHouseCollect()
    }

    //判断该房源是否收藏
    isHouseCollect = async () => {
        //判断是否登录
        if (!isLogin()) {
            return
        }
        const HouseId = this.props.match.params.id
        try {
            let res = await axios.get(`/user/favorites/${HouseId}`)
            if (res.data.status === 200) {
                //请求成功
                this.setState({
                    isCollect: res.data.body.isFavorite
                })
            } else {
                this.setState({
                    isCollect: false
                })
            }
        } catch (e) {
            console.log("获取收藏信息失败", e)
            this.setState({
                isCollect: false
            })
        }
    }

    getHouseDetails = async () => {
        try {
            let res = await axios.get(`/houses/${this.props.match.params.id}`)
            const data = res.data.body;
            this.setState({
                community: data.community,
                coord: data.coord,
                description: data.description,
                floor: data.floor,
                houseCode: data.houseCode,
                houseImg: data.houseImg,
                oriented: data.oriented,
                price: data.price,
                roomType: data.roomType,
                size: data.size,
                supporting: data.supporting,
                tags: data.tags,
                title: data.title,
                isLoading: false
            })
        } catch (e) {
            console.log(e);
        }
    }

    renderSwipers() {
        const {houseImg} = this.state;
        return houseImg.map(item => {
            return (
                <a
                    key={item}
                    href={BASE_URL + item}
                    style={{display: 'inline-block', width: '100%', height: '100%'}}
                >
                    <img
                        src={BASE_URL + item}
                        alt="图片无法正常加载!"
                        style={{width: '100%', verticalAlign: 'top'}}
                        onLoad={() => {
                            window.dispatchEvent(new Event('resize'));
                            this.setState({imgHeight: 'auto'});
                        }}
                    />
                </a>
            )
        })
    }

    // 渲染地图
    renderMap(community, coord) {
        const {latitude, longitude} = coord

        const map = new window.BMapGL.Map('map')
        const point = new window.BMapGL.Point(longitude, latitude)
        map.centerAndZoom(point, 17)

        const label = new window.BMapGL.Label('', {
            position: point,
            offset: new window.BMapGL.Size(0, -36)
        })

        const labelStyle = {
            position: 'absolute',
            zIndex: 2,
            backgroundColor: 'rgb(238, 93, 91)',
            color: 'rgb(255, 255, 255)',
            height: 25,
            padding: '5px 10px',
            lineHeight: '14px',
            borderRadius: 3,
            boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
            whiteSpace: 'nowrap',
            fontSize: 12,
            userSelect: 'none'
        }

        label.setStyle(labelStyle)
        label.setContent(`
              <span>${community}</span>
              <div class="${styles.mapArrow}"></div>
         `)
        map.addOverlay(label)
    }

    //点击添加或取消收藏功能
    handleCollect = async () => {
        //判断是否登录
        if (!isLogin()) {
            const alert = Modal.alert;
            alert('您还未登录!', '确定要登录吗?', [
                {
                    text: '取消', onPress: () => {
                        console.log("cancel")
                    }, style: 'default'
                },
                {
                    text: '确定', onPress: () => {
                        this.props.history.push("/login", {
                            from: this.props.location
                        })
                    }
                },
            ]);
        } else {
            await this.toggleCollect();
        }
    }

    toggleCollect = async () => {
        const {isCollect} = this.state;
        const HouseId = this.props.match.params.id
        if (isCollect) {
            try {
                let result = await axios.delete(`/user/favorites/${HouseId}`)
                if (result.data.status === 200) {
                    //请求成功
                    this.setState({
                        isCollect: false
                    })
                    Toast.success("取消收藏成功", 1.5, null, true)
                } else {
                    const alert = Modal.alert;
                    alert("提示", '登录超时,是否重新登录?', [
                        {
                            text: '取消'
                            , style: 'default'
                        },
                        {
                            text: '确定', onPress: () => {
                                this.props.history.push("/login", {
                                    from: this.props.location
                                })
                            }
                        },
                    ]);
                }
            } catch (err) {
                console.log("取消收藏失败", err)
            }
        } else {
            try {
                let result = await axios.post(`/user/favorites/${HouseId}`)
                if (result.data.status === 200) {
                    this.setState({
                        isCollect: true
                    })
                    Toast.success("添加收藏成功", 1.5, null, true)
                } else {
                    const alert = Modal.alert;
                    alert("提示", '登录超时,是否重新登录?', [
                        {
                            text: '取消'
                            , style: 'default'
                        },
                        {
                            text: '确定', onPress: () => {
                                this.props.history.push("/login", {
                                    from: this.props.location
                                })
                            }
                        },
                    ]);
                }
            } catch (e) {
                console.log("添加收藏失败", e)
            }
        }
    }

    //渲染房源基本信息
    renderBaseInfo() {
        const {tags, price, roomType, size, title, oriented} = this.state
        return (
            <div className={styles.info}>
                <h3 className={styles.infoTitle}>
                    {title}
                </h3>
                <Flex className={styles.tags}>
                    <Flex.Item>
                        {tags.map((item, index) => {
                            let name;
                            if (index + 1 > 3) {
                                name = styles.tag1
                            } else {
                                name = styles[`tag${index + 1}`]
                            }
                            return (
                                <span className={[styles.tag, name].join(" ")} key={item}>{item}</span>
                            )
                        })}
                    </Flex.Item>
                </Flex>

                <Flex className={styles.infoPrice}>
                    <Flex.Item className={styles.infoPriceItem}>
                        <div>
                            {price}
                            <span className={styles.month}>/月</span>
                        </div>
                        <div>租金</div>
                    </Flex.Item>
                    <Flex.Item className={styles.infoPriceItem}>
                        <div>{roomType}</div>
                        <div>房型</div>
                    </Flex.Item>
                    <Flex.Item className={styles.infoPriceItem}>
                        <div>{size}平米</div>
                        <div>面积</div>
                    </Flex.Item>
                </Flex>

                <Flex className={styles.infoBasic} align="start">
                    <Flex.Item>
                        <div>
                            <span className={styles.title}>装修：</span>
                            精装
                        </div>
                        <div>
                            <span className={styles.title}>楼层：</span>
                            低楼层
                        </div>
                    </Flex.Item>
                    <Flex.Item>
                        <div>
                            <span className={styles.title}>朝向：</span>{oriented.join(" ")}
                        </div>
                        <div>
                            <span className={styles.title}>类型：</span>普通住宅
                        </div>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }

    //房屋配套
    renderMatching() {
        const {supporting} = this.state
        if (supporting.length === 0) {
            return (
                <div className="title-empty">暂无数据</div>
            )
        }
        return (
            <div className={styles.about}>
                <div className={styles.houseTitle}>房屋配套</div>
                <HousePackage
                    list={supporting}
                />

            </div>
        )
    }

    renderHouseInfo() {
        const {description} = this.state
        return (
            <div className={styles.set}>
                <div className={styles.houseTitle}>房源概况</div>
                <div>
                    <div className={styles.contact}>
                        <div className={styles.user}>
                            <img src={BASE_URL + '/img/avatar.png'} alt="头像"/>
                            <div className={styles.useInfo}>
                                <p>王女士</p>
                                <div className={styles.userAuth}>
                                    <i className="iconfont icon-auth"/>
                                    已认证房主
                                </div>
                            </div>
                        </div>
                        <span className={styles.userMsg}>发消息</span>
                    </div>

                    <div className={styles.descText}>
                        {description === "" ? "暂无房源描述" : description}
                    </div>
                </div>
            </div>
        )
    }

    renderStars() {
        if (this.state.isCollect) {
            return (
                <Flex.Item onClick={this.handleCollect}>
                    <img
                        src={BASE_URL + '/img/star.png'}
                        className={styles.favoriteImg}
                        alt="收藏"
                    />
                    <span className={styles.favorite}>已收藏</span>
                </Flex.Item>
            )
        } else {
            return (
                <Flex.Item onClick={this.handleCollect}>
                    <img
                        src={BASE_URL + '/img/unstar.png'}
                        className={styles.favoriteImg}
                        alt="收藏"
                    />
                    <span className={styles.favorite}>收藏</span>
                </Flex.Item>

            )
        }
    }

    render() {
        const {isLoading, isCollect} = this.state
        //渲染轮播图
        return (
            <div className={styles.root}>
                <NavHeader className={styles.navHeader} rightContent={[
                    <i className={"iconfont icon-share"} key={"share"}/>
                ]}>房源详情
                </NavHeader>

                {/* 轮播图 */}
                <div className={styles.slides}>
                    {!isLoading ? (
                        <Carousel autoplay infinite autoplayInterval={2000}>
                            {this.renderSwipers()}
                        </Carousel>
                    ) : (
                        ''
                    )}
                </div>

                {/* 房屋基础信息 */}
                {this.renderBaseInfo()}

                {/* 地图位置 */}
                <div className={styles.map}>
                    <div className={styles.mapTitle}>
                        小区：
                        <span>{this.state.community}</span>
                    </div>
                    <div className={styles.mapContainer} id="map">
                        地图
                    </div>
                </div>

                {/* 房屋配套 */}
                {this.renderMatching()}

                {/* 房屋概况 */}
                {this.renderHouseInfo()}

                {/* 推荐 */}
                <div className={styles.recommend}>
                    <div className={styles.houseTitle}>猜你喜欢</div>
                    <div className={styles.items}>
                        {recommendHouses.map(item => (
                            <HouseListItem houseData={item} key={item.houseCode}/>
                        ))}
                    </div>
                </div>

                {/* 底部收藏按钮 */}
                <Flex className={styles.fixedBottom}>
                    {this.renderStars()}
                    <Flex.Item>在线咨询</Flex.Item>
                    <Flex.Item>
                        <a href="tel:17673045972" className={styles.telephone}>
                            电话预约
                        </a>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }


}


export default Detail;
