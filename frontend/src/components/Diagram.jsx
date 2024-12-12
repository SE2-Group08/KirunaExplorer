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

    // Dividi il dominio Y in sezioni
    const nonNumericDomain = [" ", "Text", "Concept"];
    const numericDomain = ["1:100000", "1:10000", "1:5000", "1:1000"];
    const blueprints = ["Blueprints/effects", ""];

    const fixedYDomain = [...nonNumericDomain, ...numericDomain, ...blueprints];

    // Funzione per normalizzare le scale
    const normalizeScale = (scale) => {
      if (scale === "Blueprint/Material effects") {
        return "Blueprints/effects";
      }
      return scale;
    };

    // Funzione per ottenere il valore numerico da una scala
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

    const xAxis = d3.axisBottom(xScale)
      .ticks(21)
      .tickFormat(d3.format("d"));
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
      .call(d3.axisBottom(xScale)
        .ticks(21)
        .tickSize(height)
        .tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Disegno dei documenti
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
        return xStart + Math.random() * (xEnd - xStart) - 15; // Posizionamento casuale nella colonna
      })
      .attr("y", (d) => {
        const normalizedScale = normalizeScale(d.scale);
        const numericScale = parseNumericScale(normalizedScale);
        
        if (numericScale) {
          let yStart = null, yEnd = null;
      
          // Caso speciale per la scala tra 1:1 e 1:1000
          if (numericScale <= parseNumericScale("1:1000") && numericScale >= parseNumericScale("1:1")) {
            yStart = yScale("Blueprints/effects");
            yEnd = yScale("1:1000");
          } else {
            // Logica per le altre scale numeriche
            for (let i = 0; i < numericDomain.length - 1; i++) {
              const currentScale = parseNumericScale(numericDomain[i]);
              const nextScale = parseNumericScale(numericDomain[i + 1]);
              
              if (
                currentScale !== null &&
                nextScale !== null &&
                numericScale > nextScale &&
                numericScale <= currentScale
              ) {
                yStart = yScale(numericDomain[i + 1]);
                yEnd = yScale(numericDomain[i]);
                break;
              }
            }
          }
      
          if (yStart !== null && yEnd !== null) {
            return yStart + Math.random() * (yEnd - yStart) - 15;
          }
        }
      
        // Per scale non numeriche
        if (nonNumericDomain.includes(normalizedScale)) {
          return yScale(normalizedScale) - 15;
        }
      
        // Per blueprint (Blueprints/effects)
        if (blueprints.includes(normalizedScale)) {
          // Posizionamento casuale tra 0 (inizio) e il valore di "Blueprints/effects" (fine)
          const startY = yScale(""); // punto di partenza
          const endY = yScale("Blueprints/effects"); // punto di fine
          // Genera un valore y casuale tra startY e endY
          return startY + Math.random() * (endY - startY) - 15; // -15 per un offset, se necessario
        }
        
      
        // Default
        return yScale("Text") - 15;
      })      
      
      .attr("width", 30)
      .attr("height", 30)
      .attr("xlink:href", (d) => getIconUrlForDocument(d.type, d.stakeholders))
      .attr("opacity", 1)
      .on("mouseover", function () {
        d3.select(this).attr("opacity", 0.7);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
      });

    // Cleanup
    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, [documentsToShow]);

  useEffect(() => {
    API.getAllDocumentSnippets()
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
