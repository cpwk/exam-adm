import React, {Component} from 'react';
import BreadcrumbCustom from "../BreadcrumbCustom";
import {CTYPE, App, U, Utils} from "../../common";
import {Button, Table, Card, Dropdown, Menu, Rate, Icon, Modal, message, Select, Col, Row, Input} from "antd";
import TemplateUtils from "./TemplateUtils";

const {Option} = Select;
const InputSearch = Input.Search;

class Template extends Component {

    constructor() {
        super();
        this.state = {
            loading: false,
            template: [],
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
        App.api('/oms/template/template_list', {
            templateQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((template) => {
            let pagination = Utils.pager.convert2Pagination(template);
            this.setState({
                template: template.content,
                loading: false,
                pagination
            });
        })
    };

    edit = template => {
        App.go(`/app/template/templateEdit/${template.id}`)
    };

    preview = template => {
        App.go(`/app/template/templatePreview/${template.id}`)
    };

    details = (template) => {
        TemplateUtils.edit(template, this.loadData);
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除此项？`,
            onOk: () => {
                App.api("/oms/template/delete", {id}).then(() => {
                    message.success(`删除成功`);
                    this.loadData();
                })
            },
            onCancel() {

            }
        })
    };


    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    getQuery = () => {
        let {templateName, status} = this.state;

        let query = {};
        query.templateName = templateName;
        query.status = status;
        return query;
    };

    render() {

        let {template = [], loading, pagination} = this.state;

        return <div>

            <BreadcrumbCustom first={CTYPE.link.template.txt}/>

            <Card>
                <Row>
                    <Button type="primary" icon="user-add" onClick={() => {
                        this.edit({id: 0})
                    }}>新建模板</Button>
                    <Col style={{float: 'right'}}>
                        <Select placeholder="状态查询" onSelect={(status) => {
                            this.setState({status});
                        }} style={{width: 105}}>
                            <Option value={1}>已上架</Option>
                            <Option value={2}>未上架</Option>
                        </Select>
                        &nbsp;
                        <InputSearch
                            placeholder="输入模板名称查询"
                            style={{width: 150}}
                            onSearch={(v) => {
                                this.setState({
                                    templateName: v, search: true, pagination: {
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
                        title: '名称',
                        dataIndex: 'templateName',
                        className: 'txt-center'
                    }, {
                        title: '难度',
                        dataIndex: 'd-difficulty',
                        className: 'txt-center',
                        render: (ob, d) => {
                            return <div className="state">
                                <Rate style={{fontSize: 14}} disabled count={d.difficulty} defaultValue={d.difficulty}/>
                            </div>
                        }
                    }, {
                        title: '详情',
                        dataIndex: 'content',
                        className: 'txt-center',
                        render: (obj, item) => {
                            return <div className="state">
                                <a onClick={() => {
                                    this.details(item);
                                }}>查看</a>
                            </div>
                        }
                    }, {
                        title: '总分',
                        dataIndex: 'totalScore',
                        className: 'txt-center'
                    }, {
                        title: '及格分',
                        dataIndex: 'passingScore',
                        className: 'txt-center'
                    }, {
                        title: '时长',
                        dataIndex: 'duration',
                        className: 'txt-center',
                        render: (duration) => {
                            return <div>
                                {<span>{duration + "/分钟"}</span>}
                            </div>
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        width: "150px",
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'c-status',
                        className: 'txt-center',
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
                        render: (obj, item, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(item)}>编辑</a>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <a onClick={() => this.preview(item)}>预览</a>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <a onClick={() => this.remove(item.id, index)}>停用</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }]}
                    rowKey={(item) => item.id}
                    dataSource={template}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}
                    loading={loading}/>

            </Card>
        </div>
    }
}

export default Template;