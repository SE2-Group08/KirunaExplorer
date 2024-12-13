import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import API from "../api";
import { getIconUrlForDocument } from "../utils/iconMapping";

const FullPageChart = () => {
  const svgRef = useRef();
  const [documentsToShow, setDocumentsToShow] = useState([]);

  useEffect(() => {
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight * 0.85 - margin.top - margin.bottom;

    const nonNumericDomain = [" ", "Text", "Concept"];
    const numericDomain = ["1:100000", "1:10000", "1:5000", "1:1000"];
    const blueprints = ["Blueprints/effects", ""];

    const fixedYDomain = [...nonNumericDomain, ...numericDomain, ...blueprints];

    // Funzione per determinare il colore della linea in base al tipo di collegamento
    const getLinkColor = (linkType) => {
      return "black";
    };

    const getLinkDashArray = (linkType) => {
      switch (linkType) {
        case "DIRECT_CONSEQUENCE":
          return "none"; // Linea continua
        case "COLLATERAL_CONSEQUENCE":
          return "5,5"; // Linea tratteggiata
        case "PREVISION":
          return "1,5"; // Linea puntinata
        case "UPDATE": // Un altro tipo di link se necessario
          return "10,5,1,5"; // Linea tratto-punto
        default:
          return "none"; // Linea continua di default
      }
    };

    const normalizeScale = (scale) => {
      if (scale === "Blueprint/Material effects") {
        return "Blueprints/effects";
      }
      return scale;
    };

    const parseNumericScale = (scale) => {
      const match = scale.match(/^1:(\d+)$/);
      return match ? parseInt(match[1]) : null;
    };

    const yScale = d3.scalePoint().domain(fixedYDomain).range([0, height]).padding(0.2);
    const xScale = d3.scaleLinear().domain([2004, 2024]).range([0, width]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "#ffffff")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(xScale).ticks(21).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").call(yAxis);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Griglie orizzontali
    svg
      .append("g")
      .attr("class", "grid grid-horizontal")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Griglie verticali
    svg
      .append("g")
      .attr("class", "grid grid-vertical")
      .call(d3.axisBottom(xScale).ticks(21).tickSize(height).tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Tooltip container
    const tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("padding", "8px")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "white")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("font-size", "12px")
    .style("height", "60px")

    // Calcolare le posizioni dei documenti
    const documentPositions = {};
    svg
      .selectAll(".document-icon")
      .data(documentsToShow)
      .enter()
      .append("image")
      .attr("class", "document-icon")
      .attr("x", (d) => {
        const year = parseInt(d.issuanceDate);
        const xStart = xScale(year);
        const xEnd = xScale(year + 1);
        const xPos = xStart + Math.random() * (xEnd - xStart) - 15;
        documentPositions[d.id] = { x: xPos }; // Salva la posizione X
        return xPos;
      })
      .attr("y", (d) => {
        const normalizedScale = normalizeScale(d.scale);
        const numericScale = parseNumericScale(normalizedScale);

        let yPos = yScale("Text") - 15; // Valore di default

        if (numericScale) {
          // Caso specifico per scale <= 1:1000
          if (numericScale <= 1000 && numericScale >= 1) {
            const yBlueprints = yScale("Blueprints/effects");
            const y1000 = yScale("1:1000");
            yPos = yBlueprints + Math.random() * (y1000 - yBlueprints) - 15;
          } else {
            // Calcola la posizione Y in base agli altri intervalli
            for (let i = 0; i < numericDomain.length - 1; i++) {
              const currentScale = parseNumericScale(numericDomain[i]);
              const nextScale = parseNumericScale(numericDomain[i + 1]);
              if (
                currentScale !== null &&
                nextScale !== null &&
                numericScale > nextScale &&
                numericScale <= currentScale
              ) {
                yPos =
                  yScale(numericDomain[i + 1]) +
                  Math.random() * (yScale(numericDomain[i]) - yScale(numericDomain[i + 1])) -
                  15;
                break;
              }
            }
          }
        } else if (normalizedScale === "Blueprints/effects") {
          // Caso specifico per scale "Blueprints/effects"
          const yMin = yScale(""); // Assumendo "" sia il valore minimo Y
          const yBlueprints = yScale("Blueprints/effects");
          yPos = yMin + Math.random() * (yBlueprints - yMin) - 15;
        } else {
          // Fallback
          yPos = yScale(normalizeScale(d.scale)) - 15;
        }

        documentPositions[d.id].y = yPos; // Salva la posizione Y
        return yPos;
      })
      .attr("width", 30)
      .attr("height", 30)
      .attr("xlink:href", (d) => getIconUrlForDocument(d.type, d.stakeholders))
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.title}</strong><p>Scale: ${d.scale}</p>`) // Mostra il titolo del documento
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
        d3.select(this).attr("opacity", 0.7); // Modifica l'opacità dell'icona
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0); // Nascondi il tooltip
        d3.select(this).attr("opacity", 1); // Ripristina l'opacità dell'icona
      });



    // Disegna le linee curve per i collegamenti tra i documenti
    const drawnLinks = new Set(); // Set per memorizzare le coppie di documenti già considerate
    
    documentsToShow.forEach((document) => {
      document.links.forEach((link, index) => {
        const targetDocument = documentsToShow.find((d) => d.id === link.documentId);
        if (targetDocument) {
          const linkType = link.linkType;
    
          // Genera un identificativo unico per la coppia di documenti e il tipo di link (es: "1-2-linkType")
          const linkId = [document.id, targetDocument.id].sort().join("-") + `-${linkType}`;
          
          // Disegna la linea solo se questa coppia di documenti con questo tipo non è già stata processata
          if (!drawnLinks.has(linkId)) {
            drawnLinks.add(linkId); // Segna questa coppia e tipo come processati
    
            const startX = documentPositions[document.id].x + 15; // Aggiungi un offset per centrarsi sull'icona
            const startY = documentPositions[document.id].y + 15;
            const endX = documentPositions[targetDocument.id].x + 15;
            const endY = documentPositions[targetDocument.id].y + 15;
    
            // Calcola la curvatura in base all'indice del link
            const curveOffset = 40 * (index - Math.floor(document.links.length / 1.3)); // Valore di curvatura
            const controlPointX = (startX + endX) / 2 + curveOffset;
            const controlPointY = (startY + endY) / 2 - Math.abs(curveOffset) / 2; // Controlla la posizione dell'arco
    
            // Crea una curva con il path, applicando il tipo di linea
            svg
              .append("path")
              .attr(
                "d",
                `M ${startX},${startY} Q ${controlPointX},${controlPointY} ${endX},${endY}`
              )
              .attr("fill", "none")
              .attr("stroke", getLinkColor(linkType))
              .attr("stroke-width", 2)
              .attr("stroke-dasharray", getLinkDashArray(linkType)); // Usa il tipo di linea
          }
        }
      });
    });
    



    // Cleanup
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [documentsToShow]);

  useEffect(() => {
    API.getAllDocumentSnippetsWithLinks()
      .then((data) => setDocumentsToShow(data))
      .catch((err) => console.error("Error fetching documents:", err));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default FullPageChart;
