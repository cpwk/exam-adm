import React from 'react';
import {CTYPE, U, Utils} from "../../common";
import {Button, Modal, message, Table, Menu, Dropdown, Icon, Card} from 'antd';
import App from "../../common/App";
import "../../assets/css/test.scss"
import BreadcrumbCustom from "../BreadcrumbCustom"
import CategoryUtils from "./CategoryUtils";


export default class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    loadData = () => {
        let {pagination = {}} = this.state;

        this.setState({loading: true});
        App.api('/oms/category/father', {
            categoryQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        })
            .then((list) => {
                let pagination = Utils.pager.convert2Pagination(list);
                this.setState({
                    list,
                    loading: false,
                    pagination
                });
            });
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除此项？`,
            onOk: () => {
                App.api("/oms/category/delete", {id}).then(() => {
                    message.success(`删除成功`);
                    let list = this.state.list;
                    this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {

            }
        })
    };

    edit = (category) => {
        CategoryUtils.edit(category, this.loadData);
    };

    edit1 = (category) => {
        CategoryUtils.edit(category, this.loadData);
    };


    render() {

        let {list = [], loading, pagination} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.category.txt}/>

            <Card>

                <div style={{marginBottom: '10px', height: '30px'}}>
                    <Button type="primary" icon="user-add" onClick={() => {
                        this.edit()
                    }}>新建一级分类</Button>
                </div>

                <Table
                    columns={[{
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        width: '25%',
                    }, {
                        title: '权重',
                        dataIndex: 'priority',
                        className: 'txt-center',
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (updatedAt) => {
                            return U.date.format(new Date(updatedAt), 'yyyy-MM-dd/HH:mm');
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
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, category, index) => {

                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(category)}>编辑</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="2">
                                    <a onClick={() => this.edit1({pId: category.id})}>新建子分类</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="3">
                                    <a onClick={() => this.remove(category.id, index)}>删除</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }]}
                    rowkey={item => item.index}
                    dataSource={list}
                    loading={loading}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}/>
            </Card>
        </div>
    }

}
