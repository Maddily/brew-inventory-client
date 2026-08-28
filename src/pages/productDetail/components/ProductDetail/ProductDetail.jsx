import {
  IconCoffee,
  IconLeaf,
  IconBottle,
  IconTool,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import styles from "./ProductDetail.module.css";
import { useLocation, useParams, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import ErrorState from "../../../error/components/ErrorState/ErrorState";
import useIsWide from "../../../../hooks/useIsWide";
import SkeletonProductDetail from "../SkeletonProductDetail/SkeletonProductDetail";
import useAvailability from "../../../../hooks/useAvailability";
import { categoryIdToClassName } from "../../../../constants";
import Breadcrumb from "../../../../components/Breadcrumb/Breadcrumb";
import { formatPrice } from "../../../../utils/utils";
import DeleteModal from "../DeleteModal/DeleteModal";

function ProductDetail() {
  const location = useLocation();
  const { from, categoryId, categoryName } = location.state || {};
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const deleteModalRef = useRef(null);
  const navigate = useNavigate();
  const isWide = useIsWide(740);

  useEffect(() => {
    let componentIsMounted = true;

    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        const data = await response.json();

        // Reduce data into one product with attributes
        const productWithAttributes = {};
        for (const row of data) {
          if (!productWithAttributes[row.id]) {
            productWithAttributes[row.id] = {
              id: row.id,
              name: row.name,
              description: row.description,
              price: row.price,
              stock_quantity: row.stock_quantity,
              category_id: row.category_id,
              category: row.category,
              attributes: {},
            };
          }

          productWithAttributes[row.id].attributes[row.attribute_name] =
            row.attribute_value;
        }

        if (componentIsMounted) {
          setProduct(Object.values(productWithAttributes)[0]);
        }
      } catch (error) {
        if (componentIsMounted) {
          setError(error);
        }
      } finally {
        if (componentIsMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => (componentIsMounted = false);
  }, [id, retryCount]);

  const showModal = function () {
    deleteModalRef.current.showModal();
  };

  const onDelete = async function (password) {
    if (!password) {
      setDeleteError("Password is required");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
          body: JSON.stringify({ password }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error ||
            data.errors[0].msg ||
            `HTTP error. Status: ${response.status}`
        );
      }
      setDeleteError(null);

      if (categoryId) {
        navigate(`/categories/${categoryId}`);
      } else {
        navigate("/products");
      }
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  const { availability, availabilityClassName, icon } = useAvailability(
    product?.stock_quantity ?? 0,
    styles["availability-icon"]
  );

  if (error)
    return <ErrorState setRetryCount={setRetryCount} entity="product" />;
  if (loading) return <SkeletonProductDetail />;

  const formattedPrice = formatPrice(product.price);

  const categoryIcons = {
    1: (
      <IconCoffee
        stroke={2}
        className={`${styles["hero-icon"]} ${styles["coffee"]}`}
        aria-hidden="true"
      />
    ),
    2: (
      <IconLeaf
        stroke={2}
        className={`${styles["hero-icon"]} ${styles["tea"]}`}
        aria-hidden="true"
      />
    ),
    3: (
      <IconBottle
        stroke={2}
        className={`${styles["hero-icon"]} ${styles["rtd"]}`}
        aria-hidden="true"
      />
    ),
    4: (
      <IconTool
        stroke={2}
        className={`${styles["hero-icon"]} ${styles["acc"]}`}
        aria-hidden="true"
      />
    ),
  };
  const ariaCategory = product?.category.split("-").join(" ");
  const ariaPrice = `${parseFloat(product.price)} dollars`;

  return (
    <main className={styles["main"]}>
      <Breadcrumb
        prevPath={from === "all" ? "/products" : `/categories/${categoryId}`}
        prev={from === "all" ? "All products" : categoryName}
        current={product.name}
      />
      <div className={styles["product-layout"]}>
        <div className={styles["product-main"]}>
          <div
            className={`${styles["hero"]} ${
              styles[`hero-${product.category.toLowerCase()}`]
            }`}
          >
            {categoryIcons[product.category_id]}
            <div className={styles["sr-only"]}>{ariaCategory}</div>
            <div
              className={`${styles["hero-label"]} ${
                styles[`${product.category.toLowerCase()}`]
              }`}
              aria-hidden="true"
            >
              {product.category}
            </div>
          </div>
          <div className={`${styles["card"]} ${styles["info-card"]}`}>
            <h2 className={styles["product-name"]}>{product.name}</h2>
            <div className={styles["meta-row"]}>
              <span
                className={`${styles["cat-tag"]} ${
                  styles[categoryIdToClassName[product.category_id]]
                }`}
                aria-hidden="true"
              >
                {product.category}
              </span>
              <span
                className={`${styles["badge"]} ${styles[availabilityClassName]}`}
              >
                {icon}
                {availability}
              </span>
            </div>
            <div className={styles["desc"]}>{product.description}</div>
            <div className={styles["divider"]} aria-hidden="true"></div>
            <div className={styles["price-row"]}>
              <span className={styles["price"]} aria-hidden="true">
                {formattedPrice}
              </span>
              <span className={styles["sr-only"]}>{ariaPrice}</span>
              <span className={styles["stock"]}>
                <span aria-hidden="true">Qty:</span>
                <span className={styles["sr-only"]}>Quantity</span>{" "}
                <strong>{product.stock_quantity}</strong>
              </span>
            </div>
          </div>
          <div className={`${styles["card"]} ${styles["attrs-card"]}`}>
            <h2 className={styles["attrs-title"]}>Attributes</h2>
            {Object.entries(product.attributes).map(([attr, val]) => (
              <div key={attr} className={styles["attr-row"]}>
                <span className={styles["attr-key"]}>{attr}</span>
                <span className={styles["sr-only"]}>
                  {val} {attr === "Weight" && "grams"}{" "}
                  {attr === "Volume" && "milliliters"}
                </span>
                <span className={styles["attr-val"]} aria-hidden="true">
                  {val} {attr === "Weight" && "g"} {attr === "Volume" && "ml"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles["sidebar"]}>
          <div className={styles["sidebar-card"]}>
            <h2 className={styles["sidebar-title"]}>Pricing &amp; Stock</h2>
            <div className={styles["sidebar-price-row"]}>
              <span className={styles["sr-only"]}>{ariaPrice}</span>
              <span className={styles["price-val"]} aria-hidden="true">
                {formattedPrice}
              </span>
              <span className={styles["price-unit"]}>per unit</span>
            </div>
            <div className={styles["stock-row"]}>
              <span className={styles["stock-label"]}>Stock quantity</span>
              <span className={styles["stock-val"]}>
                {product.stock_quantity} units
              </span>
            </div>
          </div>
          <div className={styles["sidebar-card"]}>
            <h2
              className={`${styles["sidebar-title"]} ${styles["actions-title"]}`}
            >
              Actions
            </h2>
            <div className={styles["action-btns"]}>
              <button
                className={styles["btn-edit"]}
                onClick={() =>
                  navigate(`/products/${id}/edit`, {
                    state: { categoryId },
                  })
                }
              >
                <IconPencil
                  className={styles["edit-icon"]}
                  stroke={2}
                  aria-hidden="true"
                />{" "}
                Edit {isWide && "product"}
              </button>
              <button className={styles["btn-delete"]} onClick={showModal}>
                <IconTrash
                  className={styles["delete-icon"]}
                  stroke={2}
                  aria-hidden="true"
                />{" "}
                Delete {isWide && "product"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        deleteModalRef={deleteModalRef}
        productName={product.name}
        deleteError={deleteError}
        setDeleteError={setDeleteError}
        onDelete={onDelete}
      />
    </main>
  );
}

export default ProductDetail;
