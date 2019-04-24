import React from 'react'
import App from '../../common/App.jsx'
import {Button, Card, Form, Input, message, Radio} from 'antd';
import {CTYPE, OSSWrap, U} from "../../common";
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../BreadcrumbCustom';
import '../../assets/css/common/common-edit.less'

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class TrainerEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            trainer: {}
        };
    }

    componentDidMount() {
        let {id} = this.state;
        if (id > 0) {
            App.api('adm/trainer/trainer', {id}).then((trainer) => {
                this.setState({trainer});
                this.setForm(trainer);
            })
        } else {
            this.setForm({});
        }
    }

    setForm = (trainer) => {
        let {username, name, job, workNum, gender = 1, mobile, email, intro, onjob = 1} = trainer;
        this.props.form.setFieldsValue({
            username,
            name,
            job,
            workNum,
            gender,
            mobile,
            email,
            intro,
            onjob
        });
    };

    handleNewImage = (e) => {

        let {uploading, trainer = {}} = this.state;

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
            trainer.img = result.url;
            this.setState({
                trainer, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });
    };

    submit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {

                let {trainer = {}} = this.state;

                let {img} = trainer;
                if (U.str.isEmpty(img)) {
                    message.warn('请上传照片');
                    return;
                }

                let {username, name, job, workNum, gender = 1, mobile, email, intro, onjob = 1, password} = values;

                if (U.str.isNotEmpty(email) && !U.str.isEmail(email)) {
                    message.warn('邮箱地址不正确');
                    return;
                }
                if (U.str.isNotEmpty(mobile) && !U.str.isChinaMobile(mobile)) {
                    message.warn('手机号码不正确');
                    return;
                }

                App.api('adm/trainer/save_trainer', {
                    trainer: JSON.stringify({
                        ...trainer,
                        username,
                        name,
                        job,
                        workNum,
                        gender,
                        mobile,
                        email,
                        intro,
                        onjob,
                        password
                    })
                }).then(() => {
                    message.success('保存成功');
                    window.history.back();
                })
            }
        })
    };

    render() {

        let {id, trainer = {}} = this.state;

        const {getFieldDecorator} = this.props.form;

        let {img} = trainer;

        let style_img = {width: '145px', height: '190px'};

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.trainers.path}>{CTYPE.link.trainers.txt}</Link>}
                    second='编辑管理员'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.submit()
                               }}
                               htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label={<span className='required'>照片</span>}>
                    <div className='common-edit-page'>
                        <div className='upload-img-preview' style={style_img}>
                            {img && <img src={img} style={style_img}/>}
                        </div>
                        <div className='upload-img-tip'>
                            <Button type="primary" icon="file-jpg">
                                <input className="file" type='file'
                                       onChange={(e) => this.handleNewImage(e)}/>
                                选择图片</Button>
                            <br/>
                            建议上传图片尺寸<span>580*760</span>，.jpg、.png格式，文件小于1M
                        </div>
                    </div>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="姓名">
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入姓名'}],
                    })(
                        <Input placeholder="姓名"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="性别">
                    {getFieldDecorator('gender')(<RadioGroup>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                    </RadioGroup>)}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="职务">
                    {getFieldDecorator('job')(
                        <Input placeholder="职务"/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="工号">
                    {getFieldDecorator('workNum')(
                        <Input placeholder="工号"/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="手机号">
                    {getFieldDecorator('mobile')(
                        <Input placeholder="手机号"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="email">
                    {getFieldDecorator('email')(
                        <Input placeholder="email"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="简介">
                    {getFieldDecorator('intro')(
                        <Input.TextArea placeholder="简介" style={{height: '200px'}}/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="登录名">
                    {getFieldDecorator('username', {
                        rules: [{required: id === 0}],
                    })(
                        <Input disabled={id > 0} placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="密码">
                    {getFieldDecorator('password', {
                        rules: [{required: id === 0}],
                    })(
                        <Input type='password' placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="状态">
                    {getFieldDecorator('onjob')(<RadioGroup>
                        <Radio value={1}>在职</Radio>
                        <Radio value={2}>离职</Radio>
                    </RadioGroup>)}
                </FormItem>

            </Card>
        </div>

    }
}

export default Form.create()(TrainerEdit);