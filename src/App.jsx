import Header from "./components/Header/Header";
import BottomNav from "./components/BottomNav/BottomNav";
import "./styles/normalize.css";
import "./styles/App.css";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <BottomNav />
    </>
  );
}

export default App;
