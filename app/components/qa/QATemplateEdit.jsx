import React from 'react';
import {Button, Card, Checkbox, Form, Icon, Input, message, Modal, Radio, Tag, Tooltip} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U, Utils} from "../../common";
import '../../assets/css/qa/qa-page-ui.less'
import BreadcrumbCustom from '../BreadcrumbCustom';
import {Link} from 'react-router-dom';
import Sortable from 'sortablejs'

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {TextArea} = Input;

class QATemplateEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            qaTemplate: {},
            formTypes: []
        }
    }

    componentDidMount() {
        this.loadProps();
    }

    loadProps = () => {
        App.api('common/formTypes').then((formTypes) => {
            this.setState({formTypes}, () => {
                this.loadData()
            });
        })
    };

    loadData = () => {
        let {id} = this.state;
        if (id !== 0) {
            App.api('adm/qa/qaTemplate', {id}).then((qaTemplate) => {
                this.setState({
                    qaTemplate
                });
                this.setForm(qaTemplate);
            })
        } else {
            this.setForm({});
        }
        this.formSortListner();
    };

    setForm = (qaTemplate) => {
        let {title, descr, status = 1} = qaTemplate;
        this.props.form.setFieldsValue({
            title, descr, status
        });
    };

    handleSubmit = () => {

        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {

                let {qaTemplate = {}} = this.state;

                let {items = []} = qaTemplate;
                if (items.length === 0) {
                    message.warn('请填写内容');
                    return;
                }

                let index_error = -1;
                let error = '';
                items.map((item, index) => {
                    let {question, required, type, options = []} = item;

                    if (U.str.isEmpty(required)) {
                        item.required = 0;
                    }

                    if (U.str.isEmpty(question)) {
                        index_error = index;
                        error = `问题未填写`;
                    }

                    if (type === 'select' || type === 'mselect') {
                        if (options.length === 0) {
                            index_error = index;
                            error = `可选值未填写`;
                        }
                    }

                    if (type === 'tip' && (options.length === 0 || U.str.isEmpty(options[0]))) {
                        index_error = index;
                        error = `未填写提示语`;
                    }

                });

                if (index_error > -1) {
                    message.warn(`第${index_error + 1}组内容填写有误：${error}`);
                    return;
                }

                let {title, descr, status = 1} = values;

                if (U.str.isEmpty(title)) {
                    message.warn('请填写标题');
                    return;
                }

                App.api('adm/qa/save_qaTemplate', {
                    qaTemplate: JSON.stringify({
                        ...qaTemplate,
                        title, descr, status
                    })
                }).then((res) => {
                    message.success('已保存');
                    window.history.back();
                });
            }
        });
    };

    addFormItem = (type) => {
        let {qaTemplate = {}} = this.state;
        let {items = []} = qaTemplate;

        let wrap = {type, label: '', required: 0};

        if (type === 'select' || type === 'mselect') {
            wrap.options = [];
        }

        items.push(wrap);
        this.setState({
            qaTemplate: {
                ...qaTemplate,
                items
            }
        }, () => {
            this.formSortListner();
        })
    };

    formSortListner = () => {
        let _this = this;
        let forms = document.getElementById('form_sorter');
        if (forms) {
            let sortable = Sortable.create(forms, {
                dataIdAttr: 'data-id',
                store: {
                    get: () => {

                        let {qaTemplate = {}} = _this.state;
                        let {items = []} = qaTemplate;

                        let sort = [];
                        items.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        return sort;
                    },
                    set: (sortable) => {
                        let sort = sortable.toArray();
                        let items = [];
                        sort.map((s) => {
                            items.push(JSON.parse(s));
                        });
                        let {qaTemplate = {}} = _this.state;
                        this.setState({
                            qaTemplate: {
                                ...qaTemplate,
                                items
                            }
                        })
                    }
                },
                onEnd: () => {
                    setTimeout(() => {
                        let {qaTemplate = {}} = _this.state;
                        let {items = []} = qaTemplate;
                        let sort = [];
                        items.map((s) => {
                            sort.push(JSON.stringify(s));
                        });
                        sortable.sort(sort);
                    }, 10);
                },
            });
        }
    };

    removeItem = (index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {

                let {qaTemplate = {}} = _this.state;
                let {items = []} = qaTemplate;
                _this.setState({
                    qaTemplate: {
                        ...qaTemplate,
                        items: U.array.remove(items, index)
                    }
                }, () => {
                    _this.formSortListner();
                });

            },
            onCancel() {
            },
        });
    };

    renderTags = (tags, _index) => {
        const {active_index, inputVisible, inputValue} = this.state;
        return <div>
            {tags.map((tag, index) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                    <Tag key={tag} closable={true} onClose={() => this.handleClose(tag, _index)}>
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                );
                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            })}
            {active_index === _index && inputVisible && (
                <Input ref={this.saveInputRef}
                       type="text" size="small" style={{width: 78}}
                       value={inputValue}
                       onChange={this.handleInputChange}
                       onBlur={() => this.handleInputConfirm(_index)}
                       onPressEnter={() => this.handleInputConfirm(_index)}/>
            )}
            {(active_index !== _index || !inputVisible) && (
                <Tag onClick={() => this.showInput(_index)}
                     style={{background: '#fff', borderStyle: 'dashed'}}>
                    <Icon type="plus"/> 添加
                </Tag>
            )}
        </div>
    };

    handleClose = (removedTag, index) => {
        let {qaTemplate = {}} = this.state;
        let {items = []} = qaTemplate;
        let {options = []} = items[index];
        const tags = options.filter(tag => tag !== removedTag);
        items[index].options = tags;
        this.setState({
            qaTemplate: {
                ...qaTemplate,
                items
            }
        });
    };

    showInput = (index) => {
        this.setState({active_index: index, inputVisible: true}, () => this.input.focus());
    };

    handleInputChange = (e) => {
        this.setState({inputValue: e.target.value});
    };

    handleInputConfirm = (index) => {

        let {qaTemplate = {}, inputValue} = this.state;
        let {items = []} = qaTemplate;
        let {options = []} = items[index];

        if (inputValue && options.indexOf(inputValue) === -1) {
            options = [...options, inputValue];
        }
        items[index].options = options;
        this.setState({
            qaTemplate: {
                ...qaTemplate,
                items
            },
            active_index: -1,
            inputVisible: false,
            inputValue: ''
        });

    };

    saveInputRef = input => this.input = input;

    render() {

        let {qaTemplate = {}, formTypes = []} = this.state;

        const {getFieldDecorator} = this.props.form;


        let {title} = this.props.form.getFieldsValue();

        let {items = []} = qaTemplate;

        return <div className="qa-page-ui-page">

            <BreadcrumbCustom
                first={<Link to={CTYPE.link.ws_qa_templates.path}>{CTYPE.link.ws_qa_templates.txt}</Link>}
                second='编辑问卷'/>

            <Card bordered={false}>
                <div className='preview-block'>
                    <div className='preview-page'>

                        <div className='wx-header'>{title}</div>
                        <div className='page-form'>

                            <ul>
                                {items.map((item, i) => {

                                    let {type, question, required, options = [], value} = item;

                                    let className_label = required === 1 ? 'label required' : 'label';

                                    switch (type) {

                                        case 'mobile':
                                            return <li key={i}>
                                                <div className={className_label}>{question}</div>
                                                <input className="input" disabled={true}/>
                                            </li>;
                                        case 'textarea':
                                            return <div key={i}>
                                                <li>
                                                    <div className={className_label}>{question}</div>
                                                </li>
                                                <li>
                                                    <textarea placeholder={question} disabled={true}/>
                                                </li>
                                            </div>;
                                        case 'select': {
                                            let _options = [];
                                            options.map((v) => {
                                                _options.push({label: v, value: v});
                                            });
                                            value = value || options[0];

                                            return <li key={i}>
                                                <div className={className_label}>{question}</div>
                                                <div className='line'>
                                                    <select value={value} className='input'>
                                                        {options.map((f, i) => (
                                                            <option value={f} key={i}>{f}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </li>
                                        }

                                        case 'mselect':
                                            value = value || [];
                                            return <div key={i}>
                                                <li key={i + '-1'}>
                                                    <div className={className_label}>{question}</div>
                                                </li>
                                                <li>
                                                    <div className='mselect-items'>
                                                        {options.map((v, j) => {
                                                            return <div className='ms-item' key={j}>
                                                                <div className="i-checkbox">
                                                                    <label>
                                                                        <input type="checkbox"/><i/></label>
                                                                </div>
                                                                <div className="checkbox-txt"> {v}</div>
                                                            </div>
                                                        })}
                                                    </div>
                                                </li>
                                            </div>;

                                        case 'date': {

                                            return <li key={i}>
                                                <div className={className_label}>{question}</div>
                                                <div className='line'>
                                                    <input className="input" disabled={true}/>
                                                </div>
                                            </li>
                                        }

                                        case 'city': {

                                            let pcd = Utils.addr.getPCD(value);

                                            return <li key={i}>
                                                <div className={className_label}>{question}</div>
                                                <div className='line'>
                                                    <input className="input" disabled={true}/>
                                                </div>
                                            </li>
                                        }

                                        case 'tip': {
                                            return <div className='tip' key={i}>{options[0]}</div>
                                        }


                                        default:
                                            return <li key={i}>
                                                <div className={className_label}>{question}</div>
                                                <input type="text" disabled={true} className="input"/>
                                            </li>;
                                    }

                                })}
                            </ul>

                            <div className={`btn btn-style-2`}>提交</div>
                        </div>

                    </div>
                </div>

                <Card style={{width: '700px', float: 'left'}}
                      extra={<Button type="primary" icon="save" onClick={() => {
                          this.handleSubmit()
                      }}>保存</Button>}>

                    <div className='common-module-form'>
                        <div className="common-edit-page">

                            <div className='block-title'>基础信息</div>

                            <FormItem
                                {...CTYPE.formItemLayout}
                                label="标题">
                                {getFieldDecorator('title')(<Input/>)}
                            </FormItem>

                            <FormItem
                                {...CTYPE.formItemLayout}
                                label="简介">
                                {getFieldDecorator('descr')(<Input.TextArea/>)}
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


                            <div className='block-title'>添加问题</div>

                            <ul className='ul-form-types'>
                                {formTypes.map((ft, index) => {
                                    return <li key={index} onClick={() => {
                                        this.addFormItem(ft.type)
                                    }}>{ft.val}</li>
                                })}
                            </ul>

                            {items.length > 0 && <div>
                                <div className='block-title'>编辑问题</div>

                                <ul className='ul-form-items' id='form_sorter'>
                                    {items.map((item, index) => {

                                        let {question, required, type, options = []} = item;

                                        let moduleName = formTypes.find(t => t.type === type).val;

                                        let withRequired = (type !== 'imgtips' && type !== 'tips');

                                        return <li key={index} data-id={JSON.stringify(item)}>

                                            <div className='header'>
                                                <div className='module'>[{moduleName}]</div>
                                                <input placeholder='名称' className='input' value={question}
                                                       onChange={(e) => {
                                                           items[index].question = e.target.value;
                                                           this.setState({
                                                               qaTemplate: {
                                                                   ...qaTemplate,
                                                                   items
                                                               }
                                                           })
                                                       }}/>
                                                {withRequired && <Checkbox className='checkbox'
                                                                           checked={required === 1}
                                                                           onChange={(e) => {
                                                                               items[index].required = e.target.checked ? 1 : 0;
                                                                               this.setState({
                                                                                   qaTemplate: {
                                                                                       ...qaTemplate,
                                                                                       items
                                                                                   }
                                                                               })
                                                                           }}>必填</Checkbox>}
                                                <Icon type='close' onClick={() => this.removeItem(index)}/>

                                            </div>
                                            <div className='content'>
                                                {type === 'input' && <Input disabled={true} placeholder='单行输入'/>}
                                                {type === 'textarea' &&
                                                <TextArea disabled={true} placeholder='多行输入'/>}
                                                {(type === 'select' || type === 'mselect') && this.renderTags(options, index)}
                                                {type === 'mobile' && <Input disabled={true} placeholder='输入手机号'/>}
                                                {type === 'city' && <Input disabled={true} placeholder='城市'/>}
                                                {type === 'date' && <Input disabled={true} placeholder='日期'/>}

                                                {type === 'tip' && <TextArea
                                                    value={options[0]} rows={4} maxLength={140}
                                                    onChange={(e) => {
                                                        items[index].options = [e.target.value];
                                                        this.setState({
                                                            qaTemplate: {
                                                                ...qaTemplate,
                                                                items
                                                            }
                                                        })
                                                    }}
                                                    placeholder="输入提示文案，不超过140字"/>
                                                }
                                            </div>

                                            <div className='clearfix'/>
                                        </li>
                                    })}
                                </ul>
                            </div>}

                        </div>
                    </div>
                </Card>

            </Card>
        </div>
    }
}

const QATemplateEdit = Form.create()(QATemplateEditForm);

export default QATemplateEdit;