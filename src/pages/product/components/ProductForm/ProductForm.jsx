import { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import styles from "./ProductForm.module.css";
import { formatPrice, shouldUseSelect } from "../../../../utils/utils";
import { categoryAttributes } from "../../../../constants";
import useAvailability from "../../../../hooks/useAvailability";

function ProductForm({
  id,
  name,
  description,
  price,
  quantity,
  attributes,
  categoryId,
  categoryName,
}) {
  const [productName, setProductName] = useState(name);
  const [productDescription, setProductDescription] = useState(description);
  const [productPrice, setProductPrice] = useState(price);
  const [productQuantity, setProductQuantity] = useState(quantity);
  const [productAttributes, setProductAttributes] = useState(attributes);
  const { availability, availabilityClassName, icon } = useAvailability(
    quantity,
    styles["availability-icon"]
  );

  return (
    <main className={styles["main"]}>
      <Breadcrumb
        prevPath={`/products/${id}`}
        prev={name}
        current="Edit"
        state={
          categoryId
            ? {
                from: "category",
                categoryId,
                categoryName,
              }
            : { from: "all" }
        }
      />
      <div className={styles["form-layout"]}>
        <div className={styles["left"]}>
          <div className={styles["card"]}>
            <div className={styles["card-title"]}>Basic details</div>
            <div className={styles["field"]}>
              <label htmlFor="name" className={styles["label"]}>
                Product name
              </label>
              <input
                id="name"
                className={styles["input"]}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className={styles["field"]}>
              <label
                htmlFor="description"
                className={`${styles["label"]} ${styles["desc"]}`}
              >
                Description <span>(optional)</span>
              </label>
              <textarea
                id="description"
                className={styles["input"]}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              ></textarea>
            </div>
            <div className={styles["two-col"]}>
              <div className={styles["field"]}>
                <label htmlFor="price" className={styles["label"]}>
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={1}
                  id="price"
                  className={styles["input"]}
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div className={styles["field"]}>
                <label htmlFor="quantity" className={styles["label"]}>
                  Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  id="quantity"
                  className={styles["input"]}
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={styles["card"]}>
            <div className={styles["card-title"]}>
              Attributes <span>— {categoryName}</span>
            </div>
            <div className={styles["two-col"]}>
              {Object.keys(attributes).map((attr) => (
                <div key={attr} className={styles["field"]}>
                  <label className={styles["label"]}>
                    {attr} {attr === "Weight" && "(g)"}
                    {attr === "Volume" && "(ml)"}
                  </label>
                  {shouldUseSelect(attr, categoryName) ? (
                    <select
                      className={styles["input"]}
                      value={productAttributes[attr]}
                      onChange={(e) =>
                        setProductAttributes({
                          ...productAttributes,
                          [attr]: e.target.value,
                        })
                      }
                    >
                      {categoryAttributes[categoryName][attr].map((val) => (
                        <option key={val}>{val}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={styles["input"]}
                      value={productAttributes[attr]}
                      onChange={(e) =>
                        setProductAttributes({
                          ...productAttributes,
                          [attr]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles["sidebar"]}>
          <div className={styles["sidebar-card"]}>
            <div className={styles["sidebar-title"]}>Current values</div>
            <div className={styles["current-val"]}>
              <span className={styles["current-label"]}>Price</span>
              <span className={styles["current-data"]}>
                {formatPrice(price)}
              </span>
            </div>
            <div className={styles["current-val"]}>
              <span className={styles["current-label"]}>Stock</span>
              <span className={styles["current-data"]}>{quantity} units</span>
            </div>
            <div className={styles["current-val"]}>
              <span className={styles["current-label"]}>Availability</span>
              <span
                className={`${styles["badge"]} ${styles[availabilityClassName]}`}
              >
                {icon} {availability}
              </span>
            </div>
          </div>
          <div className={`${styles["actions"]} ${styles["sidebar-card"]}`}>
            <button className={styles["btn-save"]}>
              <IconCheck stroke={2} className={styles["action-icon"]} /> Save
              changes
            </button>
            <button className={styles["btn-cancel"]}>
              <IconX stroke={2} className={styles["action-icon"]} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

ProductForm.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.string,
  quantity: PropTypes.string,
  attributes: PropTypes.object,
  categoryId: PropTypes.string,
  categoryName: PropTypes.string,
};

export default ProductForm;
