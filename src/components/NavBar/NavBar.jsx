import { Link } from "react-router";
import { Icon } from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import logo from "../../assets/logo.png";
import NavLink from "../NavLink/NavLink";
import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles["nav"]} aria-label="Primary navigation">
      <img className={styles["logo"]} src={logo} alt="Brew Inventory" />
      <div className={styles["middle-nav-btns-container"]}>
        <NavLink value="Categories" path="/" />
        <NavLink value="All products" path="/products" />
      </div>
      <Link className={styles["add-product-link"]} to="/products/new">
        <Icon
          className={styles["add-product-icon"]}
          path={mdiPlus}
          size={0.7}
        />
        <span className={styles["add-product-text"]}>Add product</span>
      </Link>
    </nav>
  );
}

export default NavBar;
