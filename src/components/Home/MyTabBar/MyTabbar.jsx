import React, {Fragment, lazy, PureComponent, Suspense} from 'react';
import {TabBar} from "antd-mobile";
import "./MyTabbar.scss"
import {Route, withRouter} from "react-router-dom";
// import Profile from "../../../pages/Profile/Profile";
// import FindHouse from "../../../pages/FindHouse/FindHouse";
// import News from "../../../pages/News/News";
// import Index from "../../../pages/Index/Index";

const Profile = lazy(() => import("../../../pages/Profile/Profile"))
const FindHouse = lazy(() => import("../../../pages/FindHouse/FindHouse"))
const News = lazy(() => import("../../../pages/News/News"))
const Index = lazy(() => import("../../../pages/Index/Index"))


const tabbarList = [
    {title: '首页', icon: 'icon-ind', path: '/home'},
    {title: '找房', icon: 'icon-findHouse', path: '/home/findhouse'},
    {title: '资讯', icon: 'icon-infom', path: '/home/news'},
    {title: '我的', icon: 'icon-my', path: '/home/profile'}
]

class MyTabBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: this.props.history.location.pathname,
            hidden: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({
                selectedTab: this.props.history.location.pathname
            })
        }
    }

    renderTabBarItems = () => {
        return tabbarList.map(item => (
                <TabBar.Item
                    title={item.title}
                    key={item.path}
                    icon={<i className={`iconfont ${item.icon}`} style={{fontSize: '20px'}}/>}
                    selectedIcon={<i className={`iconfont ${item.icon}`}
                                     style={{fontSize: '20px'}}/>
                    }
                    selected={this.state.selectedTab === `${item.path}`}
                    onPress={() => {
                        this.props.history.push(`${item.path}`)
                    }}
                >
                </TabBar.Item>
            )
        )
    }

    render() {
        return (
            <Suspense fallback={<div>loading...</div>}>
                <Fragment>
                    {/*精确匹配*/}
                    <Route exact path={"/home"} component={Index}/>
                    <Route path={"/home/profile"} component={Profile}/>
                    <Route path={"/home/findhouse"} component={FindHouse}/>
                    <Route path={"/home/news"} component={News}/>
                    <div className="mytabbar">
                        <TabBar
                            unselectedTintColor="#949494"
                            noRenderContent={true}
                            tintColor="#33A3F4"
                            barTintColor="white"
                            hidden={this.state.hidden}
                        >
                            {this.renderTabBarItems()}
                        </TabBar>
                    </div>
                </Fragment>
            </Suspense>
        );
    }
}

MyTabBar.propTypes = {};

export default withRouter(MyTabBar);
