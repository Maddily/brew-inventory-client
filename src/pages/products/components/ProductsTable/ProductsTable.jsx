import React, { useMemo } from "react";
import styles from "./ProductsTable.module.css";
import ProductRow from "../ProductRow/ProductRow";
import PropTypes from "prop-types";

function ProductsTable({ products, categoryId }) {
  const rowState = useMemo(
    () =>
      categoryId
        ? { from: "category", categoryId, categoryName: products[0]?.category }
        : { from: "all" },
    [categoryId, products]
  );

  return (
    <table className={styles["products-table"]}>
      <thead>
        <tr className={styles["table-head"]}>
          <th>product</th>
          <th>price</th>
          <th>quantity</th>
          <th>availability</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            name={product.name}
            price={product.price}
            stockQuantity={product.stock_quantity}
            category={!categoryId && product.category}
            path={`/products/${product.id}`}
            state={rowState}
          />
        ))}
      </tbody>
    </table>
  );
}

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  categoryId: PropTypes.string,
};

export default React.memo(ProductsTable);
