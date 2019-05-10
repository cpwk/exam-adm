import React from 'react'

import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table, Tabs} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'

import JobUtils from "./JobUtils";

const TabPane = Tabs.TabPane;

export default class Jobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            list: [],
            loading: false,

            jobTypes: []
        };
    }

    componentDidMount() {
        this.loadData();
        App.api('adm/job/jobTypes').then((jobTypes) => {
            this.setState({jobTypes});
        });
    }

    loadData = () => {
        this.setState({loading: true});
        Utils.nProgress.start();
        let {type} = this.state;
        App.api('adm/job/jobs', {jobQo: JSON.stringify({type})}).then((jobs) => {
                Utils.nProgress.done();
                this.setState({
                    list: jobs, loading: false
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
                App.api('adm/job/remove', {id}).then(() => {
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

    edit = (job) => {
        JobUtils.edit(job, this.loadData);
    };

    render() {

        let {type, list = [], loading, jobTypes = []} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.ws_jobs.txt}/>


            <Card bordered={false}>

                <Tabs onChange={this.tabClick} activeKey={type.toString()}>
                    {jobTypes.map((t, i) => {
                        return <TabPane tab={t.val} key={t.key}/>
                    })}
                </Tabs>

                <div style={{marginBottom: 15}}>
                    <Button type="primary" icon="file-add" onClick={() => {
                        this.edit({id: 0, type})
                    }}>新建职位</Button>
                </div>

                <Table columns={[{
                    title: '排序',
                    dataIndex: 'priority',
                    className: 'txt-center',
                    width: '60px',
                    render: priority => priority
                }, {
                    title: '名称',
                    dataIndex: 'title',
                    className: 'txt-center'
                }, {
                    title: '薪资',
                    dataIndex: 'pay',
                    className: 'txt-center',
                    width: '200px'
                }, {
                    title: '区域',
                    dataIndex: 'location',
                    className: 'txt-center',
                    width: '120px'
                }, {
                    title: '上架',
                    dataIndex: 'c-state',
                    className: 'txt-center',
                    width: '100px',
                    render: (obj, c) => {
                        return <div className="state">
                            {c.status === 1 ? <span className="important">上架</span> :
                                <span className="disabled">下架</span>}
                        </div>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'opt',
                    className: 'txt-center',
                    width: '80px',
                    render: (obj, job, index) => {

                        return <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                                <a onClick={() => this.edit(job)}>编辑</a>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="2">
                                <a onClick={() => this.remove(job.id, index)}>删除</a>
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