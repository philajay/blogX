import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import SignupPage from "./pages/SignupPage";
import WritePage from "./pages/WritePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/write" element={<WritePage />} />
      <Route path="/post/:postId" element={<PostPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
