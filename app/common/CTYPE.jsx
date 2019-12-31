let CTYPE = (() => {

    let maxlength = {title: 140, intro: 500};

    let minlength = {title: 1, intro: 1};

    let eidtMaxWidth = 1800;

    let eidtMinWidth = 900;

    let formStyle = {minWidth: eidtMinWidth, maxWidth: eidtMaxWidth, marginTop: '20px'};

    return {

        ABC: ['A', 'B', 'C', 'D', 'E'],

        judge: [{answer: "1", label: '对'}, {answer: "2", label: '错'}],

        displayType: ['单选题', '多选题', '判断题', '填空题', '问答题'],

        options: [{type: 1, label: '单选'}, {type: 2, label: '多选'}, {type: 3, label: '判断'},
            {type: 4, label: '填空'}, {type: 5, label: '问答'}],

        minprice: 0,
        maxprice: 1000000,

        eidtMaxWidth: 1800,

        eidtMinWidth: 900,

        maxlength: maxlength,

        minlength: minlength,
        pagination: {pageSize: 10},

        formStyle,

        commonPagination: {showQuickJumper: true, showSizeChanger: true, showTotal: total => `总共 ${total} 条`},

        fieldDecorator_rule_title: {
            type: 'string',
            required: true,
            message: `标题长度为${minlength.title}~${maxlength.title}个字`,
            whitespace: true,
            min: minlength.title,
            max: maxlength.title
        },

        expirePeriods: [{key: '1D', label: '一天'},
            {key: '3D', label: '三天'},
            {key: '1W', label: '一周'},
            {key: '1M', label: '一个月'},
            {key: '3M', label: '三个月'},
            {key: '6M', label: '六个月'},
            {key: '1Y', label: '一年'},
            {key: '2Y', label: '两年'},
            {key: '3Y', label: '三年'},
            {key: '5Y', label: '五年'},
            {key: '10Y', label: '十年'}],

        link: {

            question: {key: '/app/question/question', path: '/app/question/question', txt: '试题管理'},
            category: {key: '/app/category/category', path: '/app/category/category', txt: '分类管理'},
            tag: {key: '/app/tag/tag', path: '/app/tag/tag', txt: '标签管理'},
            template: {key: '/app/template/template', path: '/app/template/template', txt: '试卷模板'},
            paper: {key: '/app/paper/paper', path: '/app/paper/paper', txt: '试卷生成'},
            user: {key: '/app/user/users', path: '/app/user/users', txt: '用户信息'},
            pc: {key: '/app/banner/banners', path: '/app/banner/banners', txt: 'Banner'},
            ws_articles: {key: '/app/ws/articles', path: '/app/ws/articles', txt: '动态管理'},
            ws_qa_templates: {key: '/app/ws/qa-templates', path: '/app/ws/qa-templates', txt: '调查问卷模板'},
            ws_training_projects: {key: '/app/ws/training-projects', path: '/app/ws/training-projects', txt: '实战项目管理'},
            ws_jobs: {key: '/app/ws/jobs', path: '/app/ws/jobs', txt: '招聘管理'},
            ws_faqs: {key: '/app/ws/faqs', path: '/app/ws/faqs', txt: 'FAQ管理'},

            admin_admins: {key: '/app/admin/admins', path: '/app/admin/admins', txt: '管理员'},
            admin_roles: {key: '/app/admin/roles', path: '/app/admin/roles', txt: '权限组'},
        },

        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5625,
        },

        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        formItemLayoutWithOutLabel: {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 20, offset: 4},
            },
        },
        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        shortFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 4},
                sm: {span: 3},
            },
        },
        longFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },
        tailFormItemLayout: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 3,
                },
            },
        },
        formItemLayouts: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            },
        },
        REGION_PATH: 'http://fs.maidaotech.cn/assets/js/pca-code.json',
        bannerType: {
            HOME_PC: 1, JAVA_PRY_PC: 3, JAVA_ADV_PC: 5, SERVICE_PC: 7, REACT_PC: 9, ABOUT_PC: 11
        },

    }

})();

export default CTYPE;
