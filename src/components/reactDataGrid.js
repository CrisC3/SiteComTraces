import React, { useCallback, useState } from "react";
import XMLViewer from "react-xml-viewer";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import moment from "moment";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
// import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter";
// import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";

import "@inovua/reactdatagrid-community/index.css";
window.moment = moment;

function SiteComDataGrid({ tracesData }) {
  const [xmlTrace, setXmlTrace] = useState("");
  const [rowClicked, setRowClicked] = useState(false);

  const defaultSortInfo = { name: "SystemTime", dir: -1 };
  const filterValue = [
    { name: "SystemTime", type: "date", operator: "before", value: "" },
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
    {
      name: "FullTrace",
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
      name: "SystemTime",
      header: "System Time",
      defaultFlex: 1,
      minWidth: 135,
      defaultWidth: 150,
      dateFormat: "YYYY-MM-DD HH:mm:ss",
      filterEditor: DateFilter,
      filterEditorProps: (props, { index }) => {
        // for range and notinrange operators, the index is 1 for the after field
        return {
          dateFormat: "YYYY-MM-DD HH:mm:ss",
          cancelButton: false,
          highlightWeekends: false,
          placeholder:
            index === 1
              ? "Created date is before..."
              : "Created date is after...",
        };
      },
      render: ({ value, cellProps: { dateFormat } }) =>
        moment(value).format(dateFormat),
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
    {
      name: "FullTrace",
      header: "Full Trace",
      defaultFlex: 3,
    },
  ];

  const setHeight = "380px";
  const gridStyle = { height: setHeight };
  const styles = {
    border: "2px solid",
    padding: "10px",
    backgroundColor: "#FCF3CF",
    height: setHeight,
    width: "98%",
    overflowWrap: "break-word",
    overflowY: "scroll",
    marginTop: "2px",
  };

  const onRenderRow = useCallback((rowProps) => {
    const textDisplay = rowProps.data.FullTrace;
    if (rowProps.active) {
      setXmlTrace(textDisplay);
      setRowClicked(true);
    }
  }, []);

  const customTheme = {
    tagColor: "#3231c0",
    attributeKeyColor: "#d0384a",
    attributeValueColor: "#6d12d2",
    overflowBreak: true,
  };

  return (
    <div>
      <ReactDataGrid
        idProperty="id"
        // pagination
        // defaultLimit={100}
        columns={columns}
        defaultSortInfo={defaultSortInfo}
        defaultFilterValue={filterValue}
        dataSource={tracesData}
        style={gridStyle}
        onRenderRow={onRenderRow}
      />
      {rowClicked && (
        <XMLViewer xml={xmlTrace} theme={customTheme} style={styles} />
      )}
    </div>
  );
}

export default SiteComDataGrid;
