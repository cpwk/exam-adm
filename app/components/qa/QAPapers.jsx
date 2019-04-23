import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Input, Menu, message, Modal, Row, Select, Table, Tooltip} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import Utils from "../../common/Utils";

const InputSearch = Input.Search;
const Option = Select.Option;

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
            loading: false
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        App.api('adm/qa/qaPapers', {
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

    doExport = () => {
        Utils.exportExcel.doExport('trainees', this.getQuery());
    };

    render() {

        let {terms = [], list = [], pagination = {}, loading, q} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.trainees.txt}/>

            <Card>
                <Row>
                    <Col span={12}>
                        <Button type="primary" icon="user-add" onClick={() => {
                            this.edit({id: 0})
                        }}>添加学员</Button>
                        <Button type='primary' onClick={this.doExport}>导出</Button>
                        &nbsp;&nbsp;<Tooltip
                        title="选择学期后可以导出该学期学员"><Icon type='question-circle'/></Tooltip>
                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Select onSelect={(term) => {
                            this.setState({term});
                        }} defaultValue={0} style={{width: 150}}>
                            <Option value={0}>全部学期</Option>
                            {terms.map((t, i) => {
                                return <Option key={i} value={t.sequence}>{t.asStr}</Option>
                            })}
                        </Select>
                        &nbsp;
                        <Select onSelect={(status) => {
                            this.setState({status});
                        }} defaultValue={0} style={{width: 100}}>
                            <Option value={0}>全部状态</Option>
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
                        title: '学期',
                        dataIndex: 'term',
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
