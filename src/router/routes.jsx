import App from "../App";
import Categories from "../pages/categories/components/Categories/Categories";
import ProductDetail from "../pages/productDetail/components/ProductDetail/ProductDetail";
import Products from "../pages/products/components/Products/Products";
import EditProduct from "../pages/editProduct/components/EditProduct/EditProduct";
import AddProduct from "../pages/addProduct/components/AddProduct/AddProduct";

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
        element: <ProductDetail />,
      },
      {
        path: "/products/:id/edit",
        element: <EditProduct />,
      },
      {
        path: "/products/new",
        element: <AddProduct />,
      },
    ],
  },
];

export default routes;
