import { useContext } from "react";
import styles from "./SheetChip.module.css";
import { SelectedChipsContext } from "../../../../contexts";
import PropTypes from "prop-types";

function SheetChip({ section, value }) {
  const [selectedChips, setSelectedChips] = useContext(SelectedChipsContext);

  // If the clicked chip exists, unselect it. Otherwise, select it.
  function handleChipSelection() {
    const selectedChipsInSection = selectedChips[section];
    const chipIsSelected = selectedChipsInSection.includes(value);

    setSelectedChips({
      ...selectedChips,
      [section]: chipIsSelected
        ? selectedChipsInSection.filter((chip) => chip !== value)
        : [...selectedChipsInSection, value],
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
  section: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default SheetChip;
