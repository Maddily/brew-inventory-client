import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import styles from "./ProductRow.module.css";
import useAvailability from "../../../../hooks/useAvailability";

function ProductRow({ name, price, stockQuantity, category, path, state }) {
  const navigate = useNavigate();
  const { availability, availabilityClassName, icon } = useAvailability(
    stockQuantity,
    styles["availability-icon"]
  );

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
        className={`${styles["availability"]} ${styles[availabilityClassName]}`}
      >
        <span>
          {icon}
          {availability}
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
