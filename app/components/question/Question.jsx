import React from 'react';
import {CTYPE, U, Utils} from "../../common";
import {
    Button, Modal, message, Table, Menu, Dropdown, Icon, Card, Tag, Select, Col, Row, Input, TreeSelect, Rate
} from 'antd';
import App from "../../common/App";
import "../../assets/css/test.scss"
import BreadcrumbCustom from "../BreadcrumbCustom"

const {Option} = Select;
const InputSearch = Input.Search;
const {TreeNode} = TreeSelect;

export default class Question extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            question: [],
            loading: false,
            list: [],
            type: 0,
            difficulty: 0,
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        this.loadData();
        this.loadProps();
    }

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    getQuery = () => {
        let {categoryId, type, difficulty, topic} = this.state;

        let query = {};
        query.type = type;
        query.topic = topic;
        query.categoryId = categoryId;
        query.difficulty = difficulty;
        return query;
    };

    loadProps = () => {
        App.api('/oms/category/categorys',{oms:false}).then((list) => {
            this.setState({list});
        });
    };

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        App.api('/oms/question/question_list', {
            questionQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((question) => {
            let pagination = Utils.pager.convert2Pagination(question);
            this.setState({
                question: question.content,
                loading: false,
                pagination
            });
        });
    };

    status = (item, index) => {
        Modal.confirm({
            title: `确认${item.status === 1 ? "停用" : "启用"}此项`,
            onOk: () => {
                App.api("/oms/question/status", {id: item.id}).then(() => {
                    message.success(`操作成功`);
                    this.loadData();
                })
            },
            onCancel() {
            }
        })
    };

    edit = question => {
        App.go(`/app/question/questionEdit/${question.id}`)
    };

    render() {

        let {question = [], loading, pagination, list = []} = this.state;
        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.question.txt}/>

            <Card>
                <Row>
                    <Button type="primary" icon="user-add" onClick={() => {
                        this.edit({id: 0})
                    }}>添加试题</Button>
                    <Col span={10} style={{float: 'right'}}>
                        <TreeSelect
                            style={{width: 105}}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="全部分类"
                            allowClear
                            onSelect={(value) => {
                                this.setState({
                                    categoryId: value, pagination: {
                                        ...pagination,
                                        current: 1
                                    }
                                }, () => {
                                    this.loadData();
                                })
                            }}>
                            {list.map((v, index1) => {
                                if (v.status === 1) {
                                    let {id, name, children = []} = v;
                                    return <TreeNode title={name} value={id} key={index1} disabled>
                                        {children.map((va, index2) => {
                                            if (va.status === 1) {
                                                let {id, name, children = []} = va;
                                                return <TreeNode title={name} value={id} key={`${index1}-${index2}`} disabled>
                                                    {children.map((val, index3) => {
                                                        if (val.status === 1) {
                                                            let {id, name} = val;
                                                            return <TreeNode title={name} value={id}
                                                                             key={`${index1}-${index2}-${index3}`}/>
                                                        }
                                                    })}
                                                </TreeNode>
                                            }
                                        })}
                                    </TreeNode>
                                }
                            })}
                        </TreeSelect>
                        &nbsp;
                        <Select placeholder="全部类型" onSelect={(value) => {
                            this.setState({
                                type: value, pagination: {
                                    ...pagination,
                                    current: 1
                                }
                            }, () => {
                                this.loadData();
                            })
                        }} style={{width: 105}}>
                            <Option value={0}>全部类型</Option>
                            {CTYPE.options.map((k, index) => {
                                return <Option value={k.type} key={CTYPE.options}>{k.label}</Option>
                            })}
                        </Select>
                        &nbsp;
                        <Select placeholder="全部难度" onSelect={(value) => {
                            this.setState({
                                difficulty: value, pagination: {
                                    ...pagination,
                                    current: 1
                                }
                            }, () => {
                                this.loadData();
                            })
                        }} style={{width: 105}}>
                            <Option value={0}>全部难度</Option>
                            <Option value={1}>一星</Option>
                            <Option value={2}>二星</Option>
                            <Option value={3}>三星</Option>
                        </Select>
                        &nbsp;
                        <InputSearch
                            placeholder="输入题目查询"
                            style={{width: 150}}
                            onSearch={(v) => {
                                this.setState({
                                    topic: v, search: true, pagination: {
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
                        render: (col, row, i) => ((pagination.current - 1) * pagination.pageSize) + (i + 1)
                        // render: (text, item, i) => i + 1
                    }, {
                        title: '分类',
                        dataIndex: 'category.name',
                        className: 'txt-center',
                    }, {
                        title: '题目',
                        dataIndex: 'topic',
                        className: 'txt-center',
                        ellipsis: true,
                    }, {
                        title: '类型',
                        dataIndex: 't-type',
                        className: 'txt-center',
                        render: (ob, t) => {
                            return <div className="state">
                                {t.type === 1 ? <span>单选</span> : t.type === 2 ? <span>多选</span> : t.type === 3 ?
                                    <span>判断</span> : t.type === 4 ? <span>填空</span> : <span>问答</span>}
                            </div>
                        }
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
                        title: '标签',
                        dataIndex: 'tag',
                        className: 'txt-center',
                        width: "150px",
                        render: (tag = []) => {
                            return <div className='state'>
                                {tag.map((p, i) => {
                                    return <Tag color={"red"} key={i}>{p.name}</Tag>
                                })}
                            </div>
                        }
                    }, {
                        title: '状态',
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
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        width: "150px",
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm');
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (text, item, index) => {
                            return <Dropdown overlay={
                                <Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(item)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.status(item, index)}>
                                            {item.status === 1 ? <span>停用</span> :
                                                <span>启用</span>}
                                        </a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                <a className={"ant-dropdown-link"}>
                                    操作<Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }
                    ]}
                    rowkey={item => item.index}
                    dataSource={question}
                    loading={loading}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}
                />
            </Card>

        </div>
    }

}
