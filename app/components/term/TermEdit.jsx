import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Form, InputNumber, message} from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";

const FormItem = Form.Item;

const minY = new Date().getFullYear();

export default class TermEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            term: {year: minY, termIndex: 1},
        }
    }

    componentDidMount() {
        let {id} = this.state;
        if (id !== 0) {
            App.api('adm/term/term', {id}).then((term) => {
                this.setState({
                    term
                });
            })
        }
    }

    handleSubmit = () => {

        let {term = {}} = this.state;


        let {year, termIndex, setDefault, status} = term;

        if (U.str.isEmpty(year)) {
            message.warn('请输入学年');
            return
        }
        term.sequence = this.gSequence(year, termIndex);
        if (U.str.isEmpty(setDefault)) {
            term.setDefault = 0;
        }
        if (U.str.isEmpty(status)) {
            term.status = 1;
        }
        App.api('adm/term/save_term', {term: JSON.stringify(term)}).then((res) => {
            message.success('已保存');
            window.history.back();
        });
    };

    gSequence = (year, termIndex) => {
        return year.toString() + U.date.pad(termIndex);
    };

    render() {

        let {term = {}} = this.state;

        let {year, termIndex} = term;

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.terms.path}>{CTYPE.link.terms.txt}</Link>}
                    second='编辑学期'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.handleSubmit()
                               }}
                               htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="学年">
                    <InputNumber value={year} style={{width: '100px'}} min={minY} onChange={(year) => {
                        this.setState({
                            term: {
                                ...term,
                                year
                            }
                        })
                    }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="学期">
                    <InputNumber value={termIndex} style={{width: '100px'}} min={1} max={4} onChange={(termIndex) => {
                        this.setState({
                            term: {
                                ...term,
                                termIndex
                            }
                        })
                    }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="识别码">
                    {this.gSequence(year, termIndex)}
                </FormItem>

            </Card>
        </div>
    }
}