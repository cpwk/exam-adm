import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import '../../assets/css/home/home.less'

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {

        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom/>

                <div className='home-page'>
                </div>

            </div>
        )
    }
}

export default Dashboard;
