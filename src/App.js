import React, { useState } from "react";

import SiteComDataGrid from "./components/reactDataGrid";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tracesData, setTracesData] = useState([]);
  const [displayMsg, setDisplayMsg] = useState("");

  function getDateTime(msg) {
    const getCurrent = new Intl.DateTimeFormat("default", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format();
    console.log(`${msg} on ${getCurrent}`);

    return;
  }

  async function tracesFile(event) {
    getDateTime("Started");
    const allFiles = event.target.files;
    let filesContainer = "";

    if (allFiles.length > 0) {
      console.log("Total files added = " + allFiles.length);
      setIsLoading(true);

      console.log("Looping thru files content...");
      for await (const file of allFiles) {
        const reader = new FileReader();
        const activeFile = file.name;

        displayMsgFile(activeFile);

        console.log(`Reading file... "${activeFile}"`);

        reader.readAsText(file);

        const result = await new Promise((resolve) => {
          reader.onloadend = function (event) {
            filesContainer += reader.result;
            resolve();
          };
        });
      }

      xmlParser(`<root>${filesContainer}</root>`);
    }
  }

  function xmlParser(xmlText) {
    console.log("Parsing into XML");
    const xmlData = new DOMParser().parseFromString(xmlText, "text/xml");
    traceObjects(xmlData);
  }

  function traceObjects(traces) {
    console.log("Loading E2ETraceEvents...");
    const ifBlank = "(Blank)";
    const E2ETraceEvents = traces.getElementsByTagName("E2ETraceEvent");
    let tracesObj = [...tracesData];

    for (const trace of E2ETraceEvents) {
      const xmlString = new XMLSerializer().serializeToString(trace).trim();
      const dateTimeText = new Date(
        trace
          .getElementsByTagName("TimeCreated")[0]
          .getAttribute("SystemTime")
          .trim()
      );
      const systemTime = dateTimeText;

      const traceRecords = trace.getElementsByTagName("TraceRecord");
      const serverName = traceRecords[0]
        .getElementsByTagName("ServerName")[0]
        .textContent.toLowerCase()
        .trim();
      const userName = traceRecords[0]
        .getElementsByTagName("UserName")[0]
        .textContent.toLowerCase()
        .trim();
      const userIpAddress = traceRecords[0]
        .getElementsByTagName("UserIP")[0]
        .textContent.trim();
      const componentName = traceRecords[0]
        .getElementsByTagName("ComponentName")[0]
        .textContent.trim();
      const applicationName = traceRecords[0]
        .getElementsByTagName("ApplicationName")[0]
        .textContent.trim();
      const traceLevel = traceRecords[0]
        .getElementsByTagName("TraceLevel")[0]
        .textContent.trim();
      const message = trace
        .getElementsByTagName("Message")[0]
        .textContent.trim();
      const subMessage = traceRecords[0]
        .getElementsByTagName("SubMessage")[0]
        .textContent.trim();
      const stackTrace = trace
        .getElementsByTagName("StackTrace")[0]
        .textContent.trim();

      tracesObj.push({
        id: ++tracesData.length,
        SystemTime: systemTime,
        ServerName: serverName ? serverName : ifBlank,
        Username: userName ? userName.toLowerCase() : ifBlank,
        UserIP: userIpAddress ? userIpAddress : ifBlank,
        ComponentName: componentName ? componentName : ifBlank,
        ApplicationName: applicationName ? applicationName : ifBlank,
        TraceLevel: traceLevel ? traceLevel : ifBlank,
        Message: message ? message : ifBlank,
        SubMessage: subMessage ? subMessage : ifBlank,
        StackTrace: stackTrace ? stackTrace : ifBlank,
        FullTrace: xmlString,
      });
    }

    setTracesData(tracesObj);
    setIsLoading(false);

    console.log("Done!");
    getDateTime("Ended");
  }

  function displayMsgFile(filename) {
    setDisplayMsg(`Reading file ${filename}`);
    return;
  }

  return (
    <>
      <div>
        <h1>SiteCom Web Traces Viewer</h1>
        <input type="file" accept=".svclog" onChange={tracesFile} multiple />
        <hr />
      </div>
      <div>
        <SiteComDataGrid
          tracesData={tracesData}
          isLoading={isLoading}
          loadingMsg={displayMsg}
        />
      </div>
    </>
  );
}

export default App;
