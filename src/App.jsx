import NavBar from "./components/NavBar/NavBar";
import BottomNav from "./components/BottomNav/BottomNav";
import "./styles/normalize.css";
import "./styles/App.css";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <NavBar />
      <Outlet />
      <BottomNav />
    </>
  );
}

export default App;
