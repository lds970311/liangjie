import React, {PureComponent} from 'react';
import styles from "./filterMore.module.scss"
import PropTypes from "prop-types";
import {animated, Spring} from "react-spring";
import FilterFooter from "../FilterFooter/FilterFooter";

//详细选择组件
class FilterMore extends PureComponent {
    constructor() {
        super();
        this.state = {
            selectedValues: [] //选中值
        }
    }

    componentDidMount() {
        this.setState({
            selectedValues: this.props.defaultValues
        })
    }

    handleClick = val => {
        const {selectedValues} = this.state;
        let newValues = [...selectedValues]
        let valueIndex = selectedValues.indexOf(val)
        if (valueIndex !== -1) {
            //包含数组中有该value值
            newValues.splice(valueIndex, 1)
        } else {
            //说明没有该value
            newValues.push(val)
        }
        this.setState({
            selectedValues: newValues
        })
    }

    // 渲染标签
    renderFilters(data) {
        // 高亮类名： styles.tagActive
        return data.map(item => {
            const className = this.state.selectedValues.indexOf(item.value) === -1 ? "" : styles.tagActive
            return (
                <span className={[styles.tag, className].join(' ')} key={item.value}
                      onClick={() => this.handleClick(item.value)}>{item.label}</span>
            )
        })
    }

    //清空所有选中项
    resetAllValues = () => {
        this.setState({
            selectedValues: []
        })
    }

    renderTags() {
        const {filterModeData} = this.props;
        return (
            <Spring from={{transform: 'translate(334px,0)'}} to={{transform: 'translate(0,0)'}}>
                {props => {
                    return (
                        <animated.div className={styles.tags} style={props}>
                            <dl className={styles.dl}>
                                <dt className={styles.dt}>户型</dt>
                                <dd className={styles.dd}>{this.renderFilters(filterModeData[3])}</dd>

                                <dt className={styles.dt}>朝向</dt>
                                <dd className={styles.dd}>{this.renderFilters(filterModeData[2])}</dd>

                                <dt className={styles.dt}>楼层</dt>
                                <dd className={styles.dd}>{this.renderFilters(filterModeData[1])}</dd>

                                <dt className={styles.dt}>房屋亮点</dt>
                                <dd className={styles.dd}>{this.renderFilters(filterModeData[0])}</dd>
                            </dl>
                        </animated.div>
                    )
                }}
            </Spring>
        )
    }

    render() {
        const {filterModeData} = this.props;
        console.log(filterModeData)
        return (
            <div className={styles.root}>
                {/* 遮罩层 */}
                <div className={styles.mask} onClick={this.props.onCancel}/>

                {/* 条件内容 */}
                {this.renderTags()}

                {/* 底部按钮 */}
                <FilterFooter className={styles.footer} onCancel={this.resetAllValues}
                              onSave={() => this.props.onSave("more", this.state.selectedValues)}>清除</FilterFooter>
            </div>
        );
    }
}

FilterMore.propTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    filterModeData: PropTypes.array.isRequired,
    defaultValues: PropTypes.array.isRequired
};

export default FilterMore;
