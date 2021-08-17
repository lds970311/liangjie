import React, {Component} from 'react';
import {Flex, Grid} from 'antd-mobile';
import "./rendGroups.scss"
import axios from "axios";


class RendGroups extends Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    loadGroupData = async () => {
        try {
            let res = await axios.get("/home/groups")
            this.setState({
                data: res.data.body
            })
        } catch (e) {
        }
    }

    componentDidMount() {
        this.loadGroupData();
    }

    render() {
        return (
            <div className="rent-groups">
                <div className="title">
                    <Flex justify="between">
                        <h3>租房小组</h3>
                        <p>
                            更多
                        </p>
                    </Flex>
                </div>
                <Grid data={this.state.data} activeStyle={true} hasLine={false} square={false} columnNum={2}
                      renderItem={(el, index) => (
                          <Flex className="grid-item" justify="between">
                              <div>
                                  <p className={"detail"}>{el.title}</p>
                                  <span>{el.desc}</span>
                              </div>
                              <div>
                                  <img src={axios.defaults.baseURL + el.imgSrc}
                                       alt="rent"/>
                              </div>
                          </Flex>
                      )}/>
            </div>
        );
    }
}

export default RendGroups;
