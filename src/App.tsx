import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Home from "./Home";

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
import ViewMessage from "./mainComponents/Admin/AdminMessage/ViewMessage";
import NewDashAdmin from "./mainComponents/Admin/NewDashAdmin";
import SeeBlogs from "./mainComponents/BlogPosts/SmallBlogUI/SeeBlogs";
import PhotoDash from "./mainComponents/Admin/AdminPhoto/PhotoDash";
import AddPhoto from "./mainComponents/Admin/AdminPhoto/AddPhoto";
import EditPhoto from "./mainComponents/Admin/AdminPhoto/EditPhoto";
import PhotoViewPage from "./mainComponents/Admin/AdminPhoto/PhotoCardWrapper";
import VideoDash from "./mainComponents/Admin/AdminVideo/VideoDash";
import AddVideo from "./mainComponents/Admin/AdminVideo/AddVideo";
import EditVideo from "./mainComponents/Admin/AdminVideo/EditVideo";
import PlayVideo from "./mainComponents/Admin/AdminVideo/PlayVideo";
import VolunteerDash from "./mainComponents/Volunteer/VolunteerDash";
import BlogsDash from "./mainComponents/BlogPosts/SmallBlogUI/BlogsDash";
import CategoryManager from "./mainComponents/Admin/AdminCategory/CategoryManager";

function App() {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Routes>
      <Route path='/' element={<Home />} />

      {/*  Gallery Routes - Public */}
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

      {/*  Contact  Routes */}
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/admin/message/:id' element={<ViewMessage />} />

      {/* Admin Routes */}
      <Route path='/admin/login' element={<LoginUser />} />
      <Route path='/admin/newdash' element={<AdminDashboard />} />
      <Route path='/admin/dashboard' element={<NewDashAdmin />} />

      {/* Blogs Routes */}
      <Route path='/blog' element={<SeeBlogs />} />
      <Route path='/blog/:id' element={<BlogPostPage />} />
      <Route path='/blog/new' element={<AddBlogForm />} />
      {/* Private Blogs */}
      <Route path='/admin/blog/new' element={<AddBlogPost />} />
      <Route path='/admin/blog/edit/:id' element={<AddBlogPost />} />
      <Route path='/admin/blogsDashboard' element={<BlogsDash />} />
      {/* Photo Routes  */}
      <Route path='/admin/photoDashboard' element={<PhotoDash />} />
      <Route path='/admin/addPhoto' element={<AddPhoto />} />
      <Route path='/admin/edit/:id' element={<EditPhoto />} />
      <Route path='/admin/view/:id' element={<PhotoViewPage />} />
      {/* video Routes  */}
      <Route path='/admin/videoDashboard' element={<VideoDash />} />
      <Route path='/admin/addVideo' element={<AddVideo />} />
      <Route path='/admin/editVideo/:id"' element={<EditVideo />} />
      <Route path='/admin/play/:id"' element={<PlayVideo />} />
      {/*  Volunteer  Routes */}
      <Route path='/volunteer' element={<VolunteerPage />} />
      <Route path='/admin/volunteerDashboard' element={<VolunteerDash />} />
      <Route path='/admin/volunteer/:id' element={<VolunteerDetail />} />
      {/* Category Routes */}
      <Route path='/admin/addCategory' element={<CategoryManager />} />
      {/* Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
