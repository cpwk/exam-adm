import React from 'react';
import ReactDOM from 'react-dom';
import JobEdit from "./JobEdit";

let JobUtils = (() => {

    let edit = (job, loadData) => {
        let div = document.createElement('div');
        document.body.appendChild(div);
        ReactDOM.render(<JobEdit job={job} loadData={loadData}/>, div);
    };

    return {
        edit
    }

})();

export default JobUtils;