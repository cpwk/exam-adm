import React from 'react';
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Switch, Table} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, Utils} from "../../common";

const minY = new Date().getFullYear();

export default class QATemplates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,

            list: []

        }
    }

    componentDidMount() {
        this.loadData();
    }


    loadData = () => {
        this.setState({loading: true});
        let p = this.state.pagination;
        Utils.nProgress.start();
        App.api('adm/qa/qaTemplates').then((list) => {
            this.setState({
                list, loading: false
            });
            Utils.nProgress.done();
        });
    };

    edit = group => {
        App.go(`/app/ws/qa-template-edit/${group.id}`)
    };

    modEnabled = (qaTemplate, index, chk) => {
        let _this = this;
        let opt = chk ? '上架' : '下架';
        Modal.confirm({
            title: `确认${opt}?`,
            onOk() {
                let status = chk ? 1 : 2;
                App.api('adm/qa/status_qaTemplate', {
                    id: qaTemplate.id, status
                }).then(() => {
                    message.success('已' + opt);
                    let {list = []} = _this.state;
                    list[index].status = status;
                    _this.setState({list});
                });
            }
        });
    };

    render() {

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.info_qa_templates.txt}/>

            <Card>

                <div style={{marginBottom: '10px', height: '30px'}}>
                    <Button type={'primary'} onClick={() => {
                        this.edit({id: 0})
                    }}>添加</Button>
                </div>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        width: '60px',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '名称',
                        dataIndex: 'title',
                        className: 'txt-center'
                    }, {
                        title: '简介',
                        dataIndex: 'descr',
                        className: 'txt-center'
                    }, {
                        title: '条目数',
                        dataIndex: 'items',
                        className: 'txt-center',
                        render: (items) => {
                            return items.length;
                        }
                    }, {
                        title: '上下架',
                        dataIndex: 'status',
                        className: 'txt-center',
                        width: '80px',
                        render: (status, item, index) => {
                            return <Switch checked={status === 1} onChange={(chk) => {
                                this.modEnabled(item, index, chk);
                            }}/>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'opt',
                        className: 'txt-center',
                        width: '80px',
                        render: (obj, qaTemplate, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(qaTemplate)}>编辑</a>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <a onClick={() => App.go(`/app/ws/qa-papers/${qaTemplate.id}`)}>反馈列表</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }]}
                    rowKey={(item) => item.id} dataSource={list} pagination={false} loading={loading}/>
            </Card>
        </div>
    }
}
