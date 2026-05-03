import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/LandingPage.jsx';
import JoinUs from './Components/JoinUs.jsx';
import HomePage from './Components/HomePage.jsx';
import Courses from './Components/Courses.jsx';
import Batches from './Components/Batches.jsx';
import ContactUs from './Components/ContactUs.jsx';
import AddCourseForm from './Components/AddCourseForm.jsx';
import Gallery from './Components/Gallery.jsx';
import AboutUs from './Components/AboutUs.jsx';
import Profile from './Components/Profile.jsx';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './Components/AdminDashboard.jsx';

const App = () => {

  const storedUser = JSON.parse(localStorage.getItem('biyoans_user') || sessionStorage.getItem('biyoans_user') || 'null');



  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={storedUser ? <Navigate to="/home" replace /> : <LandingPage />}
        />
        <Route path="/joinus" element={<JoinUs />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/home/courses' element={<Courses />} />
        <Route path='/home/batches' element={<Batches />} />
        <Route path='/home/admin/addCourse' element={<AddCourseForm />} />
        <Route path='/home/gallery' element={<Gallery />} />
        <Route path='/home/contact-us' element={<ContactUs />} />
        <Route path='/home/about-us' element={<AboutUs />} />
        <Route path='/home/profile' element={<Profile />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
