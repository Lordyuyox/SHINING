const width6 = 500;
const height6 = 400;
const padding6 = 50;


let svg6 = d3.select("#CII158").append("svg")
    .attr("width", width6)
    .attr("height", height6);

let xAxis6 = svg6.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height6 - padding6) + ")");

let xLabel6 = xAxis6.append("g")
    .append("text")
    .attr("class", "x axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(${width6 - padding6}, -5)`);

let yAxis6 = svg6.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + padding6 + ",0)");

let yLabel6 = yAxis6.append("g")
    .append("text")
    .attr("class", "y axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(10, ${padding6}) rotate(-90)`);

let tooltip6 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("z-index", 1)
    .style("left", 0)
    .style("top", 0);

Promise.all([
    d3.json("data/data.json")
]).then(function(datos) {

    const y = 'CII158/FIR';
    const x = 'Luminosity';

    let data = datos[0];
    console.log(data);

    const xMin = 9.2;
    const xMax = 12.6;
    const yMin = 0.000009;
    const yMax = 0.002;

    let xScale = d3.scaleLinear()
        .range([padding, width6 - padding6])
        .domain([xMin, xMax]);
        
    let yScale = d3.scaleLog()
        .range([height6 - padding6, padding6])
        .domain([yMin, yMax]);

    let color = d3.scaleOrdinal(data.map(d => d['Optical_class']), d3.schemeCategory10);

    xAxis6.call(d3.axisBottom(xScale));
    yAxis6.call(d3.axisLeft(yScale));
    xLabel6.text(x)
    yLabel6.text(y)

    let circles = svg6.selectAll("circle")
        .data(data);

    // ENTER: los nuevos que se agregan
    circles.enter()
        .append("circle")
        .attr("cx", d => xScale(d[x]))
        .attr("cy", d => yScale(d[y]))
        .attr("r", 6)
        .style('fill', d => color(d.Optical_class))
        .on("mouseover", (event, d) => {
            // Actualizar circulos
            d3.selectAll("circle")
                .style("opacity", 0.2);
            d3.select(event.target)
                .style("opacity", 1.0)
                .style("stroke", "black")
                .style("stroke-width", 2.0);

            // Actualizar tooltip6
            tooltip6.html(`<p><strong>Name:</strong> ${d.Name}</p>
                <p><strong>Optical class</strong> ${d.Optical_class}</p>
                <p><strong>Luminosity</strong> ${d[x]}</p>
                <p><strong>CII158/FIR</strong> ${d[y]}</p>`)
                .style("left", (event.pageX + 10) + 'px')
                .style("top", event.pageY + 'px')
                .style("display", "block");
        })
        .on("mouseout", (event, d) => {
            d3.selectAll("circle")
                .style("opacity", 1.0)
                .style("stroke", "none");
            tooltip6.style("display", "none");
        });

    // UPDATE: existian y que se tienen que actualizar
    circles
        .attr("cx", d => xScale(d[x]))
        .attr("cy", d => yScale(d[y]))
        .style('fill', d => color(d.Optical_class))
        .on("mouseover", (event, d) => {
            d3.selectAll("circle")
                .style("opacity", 0.2);
            d3.select(event.target)
                .style("opacity", 1.0)
                .style("stroke", "black")
                .style("stroke-width", 2.0);
        })
        .on("mouseout", (event, d) => {
            d3.selectAll("circle")
                .style("opacity", 1.0)
                .style("stroke", "none");
        });

    // EXIT: existian pero ahora ya no
    circles.exit().remove();
})