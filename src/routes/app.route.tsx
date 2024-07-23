import { Routes, Route } from "react-router-dom";
import HomepageLayout from "../layouts/HomepageLayout";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./private.route";

function Routing() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="*" element={<HomepageLayout />} />
      </Route>
    </Routes>
  );
}

export default Routing;
