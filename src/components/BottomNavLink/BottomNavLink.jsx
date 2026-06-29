import PropTypes from "prop-types";
import { Link } from "react-router";
import { Icon } from "@mdi/react";
import styles from "./BottomNavLink.module.css";

function BottomNavLink({ value, path, iconPath }) {
  return (
    <Link className={styles["bottom-nav-link"]} to={path}>
      <Icon className={styles["icon"]} path={iconPath} size={0.7} />
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
