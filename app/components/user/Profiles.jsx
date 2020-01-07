import React, {Component} from 'react';
import {Card} from "antd";
import {App, U} from "../../common";

class Profiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
        }
    }

    componentDidMount() {
        U.setWXTitle("账号详情")
    }

    loadData = () => {

    };

    render() {

        return <div>

        </div>
    }
}

export default Profiles;