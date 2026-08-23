import { Fragment, useState, useEffect, useMemo } from "react";
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
import useIsWide from "../../hooks/useIsWide";
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
  onPasswordChange,
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
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { availability, availabilityClassName, icon } = useAvailability(
    product?.stock_quantity ?? "",
    styles["availability-icon"]
  );
  const isWide = useIsWide(700);
  const errorsExist = Object.keys(fieldErrors).length > 0;

  useEffect(() => {
    if (error === "Incorrect password") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFieldErrors((prev) => ({ ...prev, password: error }));
      document.getElementById("password")?.focus();
    }
  }, [error]);

  function handleSave() {
    if (errorsExist) return;

    const errors = {};

    if (!isEditing && !category) errors.category = "Category is required";

    if (!productName.trim()) errors.name = "Product name is required";

    if (!productPrice || productPrice <= 0)
      errors.price = "Price must be greater than 0";

    if (productQuantity === "") {
      errors.quantity = "Quantity is required";
    } else if (Number(productQuantity) < 0) {
      errors.quantity = "Quantity can't be negative";
    }

    for (const [attr, val] of Object.entries(productAttributes)) {
      if (!val) errors[attr] = `${attr} is required`;
    }

    if (isEditing && !password) {
      errors.password = "Admin password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorKey = Object.keys(errors)[0];
      document.getElementById(firstErrorKey)?.focus();
      return;
    }

    onSubmit({
      category,
      name: productName,
      description: productDescription,
      price: productPrice,
      quantity: productQuantity,
      password,
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

  const ariaCategory = isEditing
    ? product.category.split("-").join(" ")
    : category.split("-").join(" ");
  const ariaPrice = `${parseFloat(productPrice)} dollars`;
  const state = useMemo(
    () =>
      categoryId
        ? {
            from: "category",
            categoryId,
            categoryName: idToCategory[categoryId],
          }
        : { from: "all" },
    [categoryId]
  );

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
        state={state}
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
            <h2 className={styles["card-title"]}>Basic details</h2>
            <div className={styles["field"]}>
              <label htmlFor="category" className={styles["label"]}>
                Category{" "}
                <span aria-hidden="true" className={styles["asterisk"]}>
                  *
                </span>{" "}
                <span className={styles["sr-only"]}>required</span>
              </label>
              {isEditing && (
                <span id="category-desc" className={styles["sr-only"]}>
                  {ariaCategory}
                </span>
              )}
              <select
                id="category"
                aria-describedby={
                  isEditing && fieldErrors.category
                    ? "category-desc category-error"
                    : isEditing
                    ? "category-desc"
                    : undefined
                }
                aria-invalid={!!fieldErrors.category}
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
              {fieldErrors.category && (
                <FieldError
                  message={fieldErrors.category}
                  id="category-error"
                />
              )}
            </div>
            <div className={styles["field"]}>
              <label htmlFor="name" className={styles["label"]}>
                Product name{" "}
                <span aria-hidden="true" className={styles["asterisk"]}>
                  *
                </span>{" "}
                <span className={styles["sr-only"]}>required</span>
              </label>
              <input
                id="name"
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                aria-invalid={!!fieldErrors.name}
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
              {fieldErrors.name && (
                <FieldError message={fieldErrors.name} id="name-error" />
              )}
            </div>
            <div className={styles["field"]}>
              <label
                htmlFor="description"
                className={`${styles["label"]} ${styles["desc"]}`}
              >
                Description <span aria-hidden="true">(optional)</span>{" "}
                <span className={styles["sr-only"]}>optional</span>
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
                  Price{" "}
                  <span aria-hidden="true" className={styles["asterisk"]}>
                    *
                  </span>{" "}
                  <span className={styles["sr-only"]}>required</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  aria-describedby={
                    fieldErrors.price ? "price-error" : undefined
                  }
                  aria-invalid={!!fieldErrors.price}
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
                {fieldErrors.price && (
                  <FieldError message={fieldErrors.price} id="price-error" />
                )}
              </div>
              <div className={styles["field"]}>
                <label htmlFor="quantity" className={styles["label"]}>
                  Quantity{" "}
                  <span aria-hidden="true" className={styles["asterisk"]}>
                    *
                  </span>{" "}
                  <span className={styles["sr-only"]}>required</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  aria-describedby={
                    fieldErrors.quantity ? "quantity-error" : undefined
                  }
                  aria-invalid={!!fieldErrors.quantity}
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
                {fieldErrors.quantity && (
                  <FieldError
                    message={fieldErrors.quantity}
                    id="quantity-error"
                  />
                )}
              </div>
            </div>
          </div>
          <div className={styles["card"]}>
            <h2 className={styles["card-title"]}>
              Attributes{" "}
              <span aria-hidden="true">
                {(product || category) && "—"} {product?.category || category}
              </span>
              {(product || category) && (
                <span className={styles["sr-only"]}>{ariaCategory}</span>
              )}
            </h2>
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
                      <span aria-hidden="true">
                        {attr} {attr === "Weight" && "(g)"}{" "}
                        {attr === "Volume" && "(ml)"}{" "}
                        <span className={styles["asterisk"]}>*</span>
                      </span>
                      <span className={styles["sr-only"]}>
                        {attr} {attr === "Weight" && "in grams"}{" "}
                        {attr === "Volume" && "in milliliters"} required
                      </span>
                    </label>
                    {shouldUseSelect(
                      attr,
                      product?.category || category,
                      categoryAttributes
                    ) ? (
                      <select
                        id={attr}
                        aria-describedby={
                          fieldErrors[attr] ? `${attr}-error` : undefined
                        }
                        aria-invalid={!!fieldErrors[attr]}
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
                        type={
                          attr === "Weight" || attr === "Volume"
                            ? "number"
                            : "text"
                        }
                        aria-describedby={
                          fieldErrors[attr] ? `${attr}-error` : undefined
                        }
                        aria-invalid={!!fieldErrors[attr]}
                        className={styles["input"]}
                        value={productAttributes[attr]}
                        placeholder={attributePlaceholders[attr]}
                        onChange={(e) => {
                          handleAttrChange(e, attr);
                        }}
                      />
                    )}
                    {fieldErrors[attr] && (
                      <FieldError
                        message={fieldErrors[attr]}
                        id={`${attr}-error`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {isEditing && (
            <div className={`${styles["card"]} ${styles["password-card"]}`}>
              <h2 className={styles["card-title"]}>Admin authorization</h2>
              <p className={styles["password-hint"]}>
                Enter the admin password to save changes.
              </p>
              <label htmlFor="password" className={styles["label"]}>
                Admin password{" "}
                <span aria-hidden="true" className={styles["asterisk"]}>
                  *
                </span>{" "}
                <span className={styles["sr-only"]}>required</span>
              </label>
              <input
                className={styles["input"]}
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  e.target.value.trim() &&
                    fieldErrors.password &&
                    clearFieldError("password");
                  onPasswordChange();
                  setPassword(e.target.value);
                }}
                placeholder="Enter admin password"
              />
              {isEditing && fieldErrors.password && (
                <FieldError
                  message={fieldErrors.password}
                  id="password-error"
                />
              )}
            </div>
          )}
        </div>
        <div className={styles["sidebar"]}>
          {isEditing && isWide ? (
            <div
              className={`${styles["sidebar-card"]} ${styles["current-vals-card"]}`}
            >
              <h2 className={styles["sidebar-title"]}>Current values</h2>
              <div className={styles["current-val"]}>
                <span className={styles["current-label"]}>Price</span>
                <span className={styles["current-data"]} aria-hidden="true">
                  {formatPrice(product?.price)}
                </span>
                <span className={styles["sr-only"]}>{ariaPrice}</span>
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
          ) : isWide ? (
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
          ) : (
            ""
          )}
          <div className={`${styles["actions"]} ${styles["sidebar-card"]}`}>
            <button
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
  onPasswordChange: PropTypes.func.isRequired,
};

export default ProductForm;
