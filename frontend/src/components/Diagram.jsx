import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import API from "../API";
import { getIconUrlForDocument } from "../utils/iconMapping";
import { Button } from "react-bootstrap";
import LegendModal from "./Legend";

const FullPageChart = () => {
  const svgRef = useRef();

  // Track documents to show
  const [documentsToShow, setDocumentsToShow] = useState([]);

  // Track current zoom level
  const [zoomLevel, setZoomLevel] = useState(1);

  // Track visibility of legend
  const [showLegend, setShowLegend] = useState(false);

  // Track chart dimensions in state
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Dynamically recalculate chart dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      // You can adjust margins, or factor in other layout constraints here
      const margin = { top: 70, right: 80, bottom: 50, left: 100 };

      const newWidth = window.innerWidth - margin.left - margin.right;
      const newHeight = window.innerHeight * 0.85 - margin.top - margin.bottom;

      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    };

    // Initial calculation
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Main effect to draw the chart
  useEffect(() => {
    // If we have no width or height, do not draw
    if (!dimensions.width || !dimensions.height) return;

    // Extract dimensions and define margins
    const margin = { top: 70, right: 80, bottom: 50, left: 100 };
    const { width, height } = dimensions;

    // Some custom domains for your yScale
    const nonNumericDomain = [" ", "Text", "Concept"];
    const numericDomain = ["1:100000", "1:10000", "1:5000", "1:1000"];
    const blueprints = ["Blueprints/effects", ""];
    const fixedYDomain = [
      ...nonNumericDomain,
      ...numericDomain,
      ...blueprints,
    ];

    // Functions for link style
    const getLinkColor = (linkType) => "black";

    const getLinkDashArray = (linkType) => {
      switch (linkType) {
        case "DIRECT_CONSEQUENCE":
          return "none"; // solid
        case "COLLATERAL_CONSEQUENCE":
          return "5,5"; // dashed
        case "PREVISION":
          return "1,5"; // dotted
        case "UPDATE":
          return "10,5,1,5"; // dash-dot
        default:
          return "none";
      }
    };

    const normalizeScale = (scale) => {
      if (scale === "Blueprint/Material effects" || scale == "blueprints/effects") {
        return "Blueprints/effects";
      }
      return scale;
    };

    const parseNumericScale = (scale) => {
      const match = scale.match(/^1:(\d+)$/);
      return match ? parseInt(match[1]) : null;
    };

    // Clear the old chart (cleanup before drawing again)
    d3.select(svgRef.current).selectAll("*").remove();

    // Select or create the main SVG element
    const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background", "#ffffff");

    // Append main group to contain the chart
    const mainGroup = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear().domain([2004, 2026]).range([0, width]);

    const yScale = d3
        .scalePoint()
        .domain(fixedYDomain)
        .range([0, height])
        .padding(0.2);

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    // Draw axes
    mainGroup.append("g").call(yAxis);
    mainGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // Horizontal grid
    mainGroup
        .append("g")
        .attr("class", "grid grid-horizontal")
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""))
        .selectAll(".tick line")
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "4,4");

    // Vertical grid
    mainGroup
        .append("g")
        .attr("class", "grid grid-vertical")
        .call(d3.axisBottom(xScale).ticks(21).tickSize(height).tickFormat(""))
        .selectAll(".tick line")
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "4,4");

    // Tooltip container
    const tooltip = d3
        .select(svgRef.current.parentNode)
        .append("div")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("height", "auto")
        .style("opacity", 0);

    // Zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 5]) // Min and max zoom
        .translateExtent([
          [-50, -50],
          [width + 30, height + 30],
        ])
        .on("zoom", (event) => {
          mainGroup.attr("transform", event.transform);
          setZoomLevel(event.transform.k);
        });

    // Apply zoom
    svg.call(zoom);

    // Positions for documents
    const documentPositions = {};

    // Render document icons
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
          documentPositions[d.id] = { x: xPos };
          return xPos;
        })
        .attr("y", (d) => {
          const scaleNorm = normalizeScale(d.scale);
          const numericScaleValue = parseNumericScale(scaleNorm);

          let yPos = yScale("Text") - 15; // default

          if (numericScaleValue) {
            if (numericScaleValue <= 1000 && numericScaleValue >= 1) {
              // place between 1:1000 and Blueprints/effects
              const yBlueprints = yScale("Blueprints/effects");
              const y1000 = yScale("1:1000");
              yPos = yBlueprints + Math.random() * (y1000 - yBlueprints) - 15;
            } else {
              // place in numeric domain
              for (let i = 0; i < numericDomain.length - 1; i++) {
                const currentScale = parseNumericScale(numericDomain[i]);
                const nextScale = parseNumericScale(numericDomain[i + 1]);
                if (
                    currentScale !== null &&
                    nextScale !== null &&
                    numericScaleValue > nextScale &&
                    numericScaleValue <= currentScale
                ) {
                  yPos =
                      yScale(numericDomain[i + 1]) +
                      Math.random() * (yScale(numericDomain[i]) - yScale(numericDomain[i + 1])) -
                      15;
                  break;
                }
              }
            }
          } else if (scaleNorm === "Blueprints/effects") {
            // place between "" and Blueprint/effects
            const yMin = yScale("");
            const yBlueprints = yScale("Blueprints/effects");
            yPos = yMin + Math.random() * (yBlueprints - yMin) - 15;
          } else {
            // fallback
            yPos = yScale(scaleNorm) - 15;
          }

          documentPositions[d.id].y = yPos;
          return yPos;
        })
        .attr("width", 30)
        .attr("height", 30)
        .attr("xlink:href", (d) => getIconUrlForDocument(d.type, d.stakeholders))
        .on("mouseover", function (event, d) {
          tooltip
              .style("opacity", 1)
              .html(`<strong>${d.title}</strong><p>Scale: ${d.scale}</p>`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
          d3.select(this).attr("opacity", 0.9);
        })
        .on("mousemove", (event) => {
          tooltip
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", function () {
          tooltip.style("opacity", 0);
          d3.select(this).attr("opacity", 1);
        });

    // Draw links
    const drawnLinks = new Set();
    const offset = 10;

    documentsToShow.forEach((doc) => {
      doc.links.forEach((link, index) => {
        const target = documentsToShow.find((d) => d.id === link.documentId);
        if (target) {
          const linkType = link.linkType;
          // Unique ID for a link
          const linkId = [doc.id, target.id].sort((a, b) => a - b).join("-") + `-${linkType}`;
    
          if (!drawnLinks.has(linkId)) {
            drawnLinks.add(linkId);
    
            const startX = documentPositions[doc.id].x + 15;
            const startY = documentPositions[doc.id].y + 15;
            const endX = documentPositions[target.id].x + 15;
            const endY = documentPositions[target.id].y + 15;
    
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    
            // Shift the line so it doesn't enter the icon
            const newStartX = startX + (offset * deltaX) / distance;
            const newStartY = startY + (offset * deltaY) / distance;
            const newEndX = endX - (offset * deltaX) / distance;
            const newEndY = endY - (offset * deltaY) / distance;
    
            // Curvature calculation based on index
            const totalLinks = doc.links.length; // Total links from this document
            const curveScale = 20; // Scale of curvature
            const curveOffset = curveScale * (index - (totalLinks - 1) / 2); // Center the curvature
            const controlPointX = (newStartX + newEndX) / 2 + (deltaY / distance) * curveOffset;
            const controlPointY = (newStartY + newEndY) / 2 - (deltaX / distance) * curveOffset;
    
            mainGroup
              .append("path")
              .attr(
                "d",
                `M ${newStartX},${newStartY} Q ${controlPointX},${controlPointY} ${newEndX},${newEndY}`
              )
              .attr("fill", "none")
              .attr("stroke", getLinkColor(linkType))
              .attr("stroke-width", 2)
              .attr("stroke-dasharray", getLinkDashArray(linkType));
          }
        }
      });
    });
    

    // Raise document icons above links
    mainGroup.selectAll(".document-icon").raise();

    // Cleanup (remove tooltip)
    return () => {
      tooltip.remove();
    };
  }, [documentsToShow, dimensions]);

  // Fetch documents
  useEffect(() => {
    API.getAllDocumentSnippetsWithLinks()
        .then((data) => setDocumentsToShow(data))
        .catch((err) => console.error("Error fetching documents:", err));
  }, []);

  return (
      <div style={{ position: "relative" }}>
        <LegendModal
            diagram={true}
            show={showLegend}
            onHide={() => setShowLegend(false)}
        />
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
};

export default FullPageChart;