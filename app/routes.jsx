import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import Page from './components/Page';
import Login from './components/login/Login';
import Index from './Index';
import Question from "./components/question/Question";
import QuestionEdit from "./components/question/QuestionEdit";
import Dashboard from "./components/dashboard/Dashboard";
import CategoryEdit from "./components/category/CategoryEdit";
import Tag from "./components/tag/Tag";
import TagEdit from "./components/tag/TagEdit";
import Category from "./components/category/Category";
import Template from "./components/template/Template";
import TemplateEdit from "./components/template/TemplateEdit";
import TemplateConten from "./components/template/TemplateContent";
import Users from "./components/user/Users";
import Paper from "./components/paper/Paper";
import PaperEdit from "./components/paper/PaperEdit";
import TemplatePreview from "./components/template/TemplatePreview";
import PaperPreview from "./components/paper/PaperPreview";
import Banners from "./components/banner/Banners";
import Roles from "./components/admin/Roles";
import RoleEdit from "./components/admin/RoleEdit";
import Admins from "./components/admin/Admins";
import AdminEdit from "./components/admin/AdminEdit";


const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        {/*<Redirect exact from='/' to='/app/dashboard/index'/>*/}

                        <Route path='/index' exact component={Index}/>

                        <Route path='/' exact component={Login}/>

                        <Route path='/app' children={() => (
                            <Index>
                                <Route path='/app/dashboard/index' component={Dashboard}/>
                                <Route path='/app/question/question' component={Question}/>
                                <Route path='/app/question/questionEdit/:id' component={QuestionEdit}/>
                                <Route path='/app/category/categoryEdit/:id' component={CategoryEdit}/>
                                <Route path='/app/tag/tag' component={Tag}/>
                                <Route path='/app/tag/tagEdit/:id' component={TagEdit}/>
                                <Route path='/app/template/template' component={Template}/>
                                <Route path='/app/template/templateEdit/:id' component={TemplateEdit}/>
                                <Route path='/app/template/templateContent/:id' component={TemplateConten}/>
                                <Route path='/app/template/templatePreview/:id' component={TemplatePreview}/>
                                <Route path='/app/paper/paper' component={Paper}/>
                                <Route path='/app/paper/paperEdit/:id' component={PaperEdit}/>
                                <Route path='/app/user/users' component={Users}/>
                                <Route path='/app/paper/paperPreview/:id' component={PaperPreview}/>
                                <Route path='/app/category/category' component={Category}/>
                                <Route path='/app/banner/banners' component={Banners}/>

                                <Route path='/app/admin/admins' component={Admins}/>
                                <Route path='/app/admin/admin-edit/:id' component={AdminEdit}/>

                                <Route path='/app/admin/roles' component={Roles}/>
                                <Route path='/app/admin/roleEdit/:id' component={RoleEdit}/>


                            </Index>
                        )}/>

                    </Switch>
                </Page>
            )}>
            </Route>

        </Switch>
    </HashRouter>
);


export default routes;
