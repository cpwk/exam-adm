import React from 'react'

import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Tabs} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'

import BannerUtils from "./BannerUtils";

const TabPane = Tabs.TabPane;

export default class Banners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,

            list: [],
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        Utils.nProgress.start();
        let {type} = this.state;
        App.api('adm/banner/banners', {bannerQo: JSON.stringify({type})}).then((banners) => {
                Utils.nProgress.done();
                this.setState({
                    list: banners, loading: false
                });
            }
        );
    };

    tabClick = v => {
        this.setState({
            type: parseInt(v),
            list: []
        }, () => {
            this.loadData();
        });
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/banner/remove', {id}).then(() => {
                    message.success('删除成功');
                    let list = _this.state.list;
                    _this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    edit = (banner) => {
        BannerUtils.edit(banner, this.loadData);
    };

    render() {

        let {type, list = [], loading} = this.state;

        let imgs = [];
        list.map((item) => {
            imgs.push(item.img);
        });

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.ws_banners.txt}/>

            <Card bordered={false}>

                <Tabs onChange={this.tabClick} activeKey={type.toString()}>
                    {CTYPE.bannerTypes.map((t, i) => {
                        return <TabPane tab={t.label} key={t.type}/>
                    })}
                </Tabs>

                <div style={{marginBottom: 15}}>
                    <Button type="primary" icon="file-add" onClick={() => {
                        this.edit({id: 0, type})
                    }}>新建Banner</Button>
                </div>

                <Table columns={[{
                    title: '排序',
                    dataIndex: 'priority',
                    className: 'txt-center',
                    width: '60px',
                    render: priority => priority
                }, {
                    title: '图片',
                    dataIndex: 'img',
                    className: 'txt-center',
                    width: '80px',
                    render: (img, item, index) => {
                        return <img key={img} className='banner-img' src={img + '@!120-120'} onClick={() => {
                            Utils.common.showImgLightbox(imgs, index);
                        }}/>
                    }
                }, {
                    title: '名称',
                    dataIndex: 'title',
                    className: 'txt-center',
                    width: '120px'
                }, {
                    title: 'URL',
                    dataIndex: 'url',
                    className: 'txt-center',
                    render: (url) => {
                        return U.str.isNotEmpty(url) ? <a href={url} target='_blank'>{url}</a> : '';
                    }
                }, {
                    title: '启用',
                    dataIndex: 'c-status',
                    className: 'txt-center',
                    width: '100px',
                    render: (obj, c) => {
                        return <div className="state">
                            {c.status === 1 ? <span className="important">启用</span> :
                                <span className="disabled">停用</span>}
                        </div>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'opt',
                    className: 'txt-center',
                    width: '80px',
                    render: (obj, banner, index) => {

                        return <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                                <a onClick={() => this.edit(banner)}>编辑</a>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="2">
                                <a onClick={() => this.remove(banner.id, index)}>删除</a>
                            </Menu.Item>
                        </Menu>} trigger={['click']}>
                            <a className="ant-dropdown-link">操作 <Icon type="down"/>
                            </a>
                        </Dropdown>
                    }
                }]} rowKey={(record) => record.id} dataSource={list} loading={loading} pagination={false}/>
            </Card>

        </div>
    }
}