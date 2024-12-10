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

    // Normalize scale names
    const normalizeScale = (scale) => {
      if (scale === "Blueprint/Material effects") {
        return "Blueprints/effects";
      }
      return scale;
    };

    // Function to parse numeric scales
    const parseNumericScale = (scale) => {
      const match = scale.match(/^1:(\d+)$/); 
      return match ? parseInt(match[1]) : null; 
    };

    // Predefinite labels
    const nonNumericLabels = ["Text", "Concept"];
    const blueprints = ["Blueprints/effects"];
    const dynamicScales = documentsToShow
      .map((doc) => normalizeScale(doc.scale)) 
      .filter((scale) => scale !== null)
      .sort((a, b) => parseNumericScale(b) - parseNumericScale(a)); 

    const yDomain = [...nonNumericLabels, ...dynamicScales, ...blueprints];
    const yScale = d3.scalePoint().domain(yDomain).range([0, height]).padding(0.5);
    const xScale = d3.scaleLinear().domain([2004, 2024]).range([0, width]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "#ffffff")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").call(yAxis);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    // Horizontal grid lines
    svg
      .append("g")
      .attr("class", "grid grid-horizontal")
      .call(
        d3.axisLeft(yScale).tickSize(-width).tickFormat("")
      )
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Vertical grid lines
    svg
      .append("g")
      .attr("class", "grid grid-vertical")
      .call(
        d3.axisBottom(xScale)
          .tickSize(height)
          .tickFormat("")
      )
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4");

    // Draw documents
    svg
      .selectAll(".document-icon")
      .data(documentsToShow)
      .enter()
      .append("image")
      .attr("class", "document-icon")
      .attr("x", (d) => xScale(parseInt(d.issuanceDate)) - 15) // Center the icon
      .attr("y", (d) => {
        const scale = yScale(normalizeScale(d.scale)) || yScale("Text");
        return scale - 15;
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
