import { DarkThemeToggle } from "flowbite-react";
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import PageExportir from "./layout/PageExportir";
import Register from "./layout/ext/Register";
import PagePusat from "./layout/PagePusat";
import Forgot from "./layout/ext/Forgot";
import Confirmation from "./layout/ext/Confirmation";
import PnList from "./layout/ext/PnList";
import CreatePN1 from "./layout/ext/CreatePN1";
import CreatePN3 from "./layout/ext/CreatePN3";
import Profile from "./layout/ext/Profile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<PageExportir />}>
          <Route index element={<PnList />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/create"} element={<CreatePN1 />} />
          <Route path={"/create/:param"} element={<CreatePN1 />} />
          <Route path={"/pn3"} element={<CreatePN3 />} />
        </Route>
        <Route path={"/forgot"} element={<Forgot />} />
        <Route path={"/confirmation/:cek"} element={<Confirmation />} />
        <Route path={"/register"} element={<Register />} />
        <Route path={"/puskodal"} element={<PagePusat />} />
      </Routes>
    </Router>
  );
}

export default App;
