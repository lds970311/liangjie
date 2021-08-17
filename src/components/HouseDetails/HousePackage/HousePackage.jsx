import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styles from "./housePackage.module.scss"

// 所有房屋配置项
const HOUSE_PACKAGE = [
    {
        id: 1,
        name: '衣柜',
        icon: 'icon-wardrobe'
    },
    {
        id: 2,
        name: '洗衣机',
        icon: 'icon-wash'
    },
    {
        id: 3,
        name: '空调',
        icon: 'icon-air'
    },
    {
        id: 4,
        name: '天然气',
        icon: 'icon-gas'
    },
    {
        id: 5,
        name: '冰箱',
        icon: 'icon-ref'
    },
    {
        id: 6,
        name: '暖气',
        icon: 'icon-Heat'
    },
    {
        id: 7,
        name: '电视',
        icon: 'icon-vid'
    },
    {
        id: 8,
        name: '热水器',
        icon: 'icon-heater'
    },
    {
        id: 9,
        name: '宽带',
        icon: 'icon-broadband'
    },
    {
        id: 10,
        name: '沙发',
        icon: 'icon-sofa'
    }
]

class HousePackage extends PureComponent {
    state = {
        // 选中名称
        selectedNames: []
    }

    // 根据id切换选中状态
    toggleSelect = name => {
        const {selectedNames} = this.state
        let newSelectedNames

        // 判断该项是否选中
        if (selectedNames.indexOf(name) > -1) {
            // 选中：从数组中删除选中项，也就是保留未选中项
            newSelectedNames = selectedNames.filter(item => item !== name)
        } else {
            // 未选中：添加到数组中
            newSelectedNames = [...selectedNames, name]
        }

        // 传递给父组件
        this.props.onSelect(newSelectedNames)

        this.setState({
            selectedNames: newSelectedNames
        })
    }

    // 渲染列表项
    renderItems() {
        const {selectedNames} = this.state
        // select 的值为 true 表示 选择房屋配置；false 表示仅展示房屋列表
        // list 表示要展示的列表项
        const {select, list} = this.props

        let data
        // 如果传了 select 表示：选择 房屋配置
        // 如果没传 select 表示：展示 房屋配置 列表
        if (select) {
            data = HOUSE_PACKAGE
        } else {
            // 展示房屋配置列表
            // 从所有的列表项中过滤出要展示的（list）列表项
            data = HOUSE_PACKAGE.filter(v => list.includes(v.name))
        }

        return data.map(item => {
            // 判断该项是否选中
            const isSelected = selectedNames.indexOf(item.name) > -1

            return (
                <li
                    key={item.id}
                    className={[styles.item, isSelected ? styles.active : ''].join(' ')}
                    onClick={select && (() => this.toggleSelect(item.name))}
                >
                    <p>
                        <i className={`iconfont ${item.icon} ${styles.icon}`}/>
                    </p>
                    {item.name}
                </li>
            )
        })
    }

    render() {
        return <ul className={styles.root}>{this.renderItems()}</ul>
    }
}

HousePackage.propTypes = {
    list: PropTypes.array,
    select: PropTypes.bool //表示图标是否可选中
};

export default HousePackage;
