import PropTypes from "prop-types";
import styles from "./FilterSection.module.css";
import SheetChip from "../SheetChip/SheetChip";

function FilterSection({ sections, section, index, numberOfSections }) {
  return (
    <>
      <div className={styles["sheet-section"]}>
        <div className={styles["sheet-section-title"]}>{section}</div>
        <div className={styles["sheet-chips"]}>
          {sections[section].map((value) => (
            <SheetChip key={value} section={section} value={value} />
          ))}
        </div>
      </div>
      {index !== numberOfSections - 1 && (
        <div className={styles["filter-divider"]}></div>
      )}
    </>
  );
}

FilterSection.propTypes = {
  sections: PropTypes.object,
  section: PropTypes.string,
  index: PropTypes.number,
  numberOfSections: PropTypes.number,
};

export default FilterSection;
