import { Link } from "react-router";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";
import { ActiveLinkContext } from "../../contexts";
import { useContext } from "react";

function NavButton({ value, path, id }) {
  const { active, setActive } = useContext(ActiveLinkContext);

  return (
    <Link
      className={`${styles["nav-link"]} ${
        active === id ? styles["active"] : ""
      }`}
      to={path}
      onClick={() => setActive(id)}
    >
      {value}
    </Link>
  );
}

NavButton.propTypes = {
  value: PropTypes.string,
  path: PropTypes.string,
  id: PropTypes.number,
};

export default NavButton;
