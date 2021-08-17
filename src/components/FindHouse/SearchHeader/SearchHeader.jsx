import React, {Component, Fragment} from 'react';
import {Flex} from "antd-mobile";
import {withRouter} from "react-router-dom"
import PropTypes from "prop-types";
import "./serachHeader.scss"

class SearchHeader extends Component {
    render() {
        return (
            <Fragment>
                <Flex className={["search-box", this.props.className].join(" ")}>
                    <Flex className="search-left">
                        <div className={"location"} onClick={() => {
                            this.props.history.push("/citylist")
                        }}>
                            <span>{this.props.currentCity}</span>
                            <i className="iconfont icon-arrow"/>
                        </div>
                        <div className="search-form" onClick={() => {
                            this.props.history.push("/search")
                        }}>
                            <i className="iconfont icon-seach"/>
                            <span>请输入小区或地址</span>
                        </div>
                    </Flex>
                    <i className="iconfont icon-map" onClick={() => {
                        this.props.history.push("/map", {
                            // latitude: this.state.latitude,
                            // longitude: this.state.longitude
                        })
                    }}/>
                </Flex>
            </Fragment>
        );
    }
}

SearchHeader.defaultPrps = {
    className: ""
}

SearchHeader.propTypes = {
    currentCity: PropTypes.string,
    className: PropTypes.string
};

export default withRouter(SearchHeader);
