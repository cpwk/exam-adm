import React from 'react';
import App from "../../common/App";
import {Button, Card, Form, Input, message, Select, Switch} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import Link from "react-router-dom/Link";
import {CTYPE, Utils} from "../../common";

const Option = Select.Option;

class PaperEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            uploading: false,
            paper: {},
            template: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        let {pagination} = this.state;
        this.setState({loading: true});
        App.api('/oms/template/template_list', {
            templateQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((template) => {
            let pagination = Utils.pager.convert2Pagination(template);
            this.setState({
                template: template.content,
                loading: false,
                pagination
            });
        })
    };

    handleSubmit = () => {
        let {paper} = this.state;
        App.api('/oms/paper/save', {
            paper: JSON.stringify({
                ...paper
            })
        }).then(() => {
            message.success("保存成功");
            window.history.back()
        })
    };

    render() {

        let {paper, template = []} = this.state;
        let {name, status} = paper;

        return <div>
            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.paper.path}>{CTYPE.link.paper.txt}</Link>}
                    second='新建试卷'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.handleSubmit()
                               }}
                               htmlType="submit">生成试卷</Button>}
                style={CTYPE.formStyle}>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="名称">
                    <Input style={{width: '290px'}} value={name} onChange={(e) => {
                        this.setState({
                            paper: {
                                ...paper,
                                name: e.target.value
                            }
                        })
                    }}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="模板选择">
                    <Select placeholder="全部模板" style={{width: 290}} onSelect={(value) => {
                        let _template = template.find((item) => item.id === value);
                        this.setState({
                            paper: {
                                ...paper,
                                templateId: value,
                                passingScore: _template.passingScore,
                                duration: _template.duration,
                                totalScore: _template.totalScore
                            }
                        })
                    }}>
                        {template.map((t, index) => {
                            return <Option key={index} value={t.id}>{t.templateName}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="考试时长">
                    <Input style={{width: '290px'}} value={paper.duration}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="总分数">
                    <Input style={{width: '290px'}} value={paper.totalScore}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="及格分数">
                    <Input style={{width: '290px'}} value={paper.passingScore}/>
                </Form.Item>
                <Form.Item {...CTYPE.formItemLayout} required="true" label="状态">
                    <Switch checkedChildren="上架" unCheckedChildren="下架" checked={status === 1} onChange={(chk) => {
                        this.setState({
                            paper: {
                                ...paper,
                                status: chk ? 1 : 2
                            }
                        })
                    }}/>
                </Form.Item>
            </Card>
        </div>
    }
}

export default Form.create()(PaperEdit);