import React, { useState, useEffect } from "react";
import { loadCart, cartEmpty } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentbhelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";

const Paymentb = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((info) => {
      console.log("INFORMATION", info);
      if (info && info.error) {
        setInfo({ ...info, error: info.error });
      } else {
        if (info !== undefined) {
          const clientToken = info.clientToken;
          setInfo({ clientToken });
        }
      }
    });
  };

  const showbtDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn col-12 btn-success" onClick={onPurchase}>
              Buy Now
            </button>
          </div>
        ) : (
          // <h3>Please login or add something to cart</h3>
          <h4>
            Please{" "}
            <Link to="/signin" className="text-white border-bottom">
              Login
            </Link>{" "}
            or{" "}
            <Link to="/" className="text-white border-bottom">
              add something
            </Link>{" "}
            to cart.
          </h4>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    try {
      setInfo({ ...info, loading: true });
      let nonce = null;
      // let getNonce = null;
      let getNonce = info.instance.requestPaymentMethod().then((data) => {
        console.log(getNonce);
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount(),
        };

        processPayment(userId, token, paymentData)
          .then((response) => {
            setInfo({ ...info, success: response.success, loading: false });
            console.log("PAYMENT SUCCESS");

            const orderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              status: "Processing",
            };

            createOrder(userId, token, orderData);

            cartEmpty(() => {
              console.log("Did we got a crash? No - Emptied the cart...!");
            });

            setReload(!reload);
          })
          .catch((error) => {
            setInfo({ loading: false, success: false });
            console.log("PAYMENT FAILED");
          });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getAmount = () => {
    let amount = 0;
    products &&
      products.map((product) => {
        amount = amount + product.price;
      });
    return amount;
  };

  return (
    <div>
      <h3>Your bill is ${getAmount()} </h3>
      {showbtDropIn()}
    </div>
  );
};

export default Paymentb;
