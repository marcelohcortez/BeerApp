import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';

import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Offline from '../views/Offline';

// Lazy load components for code splitting
const Home = lazy(() => import('../views/Home'));
const NotFound = lazy(() => import('../views/404'));
const BeerList = lazy(() => import('../views/BeerList'));
const Beer = lazy(() => import('../views/Beer'));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    flexDirection="column"
    gap={2}
  >
    <CircularProgress size={40} />
    <span>Loading...</span>
  </Box>
);

const Router = () => (
  <BrowserRouter>
    <Menu>
      <Offline />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path='beer'>
            <Route index element={<BeerList />} />
            <Route path=':id' element={<Beer />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </Menu>
  </BrowserRouter>
);

export default Router;
