import Header from "./components/Header/Header";
import BottomNav from "./components/BottomNav/BottomNav";
import "./styles/normalize.css";
import "./styles/App.css";
import { Outlet } from "react-router";
import useIsWide from "./hooks/useIsWide";

function App() {
  const isWide = useIsWide(540);

  return (
    <>
      <Header />
      <Outlet />
      {!isWide && <BottomNav />}
    </>
  );
}

export default App;
