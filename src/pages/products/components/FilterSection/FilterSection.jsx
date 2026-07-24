import PropTypes from "prop-types";
import styles from "./FilterSection.module.css";
import SheetChip from "../SheetChip/SheetChip";

function FilterSection({ sections, section, type }) {
  return (
    <>
      <div className={styles["sheet-section"]}>
        <div className={`${styles["sheet-section-title"]} ${styles[type]}`}>
          {section}
        </div>
        <div className={styles["sheet-chips"]}>
          {sections[section].map((value) => (
            <SheetChip key={value} section={section} value={value} />
          ))}
        </div>
      </div>
    </>
  );
}

FilterSection.propTypes = {
  sections: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  section: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default FilterSection;
