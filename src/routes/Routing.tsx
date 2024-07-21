import { Routes, Route } from "react-router-dom";
import HomepageLayout from "../layouts/HomepageLayout";
import LoginPage from "../pages/LoginPage";

function Routing() {
  return (
    <Routes>
      <Route path="*" element={<HomepageLayout />} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  );
}

export default Routing;
