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

        let {QUESTION_EDIT, CATEGORY_EDIT, ROLE_EDIT, ADMIN_LIST, TAG_EDIT, USER_EDIT, BANNER_EDIT, PAPER_EDIT, TEMPLATE_EDIT, ADMIN_EDIT} = Utils.adminPermissions;

        let questionBank = QUESTION_EDIT || CATEGORY_EDIT || TAG_EDIT;

        let paper = PAPER_EDIT || TEMPLATE_EDIT;

        let setting = BANNER_EDIT;

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
                    {questionBank &&
                    <SubMenu key='/app/question'
                             title={<span><Icon type="solution"/><span
                                 className="nav-text">题库管理</span></span>}>
                        {CATEGORY_EDIT && <Menu.Item key={CTYPE.link.category.key}><Link
                            to={CTYPE.link.category.path}>{CTYPE.link.category.txt}</Link></Menu.Item>}
                        {QUESTION_EDIT && <Menu.Item key={CTYPE.link.question.key}><Link
                            to={CTYPE.link.question.path}>{CTYPE.link.question.txt}</Link></Menu.Item>}
                        {TAG_EDIT && <Menu.Item key={CTYPE.link.tag.key}><Link
                            to={CTYPE.link.tag.path}>{CTYPE.link.tag.txt}</Link></Menu.Item>}
                    </SubMenu>}
                    {paper && <SubMenu key='/app/template'
                                       title={<span><Icon type="solution"/><span
                                           className="nav-text">试卷管理</span></span>}>
                        {TEMPLATE_EDIT && <Menu.Item key={CTYPE.link.template.key}><Link
                            to={CTYPE.link.template.path}>{CTYPE.link.template.txt}</Link></Menu.Item>}
                        {PAPER_EDIT && <Menu.Item key={CTYPE.link.paper.key}><Link
                            to={CTYPE.link.paper.path}>{CTYPE.link.paper.txt}</Link></Menu.Item>}
                    </SubMenu>}
                    {USER_EDIT && <SubMenu key='/app/user'
                                           title={<span><Icon type="setting"/><span
                                               className="nav-text">用户管理</span></span>}>
                        <Menu.Item key={CTYPE.link.user.key}><Link
                            to={CTYPE.link.user.path}>{CTYPE.link.user.txt}</Link></Menu.Item>
                    </SubMenu>}
                    {setting && <SubMenu key='/app/banner'
                                         title={<span><Icon type="setting"/><span
                                             className="nav-text">网站管理</span></span>}>
                        {BANNER_EDIT && <Menu.Item key={CTYPE.link.pc.key}><Link
                            to={CTYPE.link.pc.path}>{CTYPE.link.pc.txt}</Link></Menu.Item>}
                    </SubMenu>}
                    {ADMIN_LIST && <SubMenu key='/app/admin'
                                            title={<span><Icon type="usergroup-add"/><span
                                                className="nav-text">管理&权限</span></span>}>
                        {ADMIN_EDIT && <Menu.Item key={CTYPE.link.admin_admins.key}><Link
                            to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link></Menu.Item>}
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
