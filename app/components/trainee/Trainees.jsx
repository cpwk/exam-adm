import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Input, Menu, message, Modal, Row, Select, Table} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import TraineeUtils from "./TraineeUtils";
import Utils from "../../common/Utils";

const InputSearch = Input.Search;
const Option = Select.Option;

export default class Trainees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            status: 0,
            key: 'name',
            q: '',

            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: TraineeUtils.getCurrentPage(),
                total: 0,
            },
            loading: false
        }
    }

    componentDidMount() {
        this.loadData();
    }

    getQuery = () => {
        let {status, search, q, key} = this.state;

        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                if (key === 'name') {
                    query = {name: q};
                } else if (key === 'mobile') {
                    query = {mobile: q};
                } else if (key === 'idnumber') {
                    query = {idnumber: q};
                }
            }
        }
        query.status = status;
        return query;
    };

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        App.api('adm/trainee/trainees', {
            traineeQo: JSON.stringify({
                ...this.getQuery(),
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

    edit = trainee => {
        App.go(`/app/trainee/trainee-edit/${trainee.id}`)
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/trainee/remove_trainee', {id}).then(() => {
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

    render() {

        let {list = [], pagination = {}, loading, q} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.trainees.txt}/>

            <Card>
                <Row>
                    <Col span={12}>
                        <Button type="primary" icon="user-add" onClick={() => {
                            this.edit({id: 0})
                        }}>添加学员</Button>
                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Select rowKey={(record, index) => index} onSelect={(status) => {
                            this.setState({status});
                        }} defaultValue={0} style={{width: 100}}>
                            <Option value={0}>全部</Option>
                            <Option value={1}>在校</Option>
                            <Option value={2}>毕业</Option>
                        </Select>
                        &nbsp;
                        <Select rowKey={(record, index) => index} onSelect={(key) => {
                            this.setState({key});
                        }} defaultValue='name' style={{width: 100}}>
                            <Option value="name">姓名</Option>
                            <Option value="mobile">手机号</Option>
                            <Option value="idnumber">身份证号码</Option>
                        </Select>
                        &nbsp;
                        <InputSearch
                            placeholder="输入内容查询"
                            style={{width: 200}}
                            value={q}
                            onChange={(e) => {
                                this.setState({q: e.target.value});
                            }}
                            onSearch={(v) => {
                                this.setState({
                                    q: v, search: true, pagination: {
                                        ...pagination,
                                        current: 1
                                    }
                                }, () => {
                                    this.loadData()
                                });
                            }}/>
                    </Col>
                </Row>

                <div className='clearfix-h20'/>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '姓名',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '手机号',
                        dataIndex: 'mobile',
                        className: 'txt-center'
                    }, {
                        title: '入校日期',
                        dataIndex: 'admissionAt',
                        className: 'txt-center',
                        render: (admissionAt) => {
                            return U.date.format(new Date(admissionAt), 'yyyy-MM-dd')
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'inSchool',
                        className: 'txt-center',
                        render: (inSchool) => {
                            return <div className="state">
                                {inSchool === 1 ? <span>在校</span> : <span className="warning">毕业</span>}</div>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, trainee, index) => {
                            let {id} = trainee;
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(trainee)}>编辑</a>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <a onClick={() => this.remove(id, index)}>删除</a>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <a onClick={() => TraineeUtils.traineePwd(trainee)}>重置密码</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="3">
                                    <a onClick={() => TraineeUtils.traineeSessions(id)}>登录日志</a>
                                </Menu.Item>
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
        </div>
    }
}
