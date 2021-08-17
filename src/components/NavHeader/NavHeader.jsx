import "./navHeader.scss"

import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom"
import {NavBar} from "antd-mobile";
import PropTypes from 'prop-types'

class NavHeader extends Component {
    handleLeftClick() {
        if (this.props.leftClick) {
            this.props.leftClick()
        } else {
            this.props.history.go(-1)
        }
    }

    render() {
        return (
            <Fragment>
                <NavBar
                    className={this.props.className}
                    mode="light"
                    icon={<i className="iconfont icon-back"/>}
                    onLeftClick={() => this.handleLeftClick()}
                    rightContent={this.props.rightContent}
                >{this.props.children}</NavBar>
            </Fragment>
        );
    }
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    rightContent: PropTypes.array,
    leftClick: PropTypes.func
};


export default withRouter(NavHeader);

