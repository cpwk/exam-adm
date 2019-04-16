import React from 'react';
import Utils from "../../common/Utils";
import TraineePwd from "./TraineePwd";
import TraineeSessions from "./TraineeSessions";

let TraineeUtils = (() => {

    let educationTypes = [{k: 1, v: '本科'}, {k: 2, v: '专科'}, {k: 3, v: '高中'}];

    let traineeSessions = (traineeId) => {
        Utils.common.renderReactDOM(<TraineeSessions traineeId={traineeId}/>);
    };

    let traineePwd = (trainee) => {
        Utils.common.renderReactDOM(<TraineePwd trainee={trainee}/>);
    };

    let currentPageKey = 'key-trainee-pageno';

    let setCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentPageKey, pageno);
    };

    let getCurrentPage = () => {
        return Utils._getCurrentPage(currentPageKey);
    };

    return {
        setCurrentPage, getCurrentPage,
        educationTypes, traineeSessions, traineePwd
    }

})();

export default TraineeUtils;