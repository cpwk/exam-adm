import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Input, message, Modal, Form} from 'antd';
import {CTYPE} from "../../common";
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-tag-edit';

export default class TagEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: this.props.tag,
            uploading: false,
        };
    }

    submit = () => {
        let {tag = {}} = this.state;
        App.api('/oms/tag/save', {
            tag: JSON.stringify(tag)
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

        let {tag = {}} = this.state;

        let {name} = tag;

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
                                   tag: {
                                       ...tag,
                                       name: e.target.value
                                   }
                               })
                           }}/>
                </Form.Item>
            </div>
        </Modal>
    }
}
