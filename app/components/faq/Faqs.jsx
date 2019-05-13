import React from 'react'
import {App, U} from '../../common'
import {Button, Card, Dropdown, Icon, Menu, Modal, notification, Table} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom'
import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'

export default class Faqs extends React.Component {

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
        App.api('adm/faq/faqs').then((list) => {
            this.setState({
                list,
                loading: false
            });
        });
    };

    edit = faq => {
        App.go(`/app/ws/faq-edit/${faq.id}`)
    };

    remove = (faq, index) => {

        Modal.confirm({
            title: `确认删除?`,
            onOk() {
                App.api('adm/faq/remove', {
                        id: faq.id
                    }
                ).then(() => {

                    notification['success']({
                        message: '提示',
                        description: `${faq.title} 删除成功`,
                    });

                    let {list = []} = this.state;
                    this.setState({
                        list: U.array.remove(list, faq.index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.ws_faqs.txt}/>


            <Card bordered={false}>

                <div style={{marginBottom: '15px'}}>
                    <Button type="primary" icon="file-add" onClick={() => {
                        this.edit({id: 0})
                    }}>创建FAQ</Button>
                </div>

                <Table columns={[{
                    title: '标题',
                    dataIndex: 'title',
                    width: '300px',
                    className: 'txt-center',
                }, {
                    title: '创建时间',
                    dataIndex: 'createdAt',
                    className: 'txt-center',
                    width: '140px',
                    render: createdAt => U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    className: 'txt-center',
                    width: '140px',
                    render: (status) => {
                        let pub = status === 1;
                        return <div className='state'>
                            <span className={pub ? 'primary' : 'disabled'}>{pub ? '启用' : '已停用'}</span>
                        </div>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'opt',
                    className: 'txt-center',
                    width: '80px',
                    render: (obj, faq, index) => {
                        return <Dropdown overlay={<Menu>
                            <Menu.Item key="0">
                                <a onClick={() => this.edit(faq)}> 编辑 </a>
                            </Menu.Item>
                            <Menu.Item key="1">
                                <a onClick={() => this.remove(faq, index)}> 删除 </a>
                            </Menu.Item>

                        </Menu>} trigger={['click']}>
                            <a className="ant-dropdown-link">
                                操作<Icon type="down"/>
                            </a>
                        </Dropdown>

                    }
                }]} dataSource={list} rowKey={(record) => record.id} pagination={false} loading={loading}/>

            </Card>

        </div>
    }
}