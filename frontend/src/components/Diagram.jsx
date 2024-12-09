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

    // Etichette non numeriche (ordine fisso)
    const nonNumericLabels = ["Text", "Concept", "Blueprints/effects"];

    // Ordine fisso per le scale numeriche
    const numericLabelsOrder = [
      "1:100.000",
      "1:10.000",
      "1:5.000",
      "1:1.000",
    ];

    // Funzione per convertire la scala in un valore numerico
    const parseScale = (scale) => {
      if (scale === "Blueprint/Material effects") return "Blueprints/effects";
      if (nonNumericLabels.includes(scale)) return scale;
      
      const match = scale.match(/^1:(\d+)$/);
      if (match) {
        return scale; // Restituisce la scala numerica
      }
      return null;
    };

    // Funzione per convertire le scale numeriche in numeri per confronto
    const scaleToNumericValue = (scale) => {
        // Gestisci le scale numeriche standard
        if (scale === "1:100.000") return 100000;
        if (scale === "1:10.000") return 10000;
        if (scale === "1:5.000") return 5000;
        if (scale === "1:1.000") return 1000;
        // Gestisci le scale personalizzate come "1:8000"
        const match = scale.match(/^1:(\d+)$/); // Cattura la parte numerica dopo "1:"
        if (match) {
          return parseInt(match[1]); // Restituisci il numero estratto dalla stringa
        }
        return 0; // Default per scale non numeriche
      };
      

    // Funzione per ordinare le scale, numeriche prima e poi etichette
    const yDomain = [
      ...nonNumericLabels,
      ...numericLabelsOrder,
    ];

    // Scala delle Y
    const yScale = d3
      .scalePoint()
      .domain(yDomain)
      .range([0, height])
      .padding(0.5);

    // Scala delle X (anni)
    const xScale = d3.scaleLinear().domain([2004, 2024]).range([0, width]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "#ffffff")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Assi principali
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
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
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat("")
      )
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Griglie verticali
    svg
      .append("g")
      .attr("class", "grid grid-vertical")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-height)
          .tickFormat("")
      )
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Etichette per gli assi
    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Scale");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Years");

    // Aggiunta delle icone dei documenti
    if (documentsToShow.length > 0) {
        svg
        .selectAll(".document-icon")
        .data(documentsToShow)
        .enter()
        .append("image")
        .attr("class", "document-icon")
        .attr("x", (d) => xScale(parseInt(d.issuanceDate)) - 12) // Centrare l'immagine
        .attr("y", (d) => {
          const scale = parseScale(d.scale);
          if (scale === "Blueprints/effects") return yScale("Blueprints/effects");
          if (scale === "Text") return yScale("Text");
          if (scale === "Concept") return yScale("Concept");
          
          // Se la scala è numerica, usiamo scaleToNumericValue per determinare la posizione
          const scaleValue = scaleToNumericValue(scale);
          if (scaleValue > 0) {
            // Troviamo la scala più vicina e restituiamo la sua posizione Y
            return yScale(numericLabelsOrder.find((label) => scaleToNumericValue(label) >= scaleValue));
          }
          return yScale("Text"); // Posizione di fallback
        }) // Posizionare correttamente sulla Y
        
        .attr("width", 30) // Larghezza dell'icona
        .attr("height", 30) // Altezza dell'icona
        .attr("xlink:href", (d) => getIconUrlForDocument(d.type, d.stakeholders)) // URL dell'icona
        .attr("opacity", 0.8)
        .on("mouseover", function () {
          d3.select(this).attr("opacity", 1);
        })
        .on("mouseout", function () {
          d3.select(this).attr("opacity", 0.8);
        });
      
    }

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
