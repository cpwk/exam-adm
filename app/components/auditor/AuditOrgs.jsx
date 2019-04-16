import React from 'react';
import {Card, Dropdown, Icon, Menu, Table} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import U from "../../common/U";

import '../../assets/css/common/common-list.less'
import {CTYPE, Utils} from "../../common";
import AuditorUtils from "./AuditorUtils";

const MenuItem = Menu.Item;

export default class AuditOrgs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            list: [],
            loading: false

        };
    }

    componentDidMount() {
        this.loadList();
    }

    loadList = () => {
        this.setState({loading: true});
        App.api('adm/auditor/auditOrgs').then((list) => {
            this.setState({
                list, loading: false
            });
        });
    };

    syncAuditOrg = (auditOrg, index) => {
        let {list = []} = this.state;
        list[index] = auditOrg;
        this.setState({list});
    };

    render() {


        let {loading, list = []} = this.state;

        let {AUDITOR_EDIT} = Utils.adminPermissions;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.auditor_auditorOrgs.txt}/>

            <Card>

                <Table
                    columns={[
                        {
                            title: '机构类型',
                            dataIndex: 'orgType',
                            className: 'txt-center',
                            width: '100px',
                            render: (orgType) => {
                                return orgType === 1 ? '管委会' : '驻区机构'
                            }
                        }, {
                            title: '部门代码',
                            dataIndex: 'code',
                            className: 'txt-center',
                            width: '120px',
                        }, {
                            title: '部门名称',
                            dataIndex: 'name',
                            className: 'txt-center',
                            render: (name, auditOrg, index) => {
                                return <a
                                    onClick={() => AuditorUtils.auditOrgDetail(auditOrg.id, index, this.syncAuditOrg)}>{name}</a>
                            }
                        }, {
                            title: '排序权重',
                            dataIndex: 'priority',
                            className: 'txt-center',
                            width: '90px',
                        }, {
                            title: '创建时间',
                            dataIndex: 'createdAt',
                            className: 'txt-center',
                            width: '160px',
                            render: (text, item, index) => {
                                return <span>{U.date.format(new Date(item.createdAt), 'yyyy-MM-dd hh:mm')}</span>
                            }
                        }, {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            width: '100px',
                            render: (obj, auditOrg, index) => {

                                return <Dropdown overlay={<Menu>
                                    <MenuItem key="1">
                                        <a onClick={() => AuditorUtils.auditOrgDetail(auditOrg.id, index, this.syncAuditOrg)}>账号详情</a>
                                    </MenuItem>
                                    {AUDITOR_EDIT && <MenuItem key="2">
                                        <a onClick={() => {
                                            App.go(`/app/auditor/auditOrg-edit/${auditOrg.id}`);
                                        }}>编辑</a>
                                    </MenuItem>}
                                    {AUDITOR_EDIT && <MenuItem key="3">
                                        <a onClick={() => {
                                            AuditorUtils.auditorAdd(auditOrg);
                                        }}>新增管理员</a>
                                    </MenuItem>}
                                </Menu>} trigger={['click']}>
                                    <a className="color-info">
                                        操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }
                    ]}
                    rowKey={item => item.id}
                    dataSource={list}
                    pagination={false}
                    loading={loading}/>

            </Card>

        </div>
    }
}


