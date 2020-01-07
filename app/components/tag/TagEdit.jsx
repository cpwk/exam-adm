import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Input, message, Modal, Form, TreeSelect} from 'antd';
import {CTYPE} from "../../common";
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-tag-edit';

const {TreeNode} = TreeSelect;

export default class TagEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: this.props.tag,
            uploading: false,
            list: []
        };
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        App.api('/oms/category/categorys',{oms:false}).then((list) => {
            this.setState({
                list,
            });
        });
    };

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

        let {tag = {}, list = []} = this.state;

        let {name, categoryId} = tag;

        return <Modal title={'新建标签'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'600px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">
                <Form.Item {...CTYPE.formItemLayout} required="true" label="分类">
                    <TreeSelect
                        style={{width: 300}}
                        value={categoryId}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="请选择分类"
                        allowClear
                        onSelect={(value) => {
                            this.setState({
                                tag: {
                                    ...tag,
                                    categoryId: value
                                }
                            })
                        }}>
                        {list.map((v, index1) => {
                            if (v.status === 1) {
                                let {id, name, children = []} = v;
                                return <TreeNode title={name} value={id} key={index1} disabled>
                                    {children.map((va, index2) => {
                                        if (va.status === 1) {
                                            let {id, name, children = []} = va;
                                            return <TreeNode title={name} value={id} key={`${index1}-${index2}`} disabled>
                                                {children.map((val, index3) => {
                                                    if (val.status === 1) {
                                                        let {id, name} = val;
                                                        return <TreeNode title={name} value={id}
                                                                         key={`${index1}-${index2}-${index3}`}/>
                                                    }
                                                })}
                                            </TreeNode>
                                        }
                                    })}
                                </TreeNode>
                            }
                        })}
                    </TreeSelect>
                </Form.Item>
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
