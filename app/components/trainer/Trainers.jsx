import React from 'react';
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import TrainerUtils from "./TrainerUtils";

export default class Trainers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            list: [],
            loading: false
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        App.api('adm/trainer/trainers', {trainerQo: JSON.stringify({})}).then((list) => {
            this.setState({
                list,
                loading: false
            });
        });
    };

    edit = trainer => {
        App.go(`/app/trainer/trainer-edit/${trainer.id}`)
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/trainer/remove_trainer', {id}).then(() => {
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

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.trainers.txt}/>

            <Card>

                <div style={{marginBottom: '10px', height: '30px'}}>
                    <Button type="primary" icon="user-add" onClick={() => {
                        this.edit({id: 0})
                    }}>添加讲师</Button>
                </div>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '用户名',
                        dataIndex: 'username',
                        className: 'txt-center'
                    }, {
                        title: '姓名',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '职务',
                        dataIndex: 'job',
                        className: 'txt-center'
                    }, {
                        title: '手机号',
                        dataIndex: 'mobile',
                        className: 'txt-center'
                    }, {
                        title: '状态',
                        dataIndex: 'onjob',
                        className: 'txt-center',
                        render: (onjob) => {
                            return <div className="state">
                                {onjob === 1 ? <span>在职</span> : <span className="warning">离职</span>}</div>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, trainer, index) => {
                            let {id} = trainer;
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(trainer)}>编辑</a>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <a onClick={() => this.remove(id, index)}>删除</a>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <a onClick={() => TrainerUtils.trainerPwd(trainer)}>重置密码</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="3">
                                    <a onClick={() => TrainerUtils.trainerSessions(id)}>登录日志</a>
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
