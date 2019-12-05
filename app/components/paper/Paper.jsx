import React, {Component} from 'react';
import {App, CTYPE, U, Utils} from "../../common";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {Button, Table, Card, Dropdown, Menu, Icon, Row} from "antd";

class Paper extends Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            paper: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {pagination} = this.state;
        this.setState({loading: true});
        App.api('/oms/paper/paper_list', {
            paperQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        })
            .then((paper) => {
                let pagination = Utils.pager.convert2Pagination(paper);
                this.setState({
                    paper: paper.content,
                    loading: false,
                    pagination,
                });
            })
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    edit = paper => {
        App.go(`/app/paper/paperEdit/${paper.id}`)
    };

    preview = paper => {
        App.go(`/app/paper/paperPreview/${paper.id}`)
    };

    render() {

        let {paper = [], loading, pagination} = this.state;

        return <div>

            <BreadcrumbCustom first={CTYPE.link.paper.txt}/>

            <Card>
                <Row>
                    <Button type="primary" icon="user-add" onClick={() => {
                        this.edit({id: 0})
                    }}>新建试卷</Button>
                </Row>
                <div className='clearfix-h20'/>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '模板',
                        dataIndex: 'template.templateName',
                        className: 'txt-center',
                    }, {
                        title: '考试时长',
                        dataIndex: 'duration',
                        className: 'txt-center',
                    }, {
                        title: '总分数',
                        dataIndex: 'totalScore',
                        className: 'txt-center',
                    }, {
                        title: '及格分数',
                        dataIndex: 'passingScore',
                        className: 'txt-center',
                    }, {
                        title: '状态',
                        dataIndex: 'c-status',
                        className: 'txt-center',
                        render: (obj, c) => {
                            return <div className="state">
                                {c.status === 1 ? <span className="important">上架</span> :
                                    <span className="disabled">下架</span>}
                            </div>
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'opt',
                        className: 'txt-center',
                        width: '80px',
                        render: (obj, item, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(item)}>编辑</a>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <a onClick={() => this.preview(item)}>预览</a>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <a onClick={() => this.remove(item.id, index)}>下架</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }]}
                    rowKey={(item) => item.id}
                    dataSource={paper}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}
                    loading={loading}/>

            </Card>
        </div>
    }
}

export default Paper;