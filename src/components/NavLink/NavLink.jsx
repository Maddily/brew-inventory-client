import { Link, useLocation, useSearchParams } from "react-router";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";

function NavButton({ value, path }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  return (
    <Link
      className={`${styles["nav-link"]} ${
        location.pathname === path && searchParams.size === 0
          ? styles["active"]
          : ""
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
