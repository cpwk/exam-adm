import React, {Component} from 'react';
import App from "../../common/App";
import {CTYPE, Utils} from "../../common";
import BreadcrumbCustom from "../BreadcrumbCustom";
import Link from "react-router-dom/Link";
import {Card, Radio, Input, Checkbox} from "antd";
import "../../assets/css/template/TemplatePreview.less"

const DIFFICULTY = [{difficulty: 1, label: '简单'}, {difficulty: 2, label: '一般'}, {difficulty: 3, label: '困难'}];
const OPTIONS = [{type: 1, label: '单选'}, {type: 2, label: '多选'}, {type: 3, label: '判断'},
    {type: 4, label: '填空'}, {type: 5, label: '问答'}];
const JUDGE = [{answer: "1", label: '对'}, {answer: "2", label: '错'}];


class PaperPreview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            paper: {}
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        if (id > 0) {
            App.api('/oms/paper/preview', {id}).then((paper) => {
                    this.setState({paper: paper});
                    this.setForm(paper);
                }
            );
        }
    };

    setForm = (paper) => {
        let {name, questions, status, totalScore, duration, templateId, passingScore} = paper;
        this.props.form.setFieldsValue({
            ...paper,
            templateId,
            questions,
            name,
            status,
            totalScore,
            duration,
            passingScore
        });
    };

    render() {
        let {paper} = this.state;
        let {name, duration, totalScore, passingScore} = paper;
        console.log(duration);
        // let {templateName, content, status, difficulty, category, duration, passingScore} = template;

        let {questions = []} = paper;

        return <div>
            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.template.path}>{CTYPE.link.template.txt}</Link>}
                    second='模板预览'/>}
            >
                <div className="paper">
                    <div className="paper-name">
                        <h1>{name}</h1>
                    </div>
                    <div className="paper-standard">
                        <ul>
                            <li><span>考试时间:</span>{duration}<span>/分钟</span></li>
                            <li><span>总分:</span>{totalScore}<span>/分</span></li>
                            <li><span>及格分:</span>{passingScore}<span>/分</span></li>
                        </ul>
                    </div>
                    <div className="paper-content">
                        {questions.map((k, index) => {
                            return <div>
                                <ul>
                                    <li>
                                        {(k.type === 1 || k.type === 2 || k.type === 3) &&
                                        <li>
                                            {(k.type === 1 || k.type === 2 || k.type === 3) &&
                                            index + (":") + (`${k.type}`) + k.topic}
                                            <li>
                                                {k.type === 3 ? null : k.options.map((obj, i) => {
                                                    return k.type === 1 ? <Radio>{obj}</Radio> : k.type === 2 ?
                                                        <Checkbox>{obj}</Checkbox> :
                                                        <li>
                                                            {JUDGE.map((k, index) => {
                                                                return <Radio value={k.answer}
                                                                              key={JUDGE}>{k.label}</Radio>
                                                            })}
                                                        </li>
                                                })}
                                            </li>
                                        </li>}
                                    </li>
                                    <li>
                                        {(k.type === 4 || k.type === 5) &&
                                        <li>
                                            {(k.type === 4 || k.type === 5) &&
                                            index + (":") + (`${k.type}`) + k.topic}
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

export default PaperPreview;