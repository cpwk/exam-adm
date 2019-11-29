import React from 'react';
import CategoryEdit from "./CategoryEdit";
import {Utils} from "../../common";

let CategoryUtils = (() => {

    let edit = (category, loadData) => {
        Utils.common.renderReactDOM(<CategoryEdit category={category} loadData={loadData}/>);
    };

    return {
        edit
    }

})();

export default CategoryUtils;