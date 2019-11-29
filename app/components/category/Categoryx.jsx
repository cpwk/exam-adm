import React from 'react';
import 'antd/dist/antd.css';
import {Tree} from 'antd';
import App from "../../common/App";


const {TreeNode} = Tree;

export default class Categoryx extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        this.setState({loading: true});
        App.api('/oms/category/father')
            .then((list) => {
                this.setState({
                    list,
                });
            });
    };

    render() {

        let {list} = this.state;

        return <div>

            <Tree defaultExpandAll showLine>
                {list.map((v, index1) => {
                    let {name, children = []} = v;
                    return <TreeNode title={name} value={name} key={index1}>
                        {children.map((va, index2) => {
                            let {name, children = []} = va;
                            return <TreeNode
                                key={`${index1}-${index2}`}
                                value={name}
                                title={name}>
                                {children.map((val, index3) => {
                                    let {name} = val;
                                    return <TreeNode
                                        title={name}
                                        value={name}
                                        key={`${index1}-${index2}-${index3}`}/>
                                })}
                            </TreeNode>
                        })}
                    </TreeNode>
                })}
            </Tree>
        </div>
    }
}

