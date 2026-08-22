import { Link, useLocation, useParams, useSearchParams } from "react-router";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";
import { idToCategory } from "../../constants";

function NavLink({ value, path }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { category_id: categoryId } = useParams();

  return (
    <Link
      className={`${styles["nav-link"]} ${
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
      {value}
    </Link>
  );
}

NavLink.propTypes = {
  value: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default NavLink;
