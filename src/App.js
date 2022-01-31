import React, { useState } from "react";

import SiteComDataGrid from "./components/reactDataGrid";
import DisplayLoading from "./components/reactLoading";

function App() {
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tracesData, setTracesData] = useState([]);
  const [loadedData, setLoadedData] = useState(false);

  function tracesFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    setIsLoading(true);

    reader.readAsText(file);

    reader.onloadend = (event) => {
      const content = event.target.result;
      xmlParser(content);
    };
  }

  function xmlParser(xmlText) {
    const XMLParser = require("react-xml-parser");
    const xmlData = "<root>" + xmlText + "</root>";
    const xml = new XMLParser().parseFromString(xmlData); // Assume xmlText contains the example XML
    const traceEvents = xml.getElementsByTagName("E2ETraceEvent");
    setIsLoading(false);
    traceObjects(traceEvents);
  }

  async function traceObjects(traces) {
    let processedCount = 0;

    await traces.forEach((trace) => {
      const timeCreated =
        trace.getElementsByTagName("TimeCreated")[0].attributes.SystemTime;
      const serverName = trace.getElementsByTagName("ServerName")[0].value;
      const userName = trace.getElementsByTagName("UserName")[0].value;
      const userIpAddress = trace.getElementsByTagName("UserIP")[0].value;
      const componentName =
        trace.getElementsByTagName("ComponentName")[0].value;
      const applicationName =
        trace.getElementsByTagName("ApplicationName")[0].value;
      const traceLevel = trace.getElementsByTagName("TraceLevel")[0].value;
      const message = trace.getElementsByTagName("Message")[0].value;
      const subMessage = trace.getElementsByTagName("SubMessage")[0].value;
      const stackTrace = trace.getElementsByTagName("StackTrace")[0].value;

      setTracesData((prevData) => [
        ...prevData,
        {
          id: ++tracesData.length,
          TimeCreated: timeCreated,
          ServerName: serverName,
          Username: userName,
          UserIP: userIpAddress,
          ComponentName: componentName,
          ApplicationName: applicationName,
          TraceLevel: traceLevel,
          Message: message,
          SubMessage: subMessage,
          StackTrace: stackTrace,
        },
      ]);
    });

    setIsLoading(false);
    setLoadedData(true);
  }

  return (
    <div>
      <h1>SiteCom Web Traces Viewer</h1>
      <input type="file" accept=".svclog" onChange={tracesFile} />
      <p>
        <b>Trace File Name:</b> {fileName.name}
      </p>
      {isLoading ? (
        <DisplayLoading color={"gray"} type={"spin"} />
      ) : loadedData ? (
        <SiteComDataGrid tracesData={tracesData} />
      ) : null}
    </div>
  );
}

export default App;
