import React, {Component} from 'react';
import styles from "./rendAdd.module.scss"
import NavHeader from "../../../components/NavHeader/NavHeader";
import {Flex, ImagePicker, InputItem, List, Modal, Picker, TextareaItem, Toast} from "antd-mobile";
import HousePackage from "../../../components/HouseDetails/HousePackage/HousePackage";
import axios from "axios";

// 房屋类型
const roomTypeData = [
    {label: '一室', value: 'ROOM|d4a692e4-a177-37fd'},
    {label: '二室', value: 'ROOM|d1a00384-5801-d5cd'},
    {label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2'},
    {label: '四室', value: 'ROOM|ce2a5daa-811d-2f49'},
    {label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f'}
]

// 朝向：
const orientedData = [
    {label: '东', value: 'ORIEN|141b98bf-1ad0-11e3'},
    {label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e'},
    {label: '南', value: 'ORIEN|61e99445-e95e-7f37'},
    {label: '北', value: 'ORIEN|caa6f80b-b764-c2df'},
    {label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977'},
    {label: '东北', value: 'ORIEN|67ac2205-7e0f-c057'},
    {label: '西南', value: 'ORIEN|2354e89e-3918-9cef'},
    {label: '西北', value: 'ORIEN|80795f1a-e32f-feb9'}
]

// 楼层
const floorData = [
    {label: '高楼层', value: 'FLOOR|1'},
    {label: '中楼层', value: 'FLOOR|2'},
    {label: '低楼层', value: 'FLOOR|3'}
]

class RentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 临时图片地址
            tempSlides: [],

            // 小区的名称和id
            community: {
                name: '',
                id: ''
            },
            // 价格
            price: '',
            // 面积
            size: "",
            // 房屋类型
            roomType: '',
            // 楼层
            floor: '',
            // 朝向：
            oriented: '',
            // 房屋标题
            title: '',
            // 房屋图片
            houseImg: '',
            // 房屋配套：
            supporting: '',
            // 房屋描述
            description: ''
        }
    }

    componentDidMount() {
        this.hasCommunity()
    }

    handleSelect = items => {
        this.setState({
            supporting: items.join("|")
        })
    }

    handleChange = (type, val) => {
        if (type === "roomType" || type === "floor" || type === "oriented") {
            this.handlePickerValue(type, val)
        } else {
            this.setState({
                [type]: val
            })
        }
    }

    handlePickerValue = (type, val) => {
        this.setState({
            [type]: val
        })
    }

    /**
     *
     * @param type
     * @param content
     * @returns {*}
     */
    /*formatValue(type, content) {
        console.log(type, content)
        if (content !== "") {
            if (type === "roomType") {
                const room = roomTypeData.find(item => {
                    return item.value == content
                })
                return room.label
            } else if (type === "floor") {
                const floor = floorData.find(item => {
                    return item.value == content
                })
                return floor.label
            } else {
                const oriented = orientedData.find(item => {
                    return item.value == content
                })
                return oriented.label
            }
        }
    }*/

    hasCommunity = () => {
        if (!this.props.history.location.state) {
            return
        }
        this.setState({
            community: this.props.history.location.state
        })
    }

    changeRoomType(val) {
        console.log(val)
        let room = roomTypeData.find(element => {
            return element.value == val
        })
        console.log(room)
        this.setState({
            roomType: room.label
        })
    }

    onCancel = () => {
        const alert = Modal.alert;
        alert('提示', '是否取消发布房源??', [
            {text: '取消', style: 'default'},
            {
                text: '确定', onPress: () => {
                    this.props.history.go(-1)
                }
            },
        ]);
    }

    //图片上传
    handleImgChange = (file, type, index) => {
        this.setState({
            tempSlides: file
        })
    }

    postHouseMsg = async () => {
        //1. 上传图片
        let {
            tempSlides,
            houseImg,
            title,
            description,
            oriented,
            supporting,
            price,
            roomType,
            size,
            floor,
            community
        } = this.state;
        const formData = new FormData();
        tempSlides.forEach((item) => {
            formData.append("file", item.file)
        })
        try {
            let res = await axios.post("/houses/image", formData, {
                "content-type": "multipart/form-data"
            })
            houseImg = res.data.body.join("|")
        } catch (e) {
            console.log("上传图片失败", e)
            alert(e + "请重新上传图片")
        }

        //2. 发布房源
        try {
            let res = await axios.post("/user/houses", {
                title,
                description,
                oriented,
                supporting,
                price,
                roomType,
                size,
                floor,
                community: community.id,
                houseImg,

            })
            console.log(res)
            if (res.data.status === 200) {
                //发布成功
                Toast.success("房源发布成功", 2, null, true)
                this.setState({
                    title: "",
                    description: "",
                    oriented: "",
                    supporting: "",
                    price: "",
                    roomType: "",
                    size: "",
                    floor: "",
                    community: {},
                    houseImg: "",
                    tempSlides: []
                })
            } else {
                Toast.fail("房源发布失败", 2, null, true)
            }
        } catch (e) {
            Toast.fail("请求错误", 2, null, true)
            console.log(e)
        }
    }

    render() {
        const {community, roomType, floor, oriented, title, tempSlides, description, price, size} = this.state
        return (
            <div className={styles.root}>
                <NavHeader className={styles.addHeader} leftClick={this.onCancel}>
                    发布房源
                </NavHeader>
                <List
                    className={styles.header}
                    renderHeader={() => '房源信息'}
                    data-role="rent-list"
                >
                    {/* 选择所在小区 */}
                    <List.Item
                        extra={community.name || '请输入小区名称'}
                        arrow="horizontal"
                        onClick={() => this.props.history.replace('/rent/search')}
                        className={styles.communityName}
                    >
                        小区名称
                    </List.Item>
                    <InputItem placeholder="请输入租金/月" extra="￥/月" value={price}
                               onChange={value => this.handleChange("price", value)}>
                        租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
                    </InputItem>
                    <InputItem placeholder="请输入建筑面积" extra="㎡" value={size}
                               onChange={value => this.handleChange("size", value)}>
                        建筑面积
                    </InputItem>
                    <Picker data={roomTypeData} value={[roomType]} cols={1}
                            onChange={val => this.handleChange("roomType", val[0])}>
                        <List.Item arrow="horizontal" className={styles.communityName}>
                            <Flex align={"center"}>
                                <p>户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</p>
                                {/*<Flex.Item
                                    className={styles.roomType}>{this.formatValue("roomType", roomType)}</Flex.Item>*/}
                            </Flex>
                        </List.Item>
                    </Picker>

                    <Picker data={floorData} value={[floor]} cols={1}
                            onChange={val => this.handleChange("floor", val[0])}>
                        <List.Item arrow="horizontal" className={styles.communityName}>
                            <Flex align={"center"}>
                                <p>所在楼层</p>
                                {/*<Flex.Item
                                    className={styles.roomType}>{this.formatValue("floor", floor)}</Flex.Item>*/}
                            </Flex>
                        </List.Item>
                    </Picker>
                    <Picker data={orientedData} value={[oriented]} cols={1}
                            onChange={val => this.handleChange("oriented", val[0])}>
                        <List.Item arrow="horizontal" className={styles.communityName}>
                            <Flex align={"center"}>
                                <p> 朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向</p>
                                {/*<Flex.Item
                                    className={styles.roomType}>{this.formatValue("oriented", oriented)}</Flex.Item>*/}
                            </Flex>
                        </List.Item>
                    </Picker>
                </List>

                <List
                    className={styles.title}
                    renderHeader={() => '房屋标题'}
                    data-role="rent-list"
                >
                    <InputItem
                        placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
                        value={title}
                        onChange={value => this.handleChange("title", value)}
                    />
                </List>

                <List
                    className={styles.pics}
                    renderHeader={() => '房屋图像'}
                    data-role="rent-list"
                >
                    <ImagePicker
                        files={tempSlides}
                        multiple={true}
                        className={styles.imgPicker}
                        onChange={this.handleImgChange}
                    />
                </List>

                <List
                    className={styles.supporting}
                    renderHeader={() => '房屋配置'}
                    data-role="rent-list"
                >
                    <HousePackage
                        select={true}
                        onSelect={items => this.handleSelect(items)}/>
                </List>

                <List
                    className={styles.desc}
                    renderHeader={() => '房屋描述'}
                    data-role="rent-list"
                >
                    <TextareaItem
                        rows={5}
                        placeholder="请输入房屋描述信息"
                        autoHeight
                        value={description}
                        onChange={val => this.handleChange("description", val)}
                    />
                </List>

                <Flex className={styles.bottom}>
                    <Flex.Item className={styles.cancel} onClick={this.onCancel}>
                        取消
                    </Flex.Item>
                    <Flex.Item className={styles.confirm} onClick={this.postHouseMsg}>
                        提交
                    </Flex.Item>
                </Flex>
            </div>
        );
    }
}

export default RentAdd;
