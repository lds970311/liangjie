import React, {Component} from 'react';
import "./latestNews.scss"
import {Flex} from 'antd-mobile';
import axios from "axios";


class LatestNews extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    getNewsData = async () => {
        try {
            let response = await axios.get("/home/news");
            this.setState({
                data: response.data.body
            })
        } catch (e) {
            console.error(e)
        }
    }

    componentDidMount() {
        this.getNewsData();
    }

    render() {
        return (
            <div className="latest-news">
                <h3>最新资讯</h3>
                {this.state.data.map(item => (
                    <Flex key={item.id} justify={"around"}>
                        <Flex.Item>
                            <img src={axios.defaults.baseURL + item.imgSrc} alt=""/>
                        </Flex.Item>
                        <Flex.Item>
                            <h3 className={"title"}>{item.title}</h3>
                            <Flex justify={"between"}>
                                <Flex.Item className={"from"}>{item.from}</Flex.Item>
                                <Flex.Item className={"date"}>{item.date}</Flex.Item>
                            </Flex>
                        </Flex.Item>
                    </Flex>
                ))}

            </div>
        );
    }
}

export default LatestNews;
