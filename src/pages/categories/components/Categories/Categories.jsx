import { useState, useEffect } from "react";
import {
  IconCoffee,
  IconLeaf,
  IconBottle,
  IconTool,
} from "@tabler/icons-react";
import styles from "./Categories.module.css";
import Category from "../Category/Category";
import SkeletonCategories from "../SkeletonCategories/SkeletonCategories";
import ErrorState from "../../../error/components/ErrorState/ErrorState";

const categoryIcons = {
  1: IconCoffee,
  2: IconLeaf,
  3: IconBottle,
  4: IconTool,
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let componentIsMounted = true;

    async function fetchCategories() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/categories/`
        );
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        const data = await response.json();
        if (componentIsMounted) {
          setCategories(data);
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

    fetchCategories();

    return () => (componentIsMounted = false);
  }, [retryCount]);

  if (error)
    return <ErrorState setRetryCount={setRetryCount} entity="categories" />;
  if (loading) return <SkeletonCategories />;

  return (
    <main className={styles["main"]}>
      <header className={styles["categories-header"]}>
        <h1 className={styles["heading"]}>Categories</h1>
        <p className={styles["description"]}>Browse inventory by category</p>
      </header>
      <div className={styles["categories-container"]}>
        {categories.map((category) => (
          <Category
            key={category.id}
            icon={categoryIcons[category.id]}
            id={category.id}
            name={category.name}
            description={category.description}
            productCount={category.product_count}
            path={`/categories/${category.id}`}
          />
        ))}
      </div>
    </main>
  );
}

export default Categories;
