import React from 'react';
import {
    message, Card, Input, Form, Button, Select, Switch, TreeSelect,
    Icon, Radio, Checkbox, Rate
} from 'antd';
import {Link} from 'react-router-dom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import BreadcrumbCustom from "../BreadcrumbCustom"
import HtmlEditor from "../../common/HtmlEditor";
import TagUtils from "../tag/TagUtils";

let id = 0;
const Option = Select.Option;
const {TreeNode} = TreeSelect;
const desc = ['简单', '一般', '困难'];

class QuestionEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            question: {},
            category: {},
            tag: [],
            ids: [],
            list: [],
            options: [],
            keys: [],
            cateId: 0
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        if (id > 0) {
            App.api('/oms/question/question', {id}).then((question) => {
                    let {tagsId = []} = question;
                    this.setState({question, ids: tagsId});
                    this.setState({display: question.type});
                    if (question.type === 1 || question.type === 2) {
                        this.setState({keys: question.options});
                    }
                    this.setForm(question);
                }
            )
        }
        App.api("/oms/tag/tag", {id}).then((tag) => {
            this.setState({tag})
        });
        App.api('/oms/category/categorys').then((list) => {
            this.setState({
                list,
            });
        });
    };

    setForm = (question) => {
        let {topic, type, tagsId, categoryId, answer, difficulty, options} = question;
        this.props.form.setFieldsValue({
            topic,
            type,
            tagsId,
            categoryId,
            answer,
            difficulty,
            options
        });
    };

    handleChange = ids => {
        this.setState({ids});
    };

    handleSubmit = () => {
        let {status} = this.state;
        this.props.form.validateFields((err, values) => {
            let {options = []} = values;
            let {question = {}, ids = []} = this.state;
            if (U.str.isEmpty(status)) {
                question.status = "1"
            }
            App.api('/oms/question/save', {
                question: JSON.stringify({
                    ...question,
                    tagsId: ids,
                    options
                })
            }).then((result) => {
                message.success("保存成功");
                window.history.back();
            })
        })
    };

    remove = k => {
        let {keys = []} = this.state;
        if (keys.length === 1) {
            return;
        }
        this.setState({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        let {keys = []} = this.state;
        if (keys.length > 4) {
            message.warn('最多5个');
            return;
        }
        const nextKeys = keys.concat(id++);
        this.setState({
            keys: nextKeys,
        });
    };

    syncContent = (topic) => {
        let {question = {}} = this.state;
        this.setState({
            question: {
                ...question,
                topic
            }
        })
    };

    tagEdit = (tag) => {
        TagUtils.edit(tag, this.loadData);
    };

    render() {

        let {question = {}, tag = [], ids = [], list = [], keys = [], cateId} = this.state;
        let {topic, categoryId, answer, status, type, difficulty} = question;

        const {getFieldDecorator} = this.props.form;
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? CTYPE.formItemLayout : CTYPE.tailFormItemLayout)}
                label={index === 0 ? '选项' : ''}
                required="true"
                key={k}
            >
                {getFieldDecorator(`options[${index}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: "请输入选项内容",
                        },
                    ],
                })(<Input placeholder="请添加选项" style={{width: '75%', marginRight: 8}}
                          addonBefore={CTYPE.ABC[index]}
                          addonAfter={<Icon type="minus-circle-o" onClick={() => this.remove(k)}
                          />}/>)}
            </Form.Item>
        ));

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.question.path}>{CTYPE.link.question.txt}</Link>}
                    second='编辑试题'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.handleSubmit()
                               }}
                               htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="难度">
                    <Rate tooltips={desc} style={{fontSize: 14}} count={3} value={difficulty}
                          onChange={(difficulty) => {
                              this.setState({
                                  question: {
                                      ...question,
                                      difficulty
                                  }
                              })
                          }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="分类">
                    <TreeSelect
                        style={{width: 270}}
                        value={categoryId}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="请选择分类"
                        onSelect={(value) => {
                            this.setState({cateId: value});
                            this.setState({
                                question: {
                                    ...question,
                                    categoryId: value
                                }
                            })
                        }}>
                        {list.map((v, index1) => {
                            if (v.status === 1) {
                                let {id, name, children = []} = v;
                                return <TreeNode title={name} value={id} key={index1}>
                                    {children.map((va, index2) => {
                                        if (va.status === 1) {
                                            let {id, name, children = []} = va;
                                            return <TreeNode title={name} value={id} key={`${index1}-${index2}`}>
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
                <Form.Item {...CTYPE.formItemLayout} required="true" label="标签">
                    <Select
                        style={{width: 270}}
                        mode="multiple"
                        placeholder="请选择标签"
                        value={ids}
                        onChange={(ids) => {
                            this.handleChange(ids)
                        }}>
                        {tag.map((g, i) => {
                            if (cateId === g.categoryId) {
                                return (<Option key={i} value={g.id}>{g.name}</Option>);
                            }
                        })}
                    </Select>
                    <span style={{marginLeft:'20px'}}><a onClick={() => {
                        this.tagEdit();
                    }}>添加标签</a></span>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="类型">
                    <Select
                        placeholder="请选择类型"
                        value={type}
                        style={{width: 270}}
                        onChange={(e) => {
                            this.setState({
                                question: {
                                    ...question,
                                    type: e
                                }
                            });
                        }}>
                        {CTYPE.options.map((k, index) => {
                            return <Option value={k.type} key={CTYPE.options}>{k.label}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} label="题目" required="true" className="common-edit-page">
                    <HtmlEditor content={topic} withoutTools={true} syncContent={this.syncContent}/>
                </Form.Item>
                {(type === 1 || type === 2) && <React.Fragment>
                    {formItems}
                    <Form.Item {...CTYPE.tailFormItemLayout} >
                        <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
                            <Icon type="plus"/>点击添加选项
                        </Button>
                    </Form.Item>
                </React.Fragment>}
                {type === 1 &&
                <Form.Item {...CTYPE.formItemLayout} required="true" label="答案">
                    <Radio.Group value={answer} onChange={(e) => {
                        this.setState({
                            question: {
                                ...question,
                                answer: e.target.value
                            }
                        })
                    }}>
                        {keys.map((k, index) => {
                            return <Radio value={CTYPE.ABC[index]} key={index}>{CTYPE.ABC[index]}</Radio>
                        })}
                    </Radio.Group>
                </Form.Item>}
                {type === 2 &&
                <Form.Item {...CTYPE.formItemLayout} required="true" label="答案">
                    <Checkbox.Group style={{width: '100%'}} value={answer} onChange={(vs) => {
                        this.setState({
                            question: {
                                ...question,
                                answer: vs
                            }
                        })
                    }}>
                        {keys.map((k, index) => {
                            return <Checkbox value={CTYPE.ABC[index]} key={index}>{CTYPE.ABC[index]}</Checkbox>
                        })}
                    </Checkbox.Group>
                </Form.Item>}
                {type === 3 &&
                <Form.Item {...CTYPE.formItemLayout} required="true" label="答案">
                    <Radio.Group value={answer} onChange={(e) => {
                        this.setState({
                            question: {
                                ...question,
                                answer: e.target.value
                            }
                        })
                    }}>
                        {CTYPE.judge.map((k, index) => {
                            return <Radio value={k.answer} key={CTYPE.judge}>{k.label}</Radio>
                        })}
                    </Radio.Group>
                </Form.Item>}
                {(type === 4 || type === 5) &&
                <Form.Item {...CTYPE.formItemLayout} required="true" label="答案">
                    <Input.TextArea rows={3} value={answer} onChange={(e) => {
                        this.setState({
                            question: {
                                ...question,
                                answer: e.target.value
                            }
                        })
                    }}/>
                </Form.Item>}
                <Form.Item {...CTYPE.formItemLayout} required="true" label="状态">
                    <Switch checkedChildren="启用" unCheckedChildren="停用" checked={status === 1} onChange={(chk) => {
                        this.setState({
                            question: {
                                ...question,
                                status: chk ? 1 : 2
                            }
                        })
                    }}/>
                </Form.Item>
            </Card>
        </div>
    }
}

export default Form.create()(QuestionEdit);
