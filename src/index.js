import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import "./index.scss" //全局样式
import "./assets/fonts/iconfont.css"
//道义react-virtualized样式
import "react-virtualized/styles.css"
import "./utils/axiosConfig"

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

