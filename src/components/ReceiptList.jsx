import Receipt from "./Receipt";

const ReceiptsList = ({ receiptsXml }) => {
  return (
    <div className="receipts-container">
      {receiptsXml.map((xmlString, index) => (
        <div key={index}>
          <Receipt xmlString={xmlString} />
          {index < receiptsXml.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default ReceiptsList;
