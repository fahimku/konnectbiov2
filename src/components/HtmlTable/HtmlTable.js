import { Table } from "antd";
import React, { useEffect, useState } from "react";
// import moment from "moment";

const HtmlTable = (props) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getColumns();
  }, [props]);

  // function showPopup() {}

  function getColumns() {
    if (props.columns != null) {
      let columns = [];
      props.columns.forEach((column, index) => {
        columns.push({
          title: () =>
            column.upper ? column.title.toUpperCase() : column.title,
          dataIndex: column.dataIndex,
          width: 5,
          // align:
          //   column.convert != null && column.convert == true ? "right" : null,
          // sorter: (a, b) => {
          //   let fielda = a[column.dataIndex];
          //   let fieldb = b[column.dataIndex];
          //   if (!Object.values(a).includes("Total")) {
          //     //Exclude Last Row
          //     let isValidNumber = /^[0-9,.]*$/.test(fielda);
          //     //Date Sorter
          //     if (moment(fielda, "MM/DD/YYYY", true).isValid()) {
          //       return new Date(fielda) - new Date(fieldb);
          //     }
          //     //String Sorter
          //     else if (typeof fielda === "string") {
          //       if (
          //         fielda.includes("$") ||
          //         isValidNumber ||
          //         fielda.includes("%")
          //       ) {
          //         fielda = fielda ? fielda.replaceAll("$", "") : "";
          //         fieldb = fieldb ? fieldb.replaceAll("$", "") : "";
          //         fielda = fielda ? fielda.replaceAll(",", "") : "";
          //         fieldb = fieldb ? fieldb.replaceAll(",", "") : "";
          //         fielda = fielda ? fielda.replaceAll("%", "") : "";
          //         fieldb = fieldb ? fieldb.replaceAll("%", "") : "";
          //         return fielda - fieldb;
          //       }
          //       return fielda.localeCompare([fieldb]);
          //     }
          //     return fielda - fieldb;
          //   }
          // },
          // sortDirections: ["descend", "ascend"],
          render: (text, record, i) => {
            if (index === 0) {
              let media = "";
              if (record.media_type === "IMAGE") {
                media = <img src={record.media_url} alt="mediaimage" />;
              } else {
              }
              return media;
            }
            return text;
          },
        });
      });
      setColumns(columns);
    }
  }

  return (
    <>
      <Table columns={columns} dataSource={props.rows} />
    </>
  );
};
export default HtmlTable;
