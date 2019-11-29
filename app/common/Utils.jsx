import NProgress from 'nprogress';
import React from 'react';
import ReactDOM from 'react-dom';
import DialogQRCode from "../components/common/DialogQRCode";
import {App, CTYPE, KvStorage} from "./index";
import ImgLightbox from "./ImgLightbox";
import ImgEditor from "./ImgEditor";

import {Alert, LocaleProvider, Modal} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import DialogExport from "./DialogExport";
import XiumiEditor from "./XiumiEditor";
import Spider from "./Spider";

let Utils = (function () {

    let _setCurrentPage = (key, pageno) => {
        sessionStorage.setItem(key, pageno);
    };

    let _getCurrentPage = (key) => {
        return sessionStorage.getItem(key) ? parseInt(sessionStorage.getItem(key)) : 1
    };

    let _setTabIndex = (key, index) => {
        sessionStorage.setItem(key, index);
    };

    let _getTabIndex = (tabKey) => {
        return sessionStorage.getItem(tabKey) ? parseInt(sessionStorage.getItem(tabKey)) : 0
    };

    let _setTabKey = (key, v) => {
        sessionStorage.setItem(key, v);
    };

    let _getTabKey = (tabKey) => {
        return sessionStorage.getItem(tabKey);
    };

    let nProgress = (() => {
        NProgress.configure({showSpinner: false});
        return {
            start: () => {
                NProgress.start();
            },
            done: () => {
                NProgress.done();
            },
        }
    })();

    let qrcode = (() => {

        let show = (url, avatar, title, copyStr) => {
            common.renderReactDOM(<DialogQRCode url={url} avatar={avatar} title={title} copyStr={copyStr}/>);
        };

        return {show}
    })();


    let common = (() => {

        let renderReactDOM = (child, options = {}) => {

            let div = document.createElement('div');
            let {id} = options;
            if (id) {
                let e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            } else {

            }

            document.body.appendChild(div);
            ReactDOM.render(<LocaleProvider locale={zhCN}>{child}</LocaleProvider>, div);
        };

        let closeModalContainer = (id_div) => {
            let e = document.getElementById(id_div);
            if (e) {
                document.body.removeChild(e);
            }
        };

        let createModalContainer = (id_div) => {
            //强制清理同名div，render会重复创建modal
            closeModalContainer(id_div);
            let div = document.createElement('div');
            div.setAttribute('id', id_div);
            document.body.appendChild(div);
            return div;
        };

        let showImgLightbox = (images, index) => {
            common.renderReactDOM(<ImgLightbox images={images} index={index} show={true}/>);
        };

        let showImgEditor = (aspectRatio, img, syncImg) => {
            common.renderReactDOM(<ImgEditor aspectRatio={aspectRatio} img={img}
                                             syncImg={syncImg}/>, {id: 'div-img-editor'});
        };

        let xiumiEditor = (syncContentWrap) => {
            common.renderReactDOM(<XiumiEditor syncContentWrap={syncContentWrap}/>);
        };

        let wxSpider = (onSpiderOK) => {
            Utils.common.renderReactDOM(<Spider onSpiderOK={onSpiderOK}/>);
        };

        return {
            renderReactDOM, closeModalContainer, createModalContainer, showImgLightbox, showImgEditor,
            xiumiEditor, wxSpider
        }
    })();

    let addr = (() => {

        let regions = [];

        let loadRegion = (component) => {
            if (regions && regions.length > 0) {
                component.setState({
                    regions: regions
                });
            } else {
                fetch(CTYPE.REGION_PATH).then(res => {
                    res.json().then((_regions) => {
                        regions = _regions;
                        component.setState({
                            regions: _regions
                        });
                    });
                });
            }
        };

        let getCodes = (code) => {
            let codes = [3];
            if (code && code.length === 6) {
                codes[0] = code.substr(0, 2);
                codes[1] = code.substr(0, 4);
                codes[2] = code;
            }
            return codes;
        };

        let getPCD = (code) => {
            console.log(code);
            if (!regions || regions.length === 0 || !code || code === '') {
                return null;
            }
            let codes = getCodes(code);
            let pcd = '';
            regions.map((r1, index1) => {
                if (r1.value === codes[0]) {
                    pcd = r1.label;
                    r1.children.map((r2, index2) => {
                        if (r2.value === codes[1]) {
                            pcd += ' ' + r2.label;
                            r2.children.map((r3, index3) => {
                                if (r3.value === code) {
                                    pcd += ' ' + r3.label;
                                }
                            })
                        }
                    })
                }
            });
            console.log(pcd);
            return pcd;
        };

        return {loadRegion, getPCD, getCodes}

    })();

    let adminPermissions = null;

    let adm = (() => {

        let avatar = (img) => {
            return img ? img : require('../assets/image/common/logo_square.png');
        };

        let savePermissions = (permissions) => {
            KvStorage.set('admin-permissions', permissions);
            initPermissions();
        };

        let getPermissions = () => {
            return KvStorage.get('admin-permissions') || '';
        };

        let authPermission = (f) => {
            return getPermissions().includes(f);
        };

        let initPermissions = () => {
            if (getPermissions() === '') {
                return;
            }
            Utils.adminPermissions = {

                ROLE_EDIT: authPermission('ROLE_EDIT'),
                ADMIN_EDIT: authPermission('ADMIN_EDIT'),
                ADMIN_LIST: authPermission('ADMIN_LIST'),

                TERM_EDIT: authPermission('TERM_EDIT'),
                TRAINER_EDIT: authPermission('TRAINER_EDIT'),
                TRAINEE_EDIT: authPermission('TRAINEE_EDIT'),

                BANNER_EDIT: authPermission('BANNER_EDIT'),
                PARTNER_EDIT: authPermission('PARTNER_EDIT'),
                ARTICLE_EDIT: authPermission('ARTICLE_EDIT'),
                TRAINING_PROJECT_EDIT: authPermission('TRAINING_PROJECT_EDIT'),
                QA_EDIT: authPermission('QA_EDIT'),
                JOB_EDIT: authPermission('JOB_EDIT'),
                FAQ_EDIT: authPermission('FAQ_EDIT')


            }
        };

        let clearPermissions = () => {
            Utils.adminPermissions = null;
            KvStorage.remove('admin-permissions');
        };

        return {avatar, savePermissions, initPermissions, clearPermissions}

    })();

    let num = (() => {

        let formatPrice = value => {
            value += '';
            const list = value.split('.');
            const prefix = list[0].charAt(0) === '-' ? '-' : '';
            let num = prefix ? list[0].slice(1) : list[0];
            let result = '';
            while (num.length > 3) {
                result = `,${num.slice(-3)}${result}`;
                num = num.slice(0, num.length - 3);
            }
            if (num) {
                result = num + result;
            }
            return `¥ ${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
        };

        return {
            formatPrice
        }

    })();

    let pager = (() => {

        let convert2Pagination = (result) => {

            let {pageable = {}, totalElements} = result;

            let pageSize = pageable.pageSize || CTYPE.pagination.pageSize;
            let current = pageable.pageNumber + 1;

            return {
                current,
                total: totalElements,
                pageSize
            }
        };

        return {convert2Pagination}

    })();

    let exportExcel = (() => {

        let apis = {
            trainees: ['adm/trainee/export_trainees', 'adm/trainee/export_trainees_progress'],
            qas: ['adm/qa/export_qaPapers', 'adm/qa/export_qaPapers_progress']

        };

        let doExport = (flag, query) => {
            let queryStr = '<p><b>导出条件：</b></p>';
            let withQuery = false;
            let param = {};
            if (flag === 'trainees') {
                if (query.status) {
                    queryStr += `<p>状态：${query.status === 1 ? '在校' : '毕业'}</p>`;
                    withQuery = true;
                }
                if (query.term !== '0') {
                    queryStr += `<p>学期：${query.term}</p>`;
                    withQuery = true;
                }
                param = {traineeQo: JSON.stringify({...query})};
            } else if (flag === 'qas') {
                if (query.status) {
                    queryStr += `<p>状态：${query.status === 0 ? '全部' : (query.status === 1 ? '未处理' : (query.status === 2 ? '已处理' : '废弃'))}</p>`;
                    withQuery = true;
                }
                param = {qaPaperQo: JSON.stringify({...query})};
            }
            console.log(queryStr);
            console.log(param);
            Modal.confirm({
                title: '确认导出？',
                content: withQuery ? <div dangerouslySetInnerHTML={{__html: queryStr}}/> :
                    <Alert message="未选择导出条件，此操作会耗费较长时间" type="warning"/>,
                onOk() {
                    let api = apis[flag];
                    App.api(api[0], param).then((result) => {
                        common.renderReactDOM(<DialogExport task={result} api_query={api[1]}/>);
                    });
                },
                onCancel() {
                },
            });
        };

        return {doExport}

    })();

    return {
        common, adm, num, pager, nProgress, qrcode, adminPermissions,
        exportExcel, addr,
        _setCurrentPage, _getCurrentPage, _setTabIndex, _getTabIndex
    };

})
();

export default Utils;
