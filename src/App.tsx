import { Route, Routes } from "react-router-dom";
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
import VolunteerPage from "./mainComponents/Volunter";

function App() {
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

      {/*  Adopt Routes */}
      <Route path='/adopt' element={<AdoptionForm />} />

      {/*  Report  Routes */}
      <Route path='/report' element={<ReportPage />} />

      {/*  About us  Routes */}
      <Route path='/about' element={<AboutUs />} />
      <Route path='/support' element={<SupportUs />} />

      <Route path='/volunteer' element={<VolunteerPage />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
