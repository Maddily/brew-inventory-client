import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import styles from "./Breadcrumb.module.css";
import { Link } from "react-router";
import PropTypes from "prop-types";

function Breadcrumb({ prevPath, prev, current, state }) {
  return (
    <div className={styles["breadcrumb"]}>
      <IconChevronLeft className={styles["chevron-left"]} stroke={2} />
      <Link to={prevPath} state={state}>
        {prev}
      </Link>
      <IconChevronRight className={styles["chevron-right"]} stroke={2} />
      <span>{current}</span>
    </div>
  );
}

Breadcrumb.propTypes = {
  prevPath: PropTypes.string,
  prev: PropTypes.string,
  current: PropTypes.string,
  state: PropTypes.object,
};

export default Breadcrumb;
