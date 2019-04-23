import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import CTYPE from "../common/CTYPE";
import {Utils} from "../common";

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: false
    };

    componentDidMount() {
        this.setMenuOpen();
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }

    getPostion = (str, cha, num) => {
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    };

    setMenuOpen = () => {

        let path = window.location.hash.split('#')[1];

        //兼容三层目录,三级页不修改，刷新时定位到一级
        let key = path.substr(0, path.lastIndexOf('/'));
        if (key.split('/').length > 3) {
            if (this.state.openKey)
                return;
            key = key.substring(0, this.getPostion(key, '/', 2));
        }

        this.setState({
            openKey: key,
            selectedKey: path
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline'
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false
        })
    };

    render() {

        let {
            ADMIN_LIST, ROLE_EDIT, TERM_EDIT, TRAINER_EDIT, TRAINEE_EDIT,
            BANNER_EDIT, ARTICLE_EDIT, QA_EDIT
        } = Utils.adminPermissions;

        let withSetting = TERM_EDIT;

        let withWS = BANNER_EDIT || ARTICLE_EDIT || QA_EDIT;


        let {firstHide, selectedKey, openKey} = this.state;

        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}>
                <div className={this.props.collapsed ? 'logo logo-s' : 'logo'}/>
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}>
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="home"/><span
                            className="nav-text">首页</span></Link>
                    </Menu.Item>

                    {TRAINER_EDIT && <SubMenu key='/app/trainer'
                                              title={<span><Icon type="solution"/><span
                                                  className="nav-text">讲师管理</span></span>}>
                        <Menu.Item key={CTYPE.link.trainers.key}><Link
                            to={CTYPE.link.trainers.path}>{CTYPE.link.trainers.txt}</Link></Menu.Item>
                    </SubMenu>}

                    {TRAINEE_EDIT && <SubMenu key='/app/trainee'
                                              title={<span><Icon type="usergroup-add"/><span
                                                  className="nav-text">学员管理</span></span>}>
                        <Menu.Item key={CTYPE.link.trainees.key}><Link
                            to={CTYPE.link.trainees.path}>{CTYPE.link.trainees.txt}</Link></Menu.Item>
                    </SubMenu>}

                    {withSetting && <SubMenu key='/app/setting'
                                             title={<span><Icon type="setting"/><span
                                                 className="nav-text">基础配置</span></span>}>
                        {TERM_EDIT && <Menu.Item key={CTYPE.link.terms.key}><Link
                            to={CTYPE.link.terms.path}>{CTYPE.link.terms.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {withWS && <SubMenu key='/app/ws'
                                        title={<span><Icon type="copy"/><span className="nav-text">网站管理</span></span>}>
                        {BANNER_EDIT && <Menu.Item key={CTYPE.link.info_banners.key}><Link
                            to={CTYPE.link.info_banners.path}>{CTYPE.link.info_banners.txt}</Link></Menu.Item>}
                        {ARTICLE_EDIT && <Menu.Item key={CTYPE.link.info_articles.key}><Link
                            to={CTYPE.link.info_articles.path}>{CTYPE.link.info_articles.txt}</Link></Menu.Item>}
                        {QA_EDIT && <Menu.Item key={CTYPE.link.info_qa_templates.key}><Link
                            to={CTYPE.link.info_qa_templates.path}>{CTYPE.link.info_qa_templates.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {ADMIN_LIST && <SubMenu key='/app/admin'
                                            title={<span><Icon type="usergroup-add"/><span
                                                className="nav-text">管理&权限</span></span>}>
                        <Menu.Item key={CTYPE.link.admin_admins.key}><Link
                            to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link></Menu.Item>
                        {ROLE_EDIT && <Menu.Item key={CTYPE.link.admin_roles.key}><Link
                            to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link></Menu.Item>}
                    </SubMenu>}

                </Menu>
                <style>
                    {`#nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }`}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;
