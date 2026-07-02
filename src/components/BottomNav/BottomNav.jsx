import { mdiDotsGrid, mdiPackageVariantClosed, mdiPlus } from "@mdi/js";
import BottomNavLink from "../BottomNavLink/BottomNavLink";
import styles from "./BottomNav.module.css";

function BottomNav() {
  return (
    <nav className={styles["bottom-nav"]} aria-label="Bottom navigation">
      <BottomNavLink
        value="Categories"
        path="/"
        iconPath={mdiDotsGrid}
        id={0}
      />
      <BottomNavLink
        value="All products"
        path="/products"
        iconPath={mdiPackageVariantClosed}
        id={1}
      />
      <BottomNavLink value="Add" path="/products/new" iconPath={mdiPlus} />
    </nav>
  );
}

export default BottomNav;
