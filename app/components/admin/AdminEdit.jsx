import React from 'react';
import {Link} from 'react-router-dom';
import {message, Card, Input, Button, Form, Select} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U, Utils} from "../../common";
import KvStorage from "../../common/KvStorage";

const Option = Select.Option;
const FormItem = Form.Item;

class AdminEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            admin: {},

            roles: []
        }
    }

    componentDidMount() {
        App.api('oms/role/roles').then((roles) => {

            if (roles.length === 0) {
                message.warn('请先设置管理组');
            } else {
                this.setState({roles});
                let {id} = this.state;
                if (id !== 0) {
                    App.api('oms/admin/admin', {id}).then((admin) => {
                        this.setState({admin})
                    })
                }
            }
        });
    }

    handleSubmit = () => {

        let {admin = {}} = this.state;

        let {userName, name, roleId} = admin;
        if (U.str.isEmpty(userName)) {
            message.warn('请输入用户名');
            return
        }
        if (U.str.isEmpty(name)) {
            message.warn('请输入名称');
            return
        }
        if (roleId === 0) {
            message.warn('请选择管理组');
            return;
        }
        App.api('oms/admin/save_admin', {'admin': JSON.stringify(admin)}).then((res) => {
            message.success("操作成功")
            window.history.back();
        });
    };


    render() {

        let {admin = {}, roles = []} = this.state;
        let {userName, name, password, roleId = 0} = admin;

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link>}
                    second='编辑管理员'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.handleSubmit()
                               }}
                               htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>


                <FormItem
                    {...CTYPE.formItemLayout}
                    label="用户名">
                    <Input value={userName} style={{width: '300px'}} onChange={(e) => {
                        this.setState({
                            admin: {
                                ...admin,
                                userName: e.target.value
                            }
                        })
                    }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="名称">
                    <Input value={name} style={{width: '300px'}} onChange={(e) => {
                        this.setState({
                            admin: {
                                ...admin,
                                name: e.target.value
                            }
                        })
                    }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="密码">
                    <Input value={password} style={{width: '300px'}} onChange={(e) => {
                        this.setState({
                            admin: {
                                ...admin,
                                password: e.target.value
                            }
                        })
                    }}/>
                </FormItem>


                <FormItem
                    {...CTYPE.formItemLayout}
                    label="管理组">
                    <Select
                        style={{width: '300px'}}
                        value={roleId.toString()}
                        onChange={(roleId) => {
                            this.setState({
                                admin: {
                                    ...admin,
                                    roleId: parseInt(roleId)
                                }
                            })
                        }}>
                        <Option value='0'>请选择</Option>
                        {roles.map((g, i) => {
                            return <Option key={i} value={g.id.toString()}>{g.name}</Option>
                        })}
                    </Select>
                </FormItem>
            </Card>
        </div>
    }

}

const AdminEdit = Form.create()(AdminEditForm);

export default AdminEdit;
