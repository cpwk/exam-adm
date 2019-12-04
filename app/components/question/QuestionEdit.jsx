import React from 'react';
import {
    message,
    Card,
    Input,
    Form,
    Button,
    Select,
    Switch,
    TreeSelect,
    Icon,
    Radio,
    Checkbox,
    Rate
} from 'antd';
import {Link} from 'react-router-dom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import BreadcrumbCustom from "../BreadcrumbCustom"

const Option = Select.Option;
const {TreeNode} = TreeSelect;

let id = 0;

const ABC = ['A', 'B', 'C', 'D', 'E'];
const JUDGE = [{type: 1, label: '对'}, {type: 2, label: '错'}];
const OPTIONS = [{type: 1, label: '单选'}, {type: 2, label: '多选'}, {type: 3, label: '判断'}, {
    type: 4,
    label: '填空'
}, {type: 5, label: '问答'}];

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
            // disappear: 1,
            // display: 5,
            keys: [],
            // add: 1,
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
                        this.setState({add: 2, disappear: 1, display: question.type, keys: question.options});
                    } else {
                        this.setState({add: 1, disappear: 2, display: 5})
                    }
                    this.setForm(question);
                }
            )
        }
        App.api("/oms/tag/tag", {id}).then((tag) => {
            this.setState({tag})
        });
        App.api('/oms/category/father')
            .then((list) => {
                this.setState({
                    list,
                    loading: false,
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
        let {type, difficulty, status} = this.state;
        this.props.form.validateFields((err, values) => {
            let {options} = values;
            let {question = {}, ids = []} = this.state;
            if (U.str.isEmpty(difficulty)) {
                question.difficulty = "1"
            }
            if (U.str.isEmpty(status)) {
                question.status = "1"
            }
            App.api('/oms/question/save', {
                'question': JSON.stringify({
                    ...question,
                    tagsId: ids,
                    options
                })
            }).then((res) => {
                message.success("保存成功");
                window.history.back();
            });
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

    render() {

        let {question = {}, tag = [], ids = [], list = [], add, disappear, display, keys = []} = this.state;
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
                          addonBefore={ABC[index]}
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
                    <Rate style={{fontSize: 14}} count={3} value={difficulty} onChange={(e) => {
                        this.setState({
                            question: {
                                ...question,
                                difficulty: e
                            }
                        })
                    }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="分类">
                    <TreeSelect
                        // showSearch
                        style={{width: 270}}
                        value={categoryId}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="请选择分类"
                        allowClear
                        onSelect={(value) => {
                            this.setState({
                                question: {
                                    ...question,
                                    categoryId: value
                                }
                            })
                        }}>
                        {list.map((v, index1) => {
                            let {id, name, children = []} = v;
                            return <TreeNode title={name} value={id} key={index1}>
                                {children.map((va, index2) => {
                                    let {id, name, children = []} = va;
                                    return <TreeNode key={`${index1}-${index2}`} value={id} title={name}>
                                        {children.map((val, index3) => {
                                            let {id, name} = val;
                                            return <TreeNode title={name} value={id}
                                                             key={`${index1}-${index2}-${index3}`}/>
                                        })}
                                    </TreeNode>
                                })}
                            </TreeNode>
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
                            return (<Option key={i} value={g.id}>{g.name}</Option>);
                        })}
                    </Select>
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
                        {OPTIONS.map((k, index) => {
                            return <Option value={k.type} key={OPTIONS}>{k.label}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} label="题目" required="true" className="common-edit-page">
                    <Input.TextArea rows={3} style={{width: "270px"}} value={topic} onChange={(e) => {
                        this.setState({
                            question: {
                                ...question,
                                topic: e.target.value
                            }
                        })
                    }}/>
                </Form.Item>
                {(type === 1 || type === 2) && <React.Fragment>
                    {formItems}
                    <Form.Item {...CTYPE.tailFormItemLayout} >
                        <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
                            <Icon type="plus"/> 点击添加题目选项
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
                            return <Radio value={ABC[index]} key={index}>{ABC[index]}</Radio>
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
                            return <Checkbox value={ABC[index]} key={index}>{ABC[index]}</Checkbox>
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
                        {JUDGE.map((k, index) => {
                            return <Radio value={k.type} key={JUDGE}>{k.label}</Radio>
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
                <Form.Item {...CTYPE.formItemLayout} required="true" label="启用">
                    <Switch checked={status === 1} onChange={(chk) => {
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
