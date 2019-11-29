import React from 'react';
import TagEdit from "./tagEdit";
import {Utils} from "../../common";

let CategoryUtils = (() => {

    let edit = (tag, loadData) => {
        Utils.common.renderReactDOM(<TagEdit tag={tag} loadData={loadData}/>);
    };

    return {
        edit
    }

})();

export default CategoryUtils;