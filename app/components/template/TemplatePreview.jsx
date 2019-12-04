import React, {Component} from 'react';
import App from "../../common/App";

class TemplatePreview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            uploading: false,
            template: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
    };

    render() {

        return <div className="page">


        </div>
    }
}

export default TemplatePreview;