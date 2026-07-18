import {
  IconCircleCheck,
  IconAlertTriangle,
  IconCircleX,
} from "@tabler/icons-react";

function useAvailability(stockQuantity, iconClassName) {
  if (stockQuantity > 10) {
    return {
      availability: "In stock",
      availabilityClassName: "in-stock",
      icon: iconClassName ? (
        <IconCircleCheck className={iconClassName} stroke={2} />
      ) : null,
    };
  } else if (stockQuantity > 0) {
    return {
      availability: "Low stock",
      availabilityClassName: "low-stock",
      icon: iconClassName ? (
        <IconAlertTriangle className={iconClassName} stroke={2} />
      ) : null,
    };
  } else {
    return {
      availability: "Out of stock",
      availabilityClassName: "out-of-stock",
      icon: iconClassName ? (
        <IconCircleX className={iconClassName} stroke={2} />
      ) : null,
    };
  }
}

export default useAvailability;
