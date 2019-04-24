import React from 'react';

let QAUtils = (() => {

    let statusTypes = [{k: 0, v: '全部'}, {k: 1, v: '未处理'}, {k: 2, v: '已处理'}, {k: 3, v: '废弃'}];

    return {
        statusTypes
    }

})();

export default QAUtils;