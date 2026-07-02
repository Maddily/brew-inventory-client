import { useState } from "react";
import { ActiveLinkContext } from "./contexts";
import NavBar from "./components/NavBar/NavBar";
import BottomNav from "./components/BottomNav/BottomNav";
import "./styles/normalize.css";
import "./styles/App.css";
import { Outlet } from "react-router";

function App() {
  const [active, setActive] = useState(0);

  return (
    <ActiveLinkContext value={{ active, setActive }}>
      <NavBar active={active} setActive={setActive} />
      <Outlet />
      <BottomNav active={active} setActive={setActive} />
    </ActiveLinkContext>
  );
}

export default App;
