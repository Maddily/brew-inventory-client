import PropTypes from "prop-types";
import { Link, useLocation, useSearchParams } from "react-router";
import { Icon } from "@mdi/react";
import styles from "./BottomNavLink.module.css";

function BottomNavLink({ value, path, iconPath }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <Link
      className={`${styles["bottom-nav-link"]} ${
        location.pathname === path && searchParams.size === 0
          ? styles["active"]
          : ""
      }`}
      to={path}
    >
      <Icon className={styles["icon"]} path={iconPath} size={0.8} />
      <span className={styles["text"]}>{value}</span>
    </Link>
  );
}

BottomNavLink.propTypes = {
  value: PropTypes.string,
  path: PropTypes.string,
  iconPath: PropTypes.any,
};

export default BottomNavLink;
