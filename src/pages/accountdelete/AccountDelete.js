import React from "react";
import axios from "axios";
import { Container, Button } from "reactstrap";
// import { Link } from "react-router-dom";
import s from "./ErrorPage.module.scss";
import { toast } from "react-toastify";
import { createBrowserHistory } from "history";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

export const history = createBrowserHistory({
  forceRefresh: true,
});

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

class AccountDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user_id: "",
    };
  }

  componentDidMount() {
    this.setState({ user_id: userInfo.user_id });
  }

  deleteAccount = async (campaignId) => {
    this.setState({ loading: true });
    Swal.fire({
      title: `Are you sure you want delete your account?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`/users/revise/accountdelete/${this.state.user_id}`)
          .then(() => {
            this.setState({ loading: false });
            toast.error("Your account is deleted successfully");
            history.push("/logout");
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: false });
      }
    });
  };

  // deleteAccount = async () => {
  //   this.setState({ loading: true });
  //   await axios
  //     .put(`/users/revise/accountdelete/${this.state.user_id}`)
  //     .then(() => {
  //       this.setState({ modal: false });
  //       this.setState({ loading: false });
  //       history.push("/logout");
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message);
  //       this.setState({ loading: false });
  //     });
  // };

  render() {
    return (
      <div className={s.errorPage}>
        <Container>
          <div className={`${s.errorContainer} mx-auto`}>
            <p className={s.errorInfo}>
              Are You Sure You Want Delete Your Account?
            </p>
            <p className={[s.errorHelp, "mb-3"].join(" ")}>
              This Action Is Not Reversible And It Will Remove All Your Data
              From Our Servers.
            </p>
            <p className={[s.errorHelp, "mb-3"].join(" ")}>
              <i>For Support Please Contact support@konnect.bio .</i>
            </p>

            {this.state.loading ? (
              <Button className={s.errorBtn} type="submit" color="warning">
                <Loader />
              </Button>
            ) : (
              <Button
                className={s.errorBtn}
                onClick={() => {
                  this.deleteAccount();
                }}
                type="submit"
                color="warning"
              >
                Yes Delete My Account{" "}
              </Button>
            )}
          </div>
        </Container>
      </div>
    );
  }
}
export default AccountDelete;
