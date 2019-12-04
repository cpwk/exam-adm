import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Input, InputNumber, message, Modal, Form, Switch, Select} from 'antd';
import {CTYPE} from "../../common";
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-category-edit';
const Option = Select.Option;


export default class CategoryEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category,
            uploading: false,
        };
    }

    submit = () => {

        let {category = {}} = this.state;
        let {name, priority, pId} = category;

        if (U.str.isEmpty(name)) {
            message.warn('请填写名称');
            return;
        }
        if (U.str.isEmpty(priority)) {
            category.priority = 1;
        }
        if (U.str.isEmpty(pId)) {
            category.pId = 0;
        }
        App.api('/oms/category/save', {
                category: JSON.stringify(category)
            }
        ).then(() => {
            message.success('已保存');
            this.props.loadData();
            this.close();
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {category = {}} = this.state;

        let {name, priority, status, pId = '0'} = category;

        return <Modal title={'新建分类'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'600px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">
                <Form.Item {...CTYPE.formItemLayout} label="名称" required="true">
                    <Input style={{width: 300}} className="input-wide" placeholder="输入名称"
                           value={name} maxLength={64}
                           onChange={(e) => {
                               this.setState({
                                   category: {
                                       ...category,
                                       name: e.target.value
                                   }
                               })
                           }}/>详情
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="权重">
                    <InputNumber
                        value={priority} max={99}
                        onChange={(v) => {
                            this.setState({
                                category: {
                                    ...category,
                                    priority: v
                                }
                            })
                        }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="启用">
                    <Switch checked={status === 1} onChange={(chk) => {
                        this.setState({
                            category: {
                                ...category,
                                status: chk ? 1 : 2
                            }
                        })
                    }}/>
                </Form.Item>
            </div>
        </Modal>
    }
}
