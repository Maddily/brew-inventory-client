import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import ProductForm from "../ProductForm/ProductForm";
import ErrorState from "../../../error/components/ErrorState/ErrorState";
import SkeletonProduct from "../SkeletonProductDetail/SkeletonProductDetail";

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
            name,
            description,
            price,
            stock_quantity: quantity,
            category_id: product.category_id,
            ...attributes,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP error. Status: ${response.status}`);
      }

      setProduct({
        ...product,
        name,
        description,
        price,
        stock_quantity: quantity,
        attributes: { ...attributes },
      });

      navigate(`/products/${id}`, {
        state: categoryId
          ? {
              from: "category",
              categoryId,
              categoryName: product.category,
            }
          : { from: "all" },
      });
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const onCancel = function () {
    navigate(`/products/${id}`, {
      state: categoryId
        ? {
            from: "category",
            categoryId,
            categoryName: product.category,
          }
        : { from: "all" },
    });
  };

  if (error) return <ErrorState setRetryCount={setRetryCount} entity="form" />;
  if (loading) return <SkeletonProduct />;

  return (
    <ProductForm
      id={id}
      name={product.name}
      description={product.description}
      price={product.price}
      quantity={product.stock_quantity}
      attributes={product.attributes}
      categoryId={categoryId}
      categoryName={product.category}
      onSave={onSave}
      saveError={saveError}
      onDismissError={onDismissError}
      onCancel={onCancel}
    />
  );
}

export default EditProduct;
