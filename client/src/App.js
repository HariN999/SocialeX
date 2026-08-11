import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Notifications from './components/Notifications';
import AuthProtector from './RouteProtectors/AuthProtector';
import LoginProtector from './RouteProtectors/LoginProtector';
import Chat from './pages/Chat';
import Explore from './pages/Explore';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route exact path='/' element={ <AuthProtector><Home/></AuthProtector>}  />
          <Route path='/landing' element = {<LoginProtector> <LandingPage /> </LoginProtector>} />
          <Route path='/profile/:id' element = {<AuthProtector><Profile /></AuthProtector>} />
          <Route path='/chat' element={<AuthProtector><Chat /></AuthProtector>} />
          <Route path='/explore' element={<AuthProtector><Explore /></AuthProtector>} />
      </Routes>

      {/* TODO: Phase 3 — restore media uploads and Stories */}
      {/* <CreateStory /> */}
      <Notifications />
    </div>
  );
}

export default App;
