import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import API from "../api";
import { getIconUrlForDocument } from "../utils/iconMapping";
import { Button } from "react-bootstrap";
import LegendModal from "./Legend";

const FullPageChart = () => {
  const svgRef = useRef();
  const [documentsToShow, setDocumentsToShow] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const margin = { top: 70, right: 80, bottom: 50, left: 100 };
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

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "#ffffff")
      /*.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);*/

    // Contenitore del grafico con margini
    const mainGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Creazione degli scale
    const xScale = d3.scaleLinear().domain([2004, 2025]).range([0, width]);
    const yScale = d3
      .scalePoint()
      .domain([" ", "Text", "Concept", "1:100000", "1:10000", "1:5000", "1:1000", "Blueprints/effects", ""])
      .range([0, height])
      .padding(0.2);

    const xAxis = d3.axisBottom(xScale).ticks(21).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    // Aggiunta degli assi
    mainGroup.append("g").call(yAxis);
    mainGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Griglie orizzontali
    mainGroup
      .append("g")
      .attr("class", "grid grid-horizontal")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Griglie verticali
    mainGroup
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
    .style("height", "auto")

     // **ZOOM: Definizione e gestione**
     const zoom = d3.zoom()
     .scaleExtent([1, 5]) // Minimo zoom = 1 (posizione iniziale), massimo zoom = 10
     .translateExtent([
       [-50, -50], // Limiti di pan: posizione iniziale in alto a sinistra
       [width+30, height+30], // Limiti di pan: posizione iniziale in basso a destra
     ])
     .on("zoom", (event) => {
       mainGroup.attr("transform", event.transform); // Applica la trasformazione dello zoom
       setZoomLevel(event.transform.k); // Aggiorna lo stato con il livello di zoom corrente
     });

    // Applica lo zoom all'intero SVG
    svg.call(zoom);

    // Calcolare le posizioni dei documenti
    const documentPositions = {};
    mainGroup
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
        d3.select(this).attr("opacity", 0.9); // Modifica l'opacità dell'icona
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0); // Nascondi il tooltip
        d3.select(this).attr("opacity", 1); // Ripristina l'opacità dell'icona
      })

    // Disegna le linee curve per i collegamenti tra i documenti
    const drawnLinks = new Set(); // Set per memorizzare le coppie di documenti già considerate

    const offset = 10; // Lunghezza da accorciare all'inizio e alla fine della linea

    documentsToShow.forEach((document) => {
      document.links.forEach((link, index) => {
        const targetDocument = documentsToShow.find((d) => d.id === link.documentId);
        if (targetDocument) {
          const linkType = link.linkType;

          // Genera un identificativo unico per la coppia di documenti e il tipo di link
          const linkId = [document.id, targetDocument.id].sort().join("-") + `-${linkType}`;

          // Disegna la linea solo se questa coppia di documenti con questo tipo non è già stata processata
          if (!drawnLinks.has(linkId)) {
            drawnLinks.add(linkId); // Segna questa coppia e tipo come processati

            const startX = documentPositions[document.id].x + 15; // Aggiungi un offset per centrarsi sull'icona
            const startY = documentPositions[document.id].y + 15;
            const endX = documentPositions[targetDocument.id].x + 15;
            const endY = documentPositions[targetDocument.id].y + 15;

            // Calcola la distanza tra i due punti
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            // Calcola i nuovi punti accorciati
            const newStartX = startX + (offset * deltaX) / distance;
            const newStartY = startY + (offset * deltaY) / distance;
            const newEndX = endX - (offset * deltaX) / distance;
            const newEndY = endY - (offset * deltaY) / distance;

            // Calcola la curvatura in base all'indice del link
            const curveOffset = 20 * (index - Math.floor(document.links.length / 1.2)); // Valore di curvatura
            const controlPointX = (newStartX + newEndX) / 2 + curveOffset;
            const controlPointY = (newStartY + newEndY) / 2 - Math.abs(curveOffset) / 2;

            // Crea una curva con il path, applicando il tipo di linea
            mainGroup
              .append("path")
              .attr(
                "d",
                `M ${newStartX},${newStartY} Q ${controlPointX},${controlPointY} ${newEndX},${newEndY}`
              )
              .attr("fill", "none")
              .attr("stroke", getLinkColor(linkType))
              .attr("stroke-width", 2)
              .attr("stroke-dasharray", getLinkDashArray(linkType)); // Usa il tipo di linea
          }
        }
      });
    });


    // Alza le icone dei documenti sopra le linee
    mainGroup.selectAll(".document-icon").raise();

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
    <div style={{ position: "relative" }}>
      <LegendModal diagram={true} show={showLegend} onHide={() => setShowLegend(false)} />
      <Button
        title={"legend"}
        className="position-absolute top-0 end-0 m-3"
        variant="secondary"
        onClick={() => {
          setShowLegend(!showLegend);
        }}
      >
        <i className="bi bi-question-circle"></i>
      </Button>
      <svg ref={svgRef}></svg>
    </div>
  );
}  

export default FullPageChart;
