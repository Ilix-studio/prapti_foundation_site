import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Home from "./Home";
import BlogPage from "./mainComponents/BlogPosts/SmallBlogUI/Blog";
import BlogPostPage from "./mainComponents/BlogPosts/SmallBlogUI/BlogPost";
import AddBlogForm from "./mainComponents/BlogPosts/AddBlogForm";
import NotFound from "./mainComponents/NotFound";
import LoginUser from "./mainComponents/Admin/LoginUser";
import AdminDashboard from "./mainComponents/Admin/AdminDashboard";
import AddBlogPost from "./mainComponents/BlogPosts/AddBlogForm";
import AdoptionForm from "./mainComponents/Adopt/AdoptionForm";

import ReportPage from "./mainComponents/ReportAbout/ReportPage";
import AboutUs from "./mainComponents/AboutUs";

import SupportUs from "./mainComponents/SupportUs";

import GalleryImages from "./mainComponents/Gallery/GalleryImages";
import GalleryVideos from "./mainComponents/Gallery/GalleryVideos";
import ContactUs from "./mainComponents/ContactUs/ContactUs";
import GalleryPage from "./mainComponents/Gallery/GalleryPage";
import VolunteerPage from "./mainComponents/Volunteer/VolunteerPage";
import VolunteerDetail from "./mainComponents/Volunteer/VolunteerDetail";
import ViewMessage from "./mainComponents/ContactUs/ViewMessage";

function App() {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      {/* Blog Routes */}
      <Route path='/blog' element={<BlogPage />} />
      <Route path='/blog/:id' element={<BlogPostPage />} />
      <Route path='/blog/new' element={<AddBlogForm />} />

      {/* Admin Routes */}
      <Route path='/admin/login' element={<LoginUser />} />
      <Route path='/admin/dashboard' element={<AdminDashboard />} />
      <Route path='/admin/blog/new' element={<AddBlogPost />} />
      <Route path='/admin/blog/edit/:id' element={<AddBlogPost />} />

      {/*  Gallery Routes */}
      <Route path='/gallery' element={<GalleryPage />} />
      <Route path='/g-images' element={<GalleryImages />} />
      <Route path='/g-videos' element={<GalleryVideos />} />

      {/*  Adopt Routes */}
      <Route path='/adopt' element={<AdoptionForm />} />

      {/*  Report  Routes */}
      <Route path='/report' element={<ReportPage />} />

      {/*  About us  Routes */}
      <Route path='/about' element={<AboutUs />} />
      <Route path='/support' element={<SupportUs />} />

      {/*  Volunteer  Routes */}
      <Route path='/volunteer' element={<VolunteerPage />} />
      <Route path='/admin/volunteer/:id' element={<VolunteerDetail />} />

      {/*  Contact  Routes */}
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/admin/message/:id' element={<ViewMessage />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
