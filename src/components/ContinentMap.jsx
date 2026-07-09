import React, { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

// Reliable World Atlas URL (Countries & Landmass)
const worldUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mapping of Country IDs to Continents (Simplification for grouping)
const continentMapping = {
  Africa: [
    12, 24, 120, 140, 148, 174, 178, 180, 204, 226, 231, 232, 262, 266, 270,
    288, 324, 384, 404, 426, 430, 434, 450, 454, 466, 478, 480, 504, 508, 516,
    562, 566, 624, 634, 646, 678, 686, 690, 694, 706, 710, 716, 728, 729, 732,
    748, 768, 788, 800, 818, 834, 854, 894,
  ],
  Europe: [
    8, 20, 40, 56, 70, 100, 112, 191, 196, 203, 208, 233, 246, 250, 276, 300,
    348, 352, 372, 380, 428, 438, 440, 442, 470, 498, 499, 528, 578, 616, 620,
    642, 643, 674, 688, 703, 705, 724, 752, 756, 804, 807, 826,
  ],
  
};

const ContinentMap = ({ onContinentClick }) => {
  const [paths, setPaths] = useState([]);
  const width = 1008;
  const height = 651;

  useEffect(() => {
    fetch(worldUrl)
      .then((res) => res.json())
      .then((topology) => {
        // Convert TopoJSON back to GeoJSON for D3
        const countries = feature(
          topology,
          topology.objects.countries,
        ).features;
        setPaths(countries);
      });
  }, []);

  const projection = geoMercator() //Here we use Mercator for a more familiar world map look
    .scale(150)
    .translate([width / 2, height / 1.4]);

  const pathGenerator = geoPath().projection(projection); // D3 path generator using the defined projection
 

  return (
    <div style={{ width: "100%", background: "#fdfaf3", borderRadius: "8px" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto" }}
      >
        <style>
          {`
            .land { 
              fill: #A6926A; 
              stroke: #4E594D; 
              stroke-width: 0.5; 
              transition: fill 0.2s; 
              cursor: pointer; 
            }
            .land:hover { fill: #366649; }
          `}
        </style>
        <g>
          {paths.map((d, i) => (
            <path
              key={`path-${i}`}
              d={pathGenerator(d)} // Generate the SVG path data for each country
              className="land" // Apply the CSS class for styling
              onClick={() =>
                onContinentClick && onContinentClick(d.properties.name) // Pass the country name to the click handler
              }
            >
              <title>{d.properties.name}</title>
            </path>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default ContinentMap;
