import React, {Component} from 'react';
import NavHeader from "../../components/NavHeader/NavHeader";
import styles from "./login.module.scss"
import {Flex, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import {Link} from "react-router-dom";
import axios from "axios";

class Login extends Component {
    state = {
        userName: "",
        password: "",
        isUserNameError: false,
        isPasswordError: false,
        userNameErrMsg: "",
        passwordErrMsg: ""
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    login = (e) => {
        e.preventDefault();
        this.setState({
            isUserNameError: false,
            isPasswordError: false,
            userNameErrMsg: "",
            passwordErrMsg: ""
        })
        const {userName, password} = this.state;
        const uPattern = /^[a-zA-Z0-9_-]{5,8}$/;
        const pPattern = /^[a-zA-Z0-9_]{5,20}$/

        if (this.checkEmpty(userName, password)) {
            if (uPattern.test(userName) && pPattern.test(password)) {
                //登录
                this.submitInfo(userName, password)
            } else {
                if (!uPattern.test(userName) && !pPattern.test(password)) {
                    this.setState({
                        isUserNameError: true,
                        isPasswordError: true,
                        userNameErrMsg: "长度为5到8位，只能出现数字、字母、下划线 ",
                        passwordErrMsg: "长度为5到20位，只能出现数字、字母、下划线 "
                    })
                } else if (uPattern.test(userName) && !pPattern.test(password)) {
                    this.setState({
                        isPasswordError: true,
                        passwordErrMsg: "长度为5到20位，只能出现数字、字母、下划线 "
                    })
                } else {
                    this.setState({
                        isUserNameError: true,
                        userNameErrMsg: "长度为5到8位，只能出现数字、字母、下划线 ",
                    })
                }
            }
        }
    }

    checkEmpty = (uName, pwd) => {
        if (uName === "" && pwd !== "") {
            this.setState({
                isUserNameError: true,
                userNameErrMsg: "用户名不能为空",
            })
            return false;
        } else if (uName !== "" && pwd === "") {
            this.setState({
                isPasswordError: true,
                passwordErrMsg: "密码不能为空 "
            })
            return false
        } else if (uName === "" && pwd === "") {
            this.setState({
                isUserNameError: true,
                userNameErrMsg: "用户名不能为空",
                isPasswordError: true,
                passwordErrMsg: "密码不能为空 "
            })
            return false
        } else {
            return true
        }
    }

    submitInfo(uName, pwd) {
        axios.post("/user/login", {
            username: uName,
            password: pwd
        }).then(res => {
            if (res.data.status === 200) {
                Toast.info(res.data.description, 1, null, false)
                localStorage.setItem("token", res.data.body.token)
                /*this.props.history.push("/home")*/
                //根据location.state来决定返回哪个页面
                if (this.props.location.state) {
                    //有state,说明是重定向过来的
                    this.props.history.replace(this.props.location.state.from.pathname)
                } else {
                    this.props.history.replace("/home")
                }
            } else {
                Toast.fail(res.data.description, 1, null, false)
            }
        }).catch(err => {
            console.log("用户登录失败", err)
        })
    }

    render() {
        const {isUserNameError, isPasswordError, userNameErrMsg, passwordErrMsg} = this.state
        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavHeader className={styles.navHeader}>账号登录</NavHeader>
                <WhiteSpace size="xl"/>

                {/* 登录表单 */}
                <WingBlank>
                    <form>
                        <div className={styles.formItem}>
                            <input
                                className={styles.input}
                                name="userName"
                                placeholder="请输入用户名"
                                onChange={this.handleChange}
                            />
                        </div>
                        {/* 长度为5到8位，只能出现数字、字母、下划线 */}
                        {isUserNameError ? (
                            <div className={styles.error}>{userNameErrMsg}</div>
                        ) : null}

                        <div className={styles.formItem}>
                            <input
                                className={styles.input}
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                                onChange={this.handleChange}
                            />
                        </div>
                        {/* 长度为5到12位，只能出现数字、字母、下划线 */}
                        {isPasswordError ? (
                            <div className={styles.error}>{passwordErrMsg}</div>
                        ) : null}
                        <div className={styles.formSubmit}>
                            <button className={styles.submit} onClick={this.login}>
                                登 录
                            </button>
                        </div>
                    </form>
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to="/register">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        );
    }
}

export default Login;
