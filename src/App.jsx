import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layouts/Header';
import Sidebar from './components/Layouts/Sidebar';
import Footer from './components/Layouts/Footer';
import Main from './components/Layouts/Maincontents';
import AdminLayout from './components/pages/Admin/Admin';
import ArtistLayout from './components/pages/Artist/Artist'
import { MusicProvider } from './components/pages/PlayerMusicControl/MusicContext';
import ProtectedAdminRoute from './components/pages/Admin/ProtectedAdminRoute';
import authService from './Services/AuthServices';

function App() {
  return (
    <MusicProvider>
      <Router>
        <Routes>
          {/* Layout dành cho khách */}
          <Route
            path="/*"
            element={
              <div className="bg-[rgba(105,105,170,0.1)] min-h-screen">
                <Header />
                <Sidebar />
                <Main />
                <Footer />
              </div>
            }
          />
          {/* Layout dành cho admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          />

          <Route path="/artist/*" element={<ArtistLayout />}>

          </Route>
        </Routes>
      </Router>
    </MusicProvider>
  );
}

export default App;
