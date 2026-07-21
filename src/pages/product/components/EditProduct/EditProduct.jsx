import { useLocation, useParams } from "react-router";
import ProductForm from "../ProductForm/ProductForm";
import { useEffect, useState } from "react";
import ErrorState from "../../../error/components/ErrorState/ErrorState";
import SkeletonProduct from "../SkeletonProduct/SkeletonProduct";

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();
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

  if (error)
    return <ErrorState setRetryCount={setRetryCount} entity="product" />;
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
    />
  );
}

export default EditProduct;
