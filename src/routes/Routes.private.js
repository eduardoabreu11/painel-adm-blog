import { Routes, Route, Navigate } from "react-router-dom";
import Posts from "../pages/posts/posts.js";
import Post from "../pages/post/post.js";
import Home from "../pages/home/home.jsx";
import Banner from "../pages/banner/banner.js";
import Colunistas from "../pages/colunistas/colunistas.js";
import PostsColunistas from "../pages/colunistas/posts-colunistas.js";
import Videos from "../pages/videos/videos.js"
import Materias from "../pages/materias/materias.jsx";



export default function RoutesPrivate() {
  return (
    <Routes>


      <Route path="/home" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/admin/:id_post" element={<Post />} />
      <Route path="/banners" element={<Banner />} />
      <Route path="/colunistas" element={<Colunistas />} />
      <Route path="/admin/colunistas/:id_colunista/posts" element={<PostsColunistas />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/materias" element={<Materias />} />
      
      

      
      <Route path="*" element={<Navigate to="/Home" />} />
    </Routes>
  );
}