import React, {Component} from 'react';
import {Layout, message} from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import './assets/css/common.less'
import App from "./common/App";
import {Utils} from "./common";

const {Content, Footer} = Layout;

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            permissionsLoaded: false
        };
    }

    componentDidMount() {
        this.loadPermissions(0);
    }

    loadPermissions = () => {

        this.setState({
            permissionsLoaded: true
        });
        message.destroy();
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        let {collapsed} = this.state;

        return <Layout className="ant-layout-has-sider">
            <SiderCustom collapsed={collapsed}/>
            <Layout>
                <HeaderCustom toggle={this.toggle}/>
                <Content style={{margin: '0 16px', overflow: 'initial'}}>
                    {this.props.children}
                </Content>
                <Footer style={{textAlign: 'center'}}>
                </Footer>
            </Layout>
        </Layout>
    }
}
