import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Form, Icon, Input, message, Modal} from 'antd';

import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'

const FormItem = Form.Item;
const id_div = 'div-dialog-mod-pwd';

class AuditorPwd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            auditor: this.props.auditor
        };
    }

    updatePassword = () => {
        let {auditor = {}} = this.state;
        this.props.form.validateFields((err, formitem) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {
                Utils.nProgress.start();
                App.api('adm/auditor/update_password', {
                    id: auditor.id,
                    password: formitem.password
                }).then(res => {
                    Utils.nProgress.done();
                    message.success('修改成功');
                    this.close();
                })
            }
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {auditor = {}} = this.state;
        console.log(auditor);
        const {getFieldDecorator} = this.props.form;

        return <Modal title={'修改密码'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'500px'}
                      onOk={this.updatePassword}
                      onCancel={this.close}>
            <Form>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>名称</span>
                    )}>
                    {auditor.name}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>新密码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{
                            type: 'string',
                            message: '长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头',
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            required: true,
                            whitespace: true,
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="unlock"/></span>}/>
                    )}
                </FormItem>

            </Form>
        </Modal>
    }
}

export default Form.create()(AuditorPwd);