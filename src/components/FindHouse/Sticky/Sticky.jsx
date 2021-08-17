import React, {Component} from 'react';
import Style from "./sticky.module.scss"
import PropTypes from "prop-types";

class Sticky extends Component {
    constructor() {
        super();
        this.placeHolderRef = React.createRef(); //占位元素ref
        this.contentRef = React.createRef(); //内容元素ref
    }

    componentDidMount() {
        //监听窗口滚动事件
        window.addEventListener("scroll", this.handleScroll)
    }

    handleScroll = () => {
        //获取Dom对象
        const placeHolderRef = this.placeHolderRef.current
        const contentRef = this.contentRef.current
        const {top} = placeHolderRef.getBoundingClientRect();
        if (top < 0) {
            //吸顶
            placeHolderRef.style.height = this.props.height + "px"
            contentRef.classList.add(Style.fixed)
        } else {
            //不吸顶
            placeHolderRef.style.height = '0px';
            contentRef.classList.remove(Style.fixed)
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    }

    render() {
        return (
            <div>
                {/*占位元素*/}
                <div ref={this.placeHolderRef}/>
                {/*内容元素*/}
                <div ref={this.contentRef}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Sticky.propTypes = {
    height: PropTypes.number.isRequired
}

export default Sticky;
