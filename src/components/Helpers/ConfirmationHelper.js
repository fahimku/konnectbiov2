import Swal from "sweetalert2";
const Confirm = (operation, message = null) => {
  return Swal.fire({
    title: "Are you sure?",
    text: message === null ? "Do you really want to do this?" : message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.value) {
      //Swal.fire("Done!", "", "success");
      return operation;
    }
  });
};
export default Confirm;
