import React, {Component} from 'react';
import BASE_URL from "../../utils/url";
import styles from "./profile.module.scss"
import {Button, Grid, Modal, Toast} from "antd-mobile";
import {Link} from "react-router-dom";
import axios from "axios";

// 菜单数据
const menus = [
    {id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favourite'},
    {id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent/list'},
    {id: 3, name: '看房记录', iconfont: 'icon-record'},
    {
        id: 4,
        name: '成为房主',
        iconfont: 'icon-identity'
    },
    {id: 5, name: '个人资料', iconfont: 'icon-myinfo'},
    {id: 6, name: '联系我们', iconfont: 'icon-cust'}
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'


class Profile extends Component {
    constructor() {
        super();
        this.state = {
            isLogin: false,
            nickname: "",
            avatar: ""
        }
    }

    async componentDidMount() {
        await this.isUserLogin()
        await this.getUserInfo()
    }

    isUserLogin = () => {
        const token = localStorage.getItem("token");
        if (token) {
            this.setState({
                isLogin: true,
            })
        }
    }

    getUserInfo = async () => {
        const {isLogin} = this.state;
        if (isLogin) {
            //获取用户数据
            try {
                let res = await axios.get("/user")
                if (res.data.status === 400) {
                    //登录失败
                    Toast.fail(res.data.description, 1.5, null, false)
                    //移除token
                    this.setState({
                        isLogin: false
                    })
                } else {
                    this.setState({
                        nickname: res.data.body.nickname,
                        avatar: res.data.body.avatar
                    })
                }

            } catch (e) {
                console.log("获取用户信息失败", e)
                this.setState({
                    isLogin: false
                })
            }
        }
    }

    //用户退出
    logout = () => {
        const alert = Modal.alert;
        alert('退出登录', '确定要退出吗?', [
            {
                text: '取消', onPress: () => {
                    console.log("cancel")
                }, style: 'default'
            },
            {text: 'OK', onPress: () => this.userLogout()},
        ]);
    }

    userLogout = async () => {
        try {
            let result = await axios.post("/user/logout")
            if (result.data.status === 200) {
                //退出成功
                Toast.success(result.data.description, 1.5, null, false)
                localStorage.removeItem("token");
                this.setState({
                    isLogin: false,
                    nickname: "",
                    avatar: ""
                })
            } else {
                Toast.fail(result.data.description, 1.5, null, false)
                localStorage.removeItem("token");
                this.setState({
                    isLogin: false,
                })
            }
        } catch (e) {
            console.log("用户退出失败", e)
        }
    }

    renderIcons(item) {
        if (item.to) {
            return (
                <Link to={item.to}>
                    <div className={styles.menuItem}>
                        <i className={`iconfont ${item.iconfont}`}/>
                        <span>{item.name}</span>
                    </div>
                </Link>
            )
        } else {
            return (
                <div className={styles.menuItem}>
                    <i className={`iconfont ${item.iconfont}`}/>
                    <span>{item.name}</span>
                </div>
            )
        }
    }


    render() {
        const {isLogin, nickname, avatar} = this.state
        return (
            <div className={styles.root}>
                {/* 个人信息 */}
                <div className={styles.title}>
                    <img
                        className={styles.bg}
                        src={BASE_URL + '/img/profile/bg.png'}
                        alt="背景图"
                    />
                    <div className={styles.info}>
                        <div className={styles.myIcon}>
                            <img
                                className={styles.avatar}
                                src={isLogin ? `${avatar}` : DEFAULT_AVATAR}
                                alt="icon"
                            />
                        </div>
                        <div className={styles.user}>
                            <div className={styles.name}>{isLogin ? nickname : '游客'}</div>
                            {/* 根据登录状态来决定展示什么内容 */}
                            {isLogin ? (
                                <>
                                    <div className={styles.auth}>
                                        <span onClick={this.logout}>退出</span>
                                    </div>
                                    <div className={styles.edit}>
                                        编辑个人资料
                                        <span className={styles.arrow}>
                                          <i className="iconfont icon-arrow"/>
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.edit}>
                                    <Button
                                        type="primary"
                                        size="small"
                                        inline
                                        onClick={() => this.props.history.push('/login')}
                                    >
                                        去登录
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 九宫格菜单 */}
                <Grid
                    data={menus}
                    columnNum={3}
                    hasLine={false}
                    renderItem={item => this.renderIcons(item)}
                />

                {/* 加入我们 */}
                <div className={styles.ad}>
                    <img src={BASE_URL + '/img/profile/join.png'} alt=""/>
                </div>
            </div>
        );
    }
}

export default Profile;
