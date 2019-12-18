import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Input, InputNumber, message, Modal, Form} from 'antd';
import {CTYPE} from "../../common";
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-category-edit';

export default class CategoryEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            category: this.props.category,
            parent: this.props.parent,
        };
    }

    submit = () => {

        let {category, parent = {}} = this.state;
        let {id, sequence = '', priority = 1, level, index} = category;

        if (id === 0) {
            let _index = U.date.pad(index);
            if (level === 1) {
                sequence = _index + '0000';
            } else if (level === 2) {
                sequence = parent.sequence.substring(0, 2) + _index + '00';
            } else {
                sequence = parent.sequence.substring(0, 4) + _index;
            }
            category.sequence = sequence;
            category.priority = priority;
            category.pId = parent.id;
            category.status = 1;
        }

        App.api('/oms/category/save', {
                category: JSON.stringify(category)
            }
        ).then(() => {
            message.success('已保存');
            this.close();
            this.props.loadData();
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {category = {}} = this.state;

        let {id, name, priority = 1} = category;

        return <Modal title={id > 0 ? '编辑分类' : '新建分类'}
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
                           }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="权重">
                    <InputNumber
                        value={priority} max={99} min={1}
                        onChange={(v) => {
                            this.setState({
                                category: {
                                    ...category,
                                    priority: v
                                }
                            })
                        }}/>
                </Form.Item>
            </div>
        </Modal>
    }
}
