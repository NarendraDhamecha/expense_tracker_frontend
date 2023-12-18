import axios from "axios";
import "./PremiumFeature.css";

const PremiumFeature = (props) => {
  const { isPremium, setPremium } = props;

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
        "http://localhost:4000/purchase/membership",
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
              status: "success",
            },
            { headers: { Authorization: token } }
          );

          setPremium(true);
          localStorage.setItem("isPremium", true);
          alert("You are a Premium User Now");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async (response) => {
        const { payment_id, order_id } = response.error.metadata;
        await axios.post(
          "http://localhost:4000/purchase/updatetransactionstatus",
          {
            payment_id,
            order_id,
            status: "failed",
          },
          { headers: { Authorization: token } }
        );
        alert(response.error.description);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const downloadExpenses = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:4000/expenses/download",
        {
          headers: { Authorization: token },
        }
      );

      let a = document.createElement("a");
      a.href = response.data.fileURL;
      a.download = "myexpense.csv";
      a.click();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="col">
      <div className="card">
        <div className="card-body">
          <div>
            <img
              className="fitimg"
              src="https://media.istockphoto.com/id/1261448272/vector/star-award-vector-icon-medal-best-flat-quality-reward-premium-symbol-isolated-illustation.jpg?s=612x612&w=0&k=20&c=elxe4PY8-JtbeXswZ1g5apLgWq1bwyFG317odEL6rL4="
              alt="..."
            />
          </div>

          {!isPremium && (
            <button
              className="btn btn-primary"
              onClick={activatePremiumHandler}
            >
              Activate Premium
            </button>
          )}
          {isPremium && <h5>You are a premium user</h5>}
          {isPremium && (
            <button
              className="btn btn-primary btn-sm"
              onClick={downloadExpenses}
            >
              Download expenses
            </button>
          )}
          {isPremium && (
            <button
              onClick={() => props.setshowleaderboard(true)}
              className="btn btn-primary btn-sm ms-1"
            >
              Show Leaderboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumFeature;
