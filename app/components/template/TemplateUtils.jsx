import React from 'react';
import {Utils} from "../../common";
import TemplateConten from "./TemplateContent";


let TemplateUtils = (() => {
    let edit = (template, loadDate) => {
        Utils.common.renderReactDOM(<TemplateConten template={template} loadData={loadDate}/>)
    };
    return {
        edit
    }
})();


export default TemplateUtils;