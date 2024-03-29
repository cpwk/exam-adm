import React, {Component} from 'react';
import App from "../../common/App";
import {CTYPE} from "../../common";
import BreadcrumbCustom from "../BreadcrumbCustom";
import Link from "react-router-dom/Link";
import {Card} from "antd";
import "../../assets/css/template/TemplatePreview.less"

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
        let {questions = []} = paper;

        return <div>
            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.template.path}>{CTYPE.link.template.txt}</Link>}
                    second='试卷预览'/>}
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
                                        {(k.type === 1 || k.type === 2) &&
                                        <li>
                                            {(k.type === 1 || k.type === 2) &&
                                            index + 1 + (":") + "(" + CTYPE.displayType[`${k.type - 1}`] + ")" + k.topic}

                                            <li>
                                                {k.options.map((obj, i) => {
                                                    return k.type === 1 ? <li>{CTYPE.ABC[i]}.{obj}</li> :
                                                        <li>{CTYPE.ABC[i]}.{obj}</li>
                                                })}
                                            </li>
                                        </li>}
                                    </li>
                                    <li>
                                        {k.type === 3 &&
                                        <li>
                                            {k.type === 3 &&
                                            index + 1 + (":") + "(" + CTYPE.displayType[`${k.type - 1}`] + ")"}
                                            <li dangerouslySetInnerHTML={{__html: k.topic}}/>
                                            <li>
                                                {CTYPE.judge.map((k, index) => {
                                                    return <li>{k.answer}.{k.label}</li>
                                                })}
                                            </li>
                                        </li>}
                                    </li>
                                    <li>
                                        {(k.type === 4 || k.type === 5) &&
                                        <li>
                                            {(k.type === 4 || k.type === 5) &&
                                            index + 1 + (":") + "(" + CTYPE.displayType[`${k.type - 1}`] + ")" + k.topic}
                                            <li>
                                                答：
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