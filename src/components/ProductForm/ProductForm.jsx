import { Fragment, useState } from "react";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconTag,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import PropTypes from "prop-types";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import styles from "./ProductForm.module.css";
import { formatPrice, shouldUseSelect } from "../../utils/utils";
import {
  attributePlaceholders,
  attributeStates,
  categoryAttributes,
  idToCategory,
} from "../../constants";
import useAvailability from "../../hooks/useAvailability";
import FormError from "../FormError/FormError";
import FieldError from "../FieldError/FieldError";

function ProductForm({
  product,
  categoryId,
  onSubmit,
  isEditing,
  error,
  onDismissError,
  onCancel,
}) {
  const [category, setCategory] = useState(product?.category ?? "");
  const [productName, setProductName] = useState(product?.name ?? "");
  const [productDescription, setProductDescription] = useState(
    product?.description ?? ""
  );
  const [productPrice, setProductPrice] = useState(product?.price ?? "");
  const [productQuantity, setProductQuantity] = useState(
    product?.stock_quantity ?? ""
  );
  const [productAttributes, setProductAttributes] = useState(
    product?.attributes ?? {}
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const { availability, availabilityClassName, icon } = useAvailability(
    product?.stock_quantity ?? "",
    styles["availability-icon"]
  );

  function handleSave() {
    const errors = {};

    if (!isEditing && !category) errors.category = "Category is required";
    if (!productName.trim()) errors.name = "Product name is required";
    if (!productPrice || productPrice <= 0)
      errors.price = "Price must be greater than 0";
    if (productQuantity === "" || Number(productQuantity) < 0)
      errors.quantity = "Quantity can't be negative";

    for (const [attr, val] of Object.entries(productAttributes)) {
      if (!val) errors[attr] = `${attr} is required`;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSubmit({
      category,
      name: productName,
      description: productDescription,
      price: productPrice,
      quantity: productQuantity,
      ...productAttributes,
    });
  }

  function handleAttrChange(e, attr) {
    e.target.value && fieldErrors[attr] && clearFieldError(attr);
    setProductAttributes({
      ...productAttributes,
      [attr]: e.target.value,
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
        prevPath={
          isEditing
            ? `/products/${product.id}`
            : categoryId
            ? `/categories/${categoryId}`
            : "/products"
        }
        prev={
          isEditing
            ? product.name
            : categoryId
            ? idToCategory[categoryId]
            : "All products"
        }
        current={isEditing ? "Edit" : "Add product"}
        state={
          categoryId
            ? {
                from: "category",
                categoryId,
                categoryName: idToCategory[categoryId],
              }
            : { from: "all" }
        }
      />
      {error && (
        <FormError
          message={error}
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
              <label htmlFor="category" className={styles["label"]}>
                Category <span>*</span>
              </label>
              <select
                id="category"
                className={styles["input"]}
                disabled={isEditing}
                value={category}
                onChange={(e) => {
                  const selected = e.target.value;
                  setCategory(selected);
                  setFieldErrors({});
                  setProductAttributes(attributeStates[selected]);
                }}
              >
                <option hidden>Select a category…</option>
                <option>Coffee</option>
                <option>Tea</option>
                <option>Ready-to-Drink</option>
                <option>Accessories</option>
              </select>
              {<FieldError message={fieldErrors.category} />}
            </div>
            <div className={styles["field"]}>
              <label htmlFor="name" className={styles["label"]}>
                Product name <span>*</span>
              </label>
              <input
                id="name"
                className={styles["input"]}
                value={productName}
                placeholder="e.g. Ethiopia Yirgacheffe"
                onChange={(e) => {
                  e.target.value.trim() &&
                    fieldErrors.name &&
                    clearFieldError("name");
                  setProductName(e.target.value);
                }}
              />
              {<FieldError message={fieldErrors.name} />}
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
                placeholder="Describe the product…"
                onChange={(e) => setProductDescription(e.target.value)}
              ></textarea>
            </div>
            <div className={styles["two-col"]}>
              <div className={styles["field"]}>
                <label htmlFor="price" className={styles["label"]}>
                  Price <span>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={1}
                  id="price"
                  className={styles["input"]}
                  value={productPrice}
                  placeholder="0.00"
                  onChange={(e) => {
                    Number(e.target.value) > 0 &&
                      fieldErrors.price &&
                      clearFieldError("price");
                    setProductPrice(e.target.value);
                  }}
                />
                {<FieldError message={fieldErrors.price} />}
              </div>
              <div className={styles["field"]}>
                <label htmlFor="quantity" className={styles["label"]}>
                  Quantity <span>*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  id="quantity"
                  className={styles["input"]}
                  value={productQuantity}
                  placeholder="0"
                  onChange={(e) => {
                    e.target.value !== "" &&
                      Number(e.target.value) >= 0 &&
                      fieldErrors.quantity &&
                      clearFieldError("quantity");
                    setProductQuantity(e.target.value);
                  }}
                />
                {<FieldError message={fieldErrors.quantity} />}
              </div>
            </div>
          </div>
          <div className={styles["card"]}>
            <div className={styles["card-title"]}>
              Attributes{" "}
              <span>
                {(product || category) && "—"} {product?.category || category}
              </span>
            </div>
            {!isEditing && !category ? (
              <div className={styles["attrs-placeholder"]}>
                <IconTag
                  stroke={2}
                  className={styles["tag-icon"]}
                  aria-hidden="true"
                />
                <div className={styles["attrs-placeholder-text"]}>
                  Select a category above to see its required attributes
                </div>
              </div>
            ) : (
              <div className={styles["two-col"]}>
                {Object.keys(
                  product?.attributes ?? categoryAttributes[category]
                ).map((attr) => (
                  <div key={attr} className={styles["field"]}>
                    <label htmlFor={attr} className={styles["label"]}>
                      {attr} {attr === "Weight" && "(g)"}
                      {attr === "Volume" && "(ml)"} <span>*</span>
                    </label>
                    {shouldUseSelect(attr, product?.category || category) ? (
                      <select
                        id={attr}
                        className={styles["input"]}
                        value={productAttributes[attr]}
                        onChange={(e) => {
                          handleAttrChange(e, attr);
                        }}
                      >
                        {categoryAttributes[product?.category || category][
                          attr
                        ].map((val, i) => (
                          <Fragment key={val}>
                            {i === 0 && <option hidden>Select...</option>}
                            <option>{val}</option>
                          </Fragment>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={attr}
                        className={styles["input"]}
                        value={productAttributes[attr]}
                        placeholder={attributePlaceholders[attr]}
                        onChange={(e) => {
                          handleAttrChange(e, attr);
                        }}
                      />
                    )}
                    {<FieldError message={fieldErrors[attr]} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles["sidebar"]}>
          {isEditing ? (
            <div
              className={`${styles["sidebar-card"]} ${styles["current-vals-card"]}`}
            >
              <div className={styles["sidebar-title"]}>Current values</div>
              <div className={styles["current-val"]}>
                <span className={styles["current-label"]}>Price</span>
                <span className={styles["current-data"]}>
                  {formatPrice(product?.price)}
                </span>
              </div>
              <div className={styles["current-val"]}>
                <span className={styles["current-label"]}>Stock</span>
                <span className={styles["current-data"]}>
                  {product?.stock_quantity} units
                </span>
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
          ) : (
            <div className={`${styles["sidebar-card"]} ${styles["tip-card"]}`}>
              <div className={styles["sidebar-title"]}>Tip</div>
              <div className={styles["tip"]}>
                <IconInfoCircle
                  stroke={2}
                  className={styles["tip-icon"]}
                  aria-hidden="true"
                />
                <div className={styles["tip-text"]}>
                  {category ? (
                    <>
                      All fields marked{" "}
                      <strong className={styles["tip-asterisk"]}>*</strong> are
                      required before the product can be added.
                    </>
                  ) : (
                    <>
                      Start by picking a <strong>category</strong> — this
                      determines which attributes you'll need to fill in.
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={`${styles["actions"]} ${styles["sidebar-card"]}`}>
            <button
              disabled={errorsExist}
              className={`${styles["btn-save"]} ${
                errorsExist ? styles["error"] : ""
              } ${styles["btn-action"]}`}
              type="submit"
            >
              {errorsExist ? (
                <>
                  <IconAlertTriangle
                    stroke={2}
                    className={styles["alert-icon"]}
                    aria-hidden="true"
                  />
                  Fix errors to save
                </>
              ) : isEditing ? (
                <>
                  <IconCheck
                    stroke={2}
                    className={styles["action-icon"]}
                    aria-hidden="true"
                  />
                  Save changes
                </>
              ) : (
                <>
                  <IconPlus
                    stroke={2}
                    className={styles["action-icon"]}
                    aria-hidden="true"
                  />
                  Add product
                </>
              )}
            </button>
            <button
              className={`${styles["btn-cancel"]} ${styles["btn-action"]}`}
              onClick={onCancel}
              type="button"
            >
              <IconX
                stroke={2}
                className={styles["action-icon"]}
                aria-hidden="true"
              />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

ProductForm.propTypes = {
  product: PropTypes.object,
  categoryId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onDismissError: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProductForm;
