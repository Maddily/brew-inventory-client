import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import ProductForm from "../../../../components/ProductForm/ProductForm";
import ErrorState from "../../../error/components/ErrorState/ErrorState";
import SkeletonEditProduct from "../SkeletonEditProduct/SkeletonEditProduct";
import { navigateBackAfterEdit } from "../../../../utils/utils";

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [saveError, setSaveError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId } = location.state || {};

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
          const data = await response.json();
          throw new Error(
            data.error || `HTTP error. Status: ${response.status}`
          );
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
          setError(error.message);
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

  const onDismissError = () => setSaveError(null);

  const onSave = async function ({
    name,
    description,
    price,
    quantity,
    password,
    ...attributes
  }) {
    setSaveError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "PUT",
          body: JSON.stringify({
            id,
            name,
            description,
            price,
            stock_quantity: quantity,
            category_id: product.category_id,
            password,
            ...attributes,
          }),
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

      navigateBackAfterEdit(id, categoryId, product.category, navigate);
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const onCancel = function () {
    navigateBackAfterEdit(id, categoryId, product.category, navigate);
  };

  const resetSaveError = function () {
    setSaveError(null);
  };

  if (error) return <ErrorState setRetryCount={setRetryCount} entity="form" />;
  if (loading) return <SkeletonEditProduct />;

  return (
    <ProductForm
      product={product}
      categoryId={categoryId}
      onSubmit={onSave}
      isEditing={true}
      error={saveError}
      onDismissError={onDismissError}
      onCancel={onCancel}
      onPasswordChange={resetSaveError}
    />
  );
}

export default EditProduct;
