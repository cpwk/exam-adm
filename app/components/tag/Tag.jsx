import React from 'react';
import {CTYPE, U} from "../../common";
import {Button, Modal, message, Table, Menu, Dropdown, Icon, Card} from 'antd';
import App from "../../common/App";
import "../../assets/css/test.scss"
import BreadcrumbCustom from "../BreadcrumbCustom"
import TagUtils from "./TagUtils"


export default class Tag extends React.Component {

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

    loadData = () => {
        this.setState({loading: true});
        App.api('/oms/tag/tag').then((list) => {
            this.setState({
                list,
                loading: false
            });
        });
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除此项？`,
            onOk: () => {
                App.api("/oms/tag/delete", {id}).then(() => {
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

    edit = (tag) => {
        TagUtils.edit(tag, this.loadData);
    };


    render() {

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.tag.txt}/>

            <Card>

                <div style={{marginBottom: '10px', height: '30px'}}>
                    <Button type="primary" icon="user-add" onClick={() => {
                        this.edit()
                    }}>新建标签</Button>
                </div>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (text, item, i) => i + 1
                        // render: (col, row, i) => ((pagination.current - 1) * pagination.pageSize) + (i + 1)
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        ellipsis: true,
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, tag, index) => {

                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(tag)}>编辑</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="2">
                                    <a onClick={() => this.remove(tag.id, index)}>删除</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }
                    }]}
                    rowkey={item => item.index}
                    dataSource={list}
                    loading={loading}/>
            </Card>
        </div>
    }

}
