import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import "./App.css";
import { useState } from "react";

function App() {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState(false);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Books",
            amount: {
              currency_code: "USD",
              value: 20,
            },
          },
        ],
        application_context: {
          shipping_preference: "No_Shipping",
        },
      })
      .then((orderId) => {
        setOrderId(orderId);
        return orderId;
      });
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      setSuccess(true);
    });
  };
  const onError = (data, actions) => {
    setErrorMessage("An error occured with your payment");
  };
  return (
    <div className="App1" style={{ marginLeft: "320px" }}>
      <PayPalScriptProvider
        options={{
          "client-id":
            "AbVDjHm9Uzg9uYWZgt8dLTFGGlU-sTSLut16zlzsHViqDdoTbc30t3yUeKWBkrLCmrDmT9WFe08UrRDW",
        }}
      >
        {/* code */}
        <div className="" style={{ marginLeft: "320px" }}>
          <h1>Simple Book</h1>
          <span>30$</span>
          <button onClick={() => setShow(true)} type="submit">
            Buy Now
          </button>
        </div>
        {show ? (
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          />
        ) : null}
        {success ? (
          <h1>Your Payment has been done successfully please check email </h1>
        ) : (
          <h1 className="" style={{ marginLeft: "260px" }}>
            payment is pending
          </h1>
        )}
      </PayPalScriptProvider>
    </div>
  );
}

export default App;
