import { useState, useEffect } from "react";
import ReceiptsList from "./components/ReceiptList.jsx";
import "./index.css";
import { useSearchParams } from "react-router-dom";

function App() {
  const [receiptsXml, setReceiptsXml] = useState([]); // Danh sách các XML <ePOSPrint>

  const [searchParams] = useSearchParams();
  const printerId = searchParams.get("printerId");
  let globalDeviceId = "local_printer_2";
  let globalPrintJobId = null;

  const simulatePrintRequest = async () => {
    const requestBody = new URLSearchParams();
    requestBody.append("ConnectionType", "GetRequest");
    requestBody.append("ID", printerId);

    try {
      console.log("Gửi yêu cầu GetRequest đến server...");
      const response = await fetch("/epson/direct-print", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody.toString(),
      });

      if (response.ok) {
        console.log("hi");
        const responseXml = await response.text();
        console.log("Server trả về (XML):", responseXml);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseXml, "text/xml");
        if (xmlDoc.documentElement.nodeName === "parsererror") {
          console.error("Error parsing XML");
          return;
        }

        // Trích xuất thông tin deviceId và printJobId
        const parameter = xmlDoc.querySelector("ePOSPrint > Parameter");
        if (parameter) {
          globalDeviceId =
            parameter.querySelector("devid")?.textContent || globalDeviceId;
          globalPrintJobId =
            parameter.querySelector("printjobid")?.textContent ||
            globalPrintJobId;
          console.log(
            `✔️ Lấy được: deviceId=${globalDeviceId}, printJobId=${globalPrintJobId}`,
          );
        }

        // Trích xuất các <ePOSPrint>
        const eposPrints = xmlDoc.getElementsByTagName("ePOSPrint");
        const serializer = new XMLSerializer();
        const newReceipts = Array.from(eposPrints).map((eposPrint) => ({
          xml: serializer.serializeToString(eposPrint),
          printJobId: eposPrint.querySelector("printjobid")?.textContent || "",
        }));

        // Cập nhật state, tránh trùng lặp dựa trên printJobId
        setReceiptsXml((prev) => {
          const existingIds = new Set(
            prev.map((receipt) => receipt.printJobId),
          );
          const filteredNewReceipts = newReceipts.filter(
            (receipt) => !existingIds.has(receipt.printJobId),
          );
          return [...prev, ...filteredNewReceipts];
        });
      } else {
        console.error("Lỗi GetRequest:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi gửi GetRequest:", error.message);
    }
  };

  // Gọi API mỗi 5 giây
  useEffect(() => {
    const fetchData = async () => {
      await simulatePrintRequest();
    };

    fetchData(); // Gọi lần đầu ngay khi mount
    const interval = setInterval(fetchData, 8000); // Gọi lại mỗi 5 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <h1>
        Receipts (Live Updates -{" "}
        {new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
      </h1>
      <ReceiptsList receiptsXml={receiptsXml.map((receipt) => receipt.xml)} />
    </div>
  );
}

export default App;
