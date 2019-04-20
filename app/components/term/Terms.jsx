import React from 'react';
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Switch, Table, Tag} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, Utils} from "../../common";

const minY = new Date().getFullYear();

export default class Terms extends React.Component {
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
        App.api('adm/term/terms').then((terms) => {
            this.setState({
                list: terms,
                loading: false
            });
            Utils.nProgress.done();
        });
    };

    edit = group => {
        App.go(`/app/setting/term-edit/${group.id}`)
    };

    setDefault = (id) => {
        Modal.confirm({
            title: `确认设为默认?`,
            onOk: () => {
                App.api('adm/term/set_term_default', {id}).then(() => {
                    message.success('操作成功');
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    modEnabled = (term, index, chk) => {
        let _this = this;
        let opt = chk ? '启用' : '禁用';
        Modal.confirm({
            title: `确认${opt}?`,
            onOk() {
                let status = chk ? 1 : 2;
                App.api('adm/term/update_status', {
                    id: term.id, status
                }).then(() => {
                    message.success('已' + opt);
                    let {list = []} = _this.state;
                    list[index].status = status;
                    _this.setState({list});
                });
            }
        });
    };

    editable = (term) => {
        let {year, setDefault} = term;
        return year > minY && setDefault === 0;
    };

    render() {

        let {list = [], loading} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.terms.txt}/>

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
                        title: '识别码',
                        dataIndex: 'sequence',
                        className: 'txt-center',
                        width: '140px',
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        render: (obj, term, index) => {
                            let {asStr, setDefault} = term;
                            return <span>{setDefault === 1 && <Tag color="red">默认学期</Tag>}{asStr}</span>;
                        }
                    }, {
                        title: '学年',
                        dataIndex: 'year',
                        className: 'txt-center',
                        width: '120px'
                    }, {
                        title: '学期',
                        dataIndex: 'termIndex',
                        className: 'txt-center',
                        width: '120px',
                        render: (termIndex) => {
                            return `第${termIndex}学期`
                        }
                    }, {
                        title: '启用',
                        dataIndex: 'status',
                        className: 'txt-center',
                        width: '80px',
                        render: (status, item, index) => {
                            let editable = this.editable(item);
                            return <Switch disabled={!editable} checked={status === 1} onChange={(chk) => {
                                this.modEnabled(item, index, chk);
                            }}/>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'opt',
                        className: 'txt-center',
                        width: '80px',
                        render: (obj, term, index) => {
                            let {id, setDefault} = term;
                            let editable = this.editable(term);
                            return <Dropdown overlay={<Menu>
                                {editable && <Menu.Item key="1">
                                    <a onClick={() => this.edit(term)}>编辑</a>
                                </Menu.Item>}
                                {setDefault === 0 && <Menu.Item key="3">
                                    <a onClick={() => this.setDefault(id)}>设为默认</a>
                                </Menu.Item>}
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
