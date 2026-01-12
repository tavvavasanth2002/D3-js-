import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import Legend from "./legend";
export default function WorldChoropleth(){
    const ref=useRef()
    const [world,setWorld]=useState(null)
    const [hale,setData]=useState([])
    useEffect(() => {
              d3.csv("/hale.csv", d => ({
                country:d.country,
                hale:+d.hale
              })).then(setData);
          
              fetch("/countries-50m.json")
                .then(res => res.json())
                .then(setWorld);
                }, []);


    useEffect(() => {
  if (!world || hale.length === 0) return;

  const svg = d3.select(ref.current);
  svg.selectAll("*").remove();

  const width = 928;
  const marginTop = 46;
  const height = width / 2 + marginTop;
  

  const countries = topojson.feature(world, world.objects.countries)
  const countrymesh = topojson.mesh(world, world.objects.countries, (a, b) => a !== b)


  const projection = d3.geoEqualEarth()
    .fitExtent([[2, marginTop + 2], [width - 2, height]], { type: "Sphere" });

  const path = d3.geoPath(projection);

  // --- FIX 1: correct value map ---

  const valuemap = new Map(
  hale.map(d => [d.country, d.hale])
);

  const color = d3.scaleSequential()
  .domain(d3.extent(valuemap.values()))
  .interpolator(d3.interpolateYlGnBu);

  // --- FIX 2: countries + mesh ---
  
  // --- FIX 3: color scale ---
  
  svg
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("max-width", "100%")
    .style("height", "auto");

  // Legend
  svg.append("g")
      .attr("transform", "translate(20,0)")
      .append(() => Legend(color, {title: "Healthy life expectancy (years)", width: 260}));


  // Globe background
  svg.append("path")
    .datum({type: "Sphere"})
    .attr("fill", "white")
    .attr("stroke", "currentColor")
    .attr("d", path);

    
  // Countries
  svg.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
      .attr("fill", d => {
  const v = valuemap.get(d.properties.name);
  return v == null ? "#ddd" : color(v);
})
      .attr("d", path)
    .append("title")
      .text(d => `${d.properties.name}\n${valuemap.get(d.properties.name)}`);

  // Borders
  svg.append("path")
    .datum(countrymesh)
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("d", path);

}, [world, hale]);

    return <svg ref={ref}></svg>
}





