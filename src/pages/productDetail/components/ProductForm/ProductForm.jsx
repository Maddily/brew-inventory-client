import { useState } from "react";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";
import PropTypes from "prop-types";
import Breadcrumb from "../../../../components/Breadcrumb/Breadcrumb";
import styles from "./ProductForm.module.css";
import { formatPrice, shouldUseSelect } from "../../../../utils/utils";
import { categoryAttributes } from "../../../../constants";
import useAvailability from "../../../../hooks/useAvailability";
import FormError from "../../../../components/FormError/FormError";

function ProductForm({
  id,
  name,
  description,
  price,
  quantity,
  attributes,
  categoryId,
  categoryName,
  onSave,
  saveError,
  onDismissError,
  onCancel,
}) {
  const [productName, setProductName] = useState(name);
  const [productDescription, setProductDescription] = useState(description);
  const [productPrice, setProductPrice] = useState(price);
  const [productQuantity, setProductQuantity] = useState(quantity);
  const [productAttributes, setProductAttributes] = useState(attributes);
  const [fieldErrors, setFieldErrors] = useState({});
  const { availability, availabilityClassName, icon } = useAvailability(
    quantity,
    styles["availability-icon"]
  );

  function handleSave() {
    const errors = {};

    if (!productName.trim()) errors.name = "Product name is required";
    if (!productPrice || productPrice <= 0)
      errors.price = "Price must be greater than 0";
    if (productQuantity === "" || Number(productQuantity) < 0)
      errors.quantity = "Quantity can't be negative";

    for (const [attr, val] of Object.entries(productAttributes)) {
      if (!shouldUseSelect(attr, categoryName) && !val)
        errors[attr] = `${attr} is required`;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSave({
      name: productName,
      description: productDescription,
      price: productPrice,
      quantity: productQuantity,
      ...productAttributes,
    });
  }

  function clearFieldError(fieldName) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }

  const errorsExist = Object.keys(fieldErrors).length > 0;

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
      {saveError && (
        <FormError
          message={saveError}
          onDismiss={onDismissError}
          onRetry={handleSave}
        />
      )}
      <form
        className={styles["form-layout"]}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
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
                required
                onChange={(e) => {
                  e.target.value.trim() &&
                    fieldErrors.name &&
                    clearFieldError("name");
                  setProductName(e.target.value);
                }}
              />
              {fieldErrors.name && (
                <div className={styles["field-error"]}>
                  <IconAlertCircle
                    className={styles["field-error-icon"]}
                    stroke={2}
                  />{" "}
                  {fieldErrors.name}
                </div>
              )}
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
                  onChange={(e) => {
                    Number(e.target.value) > 0 &&
                      fieldErrors.price &&
                      clearFieldError("price");
                    setProductPrice(e.target.value);
                  }}
                  required
                />
                {fieldErrors.price && (
                  <div className={styles["field-error"]}>
                    <IconAlertCircle
                      className={styles["field-error-icon"]}
                      stroke={2}
                    />{" "}
                    {fieldErrors.price}
                  </div>
                )}
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
                  onChange={(e) => {
                    e.target.value !== "" &&
                      Number(e.target.value) >= 0 &&
                      fieldErrors.quantity &&
                      clearFieldError("quantity");
                    setProductQuantity(e.target.value);
                  }}
                  required
                />
                {fieldErrors.quantity && (
                  <div className={styles["field-error"]}>
                    <IconAlertCircle
                      className={styles["field-error-icon"]}
                      stroke={2}
                    />{" "}
                    {fieldErrors.quantity}
                  </div>
                )}
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
                      onChange={(e) => {
                        e.target.value &&
                          fieldErrors[attr] &&
                          clearFieldError(attr);
                        setProductAttributes({
                          ...productAttributes,
                          [attr]: e.target.value,
                        });
                      }}
                      required
                    />
                  )}
                  {fieldErrors[attr] && (
                    <div className={styles["field-error"]}>
                      <IconAlertCircle
                        className={styles["field-error-icon"]}
                        stroke={2}
                      />{" "}
                      {fieldErrors[attr]}
                    </div>
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
            <button
              disabled={errorsExist}
              className={`${styles["btn-save"]} ${
                errorsExist ? styles["error"] : ""
              }`}
              onClick={handleSave}
            >
              {errorsExist ? (
                <>
                  <IconAlertTriangle
                    stroke={2}
                    className={styles["alert-icon"]}
                  />
                  Fix errors to save
                </>
              ) : (
                <>
                  <IconCheck stroke={2} className={styles["action-icon"]} />
                  Save changes
                </>
              )}
            </button>
            <button className={styles["btn-cancel"]} onClick={onCancel}>
              <IconX stroke={2} className={styles["action-icon"]} />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

ProductForm.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  attributes: PropTypes.object.isRequired,
  categoryId: PropTypes.string,
  categoryName: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  saveError: PropTypes.string.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProductForm;
