import React, { useState } from "react";

import SiteComDataGrid from "./components/reactDataGrid";
import DisplayLoading from "./components/reactLoading";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tracesData, setTracesData] = useState([]);
  const [loadedData, setLoadedData] = useState(false);

  async function tracesFile(event) {
    const allFiles = event.target.files;
    let filesContainer = "";

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

  function xmlParser(xmlText) {
    const xmlData = new DOMParser().parseFromString(
      "<root>" + xmlText + "</root>",
      "text/xml"
    );

    setIsLoading(false);
    traceObjects(xmlData);
  }

  async function traceObjects(traces) {
    const E2ETraceEvents = await traces.getElementsByTagName("E2ETraceEvent");

    for await (const trace of E2ETraceEvents) {
      const ifBlank = "(Blank)";
      const xmlString = new XMLSerializer().serializeToString(trace);
      const systemTime = trace
        .getElementsByTagName("TimeCreated")[0]
        .getAttribute("SystemTime");
      const serverName =
        trace.getElementsByTagName("ServerName")[0].textContent;
      const userName = trace.getElementsByTagName("UserName")[0].textContent;
      const userIpAddress = trace.getElementsByTagName("UserIP")[0].textContent;
      const componentName =
        trace.getElementsByTagName("ComponentName")[0].textContent;
      const applicationName =
        trace.getElementsByTagName("ApplicationName")[0].textContent;
      const traceLevel =
        trace.getElementsByTagName("TraceLevel")[0].textContent;
      const message = trace.getElementsByTagName("Message")[0].textContent;
      const subMessage =
        trace.getElementsByTagName("SubMessage")[0].textContent;
      const stackTrace =
        trace.getElementsByTagName("StackTrace")[0].textContent;

      setTracesData((prevData) => [
        ...prevData,
        {
          id: ++tracesData.length,
          SystemTime: systemTime,
          ServerName: serverName ? serverName : ifBlank,
          Username: userName ? userName : ifBlank,
          UserIP: userIpAddress ? userIpAddress : ifBlank,
          ComponentName: componentName ? componentName : ifBlank,
          ApplicationName: applicationName ? applicationName : ifBlank,
          TraceLevel: traceLevel ? traceLevel : ifBlank,
          Message: message ? message : ifBlank,
          SubMessage: subMessage ? subMessage : ifBlank,
          StackTrace: stackTrace ? stackTrace : ifBlank,
          FullTrace: xmlString,
        },
      ]);
    }
    setIsLoading(false);
    setLoadedData(true);
  }

  return (
    <>
      <div>
        <h1>SiteCom Web Traces Viewer</h1>
        <input type="file" accept=".svclog" onChange={tracesFile} multiple />
        <hr />
      </div>
      {isLoading ? (
        <>
          <p>{isLoading && "Processing..."}</p>
          <DisplayLoading color={"gray"} type={"spin"} />
        </>
      ) : loadedData ? (
        <SiteComDataGrid tracesData={tracesData} />
      ) : null}
    </>
  );
}

export default App;
