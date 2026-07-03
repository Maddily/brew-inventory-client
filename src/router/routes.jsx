import App from "../App";
import Categories from "../pages/categories/components/Categories/Categories";
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
    ],
  },
];

export default routes;
