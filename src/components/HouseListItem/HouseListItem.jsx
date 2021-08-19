import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import style from "./houseListItem.module.scss"
import {withRouter} from "react-router-dom"

class HouseListItem extends PureComponent {
    render() {
        return (
            <div className={style.house} key={this.props.key}
                 onClick={() => {
                     console.log(this.props.houseData.houseCode)
                     this.props.history.push(`/details/${this.props.houseData.houseCode}`)
                 }}
                 style={this.props.style}>
                <div className={style.imgWrap}>
                    <img
                        className={style.img}
                        src={axios.defaults.baseURL + this.props.houseData.houseImg}
                        alt=""
                    />
                </div>
                <div className={style.content}>
                    <h3 className={style.title}>
                        {this.props.houseData.title}
                    </h3>
                    <div className={style.desc}>{this.props.houseData.desc}</div>
                    <div className={style.tagContainer}>
                        {this.props.houseData.tags.map((item2, index) => {
                            const tagClass = `tag${index > 2 ? '3' : index + 1}`;
                            return (
                                <span className={[style.tag, style[tagClass]].join(' ')} key={item2}>
                                                {item2}
                                        </span>
                            )
                        })}
                    </div>
                    <div className={style.price}>
                        <span className={style.priceNum}>{this.props.houseData.price}</span> 元/月
                    </div>
                </div>
            </div>
        )
    }
}

HouseListItem.propTypes = {
    houseData: PropTypes.object.isRequired,
    key: PropTypes.string
};

export default withRouter(HouseListItem)
