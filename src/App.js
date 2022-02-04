import React, { useState } from "react";

import SiteComDataGrid from "./components/reactDataGrid";
import DisplayLoading from "./components/reactLoading";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tracesData, setTracesData] = useState([]);
  const [loadedData, setLoadedData] = useState(false);
  const [countProc, setCountProc] = useState(0);

  async function tracesFile(event) {
    const allFiles = event.target.files;
    let filesContainer = "";

    if (allFiles.length >= 4) {
      alert("Please upload up to 3 files at a time");
      return;
    } else {
      setIsLoading(true);

      for await (const file of allFiles) {
        const reader = new FileReader();
        reader.readAsText(file);
        const result = await new Promise((resolve, reject) => {
          reader.onloadend = function (event) {
            filesContainer += reader.result;
            resolve();
          };
        });
      }
      xmlParser(filesContainer);
      setIsLoading(false);
    }
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
    // let processedCount = 0;

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

      setCountProc((prevCountProc) => 1 + prevCountProc);
    });

    setIsLoading(false);
    setLoadedData(true);
  }

  return (
    <div>
      <h1>SiteCom Web Traces Viewer</h1>
      <input type="file" accept=".svclog" onChange={tracesFile} multiple />
      <div>
        {" "}
        <p>{/*{isLoading ? "Processing..." + countProc : null}*/}</p>{" "}
      </div>
      {isLoading ? (
        <DisplayLoading color={"gray"} type={"spin"} />
      ) : loadedData ? (
        <SiteComDataGrid tracesData={tracesData} />
      ) : null}
    </div>
  );
}

export default App;
