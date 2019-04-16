import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Form, Input, message, Modal, Radio} from 'antd';
import {CTYPE} from "../../common";
import AuditorUtils from "./AuditorUtils";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const id_div = 'div-dialog-auditor-admin';

class AuditorAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            auditOrg: this.props.auditOrg
        };
    }

    componentDidMount() {
        this.setForm({});
    }

    setForm = (auditor) => {
        let {accountType = 1, name, job, phone, mobile, email} = auditor;
        this.props.form.setFieldsValue({
            accountType, name, job, phone, mobile, email
        });
    };

    submit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {

                let {auditOrg = {}} = this.state;
                let {accountType = 1, name, job, phone, mobile, email, username, password} = values;

                if (U.str.isNotEmpty(email) && !U.str.isEmail(email)) {
                    message.warn('邮箱地址不正确');
                    return;
                }
                if (U.str.isNotEmpty(mobile) && !U.str.isChinaMobile(mobile)) {
                    message.warn('手机号码不正确');
                    return;
                }

                App.api('adm/auditor/save_auditor', {
                    auditor: JSON.stringify({
                        username,
                        password,
                        name, job, phone, mobile, email,
                        accountType,
                        auditOrgId: auditOrg.id
                    })
                }).then(() => {
                    message.success('添加成功');
                    this.close();
                })
            }

        })
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        const {getFieldDecorator} = this.props.form;

        let {auditOrg = {}} = this.state;
        let {name} = auditOrg;

        return <Modal title="添加人员"
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      onOk={this.submit}
                      onCancel={this.close}>

            <Form>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="部门">
                    {name}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="类型">
                    {getFieldDecorator('accountType')(<RadioGroup>
                        {AuditorUtils.accountTypes.map((kv, index) => {
                            return <Radio key={kv.k} value={kv.k}>{kv.v}</Radio>
                        })}
                    </RadioGroup>)}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="姓名">
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入姓名'}],
                    })(
                        <Input placeholder="姓名"/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="职务">
                    {getFieldDecorator('job')(
                        <Input placeholder="职务"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="手机号">
                    {getFieldDecorator('mobile')(
                        <Input placeholder="手机号"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="座机">
                    {getFieldDecorator('phone')(
                        <Input placeholder="座机"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="邮箱">
                    {getFieldDecorator('email')(
                        <Input placeholder="邮箱"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="登录名">
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入登录名'}],
                    })(
                        <Input placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="密码">
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码'}],
                    })(
                        <Input type='password' placeholder="密码"/>
                    )}
                </FormItem>
            </Form>

        </Modal>
    }
}

export default Form.create()(AuditorAdd);