import React from 'react';
import {Link} from 'react-router-dom';
import {Alert, Button, Card, Checkbox, Col, Form, Input, InputNumber, message, Row, Tag} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class AuditOrgEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            auditOrg: {},
            _permissions: []
        };
    }

    componentDidMount() {
        this.loadAuditOrg();
        this.loadPermissions();
    }

    loadPermissions = () => {

        App.api('adm/auditor/auditOrgPermissons').then((_permissions) => {
            _permissions = _permissions.filter(item => item.code !== 'NONE' && item.name !== '');
            this.setState({_permissions});
        })
    };

    loadAuditOrg = () => {
        let {id} = this.state;
        App.api('adm/auditor/auditOrg', {id}).then((auditOrg) => {
            auditOrg.permissions = auditOrg.permissions.split(',');
            this.setState({
                auditOrg
            });
            this.setForm(auditOrg);
        })
    };

    setForm = (auditOrg) => {
        let {name, code, email, phone, fax, address, priority, remark, permissions} = auditOrg;
        this.props.form.setFieldsValue({
            name, code, email, phone, fax, address, priority, remark, permissions
        });
    };

    submit = () => {

        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {

                let {auditOrg} = this.state;
                let {name, code, email, phone, fax, address, priority, remark, permissions} = values;
                permissions = permissions.filter(item => item !== '');

                if (!U.str.isEmail(email)) {
                    message.warn('请输入正确的邮箱');
                    return;
                }

                App.api('adm/auditor/save_auditOrg', {
                    auditOrg: JSON.stringify({
                        ...auditOrg,
                        name, code, email, phone, fax, address, priority, remark, permissions: permissions.join(',')
                    })
                }).then((result) => {
                    message.success('修改成功');
                    setTimeout(() => {
                        window.history.back();
                    }, 300)
                })
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        let {_permissions = [], auditOrg = {}} = this.state;
        let {permissions = []} = auditOrg;

        return <div className='common-edit-page'>

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.auditor_auditorOrgs.path}>{CTYPE.link.auditor_auditorOrgs.txt}</Link>}
                    second='修改信息'/>} bordered={false}
                extra={<Button type="primary" onClick={() => {
                    this.submit()
                }} htmlType="submit">保存</Button>} style={CTYPE.formStyle}>

                <Form>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="机构名称">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入机构名称'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="部门权限">
                        {getFieldDecorator("permissions", {
                            rules: [{required: true, message: '请选择权限'}],
                            initialValue: permissions
                        })(<Checkbox.Group style={{width: "100%", lineHeight: '38px'}}>
                            <Alert message="请谨慎操作" type="warning" showIcon/>
                            <Row>
                                {_permissions.map((item, index) => {
                                    return <Col span={8} key={index}>
                                        <Checkbox value={item.code}><Tag color={item.level}>{item.name}</Tag></Checkbox></Col>
                                })}
                            </Row>
                        </Checkbox.Group>)}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="机构代码">
                        {getFieldDecorator('code', {
                            rules: [{required: true, message: '请输入机构代码'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="邮箱">
                        {getFieldDecorator('email', {
                            rules: [{required: true, message: '请输入邮箱'}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="固定电话">
                        {getFieldDecorator('phone')(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="传真号码">
                        {getFieldDecorator('fax')(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="办公地址">
                        {getFieldDecorator('address')(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="排序权重">
                        {getFieldDecorator('priority')(
                            <InputNumber/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="备注">
                        {getFieldDecorator('remark')(
                            <Input/>
                        )}
                    </FormItem>


                </Form>
            </Card>
        </div>
    }
}

export default Form.create()(AuditOrgEdit);