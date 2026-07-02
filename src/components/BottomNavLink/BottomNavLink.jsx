import PropTypes from "prop-types";
import { Link } from "react-router";
import { Icon } from "@mdi/react";
import { ActiveLinkContext } from "../../contexts";
import styles from "./BottomNavLink.module.css";
import { useContext } from "react";

function BottomNavLink({ value, path, iconPath, id }) {
  const { active, setActive } = useContext(ActiveLinkContext);

  return (
    <Link
      className={`${styles["bottom-nav-link"]} ${
        active === id ? styles["active"] : ""
      }`}
      to={path}
      onClick={() => id && setActive(id)}
    >
      <Icon className={styles["icon"]} path={iconPath} size={0.7} />
      <span className={styles["text"]}>{value}</span>
    </Link>
  );
}

BottomNavLink.propTypes = {
  value: PropTypes.string,
  path: PropTypes.string,
  iconPath: PropTypes.any,
  id: PropTypes.number,
};

export default BottomNavLink;
