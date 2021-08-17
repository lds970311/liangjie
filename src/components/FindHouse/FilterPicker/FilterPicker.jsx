import React, {PureComponent} from 'react';
import PropTypes from 'prop-types'
import {PickerView} from 'antd-mobile'
import FilterFooter from "../FilterFooter/FilterFooter";
import styles from "./filterPicker.module.scss"

//数据选择组件
class FilterPicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
    }

    /**
     * 组件加载时加载上一次选中的默认值
     */
    setDefaultValue = () => {
        this.setState({
            value: this.props.defaultValue
        })
    }

    componentDidMount() {
        this.setDefaultValue();
    }


    /**
     * 递归计算数据拾取器的列数
     * @param data dataPicker的数据
     * @returns {number|*}
     */
    calculateCols(data) {
        if (!data[1]) {
            return 2;
        }
        if (!data[1].children) {
            return 1;
        }
        return 1 + this.calculateCols(data[1].children)
    }

    submitValue(val) {
        this.props.onValueChange(this.props.type, val)
        this.setState({
            value: val
        })
    }

    //渲染dataPicker的方法
    renderPickerView() {
        const {filterArray} = this.props;
        const cols = this.calculateCols(filterArray);
        return (
            <PickerView data={filterArray} value={this.state.value} cols={cols}
                        onChange={(val) => this.submitValue(val)}/>
        )
    }

    render() {
        return (
            <div className={styles.root}>
                {/* 选择器组件： */}
                {this.renderPickerView()}

                {/* 底部按钮 */}
                <FilterFooter onCancel={() => this.props.onCancel(this.props.type)}
                              onSave={() => this.props.onSave(this.props.type, this.state.value)}>取消</FilterFooter>
            </div>
        );
    }
}

FilterPicker.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    filterArray: PropTypes.array.isRequired,
    type: PropTypes.string,
    defaultValue: PropTypes.array.isRequired,
    onValueChange: PropTypes.func
};

export default FilterPicker;
