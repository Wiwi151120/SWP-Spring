import React, { useEffect, useState } from "react";
import { textApp } from "../../../TextContent/textApp";
import { Link, useLocation, useParams } from "react-router-dom";
import { getData, postData } from "../../../api/api";
import ComHeader from "../../Components/ComHeader/ComHeader";
import ComFooter from "../../Components/ComFooter/ComFooter";

const InvoicePage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState(null);
  const location = useLocation();
  useEffect(() => {
    postData(`/order/payment/bill/${id}${location.search}`, {})
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {});

    // Lấy danh sách sản phẩm
    getData("/product/staff", {})
      .then((productData) => {
        setProducts(productData?.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    // Lấy thông tin đơn hàng
    getData(`/order/user/${id}`)
      .then((data) => {
        setOrder(data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      });
  }, [id]);

  const getProductById = (productId) => {
    // Tìm sản phẩm theo ID trong danh sách sản phẩm
    console.log(products?.docs);
    return products?.docs?.find((product) => product._id === productId);
  };

  if (!order) {
    return <div>Loading...</div>;
  }
  console.log("====================================");
  console.log(order);
  console.log("====================================");
  return (
    <>
      <ComHeader />
      <div className=" flex items-center justify-center">
        <div className="bg-white p-4 md:p-8 lg:p-12 rounded-lg shadow-md w-full md:w-3/4 lg-w-1/2 xl:w-1/3">
          <h1 className="bg-blue-500 text-white py-2 px-4 rounded-md text-center block w-full text-2xl font-semibold mb-4">
            {textApp.Invoice.title}
          </h1>
          <p className="text-gray-600 mb-2">{textApp.Invoice.status}</p>
          <p className="text-gray-600 mb-6">{textApp.Invoice.thankyou}</p>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Thông tin đặt hàng:</h2>
            <p>Tên người đặt: {order.name}</p>
            <p>Email: {order.email}</p>
            <p>Số điện thoai: {order.phone}</p>
            <p>Địa chỉ giao hàng: {order.shippingAddress}</p>
            <p>Thông tin lưu ý của khách hàng: {order.description}</p>

            <h2 className="text-lg font-semibold mb-2">
              {textApp.Invoice.info}
            </h2>
            {order?.products?.map((product, index) => {
              // Sử dụng getProductById để lấy thông tin sản phẩm đầy đủ
              const fullProduct = getProductById(product.product);
              const materials = fullProduct?.material?.join(", ");

              return (
                <div key={index} className="mb-4 flex items-center">
                  <img
                    src={fullProduct?.image}
                    alt={fullProduct?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <p className="text-lg font-semibold">{fullProduct?.name}</p>
                    <p>
                      {textApp.OrderHistory.product.quantity}{" "}
                      {product?.quantity}
                    </p>
                    <p>
                      {textApp.OrderHistory.product.price}{" "}
                      {product?.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p>
                      {textApp.Product.page.material}
                      {materials}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-gray-600 mb-2">
            {textApp.Invoice.orderDate}:{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US")}
          </p>
          <p className="text-gray-600 mb-2">
            {order.payment === "Cash"
              ? textApp.Invoice.paymentMethod
              : textApp.Invoice.payPalMethod}
          </p>
          <p className="text-gray-600 mb-6">
            {textApp.OrderHistory.product.amount}:{" "}
            {order?.totalAmount?.toLocaleString("en-US", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <Link
            to="/"
            className="bg-blue-500 hover-bg-blue-600 text-white py-2 px-4 rounded-md text-center block w-full max-w-xs mx-auto"
          >
            {textApp.Invoice.button}
          </Link>
        </div>
      </div>
      <ComFooter />
    </>
  );
};

export default InvoicePage;
