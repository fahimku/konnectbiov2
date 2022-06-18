import React from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

class CancelSubsciption extends React.Component {
  state = {
    loading: false,
    cancel_modal: false,
  };
  cancel = async () => {
    this.setState({ loading: true });
    await axios
      .put(`/users/revise/subscription/${this.props.userId}`)
      .then((response) => {
        this.setState({ cancel_modal: false });
        this.setState({ loading: false });
        history.push("/logout");
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };
  cancelToggleModal = () => {
    const { cancel_modal } = this.state;
    this.setState({
      cancel_modal: !cancel_modal,
    });
  };
  cancelModal = () => {
    return (
      <Modal
        show={this.state.cancel_modal}
        onHide={this.cancelToggleModal}
        className="cancel-model"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Subsciption</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
          Are You Sure You Want To Cancel Subsciption.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.cancelToggleModal}>Close</Button>
          <Button
            className="disconnect-btn"
            onClick={this.cancel}
            disabled={!this.state.loading ? false : true}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  render() {
    return (
      <>
        <Button
          variant="primary"
          className="btn-block"
          onClick={this.cancelToggleModal}
        >
          Cancel Subscription
        </Button>
        {this.cancelModal()}
      </>
    );
  }
}
export default CancelSubsciption;
