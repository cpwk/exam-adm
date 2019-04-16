import React from 'react'
import App from '../../common/App.jsx'
import {Button, Card, DatePicker, Form, Input, message, Radio} from 'antd';
import {CTYPE, OSSWrap, U} from "../../common";
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../BreadcrumbCustom';
import '../../assets/css/common/common-edit.less'
import TraineeUtils from "./TraineeUtils";
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class TraineeEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            trainee: {}
        };
    }

    componentDidMount() {
        let {id} = this.state;
        if (id > 0) {
            App.api('adm/trainee/trainee', {id}).then((trainee) => {
                this.setState({trainee});
                this.setForm(trainee);
            })
        } else {
            this.setForm({});
        }
    }

    setForm = (trainee) => {
        let {educationType = 1, username, name, studentNum, gender = 1, idnumber, mobile, email, address, inSchool = 1} = trainee;
        this.props.form.setFieldsValue({
            educationType,
            username,
            name,
            studentNum,
            gender,
            idnumber,
            mobile,
            email,
            address,
            inSchool
        });
    };

    handleNewImage = (e) => {

        let {uploading, trainee = {}} = this.state;

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
            trainee.img = result.url;
            this.setState({
                trainee, uploading: false
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

                let {trainee = {}} = this.state;

                let {img} = trainee;
                if (U.str.isEmpty(img)) {
                    message.warn('请上传照片');
                    return;
                }

                let {educationType, username, name, studentNum, gender = 1, idnumber, mobile, email, address, inSchool = 1, password} = values;

                if (U.str.isNotEmpty(email) && !U.str.isEmail(email)) {
                    message.warn('邮箱地址不正确');
                    return;
                }
                if (U.str.isNotEmpty(mobile) && !U.str.isChinaMobile(mobile)) {
                    message.warn('手机号码不正确');
                    return;
                }

                App.api('adm/trainee/save_trainee', {
                    trainee: JSON.stringify({
                        ...trainee,
                        educationType,
                        username,
                        name,
                        studentNum,
                        gender,
                        idnumber,
                        mobile,
                        email,
                        address,
                        inSchool,
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

        let {id, trainee = {}} = this.state;

        const {getFieldDecorator} = this.props.form;

        let {img, admissionAt} = trainee;

        let _admissionAt = admissionAt ? moment(new Date(admissionAt), 'YYYY-MM-DD') : null;

        let style_img = {width: '150px', height: '210px'};

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.trainees.path}>{CTYPE.link.trainees.txt}</Link>}
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
                            建议上传图片尺寸<span>500*700</span>，.jpg、.png格式，文件小于1M
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
                    label="类型">
                    {getFieldDecorator('educationType')(<RadioGroup>
                        {TraineeUtils.educationTypes.map((type) => {
                            return <Radio key={type.k} value={type.k}>{type.v}</Radio>
                        })}
                    </RadioGroup>)}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="学号">
                    {getFieldDecorator('studentNum')(
                        <Input placeholder="学号"/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label={(
                        <span className='required'>入校日期</span>
                    )}
                    hasFeedback>

                    <DatePicker
                        showTime
                        showToday={false}
                        allowClear={false}
                        format="YYYY-MM-DD"
                        placeholder="入校日期"
                        value={_admissionAt}
                        onChange={(v) => {
                            this.setState({
                                trainee: {
                                    ...trainee,
                                    admissionAt: v.valueOf()
                                }
                            })
                        }}
                        onOk={(v) => {
                            this.setState({
                                trainee: {
                                    ...trainee,
                                    admissionAt: v.valueOf()
                                }
                            })
                        }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="手机号">
                    {getFieldDecorator('mobile', {
                        rules: [{required: true, message: '请输入手机号'}],
                    })(
                        <Input placeholder="手机号"/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="身份证号">
                    {getFieldDecorator('idnumber', {
                        rules: [{required: true, message: '请输入身份证号'}],
                    })(
                        <Input placeholder="身份证号"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="email">
                    {getFieldDecorator('email')(
                        <Input placeholder="email" autoComplete="off"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="籍贯/地址">
                    {getFieldDecorator('address')(
                        <Input.TextArea placeholder="地址"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="登录名">
                    {getFieldDecorator('username', {
                        rules: [{required: id === 0}],
                    })(
                        <Input disabled={id > 0} placeholder="用户名" autoComplete="off"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="密码">
                    {getFieldDecorator('password', {
                        rules: [{required: id === 0}],
                    })(
                        <Input type='password' placeholder="密码" autoComplete="off"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.formItemLayout}
                    label="状态">
                    {getFieldDecorator('inSchool')(<RadioGroup>
                        <Radio value={1}>在校</Radio>
                        <Radio value={2}>毕业</Radio>
                    </RadioGroup>)}
                </FormItem>

            </Card>
        </div>

    }
}

export default Form.create()(TraineeEdit);