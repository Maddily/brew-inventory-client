import App from "../App";
import Categories from "../pages/categories/components/Categories/Categories";
import Product from "../pages/product/components/Product/Product";
import Products from "../pages/products/components/Products/Products";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Categories />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/categories/:category_id",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <Product />,
      },
    ],
  },
];

export default routes;
