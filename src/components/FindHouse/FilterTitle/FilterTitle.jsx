import React, {Component} from 'react';
import Styles from "./filterTilte.module.scss"
import {Flex} from "antd-mobile";
import PropTypes from "prop-types";

// 条件筛选栏标题数组：
const titleList = [
    {title: '区域', type: 'area'},
    {title: '方式', type: 'mode'},
    {title: '租金', type: 'price'},
    {title: '筛选', type: 'more'}
]

class FilterTitle extends Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        const {selectedStatus} = this.props;
        return (
            <div className={Styles.filterTitle}>
                <Flex>
                    {titleList.map(item => {
                        const isSelected = selectedStatus[item.type]
                        return (
                            <Flex.Item key={item.type} onClick={() => this.props.changeStatus(item.type)}>
                                <span className={[Styles.dropdown,
                                    isSelected ? Styles.selected : ''].join(" ")}>
                                    <span>{item.title}</span>
                                <i className={["iconfont icon-arrow", isSelected ? "" : Styles.rotate].join(" ")}/>
                                </span>
                            </Flex.Item>
                        )
                    })}
                </Flex>
            </div>
        );
    }
}

FilterTitle.propTypes = {
    selectedStatus: PropTypes.object.isRequired,
    changeStatus: PropTypes.func.isRequired
}

export default FilterTitle;
