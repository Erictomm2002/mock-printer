import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PrinterIdInput = () => {
  const [printerId, setPrinterId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (printerId.trim()) {
      navigate(`/app?printerId=${printerId}`); // Redirect và truyền printerId
    } else {
      alert("Vui lòng nhập Printer ID");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Nhập Printer ID</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={printerId}
          onChange={(e) => setPrinterId(e.target.value)}
          placeholder="Nhập Printer ID (ví dụ: cyzmfdm4T8)"
          style={{ padding: "10px", margin: "10px", width: "300px" }}
        />
        <br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Tiếp tục
        </button>
      </form>
    </div>
  );
};

export default PrinterIdInput;
