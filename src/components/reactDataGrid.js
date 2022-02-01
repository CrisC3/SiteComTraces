import React, { useCallback } from "react";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import moment from "moment";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";

import "@inovua/reactdatagrid-community/index.css";

function SiteComDataGrid({ tracesData }) {
  const defaultSortInfo = { name: "TimeCreated", dir: -1 };
  const filterValue = [
    { name: "TimeCreated", type: "date", operator: "before", value: "" },
    { name: "ServerName", type: "string", operator: "contains", value: "" },
    { name: "Username", type: "string", operator: "contains", value: "" },
    { name: "UserIP", type: "string", operator: "contains", value: "" },
    { name: "ComponentName", type: "string", operator: "contains", value: "" },
    {
      name: "ApplicationName",
      type: "string",
      operator: "contains",
      value: "",
    },
    {
      name: "TraceLevel",
      type: "string",
      operator: "contains",
      value: "",
    },
    {
      name: "Message",
      type: "string",
      operator: "contains",
      value: "",
    },
    {
      name: "SubMessage",
      type: "string",
      operator: "contains",
      value: "",
    },
    {
      name: "StackTrace",
      type: "string",
      operator: "contains",
      value: "",
    },
  ];

  const columns = [
    {
      name: "id",
      header: "Id",
      defaultVisible: false,
      defaultFlex: 1,
      defaultWidth: 20,
      type: "number",
    },
    {
      name: "TimeCreated",
      header: "Time Created",
      defaultFlex: 1,
      minWidth: 149,
      defaultWidth: 149,
      filterEditor: DateFilter,
      filterEditorProps: (props, { index }) => {
        // for range and notinrange operators, the index is 1 for the after field
        return {
          dateFormat: "M/D/YYYY hh:mm:ss a",
          cancelButton: false,
          highlightWeekends: false,
          placeholder:
            index === 1
              ? "Created date is before..."
              : "Created date is after...",
        };
      },
      render: ({ value, cellProps }) => {
        return moment(value).format("M/D/YYYY HH:mm:ss");
      },
    },
    {
      name: "ServerName",
      header: "Server Name",
      minWidth: 121,
      width: 121,
      defaultFlex: 1,
    },
    {
      name: "Username",
      minWidth: 104,
      width: 104,
      defaultFlex: 1,
    },
    {
      name: "UserIP",
      header: "User IP",
      minWidth: 149,
      defaultWidth: 149,
      defaultFlex: 1,
    },
    {
      name: "ComponentName",
      header: "Component Name",
      defaultVisible: false,
      defaultFlex: 2,
    },
    {
      name: "ApplicationName",
      header: "Application Name",
      defaultFlex: 2,
    },
    {
      name: "TraceLevel",
      defaultVisible: false,
      header: "Trace Level",
      defaultFlex: 1,
    },
    {
      name: "Message",
      defaultFlex: 4,
    },
    {
      name: "SubMessage",
      defaultVisible: false,
      defaultFlex: 3,
    },
    {
      name: "StackTrace",
      defaultVisible: false,
      defaultFlex: 3,
    },
  ];

  const gridStyle = { minHeight: 400 };
  const styles = {
    border: "2px solid",
    padding: "10px",
    backgroundColor: "#bcd4e6",
    height: "100%",
    width: "95%",
    overflowWrap: "break-word",
  };
  // console.log("***************************************");

  const onRenderRow = useCallback((rowProps) => {
    // save the original handlers to be called later
    // const { onClick, onDoubleClick } = rowProps;

    // rowProps.onDoubleClick = (event) => {
    // console.log(event);
    // };
    rowProps.onClick = (event) => {
      const textDisplay = event.target.parentElement.parentElement.innerText;
      console.log(event);
      const displayMsg = document.getElementById("Display");
      displayMsg.innerText = textDisplay;
      // console.log(displayMsg.textContent);
    };
  }, []);

  // console.log("***************************************");
  return (
    <div>
      <ReactDataGrid
        idProperty="id"
        pagination
        columns={columns}
        defaultSortInfo={defaultSortInfo}
        defaultFilterValue={filterValue}
        dataSource={tracesData}
        style={gridStyle}
        onRenderRow={onRenderRow}
      />
      <div style={styles}>
        <p id="Display" />
      </div>
    </div>
  );
}

export default SiteComDataGrid;
