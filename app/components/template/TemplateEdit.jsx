import React, {Component} from 'react';
import {CTYPE, U} from "../../common";
import {Card, Button, Form, TreeSelect, InputNumber, Input, Rate, Select, Switch, message} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import Link from "react-router-dom/Link";
import App from "../../common/App";

const {TreeNode} = TreeSelect;
const {Option} = Select;

import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

class TemplateEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            uploading: false,
            list: [],
            template: {},
            _duration: 60
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        let {id} = this.state;
        if (id > 0) {
            App.api('/oms/template/getById', {id}).then((template) => {
                    let {duration} = template;
                    let _duration = duration / 60000;
                    this.setState({template: template, _duration});
                    this.setForm(template);
                }
            )
        }
        App.api('/oms/category/categorys').then((list) => {
            this.setState({list});
        });
    };

    setForm = (template) => {
        let {templateName, content, status, difficulty, categoryId, passingScore} = template;
        this.props.form.setFieldsValue({
            ...template,
            difficulty,
            templateName,
            content,
            status,
            categoryId,
            passingScore
        });
    };

    handleSubmit = () => {
        let {template, _duration} = this.state;
        let {content = [], totalScore} = template;
        let duration = _duration * 1000 * 60;
        if (U.str.isEmpty(status)) {
            template.status = "1"
        }
        App.api("/oms/template/save", {
            "template": JSON.stringify({
                ...template,
                content: content,
                totalScore: totalScore,
                duration
            })
        }).then(() => {
            message.success("保存成功");
            window.history.back()
        })
    };

    calc = () => {
        let {template} = this.state;
        let {content = []} = template;
        let totalScore = 0;
        content.map((detail, index) => {
            let {number, score} = detail;
            let total = number * score;
            totalScore = totalScore + total;
        });
        let passingScore = totalScore * 0.7;
        this.setState({
            template: {
                ...template,
                totalScore,
                passingScore
            }
        })
    };

    Submit = (questionId, collected) => {
        let collect = {
            questionId,
        };
        if (collected === 1) {
            App.api('/usr/collect/save', {
                collect: JSON.stringify(collect)
            }).then(() => {
                message.success("已收藏");
            })
        } else {
            App.api('/usr/collect/delete', {
                id: questionId
            }).then(() => {
                message.success("已取消");
            })
        }
    };

    render() {
        let {list = [], template = {}, _duration} = this.state;
        let {templateName, categoryId, difficulty, status, content = [], totalScore = 0, passingScore = 0} = template;
        let checkTypes = [];
        content.map((detail) => {
            checkTypes.push(detail.type);
        });
        return <div>
            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.template.path}>{CTYPE.link.template.txt}</Link>}
                    second='编辑模板'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.handleSubmit()
                               }}
                               htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="难度">
                    <Rate style={{fontSize: 16}} count={3}
                          value={difficulty} onChange={(e) => {
                        this.setState({
                            template: {
                                ...template,
                                difficulty: e
                            }
                        })
                    }}
                    />
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="名称">
                    <Input style={{width: '290px'}} value={templateName} onChange={(e) => {
                        this.setState({
                            template: {
                                ...template,
                                templateName: e.target.value
                            }
                        })
                    }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="分类">
                    <TreeSelect
                        style={{width: 290}}
                        value={categoryId}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="请选择分类"
                        onSelect={(value) => {
                            this.setState({
                                template: {
                                    ...template,
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
                <Form.Item {...CTYPE.formItemLayout} required="true" label="类型">
                    <Select
                        style={{width: 290}}
                        mode="multiple"
                        placeholder="请选择类型"
                        value={checkTypes}
                        onChange={(checkTypes) => {
                            if (checkTypes.length === 0) {
                                content = [];
                            } else {
                                checkTypes.map((type) => {
                                    let _type = content.find((item) => item.type === type);
                                    if (!_type) {
                                        content.push({type, number: 5, score: 2});
                                    }
                                });
                                content.map((detail) => {
                                    let type = checkTypes.find((t) => t === detail.type);
                                    if (!type) {
                                        content = content.filter((item) => item.type !== detail.type);
                                    }
                                });
                            }
                            this.setState({
                                template: {
                                    ...template,
                                    content
                                }
                            }, () => {
                                this.calc()
                            });
                        }}>
                        {CTYPE.options.map((k, index) => {
                            return <Option value={k.type} key={CTYPE.options}>{k.label}</Option>
                        })}
                    </Select>
                </Form.Item>
                {content.map((detail, index) => {
                    let {type, number, score} = detail;
                    return <div key={index}>
                        <Form.Item {...CTYPE.formItemLayout} required="true" label="题型">
                            <span
                                key={index}
                                style={{marginRight: '5px'}}>{type === 1 ? '单选' : type === 2 ? '多选' : type === 3 ? '判断' : type === 4 ? '填空' : '问答'}题</span>
                            <InputNumber min={0} value={number} style={{width: '70px'}} onChange={(value) => {
                                content[index].number = value;
                                this.setState({
                                    template: {
                                        ...template,
                                        content
                                    }
                                }, () => {
                                    this.calc();
                                });
                            }}/>
                            <span style={{margin: '0 5px'}}>道,每道</span>
                            <InputNumber min={0} value={score} style={{width: '70px'}} onChange={(value) => {
                                content[index].score = value;
                                this.setState({
                                    template: {
                                        ...template,
                                        content,
                                    }
                                }, () => {
                                    this.calc();
                                });
                            }}/>
                            <span style={{marginLeft: '5px'}}>分</span>
                        </Form.Item>
                    </div>
                })}
                <Form.Item {...CTYPE.formItemLayout} required="true" label="考试时间">
                    <InputNumber min={0} max={180} style={{width: '250px'}} value={_duration} onChange={(e) => {
                        this.setState({
                            _duration: e
                        })
                    }}/>
                    <span style={{marginLeft: "10px"}}>分钟</span>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="总分">
                    <Input min={0} disabled={true} style={{width: '80px'}} value={totalScore}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="及格分数">
                    <Input min={0} disabled={true} style={{width: '80px'}} value={passingScore}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="状态">
                    <Switch checkedChildren="启用" unCheckedChildren="停用" checked={status === 1} onChange={(chk) => {
                        this.setState({
                            template: {
                                ...template,
                                status: chk ? 1 : 2
                            }
                        })
                    }}/>
                </Form.Item>

            </Card>
        </div>
    }
}

export default Form.create()(TemplateEdit);