import { Link, useLocation, useParams, useSearchParams } from "react-router";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";
import { idToCategory } from "../../constants";

function NavButton({ value, path }) {
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

NavButton.propTypes = {
  value: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default NavButton;
