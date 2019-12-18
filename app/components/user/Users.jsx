import React, {Component} from 'react';
import {App, CTYPE, Utils} from "../../common";
import {Dropdown, Icon, Menu, Table, Modal, message, Row, Col, Select, Card} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";

const {Option} = Select;

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
            users: [],
            loading: false,
            status:0
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        App.api('oms/user/users', {
            userQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((users) => {
            let pagination = Utils.pager.convert2Pagination(users);
            this.setState({
                users: users.content,
                loading: false,
                pagination
            })
        })
    };

    getQuery = () => {
        let {status} = this.state;

        let query = {};
        query.status = status;
        return query;
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    status = (item, index) => {
        Modal.confirm({
            title: `确认${item.status === 1 ? "封禁" : "解禁"}此帐户`,
            onOk: () => {
                App.api("/oms/user/status", {id: item.id}).then(() => {
                    message.success(`操作成功`);
                    this.loadData();
                })
            },
            onCancel() {

            }
        })
    };


    render() {
        let {users = [], pagination, loading} = this.state;

        return <div>

            <BreadcrumbCustom first={CTYPE.link.user.txt}/>

            <Card>

                <Row>
                    <Col style={{float: 'right'}}>
                        <Select placeholder="全部状态"
                                onSelect={(value) => {
                                    this.setState({
                                        status: value, pagination: {
                                            ...pagination,
                                            current: 1
                                        }
                                    }, () => {
                                        this.loadData();
                                    })
                                }}
                                style={{width: 105}}>
                            <Option value={0}>全部状态</Option>
                            <Option value={1}>正常</Option>
                            <Option value={2}>封禁</Option>
                        </Select>
                    </Col>
                </Row>

                <div className='clearfix-h20'/>

                <Table
                    columns={[{
                        title: "序号",
                        dataIndex: "id",
                        className: "txt-center",
                        render: (text, item, i) => i + 1
                    }, {
                        title: "头像",
                        dataIndex: "avatar",
                        className: "txt-center",
                        render: (avatar, item, index) => {
                            return <img key={avatar} className='article-img' src={avatar + '@!40-40'}/>
                        }
                    }, {
                        title: "用户名",
                        dataIndex: "username",
                        className: "txt-center",
                    }, {
                        title: "手机号",
                        dataIndex: "mobile",
                        className: "txt-center",
                    }, {
                        title: '状态',
                        dataIndex: 'c-status',
                        className: 'txt-center',
                        render: (obj, c) => {
                            return <div className="state">
                                {c.status === 1 ? <span className="important">正常</span> :
                                    <span className="disabled">封禁</span>}
                            </div>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (text, item, index) => {
                            return <Dropdown overlay={
                                <Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(item)}>查看详情</a>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.status(item, index)}>
                                            {item.status === 1 ? <span>封禁</span> :
                                                <span>解禁</span>}
                                        </a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                <a className={"ant-dropdown-link"}>
                                    操作<Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }]}
                    rowkey={item => item.index}
                    dataSource={users}
                    loading={loading}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}/>
            </Card>
        </div>
    }
}

export default Users;