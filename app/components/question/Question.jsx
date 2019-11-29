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
            q: '',
            list: [],
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
        let {value, type, difficulty, topic} = this.state;

        let query = {};
        query.type = type;
        query.topic = topic;
        query.categoryId = value;
        query.difficulty = difficulty;
        return query;
    };

    loadProps = () => {
        App.api('/oms/category/father').then((list) => {
            this.setState({list});
            console.log(list);
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

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除此项？`,
            onOk: () => {
                App.api("/oms/question/delete", {id}).then(() => {
                    message.success(`删除成功`);
                    let question = this.state.question;
                    this.setState({
                        question: U.array.remove(question, index)
                    })
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
                            // showSearch
                            style={{width: 105}}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="全部分类"
                            allowClear
                            onSelect={(value) => {
                                this.setState({value});
                                console.log(value);
                            }}>
                            {list.map((v, index1) => {
                                let {id, name, children = []} = v;
                                return <TreeNode title={name} value={id} key={index1}>
                                    {children.map((va, index2) => {
                                        let {id, name, children = []} = va;
                                        return <TreeNode key={`${index1}-${index2}`} value={id} title={name}>
                                            {children.map((val, index3) => {
                                                let {id, name} = val;
                                                return <TreeNode title={name} value={id}
                                                                 key={`${index1}-${index2}-${index3}`}/>
                                            })}
                                        </TreeNode>
                                    })}
                                </TreeNode>
                            })}
                        </TreeSelect>
                        &nbsp;
                        <Select placeholder="全部类型" onSelect={(type) => {
                            this.setState({type});
                        }} style={{width: 105}}>
                            <Option value={1}>单选</Option>
                            <Option value={2}>多选</Option>
                            <Option value={3}>填空</Option>
                            <Option value={4}>问答</Option>
                        </Select>
                        &nbsp;
                        <Select placeholder="全部难度" onSelect={(difficulty) => {
                            this.setState({difficulty});
                        }} style={{width: 105}}>
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
                        render: (text, item, i) => i + 1
                    }, {
                        title: '分类',
                        dataIndex: 'categoryName.name',
                        className: 'txt-center',
                        ellipsis: true,
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
                                {t.type === 1 && <span>单选</span>}
                                {t.type === 2 && <span>多选</span>}
                                {t.type === 3 && <span>填空</span>}
                                {t.type === 4 && <span>问答</span>}
                            </div>
                        }
                    }, {
                        title: '难度',
                        dataIndex: 'd-difficulty',
                        className: 'txt-center',
                        width:"130px",
                        render: (ob, d) => {
                            return <div className="state">
                                    <Rate disabled count={d.difficulty} defaultValue={d.difficulty}/>
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
                                    console.log(tag);
                                    return <Tag color={"red"} key={i}>{p.name}</Tag>
                                })}
                            </div>
                        }
                    }, {
                        title: '启用',
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
                                        <a onClick={() => this.remove(item.id, index)}>删除</a>
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
