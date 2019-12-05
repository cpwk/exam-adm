import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import Page from './components/Page';
import Login from './components/login/Login';
import Index from './Index';
import Question from "./components/question/Question";
import QuestionEdit from "./components/question/QuestionEdit";
import Dashboard from "./components/dashboard/Dashboard";
import Category from "./components/category/Category";
import CategoryEdit from "./components/category/CategoryEdit";
import Tag from "./components/tag/Tag";
import TagEdit from "./components/tag/TagEdit";
import Categoryx from "./components/category/Categoryx";
import Template from "./components/template/Template";
import TemplateEdit from "./components/template/TemplateEdit";
import TemplateConten from "./components/template/TemplateContent";
import UserInfo from "./components/user/UserInfo";
import Paper from "./components/paper/Paper";
import PaperEdit from "./components/paper/PaperEdit";
import TemplatePreview from "./components/template/TemplatePreview";
import PaperPreview from "./components/paper/PaperPreview";


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
                                <Route path='/app/category/category' component={Category}/>
                                <Route path='/app/category/categoryEdit/:id' component={CategoryEdit}/>
                                <Route path='/app/tag/tag' component={Tag}/>
                                <Route path='/app/tag/tagEdit/:id' component={TagEdit}/>
                                <Route path='/app/template/template' component={Template}/>
                                <Route path='/app/template/templateEdit/:id' component={TemplateEdit}/>
                                <Route path='/app/template/templateContent/:id' component={TemplateConten}/>
                                <Route path='/app/template/templatePreview/:id' component={TemplatePreview}/>
                                <Route path='/app/paper/paper' component={Paper}/>
                                <Route path='/app/paper/paperEdit/:id' component={PaperEdit}/>
                                <Route path='/app/user/userInfo' component={UserInfo}/>
                                <Route path='/app/paper/paperPreview/:id' component={PaperPreview}/>
                                <Route path='/app/category/categoryx' component={Categoryx}/>
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
