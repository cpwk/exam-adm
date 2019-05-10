import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Input, InputNumber, message, Modal, Select, Switch} from 'antd';
import '../../assets/css/common/common-edit.less'

const Option = Select.Option;

const id_div = 'div-dialog-job-edit';

export default class JobEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            job: this.props.job,
            jobTypes: []
        };
    }

    componentDidMount() {
        App.api('adm/job/jobTypes').then((jobTypes) => {
            this.setState({jobTypes});
        });
    }

    submit = () => {

        let {job = {}} = this.state;
        let {id, title, pay, location, responsibility = [], skill = [], priority, type} = job;

        if (U.str.isEmpty(type) || type === 0) {
            message.warn('请选择类型');
            return;
        }
        if (U.str.isEmpty(title)) {
            message.warn('请填写标题');
            return;
        }
        if (U.str.isEmpty(pay)) {
            message.warn('请填写薪资');
            return;
        }
        if (U.str.isEmpty(location)) {
            message.warn('请填写工作地址');
            return;
        }
        if (responsibility.length === 0) {
            message.warn('请填写工作职责');
            return;
        }
        if (skill.length === 0) {
            message.warn('请填写岗位要求');
            return;
        }
        if (U.str.isEmpty(priority)) {
            job.priority = 1;
        }
        if (U.str.isEmpty(status)) {
            job.status = 1;
        }

        App.api('adm/job/save', {
                job: JSON.stringify(job)
            }
        ).then(() => {
            message.success('已保存');
            this.props.loadData();
            this.close();
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {job = {}, jobTypes = []} = this.state;

        let {id, title, pay, location, responsibility = [''], skill = [''], status = 1, priority, type = 1} = job;

        return <Modal title={'编辑职位'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'1000px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <div className='p'>类型</div>
                        <Select value={type.toString()} style={{width: 300}} onChange={(v) => {
                            this.setState({
                                job: {
                                    ...job,
                                    type: parseInt(v)
                                }
                            })
                        }}>
                            <Option key='0'>请选择</Option>
                            {jobTypes.map((t) => {
                                return <Option key={t.key.toString()}>{t.val}</Option>

                            })}
                        </Select>
                    </div>


                    <div className="line">
                        <div className='p required'>名称</div>
                        <input type="input" style={{width: 300}} className="input-wide" placeholder="输入名称"
                               value={title} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       job: {
                                           ...job,
                                           title: e.target.value
                                       }
                                   })
                               }}/>
                    </div>


                    <div className="line">
                        <div className='p required'>薪资</div>
                        <input type="input" className="input-wide" value={pay} maxLength={512}
                               onChange={(e) => {
                                   this.setState({
                                       job: {
                                           ...job,
                                           pay: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <div className='p required'>工作地址</div>
                        <input type="input" className="input-narrow" value={location} maxLength={512}
                               onChange={(e) => {
                                   this.setState({
                                       job: {
                                           ...job,
                                           location: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <div className='p required'>工作职责</div>
                        <Card style={{width: 800}} bodyStyle={{padding: 15}}>
                            {responsibility.map((val, i) => {
                                return <div className='array-edit-block' key={i}>
                                    <Input
                                        value={val}
                                        onChange={(e) => {
                                            responsibility[i] = e.target.value;
                                            this.setState({
                                                job: {
                                                    ...job,
                                                    responsibility
                                                }
                                            });
                                        }}/>
                                    <div className='span'>

                                        {responsibility.length !== 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="minus"
                                                onClick={() => {
                                                    responsibility = U.array.remove(responsibility, i);
                                                    this.setState({
                                                        job: {
                                                            ...job,
                                                            responsibility
                                                        }
                                                    });
                                                }}/>}

                                        {i === responsibility.length - 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="plus"
                                                onClick={() => {
                                                    if (responsibility.length < 10) {
                                                        responsibility.push('');
                                                        this.setState({
                                                            job: {
                                                                ...job,
                                                                responsibility
                                                            }
                                                        });
                                                    } else {
                                                        message.warning('最多添加10个');
                                                    }
                                                }}/>}

                                    </div>
                                </div>
                            })}
                        </Card>
                    </div>


                    <div className="line">
                        <div className='p required'>岗位要求</div>
                        <Card style={{width: 800}} bodyStyle={{padding: 15}}>
                            {skill.map((val, i) => {
                                return <div className='array-edit-block' key={i}>
                                    <Input
                                        value={val}
                                        onChange={(e) => {
                                            skill[i] = e.target.value;
                                            this.setState({
                                                job: {
                                                    ...job,
                                                    skill
                                                }
                                            });
                                        }}/>
                                    <div className='span'>

                                        {skill.length !== 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="minus"
                                                onClick={() => {
                                                    skill = U.array.remove(skill, i);
                                                    this.setState({
                                                        job: {
                                                            ...job,
                                                            skill
                                                        }
                                                    });
                                                }}/>}

                                        {i === skill.length - 1 &&
                                        <Button type='primary' size='small' shape="circle" icon="plus"
                                                onClick={() => {
                                                    if (skill.length < 10) {
                                                        skill.push('');
                                                        this.setState({
                                                            job: {
                                                                ...job,
                                                                skill
                                                            }
                                                        });
                                                    } else {
                                                        message.warning('最多添加10个');
                                                    }
                                                }}/>}

                                    </div>
                                </div>
                            })}
                        </Card>
                    </div>

                    <div className="line">
                        <div className='p'>权重</div>
                        <InputNumber
                            value={priority} max={99}
                            onChange={(v) => {
                                this.setState({
                                    job: {
                                        ...job,
                                        priority: v
                                    }
                                })
                            }}/>
                    </div>

                    <div className="line">
                        <div className='p'>上架</div>
                        <Switch checked={status === 1} onChange={(chk) => {
                            this.setState({
                                job: {
                                    ...job,
                                    status: chk ? 1 : 2
                                }
                            })
                        }}/>

                    </div>

                </div>

            </div>
        </Modal>
    }
}
