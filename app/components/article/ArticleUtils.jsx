import React from 'react';
import Utils from "../../common/Utils";

let ArticleUtils = (() => {


    let currentPageKey = 'key-article-pageno';

    let setCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentPageKey, pageno);
    };

    let getCurrentPage = () => {
        return Utils._getCurrentPage(currentPageKey);
    };

    return {
        setCurrentPage, getCurrentPage,
    }

})();

export default ArticleUtils;