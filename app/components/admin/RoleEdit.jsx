import React from 'react';
import {Link} from 'react-router-dom';
import {message, Card, Input, Button, Form, Select, Tree} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";

const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

export default class RoleEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            role: {},
            permissions: [],
            checkedKeys: []
        }
    }

    componentDidMount() {
        let {id} = this.state;
        App.api('adm/admin/permissions').then((permissions) => {
            this.setState({permissions});
            if (id != 0) {
                App.api('adm/admin/role', {id}).then((role) => {
                    let {permissions} = role;
                    let _ps = U.str.isNotEmpty(permissions) ? permissions.split(',') : [];
                    let checkedKeys = [];
                    _ps.map((k) => {
                        checkedKeys.push(k);
                    });
                    this.setState({
                        role, checkedKeys
                    });
                })
            }

        })
    }

    handleSubmit = () => {

        let {role = {}, checkedKeys = []} = this.state;

        let {name} = role;
        if (U.str.isEmpty(name)) {
            message.warn('请输入名称');
            return
        }
        if (checkedKeys.length === 0) {
            message.warn('请选择权限');
            return;
        }

        role.permissions = checkedKeys.join(',');
        App.api('adm/admin/save_role', {role: JSON.stringify(role)}).then((res) => {
            window.history.back();
        });
    };

    render() {

        let {role = {}, permissions = [], checkedKeys = []} = this.state;

        let {name} = role;

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link>}
                    second='编辑分组'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.handleSubmit()
                               }}
                               htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="名称">
                    <Input value={name} style={{width: '500px'}} onChange={(e) => {
                        this.setState({
                            role: {
                                ...role,
                                name: e.target.value
                            }
                        })
                    }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="权限">
                    <Select
                        mode="multiple"
                        style={{width: '500px'}}
                        value={checkedKeys}
                        onChange={(checkedKeys) => {
                            this.setState({checkedKeys})
                        }}>
                        {permissions.map((g, i) => {
                            return (<Option key={i} value={g.code}>{g.name}</Option>);
                        })}
                    </Select>
                </FormItem>

            </Card>
        </div>
    }
}