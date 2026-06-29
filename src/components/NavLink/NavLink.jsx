import { Link } from "react-router";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";

function NavButton({ value, path }) {
  return (
    <Link className={styles["nav-btn"]} to={path}>
      {value}
    </Link>
  );
}

NavButton.propTypes = {
  value: PropTypes.string,
  path: PropTypes.string,
};

export default NavButton;
