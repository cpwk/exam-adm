import React from 'react';
import QuestionEdit from "./QuestionEdit";
import {Utils} from "../../common";

let QuestionUtils = (() => {


    let edit = (question, loadData) => {
        Utils.common.renderReactDOM(<QuestionEdit question={question} loadData={loadData}/>);
    };

    return {
        edit
    }


})();

export default QuestionUtils;