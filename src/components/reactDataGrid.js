import React, { useCallback, useState } from "react";
import XMLViewer from "react-xml-viewer";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import moment from "moment";
import DateFilter from "@inovua/reactdatagrid-community/DateFilter";
import SelectFilter from "@inovua/reactdatagrid-community/SelectFilter";

import "@inovua/reactdatagrid-community/index.css";

// Require for MomentJS support due React Grid dependencies
window.moment = moment;

function SiteComDataGrid({ tracesData, isLoading, loadingMsg }) {
  const [xmlTrace, setXmlTrace] = useState("");
  const [rowClicked, setRowClicked] = useState(false);
  // const [gridRef, setGridRef] = useState(null);

  function SortArray(x, y) {
    return x.id.localeCompare(y.id);
  }

  const serversSelect = tracesData.reduce((servers, currentServer) => {
    if (
      servers.filter((element) => element.id === currentServer.ServerName)
        .length
    ) {
      return servers;
    }
    servers.push({
      id: currentServer.ServerName,
      label: currentServer.ServerName,
    });

    const output = servers.sort(SortArray);

    return output;
  }, []);

  const usersSelect = tracesData.reduce((users, currentUser) => {
    if (users.filter((element) => element.id === currentUser.Username).length) {
      return users;
    }

    users.push({
      id: currentUser.Username,
      label: currentUser.Username,
    });

    const output = users.sort(SortArray);
    return output;
  }, []);

  const defaultSortInfo = { name: "SystemTime", dir: -1 };
  const filterValue = [
    { name: "SystemTime", operator: "before", type: "date", value: "" },
    { name: "ServerName", operator: "inlist", type: "select", value: "" },
    { name: "Username", operator: "inlist", type: "select", value: "" },
    { name: "UserIP", operator: "contains", type: "string", value: "" },
    { name: "ComponentName", operator: "contains", type: "string", value: "" },
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
    // {
    //   name: "id",
    //   header: "Id",
    //   defaultVisible: false,
    //   defaultFlex: 1,
    //   defaultWidth: 20,
    //   type: "number",
    // },
    {
      name: "SystemTime",
      header: "System Time",
      defaultFlex: 1,
      minWidth: 135,
      defaultWidth: 150,
      type: "number",
      dateFormat: "YYYY-MM-DD HH:mm:ss",
      filterEditor: DateFilter,
      filterEditorProps: (props, { index }) => {
        return {
          dateFormat: "YYYY-MM-DD HH:mm:ss",
          cancelButton: true,
          highlightWeekends: false,
          placeholder: index === 1 ? "End" : "Start",
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
      filterEditor: SelectFilter,
      filterEditorProps: {
        placeholder: "All",
        dataSource: serversSelect,
      },
      render: ({ value }) => value,
    },
    {
      name: "Username",
      minWidth: 104,
      width: 104,
      defaultFlex: 1,
      filterEditor: SelectFilter,
      filterEditorProps: {
        placeholder: "All",
        dataSource: usersSelect,
      },
      render: ({ value }) => value,
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

  const setHeight = "342px";
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

  const renderLoadMask = ({ visible, livePagination, loadingText, zIndex }) => {
    return (
      <div
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex,
          background: "rgb(26, 26, 26)",
          color: "white",
          opacity: 0.8,
          display: "flex",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loadingMsg}
      </div>
    );
  };

  const customTheme = {
    tagColor: "#3231c0",
    attributeKeyColor: "#d0384a",
    attributeValueColor: "#6d12d2",
    overflowBreak: true,
  };

  return (
    <div>
      <ReactDataGrid
        // idProperty="id"
        // handle={setGridRef}
        pagination
        defaultLimit={1000000}
        columns={columns}
        defaultSortInfo={defaultSortInfo}
        defaultFilterValue={filterValue}
        dataSource={tracesData}
        style={gridStyle}
        loading={isLoading}
        onRenderRow={onRenderRow}
        renderLoadMask={isLoading ? renderLoadMask : null}
      />
      {rowClicked && (
        <XMLViewer xml={xmlTrace} theme={customTheme} style={styles} />
      )}
    </div>
  );
}

export default SiteComDataGrid;
