import { type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Login from 'components/Login/Login';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import Profile from 'components/Profile/Profile';
import Project from 'components/Project/Project';
import Projects from 'components/Projects/Projects';
import TaskPage from 'components/TaskPage/TaskPage';

import { setToken, setUser } from 'store/slices/userSlice';

const App: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const profile = localStorage.getItem('profile');

    if (token) {
      dispatch(setToken(token));
    }
    if (profile) {
      dispatch(setUser(JSON.parse(profile)));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route
        element={(
          <PrivateRoute>
            <Projects />
          </PrivateRoute>
                  )}
        path="/"
      />
      <Route
        element={(
          <PrivateRoute>
            <Project />
          </PrivateRoute>
                  )}
        path="/projects/:id"
      />
      <Route
        element={(
          <PrivateRoute>
            <TaskPage />
          </PrivateRoute>
                  )}
        path="/projects/:id/task/:taskId"
      />
      <Route
        element={(
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
                  )}
        path="/profile"
      />
      <Route element={<Login />} path="/login" />
    </Routes>
  );
};

export default App;
