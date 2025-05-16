import { useEffect, useRef } from "react";

const Receipt = ({ xmlString }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!xmlString || !containerRef.current) return;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    if (xmlDoc.documentElement.nodeName === "parsererror") {
      console.error("Error parsing XML");
      return;
    }

    const eposPrint = xmlDoc.querySelector("epos-print");
    if (!eposPrint) return;

    const styleConfig = {
      fonts: { font_a: { fontSize: "16px" }, font_c: { fontSize: "12px" } },
      colors: { color_1: "#000000" },
      scale: { width: { 2: 1.5 }, height: { 2: 1.5 }, lineHeight: 1.1 },
    };

    const elements = eposPrint.children;
    let currentStyles = {};

    for (const el of elements) {
      if (el.tagName === "text") {
        const span = document.createElement("span");
        if (el.textContent.trim()) {
          span.textContent = el.textContent;
        } else {
          span.style.display = "block";
        }

        if (el.getAttribute("align"))
          currentStyles.textAlign = el.getAttribute("align");
        if (el.getAttribute("font"))
          currentStyles.fontSize =
            styleConfig.fonts[el.getAttribute("font")]?.fontSize || "14px";
        if (el.getAttribute("width")) {
          const scale = styleConfig.scale.width[el.getAttribute("width")] || 1;
          currentStyles.fontSize = `${parseFloat(currentStyles.fontSize || 14) * scale}px`;
        }
        if (el.getAttribute("em") === "true") currentStyles.fontWeight = "bold";
        else if (el.getAttribute("em") === "false")
          currentStyles.fontWeight = "normal";
        if (el.getAttribute("ul") === "true")
          currentStyles.textDecoration = "underline";
        else if (el.getAttribute("ul") === "false")
          currentStyles.textDecoration = "none";
        if (el.getAttribute("color"))
          currentStyles.color =
            styleConfig.colors[el.getAttribute("color")] || "#000000";
        if (el.getAttribute("linespc"))
          currentStyles.lineHeight = `${el.getAttribute("linespc") / 1.5}px`;

        Object.assign(span.style, currentStyles);
        containerRef.current.appendChild(span);
      } else if (el.tagName === "feed") {
        const feed = document.createElement("div");
        feed.setAttribute("role", "feed");
        feed.style.marginBottom = el.getAttribute("line")
          ? `${parseInt(el.getAttribute("line")) * 5}px`
          : "5px";
        containerRef.current.appendChild(feed);
      } else if (el.tagName === "cut") {
        const hr = document.createElement("hr");
        containerRef.current.appendChild(hr);
      }
    }
  }, []);

  return <div className="receipt-container" ref={containerRef}></div>;
};

export default Receipt;
