import React from 'react'

import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'

import PartnerUtils from "./PartnerUtils";

export default class Partners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

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
        App.api('adm/partner/partners', {partnerQo: JSON.stringify({})}).then((partners) => {
                Utils.nProgress.done();
                this.setState({
                    list: partners, loading: false
                });
            }
        );
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/partner/remove', {id}).then(() => {
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

    edit = (partner) => {
        PartnerUtils.edit(partner, this.loadData);
    };

    render() {

        let {list = [], loading} = this.state;

        let imgs = [];
        list.map((item) => {
            imgs.push(item.img);
        });

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.ws_partners.txt}/>

            <Card bordered={false}>

                <div style={{marginBottom: 15}}>
                    <Button type="primary" icon="file-add" onClick={() => {
                        this.edit({id: 0})
                    }}>添加合作伙伴</Button>
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
                        return <img key={img} className='partner-img' src={img + '@!120-120'} onClick={() => {
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
                    render: (obj, partner, index) => {

                        return <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                                <a onClick={() => this.edit(partner)}>编辑</a>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="2">
                                <a onClick={() => this.remove(partner.id, index)}>删除</a>
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