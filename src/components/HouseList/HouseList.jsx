import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import "./houseList.scss"
import HouseListItem from "../HouseListItem/HouseListItem";


class HouseList extends PureComponent {

    renderHouseList = () => {
        return (
            <div className={["houseList", this.props.isShow ? "show" : ""].join(' ')}>
                <div className={"titleWrap"}>
                    <span className={"listTitle"}>{this.props.label}</span>
                    <a className={"titleMore"} href="/house/list">
                        更多房源
                    </a>
                    <p className={"renting-count"}>在租{this.props.count}套</p>
                </div>
                <div className={"houseItems"}>
                    {this.props.data.map((item, index) => (
                        <HouseListItem houseData={item} key={index}/>
                    ))}
                </div>
            </div>
        )
    }

    render() {
        return this.renderHouseList()
    }
}

HouseList.propTypes = {
    data: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    isShow: PropTypes.bool.isRequired,
};

export default HouseList;
