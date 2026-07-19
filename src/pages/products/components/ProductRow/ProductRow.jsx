import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconCircleX,
} from "@tabler/icons-react";
import styles from "./ProductRow.module.css";

function ProductRow({ name, price, stockQuantity, category, path, state }) {
  const navigate = useNavigate();

  return (
    <tr
      className={styles["product-row"]}
      onClick={() => navigate(path, { state })}
    >
      <td className={styles["name-and-category"]}>
        <p className={styles["name"]}>{name}</p>
        <p className={styles["category"]}>{category}</p>
      </td>
      <td className={styles["price"]}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price)}
      </td>
      <td className={styles["quantity"]}>{stockQuantity}</td>
      <td
        className={`${styles["availability"]} ${
          stockQuantity > 10
            ? styles["in-stock"]
            : stockQuantity > 0
            ? styles["low-stock"]
            : styles["out-of-stock"]
        }`}
      >
        <span>
          {stockQuantity > 10 ? (
            <IconCircleCheck className={styles["in-stock-icon"]} stroke={2} />
          ) : stockQuantity > 0 ? (
            <IconAlertTriangle
              className={styles["low-stock-icon"]}
              stroke={2}
            />
          ) : (
            <IconCircleX className={styles["out-of-stock-icon"]} stroke={2} />
          )}
          {stockQuantity > 10
            ? "In stock"
            : stockQuantity > 0
            ? "Low stock"
            : "Out of stock"}
        </span>
      </td>
    </tr>
  );
}

ProductRow.propTypes = {
  name: PropTypes.string,
  price: PropTypes.string,
  stockQuantity: PropTypes.string,
  category: PropTypes.string,
  path: PropTypes.string,
  state: PropTypes.object,
};

export default ProductRow;
