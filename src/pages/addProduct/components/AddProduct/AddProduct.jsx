import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ProductForm from "../../../../components/ProductForm/ProductForm";
import { categoryNameToId } from "../../../../constants";
import { navigateBackAfterAdd } from "../../../../utils/utils";

function AddProduct() {
  const [addError, setAddError] = useState(null);
  const location = useLocation();
  const { categoryId } = location.state || {};
  const navigate = useNavigate();

  const onDismissError = () => setAddError(null);

  const onCancel = function () {
    navigateBackAfterAdd(categoryId, navigate);
  };

  const onAdd = async function ({
    category,
    name,
    description,
    price,
    quantity,
    ...attributes
  }) {
    setAddError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            price,
            stock_quantity: quantity,
            category_id: categoryNameToId[category],
            ...attributes,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP error. Status: ${response.status}`);
      }

      navigateBackAfterAdd(categoryId, navigate);
    } catch (error) {
      setAddError(error.message);
    }
  };

  return (
    <ProductForm
      categoryId={categoryId}
      onSubmit={onAdd}
      isEditing={false}
      error={addError}
      onDismissError={onDismissError}
      onCancel={onCancel}
    />
  );
}

export default AddProduct;
