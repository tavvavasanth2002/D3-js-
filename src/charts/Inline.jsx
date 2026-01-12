import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Inline() {
  const fruit = [
    { date: "2009-01-01", fruit: "Apples", value: 130 },
    { date: "2009-01-01", fruit: "Bananas", value: 40 },
    { date: "2010-01-01", fruit: "Apples", value: 137 },
    { date: "2010-01-01", fruit: "Bananas", value: 58 },
    { date: "2011-01-01", fruit: "Apples", value: 166 },
    { date: "2011-01-01", fruit: "Bananas", value: 97 },
    { date: "2012-01-01", fruit: "Apples", value: 154 },
    { date: "2012-01-01", fruit: "Bananas", value: 117 },
    { date: "2013-01-01", fruit: "Apples", value: 179 },
    { date: "2013-01-01", fruit: "Bananas", value: 98 },
    { date: "2014-01-01", fruit: "Apples", value: 187 },
    { date: "2014-01-01", fruit: "Bananas", value: 120 },
    { date: "2015-01-01", fruit: "Apples", value: 189 },
    { date: "2015-01-01", fruit: "Bananas", value: 84 }
  ];

  const ref = useRef();

  useEffect(() => {
    const width = 928;
    const height = 500;
    const marginTop = 30;
    const marginRight = 50;
    const marginBottom = 30;
    const marginLeft = 30;

    // Parse dates
    const parsedData = fruit.map(d => ({
      ...d,
      date: d3.utcParse("%Y-%m-%d")(d.date)
    }));

    // Clear previous render
    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const x = d3.scaleUtc()
      .domain(d3.extent(parsedData, d => d.date))
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.value)])
      .nice()
      .range([height - marginBottom, marginTop]);

    const color = d3.scaleOrdinal()
      .domain([...new Set(parsedData.map(d => d.fruit))])
      .range(d3.schemeCategory10);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // Group by fruit
    const serie = svg.append("g")
      .selectAll()
      .data(d3.group(parsedData, d => d.fruit))
      .join("g");

    // Draw lines
    serie.append("path")
      .attr("fill", "none")
      .attr("stroke", d => color(d[0]))
      .attr("stroke-width", 1.5)
      .attr("d", d => d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))(d[1]));

    // Labels
    serie.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(d => d[1])
      .join("text")
        .text(d => d.value)
        .attr("dy", "0.35em")
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.value))
        .call(text => text.filter((d, i, nodes) => i === nodes.length - 1)
          .append("tspan")
            .attr("font-weight", "bold")
            .text(d => ` ${d.fruit}`))
      .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 6);
  }, [fruit]);

  return <svg ref={ref}></svg>;
}
