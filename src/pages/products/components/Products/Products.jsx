import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { IconFilter } from "@tabler/icons-react";
import ErrorState from "../../../error/components/ErrorState/ErrorState";
import styles from "./Products.module.css";
import Product from "../Product/Product";
import FilterBottomSheet from "../FilterBottomSheet/FilterBottomSheet";
import ProductsTable from "../ProductsTable/ProductsTable";
import { SelectedChipsContext } from "../../../../contexts";
import {
  clearFilters,
  filtersExist,
  populateSelectedChips,
} from "../../../../utils/filterUtils";
import SkeletonProducts from "../SkeletonProducts/SkeletonProducts";
import ProductEmptyState from "../ProductEmptyState/ProductEmptyState";
import { idToCategory } from "../../../../constants";
import useIsWide from "../../../../hooks/useIsWide";
import FilterDropdown from "../FilterDropdown/FilterDropdown";
import SearchBar from "../SearchBar/SearchBar";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedChips, setSelectedChips] = useState({
    Category: [],
    Availability: [],
    Origin: [],
    "Roast Level": [],
    Format: [],
    Weight: [],
    Type: [],
    "Caffeine Level": [],
    Base: [],
    Volume: [],
    "Compatible With": [],
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { category_id: categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isWide = useIsWide();
  const filterBottomSheetRef = useRef(null);
  const navigate = useNavigate();
  const hasProducts = products.length > 0;
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

  useEffect(() => {
    let componentIsMounted = true;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      const categoryIdParams = searchParams.getAll("category_id");
      const availability = searchParams.getAll("availability");
      const attributes = {
        Origin: searchParams.getAll("Origin"),
        "Roast Level": searchParams.getAll("Roast Level"),
        Format: searchParams.getAll("Format"),
        Weight: searchParams.getAll("Weight"),
        Type: searchParams.getAll("Type"),
        "Caffeine Level": searchParams.getAll("Caffeine Level"),
        Base: searchParams.getAll("Base"),
        Volume: searchParams.getAll("Volume"),
        "Compatible With": searchParams.getAll("Compatible With"),
      };

      try {
        let url = new URL(`${import.meta.env.VITE_API_URL}/api/products`);

        if (categoryId) {
          url.searchParams.set("category_id", categoryId);
        }

        categoryIdParams.forEach((id) =>
          url.searchParams.append("category_id", id)
        );
        availability.forEach((a) => url.searchParams.append("availability", a));

        // For each attribute, iterate over its values and append them to url.searchParams
        for (const [attribute, values] of Object.entries(attributes)) {
          values.forEach((value) => url.searchParams.append(attribute, value));
        }

        const searchTerm = searchParams.get("search");
        if (searchTerm) {
          url.searchParams.set("search", searchTerm);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        const data = await response.json();

        // Reduce data into one object per product
        const productsMap = new Map();
        for (const row of data) {
          if (!productsMap.has(row.id)) {
            productsMap.set(row.id, {
              id: row.id,
              name: row.name,
              description: row.description,
              price: row.price,
              stock_quantity: row.stock_quantity,
              category_id: row.category_id,
              category: row.category,
              attributes: {},
            });
          }

          productsMap.get(row.id).attributes[row.attribute_name] =
            row.attribute_value;
        }

        if (componentIsMounted) {
          setProducts(Array.from(productsMap.values()));
          populateSelectedChips(searchParams, setSelectedChips, idToCategory);
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

    return () => (componentIsMounted = false);
  }, [categoryId, retryCount, searchParams]);

  function showFilter() {
    // Open the filter bottom sheet
    if (!isWide) {
      filterBottomSheetRef.current.showModal();
      return;
    }

    // Open/close the filter dropdown
    filterOpen ? closeFilter() : setFilterOpen(true);
  }

  function closeFilter() {
    setFilterOpen(false);
  }

  if (error)
    return <ErrorState setRetryCount={setRetryCount} entity="products" />;
  if (loading && !searchParams.get("search")) return <SkeletonProducts />;

  return (
    <main className={styles["main"]}>
      <header className={styles["page-header"]}>
        <div className={styles["left"]}>
          <h1 className={styles["heading"]}>
            {categoryId ? idToCategory[categoryId] : "All Products"}
          </h1>
          <p className={styles["header-description"]}>
            {searchParams.size
              ? `${products.length} products match current filters`
              : `${products.length} products across ${
                  categoryId ? "1 category" : "4 categories"
                }`}
          </p>
        </div>
        <div className={styles["search-container"]}>
          <SearchBar />
          <button
            className={`${styles["filter-button"]} ${
              filtersExist(selectedChips) ? styles["active"] : ""
            }`}
            aria-label="filter products"
            aria-expanded={filterOpen}
            onClick={showFilter}
          >
            <IconFilter
              className={styles["filter-icon"]}
              stroke={2}
              aria-hidden="true"
            />{" "}
            {isWide && "Filter"}
          </button>
        </div>
      </header>
      {!hasProducts &&
        (searchParams.size ? (
          <ProductEmptyState
            title="No products found"
            subtitle="No products match your current filters. Try adjusting or clearing your filters."
            action={{
              label: "Clear filters",
              onClick: () =>
                clearFilters(setSelectedChips, searchParams, setSearchParams),
            }}
          />
        ) : categoryId ? (
          <ProductEmptyState
            title="No products in this category yet"
            subtitle="Add the first product to this category to get started."
            action={{
              label: "Add product",
              onClick: () => navigate("/products/new", { state }),
            }}
          />
        ) : (
          <ProductEmptyState
            title="No products yet"
            subtitle="This inventory is empty. Add your first product to get started."
            action={{
              label: "Add product",
              onClick: () => navigate("/products/new", { state }),
            }}
          />
        ))}
      {/* Mobile list */}
      {hasProducts && !isWide ? (
        <ul className={styles["products-list"]}>
          {products.map((product) => (
            <li key={product.id}>
              <Product
                name={product.name}
                price={product.price}
                stockQuantity={product.stock_quantity}
                category={!categoryId && product.category}
                path={`/products/${product.id}`}
                state={state}
              />
            </li>
          ))}
        </ul>
      ) : null}
      {/* Desktop table */}
      {hasProducts && isWide ? (
        <ProductsTable products={products} categoryId={categoryId} />
      ) : null}
      <SelectedChipsContext value={[selectedChips, setSelectedChips]}>
        {isWide && filterOpen ? (
          <FilterDropdown products={products} closeFilter={closeFilter} />
        ) : !isWide ? (
          <FilterBottomSheet
            filterBottomSheetRef={filterBottomSheetRef}
            closeFilter={closeFilter}
            products={products}
          />
        ) : (
          ""
        )}
      </SelectedChipsContext>
    </main>
  );
}

export default Products;
