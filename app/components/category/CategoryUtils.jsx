import React from 'react';
import CategoryEdit from "./CategoryEdit";
import {Utils} from "../../common";

let CategoryUtils = (() => {

    let edit = (category, loadData) => {
        Utils.common.renderReactDOM(<CategoryEdit category={category} loadData={loadData}/>);
    };

    let editType = (category, parent, loadData) => {
        Utils.common.renderReactDOM(<CategoryEdit category={category} parent={parent} loadData={loadData}/>);
    };

    return {
        edit, editType
    }

})();


export default CategoryUtils;