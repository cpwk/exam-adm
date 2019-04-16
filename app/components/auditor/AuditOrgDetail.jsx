import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Dropdown, Icon, Menu, message, Modal, Table, Tag} from 'antd';

import '../../assets/css/auditor/audit-org-detail.less'
import '../../assets/css/common/common-edit.less'
import {CrossTitle} from "../../common/CommonComponent";
import AuditorUtils from "./AuditorUtils";
import {U} from "../../common";

const id_div = 'div-dialog-audit-org-detail';

export default class AuditOrgDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            index: this.props.index,
            auditOrg: {}
        };
    }

    componentDidMount() {
        this.loadAuditOrg();
    }

    loadAuditOrg = (sync) => {
        let {id} = this.state;
        App.api('adm/auditor/auditOrg', {id}).then((auditOrg) => {
            if (sync) {
                this.syncAuditOrg(auditOrg);
            } else {
                this.setState({
                    auditOrg
                });
            }
        })
    };

    syncAuditOrg = (auditOrg) => {
        let {index} = this.state;
        this.setState({auditOrg});
        this.props.syncAuditOrg(auditOrg, index);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    remove = (id, index) => {
        Modal.confirm({
            title: `确认删除操作?`,
            onOk: () => {
                App.api('adm/auditor/remove_auditor', {id}).then(() => {
                    message.success('删除成功');
                    let {auditOrg = {}} = this.state;
                    let {auditors = []} = auditOrg;
                    auditOrg.auditors = U.array.remove(auditors, index);
                    this.setState({
                        auditOrg
                    })
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let {auditOrg = {}} = this.state;

        let {AUDITOR_EDIT} = Utils.adminPermissions;

        let {id, name, org_type, code, phone, fax, address, remark, auditors = [], pstr = []} = auditOrg;

        if (!id) {
            return <div/>
        }

        return <Modal title="部门详情"
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={800} footer={null}
                      onCancel={this.close}>

            <div className='modal-scroll-500'>
                <div className='inner'>
                    <div className='audit-org-detail-page'>

                        <CrossTitle title='基本信息'/>

                        <div className="top">
                            <div className='summary'>
                                <div className='line'>
                                    <label>名称：</label>{name}</div>
                                <div className='line'>
                                    <label>机构类型：</label>
                                    {org_type === 1 ? '管委会' : '驻区机构'}
                                </div>
                                <div className='line'>
                                    <label>机构代码：</label>{code}</div>
                                <div className='line'>
                                    <label>电话总机：</label>{phone}</div>
                                <div className='line'>
                                    <label>传真号码：</label>{fax}</div>
                                <div className='line'>
                                    <label>办公地址：</label>{address}</div>
                                <div className='line'>
                                    <label>备注：</label>{remark}</div>

                            </div>
                        </div>


                        <CrossTitle title='部门权限'/>

                        <div className='tags-block'>
                            {pstr.map((p, i) => {
                                return <Tag color={p.level} key={i}>{p.name}</Tag>
                            })}
                        </div>

                        <CrossTitle title='部门人员'/>

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
                                title: '手机号',
                                dataIndex: 'mobile',
                                className: 'txt-center'
                            }, {
                                title: '账号类型',
                                dataIndex: 'accountType',
                                className: 'txt-center',
                                render: (accountType) => <Tag color='blue'>{AuditorUtils.accountType(accountType)}</Tag>
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
                                render: (obj, auditor, index) => {
                                    let {id} = auditor;
                                    return <Dropdown overlay={<Menu>
                                        {AUDITOR_EDIT && <Menu.Item key="1">
                                            <a onClick={() => AuditorUtils.auditorPwd(auditor)}>重置密码</a>
                                        </Menu.Item>}
                                        {AUDITOR_EDIT && <Menu.Item key="2">
                                            <a onClick={() => this.remove(id, index)}>删除</a>
                                        </Menu.Item>}
                                    </Menu>} trigger={['click']}>
                                        <a className="ant-dropdown-link">
                                            操作 <Icon type="down"/>
                                        </a>
                                    </Dropdown>
                                }

                            }]}
                            size='small'
                            rowKey={(item) => item.id}
                            dataSource={auditors}
                            pagination={false}
                            loading={false}/>

                            <div className='clearfix-h20'/>

                    </div>
                </div>
            </div>

        </Modal>
    }
}
