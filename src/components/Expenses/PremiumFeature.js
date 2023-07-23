import axios from "axios";
import "./PremiumFeature.css";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const PremiumFeature = () => {
  const initialState = JSON.parse(localStorage.getItem('isPremium'))
  const [isPremium, setPremium] = useState(initialState);
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const activatePremiumHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("connection error");
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/purchase/premiummembership",
        { headers: { Authorization: token } }
      );

      const options = {
        key: response.data.key_id, 
        order_id: response.data.order.id, 

        handler: async (response) => {
          await axios.post(
            "http://localhost:4000/purchase/updatetransactionstatus",
            {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              status: 'success'
            },
            { headers: { Authorization: token } }
          );

          setPremium(true);
          localStorage.setItem('isPremium', true)
          alert("You are a Premium User Now");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async (response) => {
        const {payment_id, order_id} = response.error.metadata;
        await axios.post(
          "http://localhost:4000/purchase/updatetransactionstatus",
          {
            payment_id,
            order_id,
            status: "failed"
          },
          { headers: { Authorization: token } }
        );
        alert(response.error.description);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="premium">
      {!isPremium && <button className="btn btn-primary" onClick={activatePremiumHandler}>
        Activate Premium
      </button>}
      {isPremium && <h5>You are a premium user</h5>}
      {isPremium && <NavLink to='/leaderboard'><button className="btn btn-success">Show Leaderboard</button></NavLink>}
    </div>
  );
};

export default PremiumFeature;
