import React, {Component} from 'react';
import NavHeader from "../../components/NavHeader/NavHeader";
import {Flex, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import {Link} from "react-router-dom";
import styles from "./register.module.scss"
import axios from "axios";
// 导入 formik 组件
import {ErrorMessage, Field, withFormik} from 'formik'
// 导入表单校验schema
import * as Yup from 'yup'

class Register extends Component {
    state = {
        userName: "",
        password: "",
    }

    render() {
        const {handleSubmit} = this.props
        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavHeader className={styles.navHeader}>用户注册</NavHeader>
                <WhiteSpace size="xl"/>

                {/* 注册表单 */}
                <WingBlank>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formItem}>
                            <Field
                                name="userName"
                                placeholder="请输入用户名"
                                className={styles.input}
                            />
                        </div>
                        <ErrorMessage
                            name="userName"
                            component="div"
                            className={styles.error}
                        />
                        {/* 长度为5到8位，只能出现数字、字母、下划线 */}
                        <div className={styles.formItem}>
                            <Field
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                                className={styles.input}
                            />
                        </div>
                        <ErrorMessage
                            name="password"
                            component="div"
                            className={styles.error}
                        />
                        {/* 长度为5到12位，只能出现数字、字母、下划线 */}
                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type="submit">
                                注 册
                            </button>
                        </div>
                    </form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to="/login">已有账号,去登录 ~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        );
    }
}

// 使用 withFormik 高阶组件包装我们自己的 Register组件
// withFormik() 第一次调用：可以传入一些配置对象
// 第二次调用，再包装组件
const uPattern = /^[a-zA-Z0-9_-]{5,8}$/;
const pPattern = /^[a-zA-Z0-9_]{5,20}$/
Register = withFormik({
    // 为表单提供状态值，相当于原来在 Login 组件 state 中添加的状态
    mapPropsToValues: () => ({userName: '', password: ''}),

    // 表单校验规则：
    validationSchema: Yup.object().shape({
        userName: Yup.string()
            .required('账号为必填项')
            .matches(uPattern, '长度为5到8位，只能出现数字、字母、下划线'),
        password: Yup.string()
            .required('密码为必填项')
            .matches(pPattern, '长度为5到20位，只能出现数字、字母、下划线')
    }),

    // 为表单提供事件处理程序
    handleSubmit: async (values, {props}) => {
        const {userName, password} = values;
        console.log(userName, password)
        try {
            let res = await axios.post("/user/registered", {
                username: userName,
                password: password
            })
            if (res.data.status === 200) {
                await Toast.info(res.data.description, 1, null, false)
                props.history.push(`/login`)
            } else {
                Toast.fail(res.data.description, 1, null, false)
            }
        } catch (e) {
            console.log("用户注册失败", e)
        }
    }
})(Register)

export default Register;
