import { useContext } from "react";
import styles from "./SheetChip.module.css";
import { SelectedChipsContext } from "../../../../contexts";
import PropTypes from "prop-types";

function SheetChip({ section, value }) {
  const [selectedChips, setSelectedChips] = useContext(SelectedChipsContext);

  function handleChipSelection() {
    // Update selected chips in the given section. If the clicked chip exists, remove it. Otherwise, add it.
    const selectedChipsInSection = selectedChips[section];
    const index = selectedChipsInSection.indexOf(value);
    if (index !== -1) {
      selectedChipsInSection.splice(index, 1);
    } else {
      selectedChipsInSection.push(value);
    }

    setSelectedChips({
      ...selectedChips,
      [section]: [...selectedChipsInSection],
    });
  }

  const isActive = selectedChips[section].includes(value);

  return (
    <span
      className={`${styles["sheet-chip"]} ${
        isActive ? styles["selected"] : ""
      }`}
      onClick={handleChipSelection}
    >
      {value}
    </span>
  );
}

SheetChip.propTypes = {
  section: PropTypes.string,
  value: PropTypes.string,
};

export default SheetChip;
