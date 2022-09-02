const width1 = 500;
const height1 = 400;
const padding1 = 50;


let svg = d3.select("#NIII57").append("svg")
    .attr("width", width1)
    .attr("height", height1);

let xAxis = svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height1 - padding1) + ")");

let xLabel = xAxis.append("g")
    .append("text")
    .attr("class", "x axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(${width1 - padding1}, -5)`);

let yAxis = svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + padding1 + ",0)");

let yLabel = yAxis.append("g")
    .append("text")
    .attr("class", "y axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(10, ${padding1}) rotate(-90)`);

let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("z-index", 1)
    .style("left", 0)
    .style("top", 0);

Promise.all([
    d3.json("data/data.json")
]).then(function(datos) {

    const y = 'NIII57/FIR';
    const x = 'Luminosity';

    let data = datos[0];
    console.log(data);

    const xMin = 9.2;
    const xMax = 12.6;
    const yMin = 0.0000018;
    const yMax = 0.00016;

    let xScale = d3.scaleLinear()
        .range([padding1, width1 - padding1])
        .domain([xMin, xMax]);
        
    let yScale = d3.scaleLog()
        .range([height1 - padding1, padding1])
        .domain([yMin, yMax]);

    let color = d3.scaleOrdinal(data.map(d => d['Optical_class']), d3.schemeCategory10);

    xAxis.call(d3.axisBottom(xScale));
    yAxis.call(d3.axisLeft(yScale));
    xLabel.text(x)
    yLabel.text(y)

    let circles = svg.selectAll("circle")
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

            // Actualizar tooltip
            tooltip.html(`<p><strong>Name:</strong> ${d.Name}</p>
                <p><strong>Optical class</strong> ${d.Optical_class}</p>
                <p><strong>Luminosity</strong> ${d[x]}</p>
                <p><strong>NIII57/FIR</strong> ${d[y]}</p>`)
                .style("left", (event.pageX + 10) + 'px')
                .style("top", event.pageY + 'px')
                .style("display", "block");
        })
        .on("mouseout", (event, d) => {
            d3.selectAll("circle")
                .style("opacity", 1.0)
                .style("stroke", "none");
            tooltip.style("display", "none");
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