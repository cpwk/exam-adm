import React from 'react';
import PartnerEdit from "./PartnerEdit";
import {Utils} from "../../common";

let PartnerUtils = (() => {

    let edit = (partner, loadData) => {
        Utils.common.renderReactDOM(<PartnerEdit partner={partner} loadData={loadData}/>);
    };

    return {
        edit
    }

})();

export default PartnerUtils;