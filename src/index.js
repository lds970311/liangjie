import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import "./index.scss" //全局样式
import "./assets/fonts/iconfont.css"
//道义react-virtualized样式
import "react-virtualized/styles.css"
import "./utils/axiosConfig"
import {Provider} from "react-redux";
import store from './redux/store'


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

