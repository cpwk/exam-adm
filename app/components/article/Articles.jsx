import React from 'react'

import {App, CTYPE, U, Utils} from '../../common'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table} from 'antd';

import BreadcrumbCustom from '../BreadcrumbCustom'
import '../../assets/css/common/common-list.less'
import ArticleUtils from "./ArticleUtils";

export default class Articles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],

            pagination: {pageSize: CTYPE.pagination.pageSize, current: ArticleUtils.getCurrentPage(), total: 0},
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {

        this.setState({loading: true});

        let {pagination = {}} = this.state;

        App.api('adm/article/articles', {
            articleQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content,
                pagination,
                loading: false
            });
            ArticleUtils.setCurrentPage(pagination.current);
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/article/remove', {id}).then(() => {
                    message.success('删除成功');
                    let list = _this.state.list;
                    _this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    edit = (id) => {
        App.go(`/app/ws/article-edit/${id}`);
    };

    render() {

        let {list = [], pagination = {}, loading} = this.state;

        let imgs = [];
        list.map((item) => {
            imgs.push(item.img);
        });

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.info_articles.txt}/>

            <Card bordered={false}>

                <div style={{marginBottom: 15}}>
                    <Button type="primary" icon="file-add" onClick={() => {
                        this.edit(0)
                    }}>新建</Button>
                </div>

                <Table columns={[{
                    title: '图片',
                    dataIndex: 'img',
                    className: 'txt-center',
                    width: '80px',
                    render: (img, item, index) => {
                        return <img key={img} className='article-img' src={img + '@!120-120'} onClick={() => {
                            Utils.common.showImgLightbox(imgs, index);
                        }}/>
                    }
                }, {
                    title: '标题',
                    dataIndex: 'title',
                    className: 'txt-center'
                }, {
                    title: '发布时间',
                    dataIndex: 'createdAt',
                    className: 'txt-center',
                    width: '160px',
                    render: (createdAt) => {
                        return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                    }
                }, {
                    title: '访问量',
                    dataIndex: 'visitNum',
                    className: 'txt-center'
                }, {
                    title: '上架',
                    dataIndex: 'state',
                    className: 'txt-center',
                    width: '100px',
                    render: (state) => {
                        return <div className="state">
                            {state === 1 ? <span className="important">上架</span> :
                                <span className="disabled">下架</span>}
                        </div>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'opt',
                    className: 'txt-center',
                    width: '80px',
                    render: (obj, article, index) => {

                        return <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                                <a onClick={() => this.edit(article.id)}>编辑</a>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item key="2">
                                <a onClick={() => this.remove(article.id, index)}>删除</a>
                            </Menu.Item>
                        </Menu>} trigger={['click']}>
                            <a className="ant-dropdown-link">操作 <Icon type="down"/>
                            </a>
                        </Dropdown>
                    }
                }]} rowKey={(record) => record.id} dataSource={list}
                       pagination={{...pagination, ...CTYPE.commonPagination}}
                       loading={loading}
                       onChange={this.handleTableChange}/>
            </Card>

        </div>
    }
}