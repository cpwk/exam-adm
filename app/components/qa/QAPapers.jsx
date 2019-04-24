import React from 'react';
import {Button, Card, Drawer, Dropdown, Icon, Menu, message, Modal, Table, Tabs} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import Utils from "../../common/Utils";
import QAUtils from "./QAUtils";
import '../../assets/css/qa/qa-paper.less'

const TabPane = Tabs.TabPane;

const statusTypes = QAUtils.statusTypes;

export default class QAPapers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            id: parseInt(this.props.match.params.id),

            status: 0,

            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0,
            },
            loading: false,

            show_drawer: false,
            paper: {}
        }
    }

    componentDidMount() {
        this.loadData();
        Utils.addr.loadRegion(this);
    }

    loadData = () => {
        let {pagination = {}, status, id} = this.state;
        this.setState({loading: true});
        App.api('adm/qa/qaPapers', {
            qaPaperQo: JSON.stringify({
                tplId: id,
                status,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/qa/remove_qaPaper', {id}).then(() => {
                    message.success('删除成功');
                    let {list = []} = this.state;
                    this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    statusQAPaper = (paper, status) => {
        Modal.confirm({
            title: `确认${status === 2 ? '标记已处理' : '废弃'}?`,
            onOk: () => {
                let {id, index} = paper;
                App.api('adm/qa/status_qaPaper', {id, status}).then(() => {
                    message.success('操作成功');
                    let {paper = {}, list = []} = this.state;
                    list[index].status = status;
                    paper.status = status;
                    this.setState({paper, list});
                })
            },
            onCancel() {
            },
        });
    };

    doExport = () => {
        let {status, id} = this.state;
        Utils.exportExcel.doExport('qas', {tplId: id, status});
    };

    tabClick = v => {
        let {pagination} = this.state;
        this.setState({
            status: parseInt(v),
            pagination: {
                ...pagination,
                pageNumber: 0
            },
            list: []
        }, () => {
            this.loadData();
        });
    };

    showDrawer = (val, paper) => {
        this.setState({show_drawer: val || false, paper});
    };

    render() {

        let {status, list = [], pagination = {}, loading, show_drawer, paper = {}} = this.state;

        let {items = []} = paper;

        list.map((item, index) => {
            item.index = index;
        });

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.ws_qa_templates.txt}/>

            <Card>

                <Tabs onChange={this.tabClick} activeKey={status.toString()}
                      tabBarExtraContent={<Button type='primary' onClick={this.doExport}>导出</Button>}>
                    {statusTypes.map((t, i) => {
                        return <TabPane tab={t.v} key={t.k}/>
                    })}
                </Tabs>

                <div className='clearfix-h20'/>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '预览',
                        dataIndex: 'items',
                        className: 'txt-center',
                        render: (items, item) => {
                            return <a onClick={() => this.showDrawer(true, item)}>预览</a>
                        }
                    }, {
                        title: '提交时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')
                        }
                    }, {
                        title: '处理时间',
                        dataIndex: 'dealAt',
                        className: 'txt-center',
                        render: (dealAt, item) => {
                            let {status} = item;
                            return status === 1 ? '-/-' : U.date.format(new Date(dealAt), 'yyyy-MM-dd HH:mm:ss')
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            let str = statusTypes.find(item => item.k === status).v;
                            return <div className="state">
                                {status !== 1 ? <span>{str}</span> : <span className="warning">{str}</span>}</div>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, paper, index) => {
                            let {id, status} = paper;
                            return <Dropdown overlay={<Menu>
                                {status === 3 && <Menu.Item key="2">
                                    <a onClick={() => this.remove(id, index)}>删除</a>
                                </Menu.Item>}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    loading={loading} onChange={this.handleTableChange}/>
            </Card>

            <Drawer
                title="表单内容"
                placement="right"
                width={700}
                closable={true}
                onClose={() => this.showDrawer(false)}
                visible={show_drawer}>
                <div className='qa-paper-drawer'>
                    <ul>
                        {items.map((item, index) => {
                            let {question, values = [], type} = item;

                            if (type !== 'tip') {
                                let str = '';
                                if (type === 'city') {
                                    str = (values.length > 0 && values[0].length === 6) ? Utils.addr.getPCD(values[0]) : "";
                                } else if (type === 'date') {
                                    if (values.length > 0) {
                                        str = U.date.format(new Date(values[0]), 'yyyy-MM-dd');
                                    }
                                } else if (type === 'mselect') {
                                    str = values.join(',');
                                } else {
                                    str = values.length > 0 ? values[0] : '';
                                }
                                return <li key={index}>
                                    <div className='header'>{question}</div>
                                    <div className='content'>{str}</div>
                                </li>
                            }
                        })}
                    </ul>

                    <div className='btm-btn'>
                        <Button onClick={() => this.showDrawer(false)} style={{marginRight: 8}}>
                            关闭
                        </Button>
                        {paper.status === 1 &&
                        <Button onClick={() => this.statusQAPaper(paper, 2)} style={{marginRight: 8}} type="primary">
                            我已处理
                        </Button>}
                        {paper.status === 1 && <Button onClick={() => this.statusQAPaper(paper, 3)} type="danger">
                            废弃
                        </Button>}
                    </div>
                </div>
            </Drawer>
        </div>
    }
}