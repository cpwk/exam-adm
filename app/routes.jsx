import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import Page from './components/Page';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Index from './Index';

import Admins from './components/admin/Admins';
import AdminEdit from './components/admin/AdminEdit';
import Roles from './components/admin/Roles';
import RoleEdit from './components/admin/RoleEdit';

import Terms from './components/term/Terms';
import TermEdit from './components/term/TermEdit';

import Trainers from './components/trainer/Trainers';
import TrainerEdit from './components/trainer/TrainerEdit';

import Trainees from './components/trainee/Trainees';
import TraineeEdit from './components/trainee/TraineeEdit';

const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        <Redirect exact from='/' to='/app/dashboard/index'/>

                        <Route path='/' exact component={Index}/>

                        <Route path='/login' exact component={Login}/>

                        <Route path='/app' children={() => (
                            <Index>

                                <Route path='/app/dashboard/index' component={Dashboard}/>

                                <Route path={'/app/setting/terms'} component={Terms}/>
                                <Route path={'/app/setting/term-edit/:id'} component={TermEdit}/>

                                <Route path={'/app/trainer/trainers'} component={Trainers}/>
                                <Route path={'/app/trainer/trainer-edit/:id'} component={TrainerEdit}/>

                                <Route path={'/app/trainee/trainees'} component={Trainees}/>
                                <Route path={'/app/trainee/trainee-edit/:id'} component={TraineeEdit}/>

                                <Route path={'/app/admin/admins'} component={Admins}/>
                                <Route path={'/app/admin/admin-edit/:id'} component={AdminEdit}/>
                                <Route path={'/app/admin/roles'} component={Roles}/>
                                <Route path={'/app/admin/role-edit/:id'} component={RoleEdit}/>

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
