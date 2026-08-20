import React from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import styles from "./Breadcrumb.module.css";
import { Link } from "react-router";
import PropTypes from "prop-types";

function Breadcrumb({ prevPath, prev, current, state }) {
  return (
    <nav className={styles["breadcrumb"]} aria-label="breadcrumb">
      <IconChevronLeft
        className={styles["chevron-left"]}
        stroke={2}
        aria-hidden="true"
      />
      <Link
        to={prevPath}
        state={state}
        className={styles["back"]}
        aria-label={`${prev?.split("-").join(" ")}`}
      >
        {prev}
      </Link>
      <IconChevronRight
        className={styles["chevron-right"]}
        stroke={2}
        aria-hidden="true"
      />
      <h1 className={styles["current"]}>{current}</h1>
    </nav>
  );
}

Breadcrumb.propTypes = {
  prevPath: PropTypes.string.isRequired,
  prev: PropTypes.string.isRequired,
  current: PropTypes.string.isRequired,
  state: PropTypes.object,
};

export default React.memo(Breadcrumb);
