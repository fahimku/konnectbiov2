import React, { useEffect } from "react";
import Loader from "../../../components/Loader/Loader";
import axios from "axios";
import queryString from "query-string";
import { toast } from "react-toastify";
import { receiveToken } from "../../../actions/auth";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

function SessionLogin() {
  useEffect(() => {
    const query = queryString.parse(window.location.search);
    if (query.sid) {
      getSidUrl(query.sid);
    }
  }, []);
  const getSidUrl = async (sid) => {
    await axios
      .post(`/signin/session`, { sid: sid })
      .then((res) => {
        const token = res.data.message.token;
        const userInfo = {
          menu: res.data.message.menu,
          user_id: res.data.message.user_id,
          name: res.data.message.name,
          access_token: res.data.message.access_token,
          username: res.data.message.username,
          email: res.data.message.email,
          user_type: res.data.message.user_type,
          country: res.data.message.country,
          city: res.data.message.city,
          package: res.data.message.package,
          zip: res.data.message.zip,
          page_token: res.data.message.page_token,
          fb_token: res.data.message.fb_token,
          instagram_id: res.data.message.instagram_id,
          next_payment_date: res.data.message.next_payment_date,
          recurring_payment_type: res.data.message.recurring_payment_type,
          is_trial_expired: res.data?.message?.is_trial_expired,
          account_type: res.data?.message?.account_type,
          pid: res.data?.message?.pid,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        this.props.dispatch(receiveToken(token));
        history.push("/app/linkinbio");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setTimeout(() => {
          history.push("/login");
        }, 1500);
      });
  };

  return (
    <div className="session_login">
      <Loader size={50} />
    </div>
  );
}
export default SessionLogin;
