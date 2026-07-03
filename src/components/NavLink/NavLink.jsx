import { Link, useLocation } from "react-router";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";

function NavButton({ value, path }) {
  const location = useLocation();

  return (
    <Link
      className={`${styles["nav-link"]} ${
        location.pathname === path ? styles["active"] : ""
      }`}
      to={path}
    >
      {value}
    </Link>
  );
}

NavButton.propTypes = {
  value: PropTypes.string,
  path: PropTypes.string,
};

export default NavButton;
