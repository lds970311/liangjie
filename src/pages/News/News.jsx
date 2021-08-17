//资讯页
import React, {PureComponent} from 'react';
import styles from "./news.module.scss"
import NavHeader from "../../components/NavHeader/NavHeader";


class News extends PureComponent {
    componentDidMount() {
        console.log(window.history)
    }


    render() {
        return (
            <div className={styles.root}>
                <NavHeader className={styles.header}>资讯</NavHeader>
            </div>
        );
    }
}


export default News;
