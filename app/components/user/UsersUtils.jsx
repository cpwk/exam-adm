import React from 'react';
import Profiles from "./Profiles";
import {Utils} from "../../common";

let UserUtils = (() => {

    let edit = (id, loadData) => {
        Utils.common.renderReactDOM(<Profiles id={id} loadData={loadData}/>);
    };

    return {
        edit
    }

})();

export default UserUtils;