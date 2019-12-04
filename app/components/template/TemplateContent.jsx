import React, {Component} from 'react';
import Utils from "../../common/Utils";
import {Modal, Table} from "antd";

const id_div = 'div-dialog-template-edit';

class TemplateContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            template: this.props.template,
        }
    }

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {
        let {template = []} = this.state;
        let {content} = template;

        return <Modal title={'模板配置'}
                      footer={null}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'600px'}
                      onCancel={this.close}>
            <div className="common-edit-page">
                <Table pagination={false}
                       columns={[{
                           title: '类型',
                           dataIndex: 't-type',
                           className: 'txt-center',
                           render: (ob, t) => {
                               return <div className="state">
                                   {t.type === 1 ? '单选' : t.type === 2 ? '多选' : t.type === 3 ? '填空' : '问答'}
                               </div>
                           }
                       }, {
                           title: '数量(道)',
                           dataIndex: 'number',
                           className: 'txt-center'
                       }, {
                           title: '每道分值',
                           dataIndex: 'score',
                           className: 'txt-center'
                       }]}
                       rowKey={(item) => item.id}
                       dataSource={content}/>
            </div>
        </Modal>
    }
}

export default TemplateContent;