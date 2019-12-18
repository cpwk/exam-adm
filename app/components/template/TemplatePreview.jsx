import React, {Component} from 'react';
import App from "../../common/App";
import {CTYPE} from "../../common";
import BreadcrumbCustom from "../BreadcrumbCustom";
import Link from "react-router-dom/Link";
import {Button, Card, Radio, Input, Checkbox} from "antd";
import "../../assets/css/template/TemplatePreview.less"

class TemplatePreview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
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
            App.api('/oms/template/getById', {id}).then((template) => {
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
        let {templateName, duration, totalScore, passingScore} = template;

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
                                        {(k.type === 1 || k.type === 2) &&
                                        <li>
                                            {(k.type === 1 || k.type === 2) &&
                                            index + 1 + (":") + "(" + CTYPE.displayType[`${k.type - 1}`] + ")"}
                                            <li dangerouslySetInnerHTML={{__html: k.topic}}/>
                                            <li>
                                                {k.options.map((obj, i) => {
                                                    return k.type === 1 ? <Radio>{CTYPE.ABC[i]}.{obj}</Radio> :
                                                        <Checkbox>{CTYPE.ABC[i]}.{obj}</Checkbox>
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
                                                    return <Radio>{k.label}</Radio>
                                                })}
                                            </li>
                                        </li>}
                                    </li>
                                    <li>
                                        {(k.type === 4 || k.type === 5) &&
                                        <li>
                                            {(k.type === 4 || k.type === 5) &&
                                            index + 1 + (":") + "(" + CTYPE.displayType[`${k.type - 1}`] + ")"}
                                            <li dangerouslySetInnerHTML={{__html: k.topic}}/>
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