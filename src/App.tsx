import * as React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PublicHeader from './components/Header/PublicHeader';
import PrivateHeader from './components/Header/PrivateHeader';
import FooterView from './components/Footer';
import BootCheck from './views/Boot/BootCheck';
import NoSubscription from './views/Subscription/NoSubscription';
import ConnectionError from './views/Connection/ConnectionError';
import CheckUpdate from './views/Update/CheckUpdate';
import UserLogin from './views/Login/UserLogin';
import UpdateInProgress from './views/Update/InProgress';
import AccessPointSelection from './views/AccessPointSelection';
import Setting from './views/Setting';
import Referral from './views/Referral';
import Main from './views/Main';
import News from './views/News';
import Notice from './views/Notice';

const { Header, Footer, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/setting' component={(props: any) => (
          <div className='page'>
            <PrivateHeader {...props} />
            <Setting {...props} />
          </div>
        )} />
        <Route exact path='/referral' component={(props: any) => (
          <div className='page'>
            <PrivateHeader {...props} />
            <Referral {...props} />
          </div>
        )} />
        <Route exact path='/news' component={(props: any) => (
          <div className='page'>
            <PrivateHeader {...props} />
            <News {...props} />
          </div>
        )} />
        <Route exact path='/notice' component={(props: any) => (
          <div className='page'>
            <PrivateHeader {...props} />
            <Notice {...props} />
          </div>
        )} />
        <Route component={() => (
          <Layout>
            <Header>
              <Switch>
                <Route exact path='/main' component={PrivateHeader} />
                <Route component={PublicHeader} />
              </Switch>
            </Header>
            <Content>
              <Switch>
                <Route
                  exact
                  path={'/connectionError'}
                  component={ConnectionError}
                />
                <Route exact path={'/userLogin'} component={UserLogin} />
                <Route exact path={'/noSubscription'} component={NoSubscription} />
                <Route exact path={'/checkUpdate'} component={CheckUpdate} />
                <Route exact path='/main' component={Main} />
                <Route exact path='/accessPointSelection' component={AccessPointSelection} />
                <Route
                  exact
                  path={'/updateInProgress/:versionType'}
                  component={UpdateInProgress}
                />
                <Route exact path='/setting' component={Setting} />
                <Route exact path={'/'} component={BootCheck} />
              </Switch>
            </Content>
            <Footer>
              <FooterView />
            </Footer>
          </Layout>
        )} />
      </Switch>

    </Router>
  );
};

export default () => {
  return (
    <React.Suspense fallback="loading">
      <App />
    </React.Suspense>
  );
};
