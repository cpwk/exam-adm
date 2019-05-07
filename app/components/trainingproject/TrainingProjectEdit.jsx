import React from 'react'
import {App, CTYPE, OSSWrap, U} from '../../common'
import {Button, Card, Form, Input, InputNumber, message, Radio} from 'antd';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../BreadcrumbCustom'
import '../../assets/css/common/common-edit.less'
import HtmlEditor from "../../common/HtmlEditor";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

class TrainingProjectEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            trainingProject: {}

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let id = this.state.id;
        if (id && id > 0) {
            App.api('adm/trainingProject/trainingProject', {id}).then((trainingProject) => {
                this.setState({
                    trainingProject
                });
                this.setForm(trainingProject);
            })
        } else {
            this.setForm({});
        }
    };

    setForm = (trainingProject) => {
        let {title, descr, keyPoint = [], settop = 2, priority, status = 1} = trainingProject;
        this.props.form.setFieldsValue({
            title, descr, settop, priority, status
        });
        if (keyPoint.length === 0) {
            trainingProject.keyPoint = [''];
        }
        this.setState({trainingProject});
    };

    syncContent = (content) => {
        this.setState({
            trainingProject: {
                ...this.state.trainingProject,
                content
            }
        })
    };

    syncPoster = (img) => {
        this.setState({
            trainingProject: {
                ...this.state.trainingProject,
                img
            }
        });
    };

    handleNewImage = (type, e) => {

        let {uploading, trainingProject = {}} = this.state;

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

            trainingProject.img = result.url;

            this.setState({
                trainingProject, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, trainingProject) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            }
            if (!err) {
                let id = this.state.id;
                trainingProject.id = id > 0 ? id : null;

                let _trainingProject = this.state.trainingProject;

                let {img, keyPoint = [], content = ''} = _trainingProject;


                if (U.str.isEmpty(img)) {
                    message.warn('请上传图片');
                    return;
                }

                {
                    trainingProject.img = img;
                    trainingProject.keyPoint = keyPoint;
                    trainingProject.content = content;
                    trainingProject.createdAt = _trainingProject.createdAt;
                    trainingProject.priority = _trainingProject.priority || 0;
                }

                App.api('adm/trainingProject/save', {trainingProject: JSON.stringify(trainingProject)}).then(() => {
                    message.success('保存成功');
                    setTimeout(() => {
                        window.history.back();
                    }, 500);
                });

            }
        });
    };

    render() {

        let {id, trainingProject = {}} = this.state;

        const {getFieldDecorator} = this.props.form;

        let {img, keyPoint = [], content} = trainingProject;

        let style_img = {width: '330px', height: '200px'};

        return <div className="common-edit-page">

            <Form onSubmit={this.handleSubmit}>
                <Card title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.ws_training_projects.path}>{CTYPE.link.ws_training_projects.txt}</Link>}
                    second={id > 0 ? '编辑案例' : '新建案例'}/>} bordered={false}
                      extra={<Button type="primary" htmlType="submit">{id > 0 ? '保存' : '发布'}</Button>}
                      style={CTYPE.formStyle}>


                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='标题'
                        hasFeedback>
                        {getFieldDecorator('title', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='简介'
                        hasFeedback>
                        {getFieldDecorator('descr', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <TextArea rows={5} placeholder={`建议输入字数不超过${CTYPE.maxlength.intro}个字`}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label={<span>技能点</span>}>
                        <Card style={{width: 800}} bodyStyle={{padding: 15}}>
                            {keyPoint.map((val, i) => {
                                return <div className='array-edit-block' key={i}>
                                    <Input
                                        value={val}
                                        onChange={(e) => {
                                            trainingProject.keyPoint[i] = e.target.value;
                                            this.setState({trainingProject});
                                        }}/>
                                    <div className='span'>

                                        {keyPoint.length !== 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="minus"
                                                onClick={() => {
                                                    trainingProject.keyPoint = U.array.remove(keyPoint, i);
                                                    this.setState({trainingProject});
                                                }}/>}

                                        {i === keyPoint.length - 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="plus"
                                                onClick={() => {
                                                    if (keyPoint.length < 20) {
                                                        keyPoint.push('');
                                                        trainingProject.keyPoint = keyPoint;
                                                        this.setState({trainingProject});
                                                    } else {
                                                        message.warning('最多添加20个');
                                                    }
                                                }}/>}

                                    </div>
                                </div>
                            })}
                        </Card>
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label={<span className='required'>列表封面</span>}>
                        <div className='common-edit-page'>
                            <div className='upload-img-preview' style={style_img}>
                                {img && <img src={img} style={style_img}/>}
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file'
                                           onChange={(e) => this.handleNewImage('img', e)}/>
                                    选择图片</Button>
                                <br/>
                                建议上传图片尺寸<span>660*400</span>，.jpg、.png格式，文件小于1M
                            </div>
                        </div>
                    </FormItem>


                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='权重'
                        hasFeedback>
                        {getFieldDecorator('priority')(
                            <InputNumber/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='上架'>
                        {getFieldDecorator('status')(
                            <RadioGroup>
                                <Radio value={1}>上架</Radio>
                                <Radio value={2}>下架</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='置顶'>
                        {getFieldDecorator('settop')(<RadioGroup>
                            <Radio value={1}>是</Radio>
                            <Radio value={2}>否</Radio>
                        </RadioGroup>)}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="内容">
                        <HtmlEditor content={content} syncContent={this.syncContent}/>
                    </FormItem>

                </Card>
            </Form>
        </div>
    }
}

const TrainingProjectEdit = Form.create()(TrainingProjectEditForm);

export default TrainingProjectEdit;