import React from 'react';
import AuditOrgDetail from "./AuditOrgDetail";
import Utils from "../../common/Utils";
import AuditorAdd from "./AuditorAdd";
import AuditorPwd from "./AuditorPwd";

let AuditorUtils = (() => {

    let accountTypes = [{k: 1, v: '分管领导'}, {k: 2, v: '主要负责人'}, {k: 3, v: '科员'}];

    let accountType = (type) => {
        return accountTypes.find(t => t.k === type).v;
    };

    let auditOrgDetail = (id, index, syncAuditOrg) => {
        Utils.common.renderReactDOM(<AuditOrgDetail id={id} index={index} syncAuditOrg={syncAuditOrg}/>);
    };

    let auditorAdd = (auditOrg) => {
        Utils.common.renderReactDOM(<AuditorAdd auditOrg={auditOrg}/>);
    };

    let auditorPwd = (auditor) => {
        Utils.common.renderReactDOM(<AuditorPwd auditor={auditor}/>);
    };

    return {
        accountTypes, accountType, auditOrgDetail, auditorAdd, auditorPwd
    }

})();

export default AuditorUtils;