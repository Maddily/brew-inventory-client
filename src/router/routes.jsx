import App from "../App";
import Categories from "../pages/categories/components/Categories/Categories";
import Product from "../pages/product/components/Product/Product";
import Products from "../pages/products/components/Products/Products";
import EditProduct from "../pages/product/components/EditProduct/EditProduct";

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
      {
        path: "/products/:id/edit",
        element: <EditProduct />,
      },
    ],
  },
];

export default routes;
