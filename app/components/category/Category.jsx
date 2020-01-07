import React from 'react';
import 'antd/dist/antd.css';
import {Tree, Icon, Card, Button, Modal, notification, message} from 'antd';
import App from "../../common/App";
import CategoryUtils from "./CategoryUtils";

const {TreeNode} = Tree;

export default class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        this.setState({loading: true});
        App.api('/oms/category/categorys',{oms:true})
            .then((list) => {
                this.setState({
                    list,
                    loading: false
                });
            });
    };

    edit = question => {
        App.go(`/app/question/questionEdit/${question.id}`)
    };

    status = (id, status) => {
        let txt = status === 1 ? '禁用' : '启用';
        Modal.confirm({
            title: `确认${txt}?`,
            onOk: () => {
                App.api('/oms/category/status', {id, status: status === 1 ? 2 : 1}).then(() => {
                    notification['success']({
                        message: '提示',
                        description: `${txt} 成功`,
                    });
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    remove = (id) => {
        Modal.confirm({
            title: `确认删除操作?此操作将删除分类下所有单选题和材料`,
            onOk: () => {
                App.api('/oms/category/remove', {id}).then(() => {
                    message.success(`操作成功`);
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    renderTitle = (category, parent, level, index) => {
        let {id, name, priority, status, children = []} = category;
        let on = status === 1;
        category.level = level;
        category.index = index;
        return <span style={{color: on ? 'black' : 'gray'}}>
            [{priority}]{name}
            &nbsp;
            <a title='编辑分类' onClick={() => {
                CategoryUtils.editType(category, parent, this.loadData);
            }}><Icon type='edit'/></a>
            {level !== 3 && <span>&nbsp;
                <a title='新建子分类' onClick={() => {
                    CategoryUtils.editType({
                        id: 0,
                        level: level + 1,
                        index: children.length + 1
                    }, category, this.loadData);
                }}><Icon type='file-add' theme="twoTone" twoToneColor="#91d5ff"/></a>
            </span>}
            &nbsp;
            <a onClick={() => {
                this.status(id, status);
            }}>{on ? <Icon type='stop' theme="twoTone" twoToneColor="#ffa39e"/> :
                <Icon type='check-circle' theme="twoTone" twoToneColor="#b7eb8f"/>}</a>
            &nbsp;
            <a onClick={() => {
                this.remove(id);
            }}><Icon type='delete' theme="twoTone" twoToneColor="#ff0000"/></a>

        </span>;
    };

    render() {

        let {list = []} = this.state;

        return <div>

            <Card bordered={false} extra={<Button type="primary" icon="file-add" onClick={() => {
                CategoryUtils.editType({id: 0, level: 1, index: list.length + 1}, {id: 0}, this.loadData);
            }}>新建一级分类</Button>}>

                <Tree defaultExpandAll showLine>
                    {list.map((v, index1) => {
                        let {name, children = []} = v;
                        return <TreeNode title={this.renderTitle(v, {id: 0}, 1, index1 + 1)} key={`${index1}`}>

                            {children.map((va, index2) => {
                                let {name, children = []} = va;
                                return <TreeNode title={this.renderTitle(va, v, 2, index2 + 1)}
                                                 key={`${index1}-${index2}`}>

                                    {children.map((val, index3) => {
                                        let {name} = val;
                                        return <TreeNode title={this.renderTitle(val, va, 3, index3 + 1)}
                                                         key={`${index1}-${index2}-${index3}`}/>
                                    })}

                                </TreeNode>
                            })}

                        </TreeNode>
                    })}


                </Tree>

            </Card>
        </div>
    }
}

