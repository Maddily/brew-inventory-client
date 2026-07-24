import styles from "./ProductsTable.module.css";
import ProductRow from "../ProductRow/ProductRow";
import PropTypes from "prop-types";

function ProductsTable({ products, categoryId }) {
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
            state={
              categoryId
                ? {
                    from: "category",
                    categoryId,
                    categoryName: product.category,
                  }
                : { from: "all" }
            }
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

export default ProductsTable;
