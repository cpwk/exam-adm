import React from 'react'
import {App, CTYPE, OSSWrap, U} from '../../common'
import {Button, Card, Form, Input, InputNumber, message, Radio} from 'antd';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../BreadcrumbCustom'
import '../../assets/css/common/common-edit.less'
import HtmlEditor from "../../common/HtmlEditor";
import {PosterEdit} from "../../common/CommonEdit";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class ArticleEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            article: {}

        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let id = this.state.id;
        if (id && id > 0) {
            App.api('adm/article/article', {id}).then((article) => {
                this.setState({
                    article
                });
                this.setForm(article);
            });
        } else {
            this.setForm({});
        }
    };

    setForm = (article) => {
        let {title, intro, visit = 1, status = 1} = article;
        this.props.form.setFieldsValue({
            title, intro, visit, status
        });
    };

    syncPoster = (img) => {
        this.setState({
            article: {
                ...this.state.article,
                img
            }
        });
    };

    syncContent = (content) => {
        this.setState({
            article: {
                ...this.state.article,
                content
            }
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, article) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            }
            if (!err) {
                let id = this.state.id;
                article.id = id > 0 ? id : null;

                let _article = this.state.article;

                if (U.str.isEmpty(_article.img)) {
                    message.warn('请上传图片');
                    return;
                }

                {
                    article.img = _article.img;
                    article.content = _article.content;
                    article.createdAt = _article.createdAt;
                }
                App.api('adm/article/save', {article: JSON.stringify(article)}).then(() => {
                    message.success('保存成功');
                    setTimeout(() => {
                        window.history.back();
                    }, 500);
                });

            }
        });
    };

    render() {

        let {id, article} = this.state;

        const {getFieldDecorator} = this.props.form;
        let {img, content} = article;

        return <div className="common-edit-page">

            <Form onSubmit={this.handleSubmit}>
                <Card title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.info_articles.path}>{CTYPE.link.info_articles.txt}</Link>}
                    second={id > 0 ? '编辑动态' : '新建动态'}/>} bordered={false}
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

                    <PosterEdit title='列表封面' type='h' img={img} required={true} syncPoster={this.syncPoster}/>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label="简介"
                        hasFeedback>
                        {getFieldDecorator('intro', {
                            rules: [{
                                type: 'string',
                                required: true,
                                message: `简介长度为${CTYPE.minlength.intro}~${CTYPE.maxlength.intro}个字`,
                                whitespace: true,
                                min: CTYPE.minlength.intro,
                                max: CTYPE.maxlength.intro
                            }],
                        })(
                            <Input.TextArea rows={3}/>
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
                        {...CTYPE.shortFormItemLayout}
                        label='访问量' hasFeedback>
                        {getFieldDecorator('visit', {
                            rules: [{
                                type: 'number',
                                required: true,
                                min: 1,
                                max: CTYPE.maxprice,
                            }]
                        })(
                            <InputNumber precision={0} style={{width: '100%'}}/>
                        )}
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

const ArticleEdit = Form.create()(ArticleEditForm);

export default ArticleEdit;