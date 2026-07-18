import { IconSearch } from "@tabler/icons-react";
import styles from "./SearchBar.module.css";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useSearchParams } from "react-router";

function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    // Add the search term to the url or remove it if there's no search term
    if (debouncedSearch) {
      newParams.set("search", debouncedSearch);
    } else {
      newParams.delete("search");
    }

    setSearchParams(newParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <>
      <IconSearch className={styles["search-icon"]} stroke={2} />
      <input
        className={styles["search"]}
        type="search"
        name="search"
        id="search"
        placeholder="Search products…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </>
  );
}

export default SearchBar;
