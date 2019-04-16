import React from 'react';
import Utils from "../../common/Utils";
import TrainerPwd from "./TrainerPwd";
import TrainerSessions from "./TrainerSessions";

let TrainerUtils = (() => {


    let trainerSessions = (trainerId) => {
        Utils.common.renderReactDOM(<TrainerSessions trainerId={trainerId}/>);
    };

    let trainerPwd = (trainer) => {
        Utils.common.renderReactDOM(<TrainerPwd trainer={trainer}/>);
    };

    return {
        trainerSessions, trainerPwd
    }

})();

export default TrainerUtils;