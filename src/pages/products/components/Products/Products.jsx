import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import ErrorState from "../../../error/components/ErrorState/ErrorState";
import styles from "./Products.module.css";
import Product from "../Product/Product";
import FilterBottomSheet from "../FilterBottomSheet/FilterBottomSheet";
import ProductsTable from "../ProductsTable/ProductsTable";
import { SelectedChipsContext } from "../../../../contexts";
import { populateSelectedChips } from "../../../../utils/filterUtils";
import SkeletonProducts from "../SkeletonProducts/SkeletonProducts";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedChips, setSelectedChips] = useState({
    Category: [],
    Availability: [],
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { category_id: categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const filterBottomSheetRef = useRef(null);

  useEffect(() => {
    let componentIsMounted = true;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      const categoryIdParams = searchParams.getAll("category_id");
      const availability = searchParams.getAll("availability");

      try {
        let URL = `${import.meta.env.VITE_API_URL}/api/products`;
        if (categoryId) {
          URL += `?category_id=${categoryId}`;
        }

        if (categoryIdParams.length > 0 || availability.length > 0) {
          URL += window.location.search;
        }

        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        const data = await response.json();

        if (componentIsMounted) {
          setProducts(data);
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

    fetchProducts();

    populateSelectedChips(searchParams, setSelectedChips);

    return () => (componentIsMounted = false);
  }, [categoryId, retryCount, searchParams]);

  function showFilterModal() {
    filterBottomSheetRef.current.showModal();
    setFilterOpen(true);
  }

  function resetButtonStyle() {
    setFilterOpen(false);
  }

  if (error)
    return <ErrorState setRetryCount={setRetryCount} entity="products" />;
  if (loading) return <SkeletonProducts />;

  return (
    <main className={styles["main"]}>
      <header className={styles["page-header"]}>
        <div className={styles["left"]}>
          <h1 className={styles["heading"]}>
            {categoryId ? products[0].category : "All Products"}
          </h1>
          <p className={styles["header-description"]}>
            {products.length} products across{" "}
            {categoryId ? "1 category" : "4 categories"}
          </p>
        </div>
        <div className={styles["search-container"]}>
          <IconSearch className={styles["search-icon"]} stroke={2} />
          <input
            className={styles["search"]}
            type="search"
            name="search"
            id="search"
            placeholder="Search products…"
          />
          <button
            className={`${styles["filter-button"]} ${
              filterOpen ? styles["open-modal"] : ""
            }`}
            aria-label="filter"
            onClick={showFilterModal}
          >
            <IconFilter className={styles["filter-icon"]} stroke={2} />
          </button>
        </div>
      </header>
      {/* Mobile list */}
      <div className={styles["products-list"]}>
        {products.map((product) => (
          <Product
            key={product.id}
            name={product.name}
            price={product.price}
            stockQuantity={product.stock_quantity}
            category={!categoryId && product.category}
            path={`/products/${product.id}`}
          />
        ))}
      </div>
      {/* Desktop table */}
      <ProductsTable products={products} categoryId={categoryId} />
      <SelectedChipsContext value={[selectedChips, setSelectedChips]}>
        <FilterBottomSheet
          filterBottomSheetRef={filterBottomSheetRef}
          resetButtonStyle={resetButtonStyle}
        />
      </SelectedChipsContext>
    </main>
  );
}

export default Products;
