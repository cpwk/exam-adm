import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Input, InputNumber, message, Modal, Select, Switch} from 'antd';
import {OSSWrap} from "../../common";
import '../../assets/css/common/common-edit.less'

const Option = Select.Option;

const id_div = 'div-dialog-partner-edit';

export default class PartnerEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            partner: this.props.partner,
            uploading: false
        };
    }


    handleNewImage = e => {

        let {uploading, partner = {}} = this.state;

        let img = e.target.files[0];

        if (!img || img.type.indexOf('image') < 0) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }

        if (uploading) {
            message.loading('上传中');
            return;
        }

        this.setState({uploading: true});

        OSSWrap.upload(img).then((result) => {
            this.setState({
                partner: {
                    ...partner,
                    img: result.url
                }, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });

    };

    submit = () => {

        let {partner = {}} = this.state;
        let {id, title, url, status, priority, img} = partner;
        if (U.str.isEmpty(title)) {
            message.warn('请填写名称');
            return;
        }
        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }
        if (U.str.isEmpty(priority)) {
            partner.priority = 1;
        }
        if (U.str.isEmpty(status)) {
            partner.status = 1;
        }

        App.api('adm/partner/save', {
                partner: JSON.stringify(partner)
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

        let {partner = {}} = this.state;
        let {id, title, url, status, priority, img} = partner;

        let style = {width: '180px', height: '100px'};

        return <Modal title={'编辑合作伙伴'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'1000px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <p className='p required'>名称</p>
                        <Input style={{width: 300}} className="input-wide" placeholder="输入名称"
                               value={title} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       partner: {
                                           ...partner,
                                           title: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p required'>图片</p>
                        <div>
                            <div className='upload-img-preview' style={style}>
                                {img && <img src={img} style={style}/>}
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file' onChange={this.handleNewImage}/>
                                    选择图片</Button>
                                <br/>
                                建议上传图片尺寸<span>{'360*200'}</span>，.jpg、.png格式，文件小于1M
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <p className='p'>URL</p>
                        <Input className="input-wide" value={url} maxLength={512}
                               onChange={(e) => {
                                   this.setState({
                                       partner: {
                                           ...partner,
                                           url: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p'>权重</p>
                        <InputNumber
                            value={priority} max={99}
                            onChange={(v) => {
                                this.setState({
                                    partner: {
                                        ...partner,
                                        priority: v
                                    }
                                })
                            }}/>
                    </div>

                    <div className="line">
                        <p className='p'>启用</p>
                        <Switch checked={status === 1} onChange={(chk) => {
                            this.setState({
                                partner: {
                                    ...partner,
                                    status: chk ? 1 : 2
                                }
                            })
                        }}/>

                    </div>

                </div>

            </div>
        </Modal>
    }
}
