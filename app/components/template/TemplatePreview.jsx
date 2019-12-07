import React, {Component} from 'react';
import App from "../../common/App";
import {CTYPE} from "../../common";
import BreadcrumbCustom from "../BreadcrumbCustom";
import Link from "react-router-dom/Link";
import {Button, Card, Radio, Input, Checkbox} from "antd";
import "../../assets/css/template/TemplatePreview.less"

const DIFFICULTY = [{difficulty: 1, label: '简单'}, {difficulty: 2, label: '一般'}, {difficulty: 3, label: '困难'}];
const OPTIONS = [{type: 1, label: '单选'}, {type: 2, label: '多选'}, {type: 3, label: '判断'},
    {type: 4, label: '填空'}, {type: 5, label: '问答'}];
const JUDGE = [{answer: "1", label: '对'}, {answer: "2", label: '错'}];


class TemplatePreview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            uploading: false,
            template: {},
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        if (id > 0) {
            App.api('/oms/template/template_id', {id}).then((template) => {
                    this.setState({template: template});
                    this.setForm(template);
                }
            );
            App.api('/oms/template/create', {id}).then((list) => {
                this.setState({list: list})
            })
        }
    };

    setForm = (template) => {
        let {templateName, content, status, difficulty, category, duration, passingScore} = template;
        this.props.form.setFieldsValue({
            ...template,
            difficulty,
            templateName,
            content,
            status,
            category,
            duration,
            passingScore
        });
    };

    render() {
        let {template, list = []} = this.state;
        let {templateName, duration, totalScore, difficulty, passingScore} = template;

        OPTIONS.map((k, index) => {
            return <Input value={k.type} key={OPTIONS}>{k.label}</Input>
        });

        return <div>
            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.template.path}>{CTYPE.link.template.txt}</Link>}
                    second='模板预览'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.create()
                               }}
                               htmlType="submit">生成试卷</Button>}>
                <div className="paper">
                    <div className="paper-name">
                        <h1>{templateName}</h1>
                    </div>
                    <div className="paper-standard">
                        <ul>
                            <li><span>考试时间:</span>{duration}<span>/分钟</span></li>
                            <li><span>总分:</span>{totalScore}<span>/分</span></li>
                            <li><span>及格分:</span>{passingScore}<span>/分</span></li>
                        </ul>
                    </div>
                    <div className="paper-content">
                        {list.map((k, index) => {
                            return <div>
                                <ul>
                                    <li>
                                        {(k.type === 1 || k.type === 2 || k.type === 3) &&
                                        <li>
                                            {(k.type === 1 || k.type === 2 || k.type === 3) &&
                                            index+1 + (":") + (`${k.type}`) + k.topic}
                                            <li>
                                                {k.type === 3 ? null : k.options.map((obj, i) => {
                                                    return k.type === 1 ? <Radio>{obj}</Radio> :
                                                        <Checkbox>{obj}</Checkbox>
                                                })}
                                            </li>
                                        </li>}
                                    </li>
                                    {/*<li>*/}
                                    {/*    {k.type === 3 &&*/}
                                    {/*    <li>*/}
                                    {/*        {k.type === 3 &&*/}
                                    {/*        index + (":") + (`${k.type}`) + k.topic}*/}
                                    {/*        <li>*/}
                                    {/*            {JUDGE.map((k, index) => {*/}
                                    {/*                return <Radio value={k.answer} key={JUDGE}>{k.label}</Radio>*/}
                                    {/*            })}*/}
                                    {/*        </li>*/}
                                    {/*    </li>}*/}
                                    {/*</li>*/}
                                    <li>
                                        {(k.type === 4 || k.type === 5) &&
                                        <li>
                                            {(k.type === 4 || k.type === 5) &&
                                            index+1 + (":") + (`${k.type}`) + k.topic}
                                            <li>
                                                <Input/>
                                            </li>
                                        </li>}
                                    </li>
                                </ul>
                            </div>
                        })}
                    </div>
                </div>
            </Card>
        </div>
    }
}

export default TemplatePreview;