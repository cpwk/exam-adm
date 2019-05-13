import React from 'react'

import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Form, Icon, Input, message, Modal, Radio, Select, Tag, Tooltip} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from '../BreadcrumbCustom'

import CTYPE from "../../common/CTYPE";

import '../../assets/css/common/common-edit.less'
import '../../assets/css/faq/faq-edit.less'
import U from "../../common/U";
import HtmlEditor from "../../common/HtmlEditor";

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {TextArea} = Input;

moment.locale('zh-cn');

class FaqEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            faq: {}
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        if (id && id > 0) {
            App.api('adm/faq/faq', {id}).then((faq) => {

                this.setState({faq});
                this.setForm(faq);

            })
        } else {
            this.setForm({})
        }

    };

    setForm = (faq) => {
        let {title, status = 1} = faq;
        this.props.form.setFieldsValue({
            title, status
        });
    };

    handleSubmit = (e) => {
        e && e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            }
            if (!err) {

                let {faq = {}} = this.state;
                let {keywords = [], content} = faq;

                if (keywords.length === 0) {
                    message.warn('请设置关键词');
                    return;
                }

                if (U.str.isEmpty(content)) {
                    message.warn('请设置反馈内容');
                    return;
                }

                let {title, status} = values;
                if (U.str.isEmpty(title)) {
                    message.warn('请输入标题');
                    return;
                }

                App.api('adm/faq/save_faq', {
                        faq: JSON.stringify({
                            ...faq, title, status
                        })
                    }
                ).then((data) => {
                    message.success('保存成功');
                    history.back();
                });
            }
        });
    };

    editFaqKeyword = (faqKeyword, index) => {
        Utils.common.renderReactDOM(<FaqKeywordEdit faqKeyword={faqKeyword} index={index}
                                                    syncfaqKeyword={this.syncfaqKeyword}/>);
    };

    syncfaqKeyword = (faqKeyword, index) => {

        let {faq = {}} = this.state;
        let {keywords = []} = faq;

        if (index > -1) {
            keywords[index] = faqKeyword;
        } else {
            let added = false;
            keywords.map((kw) => {
                if (kw.weight === faqKeyword.weight) {
                    let {words = []} = kw;
                    kw.words = words.concat(faqKeyword.words);
                    added = true;
                }
            });

            !added && keywords.push(faqKeyword);

        }
        this.setState({
            faq: {
                ...this.state.faq,
                keywords
            }
        });
    };

    syncContent = (content) => {
        this.setState({
            faq: {
                ...this.state.faq,
                content
            }
        });
    };

    render() {

        let {faq = {}} = this.state;
        let {keywords = [], content} = faq;

        const {getFieldDecorator} = this.props.form;

        return <div className="common-edit-page">

            <BreadcrumbCustom first={<Link to={CTYPE.link.ws_faqs.path}>{CTYPE.link.ws_faqs.txt}</Link>}/>

            <Form onSubmit={this.handleSubmit}>
                <Card title="编辑FAQ" bordered={false}
                      extra={<Button type="primary" htmlType="submit">保存</Button>}>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label={(
                            <span>标题</span>
                        )}
                        hasFeedback>
                        {getFieldDecorator('title', {
                            rules: [CTYPE.fieldDecorator_rule_title]
                        })(
                            <Input placeholder={`建议输入字数不超过${CTYPE.maxlength.title}个字`}/>
                        )}
                    </FormItem>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label={(
                        <span>关键词</span>
                    )}>
                        <div>
                            <Button type='primary' onClick={() => {
                                this.editFaqKeyword({}, -1);
                            }}>添加</Button>
                            <ul className='faq-keyword-edit-ul'>
                                {keywords.map((faqKeyword, i1) => {
                                    let {words = [], weight} = faqKeyword;
                                    if (words.length > 0) {
                                        return <li key={i1}>
                                            <span className='score'>{weight} 分：</span>
                                            {words.map((w, i2) => {
                                                return <Tag key={i2} onClick={() => {
                                                    this.editFaqKeyword(faqKeyword, i1);
                                                }}>{w}</Tag>
                                            })}
                                        </li>
                                    }
                                })}
                            </ul>
                        </div>
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label={<span className='required'>反馈内容</span>}>
                        <HtmlEditor content={content} syncContent={this.syncContent}/>
                    </FormItem>


                    <FormItem
                        {...CTYPE.formItemLayout}
                        label={(<span>启用</span>)}>
                        {getFieldDecorator('status')(
                            <RadioGroup>
                                <Radio value={1}>启用</Radio>
                                <Radio value={2}>停用</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>


                </Card>

            </Form>

        </div>
    }
}

const id_div_faq_keyword = 'id_div_faq_keyword';

class FaqKeywordEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            faqKeyword: this.props.faqKeyword,
            index: this.props.index
        };
    }

    componentDidMount() {
        let {faqKeyword = {}} = this.state;
        let {words = [], weight} = faqKeyword;
        if (words.length === 0) {
            faqKeyword.words = [''];
        }
        if (!weight) {
            faqKeyword.weight = 10;
        }
        this.setState({faqKeyword});
    }

    save = () => {
        let {faqKeyword = {}, index} = this.state;
        let {words = []} = faqKeyword;
        words = words.filter(item => U.str.isNotEmpty(item));
        if (words.length === 0) {
            message.warn('请输入关键词');
            return;
        }
        faqKeyword.words = words;
        this.props.syncfaqKeyword(faqKeyword, index);
        this.close();
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_faq_keyword);
    };

    render() {

        let {faqKeyword = {}} = this.state;
        let {words = [], weight = 10} = faqKeyword;

        return <Modal title={'修改密码'}
                      getContainer={() => Utils.common.createModalContainer(id_div_faq_keyword)}
                      visible={true}
                      width={'900px'}
                      onOk={this.save}
                      onCancel={this.close}>
            <div className='common-edit-page'>
                <div className='form'>
                    <div className='line'>
                        <div className='p required'>
                            <Tooltip
                                title={'提问内容匹配中的关键词总分值大于7分时会触发自动回复'}>
                                <span>权重&nbsp;<Icon type="question-circle-o"/></span>
                            </Tooltip>
                        </div>
                        <RadioGroup value={weight.toString()} onChange={e => {
                            this.setState({
                                faqKeyword: {
                                    ...faqKeyword,
                                    weight: e.target.value
                                }
                            });
                        }}>
                            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num, i) => {
                                return <Radio key={i} value={num.toString()}>{num}</Radio>
                            })}
                        </RadioGroup>
                    </div>

                    <div className='line'>
                        <div className='p required'>
                            关键词
                        </div>
                        <Card style={{width: 800}} bodyStyle={{padding: 15}}>
                            {words.map((val, i) => {
                                return <div className='array-edit-block' key={i}>
                                    <Input
                                        value={val}
                                        onChange={(e) => {
                                            faqKeyword.words[i] = e.target.value;
                                            this.setState({faqKeyword});
                                        }}/>
                                    <div className='span'>

                                        {words.length !== 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="minus"
                                                onClick={() => {
                                                    faqKeyword.words = U.array.remove(words, i);
                                                    this.setState({faqKeyword});
                                                }}/>}

                                        {i === words.length - 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="plus"
                                                onClick={() => {
                                                    if (words.length < 10) {
                                                        words.push('');
                                                        faqKeyword.words = words;
                                                        this.setState({faqKeyword});
                                                    } else {
                                                        message.warning('最多添加10个');
                                                    }
                                                }}/>}

                                    </div>
                                </div>
                            })}
                        </Card>
                    </div>
                </div>

            </div>
        </Modal>
    }
}

const FaqEdit = Form.create()(FaqEditForm);

export default FaqEdit;