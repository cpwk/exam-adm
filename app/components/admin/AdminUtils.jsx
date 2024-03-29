import React from 'react';
import AdminSessions from "./AdminSessions";
import {Utils} from "../../common";
import ModAdminPwd from "./ModAdminPwd";


let AdminUtils = (() => {

    let adminSessions = (adminId) => {
        Utils.common.renderReactDOM(<AdminSessions adminId={adminId}/>);
    };

    let modAdminPwd = () => {
        Utils.common.renderReactDOM(<ModAdminPwd/>);
    };

    return {
        adminSessions, modAdminPwd
    }

})();

export default AdminUtils;