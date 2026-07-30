import PropTypes from "prop-types";
import { Link, useLocation, useSearchParams, useParams } from "react-router";
import { Icon } from "@mdi/react";
import styles from "./BottomNavLink.module.css";
import { idToCategory } from "../../constants.js";

function BottomNavLink({ value, path, iconPath }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { category_id: categoryId } = useParams();

  return (
    <Link
      className={`${styles["bottom-nav-link"]} ${
        location.pathname === path && searchParams.size === 0
          ? styles["active"]
          : ""
      }`}
      to={path}
      state={
        categoryId
          ? {
              from: "category",
              categoryId,
              categoryName: idToCategory[categoryId],
            }
          : { from: "all" }
      }
    >
      <Icon
        className={styles["icon"]}
        path={iconPath}
        size={0.8}
        aria-hidden="true"
      />
      <span className={styles["text"]}>{value}</span>
    </Link>
  );
}

BottomNavLink.propTypes = {
  value: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  iconPath: PropTypes.any.isRequired,
};

export default BottomNavLink;
