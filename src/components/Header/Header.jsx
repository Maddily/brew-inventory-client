import { Link } from "react-router";
import { Icon } from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import logo from "../../assets/logo.png";
import NavLink from "../NavLink/NavLink";
import styles from "./Header.module.css";
import useIsWide from "../../hooks/useIsWide";

function Header() {
  const isWide = useIsWide(540);

  return (
    <header className={styles["header"]}>
      <img className={styles["logo"]} src={logo} alt="Brew Inventory logo" />
      {isWide && (
        <nav aria-label="primary navigation" className={styles["nav"]}>
          <div className={styles["nav-spacer"]} aria-hidden="true" />
          <div className={styles["middle-nav-btns-container"]}>
            <NavLink value="Categories" path="/" />
            <NavLink value="All products" path="/products" />
          </div>
          <Link className={styles["add-product-link"]} to="/products/new">
            <Icon
              className={styles["add-product-icon"]}
              path={mdiPlus}
              size={0.7}
              aria-hidden="true"
            />
            <span className={styles["add-product-text"]}>Add product</span>
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
