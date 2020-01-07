import React from 'react';
import {Table, Card, Menu, Dropdown, Icon, Tag, Modal, message, Button} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U, Utils} from "../../common";

export default class Roles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,

            list: []

        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        let p = this.state.pagination;
        Utils.nProgress.start();
        App.api('oms/role/roles').then((roles) => {
            this.setState({
                list: roles,
                loading: false
            });
            Utils.nProgress.done();
        });
    };

    edit = group => {
        App.go(`/app/admin/roleEdit/${group.id}`)
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('oms/role/remove_role', {id}).then(() => {
                    message.success('删除成功');
                    let list = this.state.list;
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

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.admin_roles.txt}/>

            <Card>

                <div style={{marginBottom: '10px', height: '30px'}}>
                    <Button type={'primary'} onClick={() => {
                        this.edit({id: 0})
                    }}>添加</Button>
                </div>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        width: '60px',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        width: '120px',
                    }, {
                        title: '权限',
                        dataIndex: 'pstr',
                        className: 'txt-center',
                        render: (pstr) => {
                            return <div className='state'>
                                {pstr.map((p, i) => {
                                    return <Tag color={p.level} key={i}>{p.name}</Tag>
                                })}
                            </div>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'opt',
                        className: 'txt-center',
                        width: '80px',
                        render: (obj, role, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(role)}>编辑</a>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <a onClick={() => this.remove(role.id, index)}>删除</a>
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
                    pagination={false}
                    loading={loading}/>
            </Card>
        </div>
    }
}
