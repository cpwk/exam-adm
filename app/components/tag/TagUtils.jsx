import React from 'react';
import TagEdit from "./TagEdit";
import {Utils} from "../../common";

let TagUtils = (() => {

    let edit = (tag, loadData) => {
        Utils.common.renderReactDOM(<TagEdit tag={tag} loadData={loadData}/>);
    };

    return {
        edit
    }

})();

export default TagUtils;