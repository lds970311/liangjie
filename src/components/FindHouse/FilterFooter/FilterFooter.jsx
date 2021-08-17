import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Flex} from "antd-mobile";
import styles from "./filterFooter.module.scss"

//底部两个按钮
class FilterFooter extends PureComponent {

    render() {
        return (
            <Flex className={[styles.root, this.props.className || ""].join(' ')}>
                {/* 取消按钮 */}
                <span
                    className={[styles.btn, styles.cancel].join(' ')}
                    onClick={this.props.onCancel}
                >
                    {this.props.children}
      </span>

                {/* 确定按钮 */}
                <span className={[styles.btn, styles.ok].join(' ')} onClick={this.props.onSave}>
        确定
      </span>
            </Flex>
        );
    }
}

FilterFooter.propTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    className: PropTypes.string
}
export default FilterFooter;
