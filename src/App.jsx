import { DarkThemeToggle } from "flowbite-react";
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import PageExportir from "./layout/PageExportir";
import Register from "./layout/ext/Register";
import PagePusat from "./layout/PagePusat";
import Forgot from "./layout/ext/Forgot";
import Confirmation from "./layout/ext/Confirmation";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path={"/"} element={<PageExportir />} />
        <Route path={"/forgot"} element={<Forgot />} />
        <Route path={"/confirmation/:cek"} element={<Confirmation />} />
        <Route path={"/register"} element={<Register />} />
        <Route path={"/puskodal"} element={<PagePusat />} />
      </Routes>
    </Router>
  );
}

export default App;
