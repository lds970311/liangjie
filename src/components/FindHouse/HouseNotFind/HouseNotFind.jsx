import React, {Component} from 'react';
import styles from "./houseNotFind.module.scss"
import notFound from "../../../assets/imgs/not-found.png"
import PropTypes from 'prop-types';


class HouseNotFind extends Component {
    render() {
        return (
            <div className={styles.root}>
                <img
                    className={styles.img}
                    src={notFound}
                    alt="暂无数据"
                />
                <p className={styles.msg}>暂无相关房源数据!</p>
                {this.props.children}
            </div>
        );
    }
}

HouseNotFind.propTypes = {
    children: PropTypes.element
};
export default HouseNotFind;
