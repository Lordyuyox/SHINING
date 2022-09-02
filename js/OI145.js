const width4 = 500;
const height4 = 400;
const padding4 = 50;


let svg4 = d3.select("#OI145").append("svg")
    .attr("width", width4)
    .attr("height", height4);

let xAxis4 = svg4.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height4 - padding4) + ")");

let xLabel4 = xAxis4.append("g")
    .append("text")
    .attr("class", "x axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(${width4 - padding4}, -5)`);

let yAxis4 = svg4.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + padding4 + ",0)");

let yLabel4 = yAxis4.append("g")
    .append("text")
    .attr("class", "y axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(10, ${padding4}) rotate(-90)`);

let tooltip4 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("z-index", 1)
    .style("left", 0)
    .style("top", 0);

Promise.all([
    d3.json("data/data.json")
]).then(function(datos) {

    const y = 'OI145/FIR';
    const x = 'Luminosity';

    let data = datos[0];
    console.log(data);

    const xMin = 9.2;
    const xMax = 12.6;
    const yMin = 0.0000005;
    const yMax = 0.0001;

    let xScale = d3.scaleLinear()
        .range([padding4, width4 - padding4])
        .domain([xMin, xMax]);
        
    let yScale = d3.scaleLog()
        .range([height4 - padding4, padding4])
        .domain([yMin, yMax]);

    let color = d3.scaleOrdinal(data.map(d => d['Optical_class']), d3.schemeCategory10);

    xAxis4.call(d3.axisBottom(xScale));
    yAxis4.call(d3.axisLeft(yScale));
    xLabel4.text(x)
    yLabel4.text(y)

    let circles = svg4.selectAll("circle")
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

            // Actualizar tooltip4
            tooltip4.html(`<p><strong>Name:</strong> ${d.Name}</p>
                <p><strong>Optical class</strong> ${d.Optical_class}</p>
                <p><strong>Luminosity</strong> ${d[x]}</p>
                <p><strong>OI145/FIR</strong> ${d[y]}</p>`)
                .style("left", (event.pageX + 10) + 'px')
                .style("top", event.pageY + 'px')
                .style("display", "block");
        })
        .on("mouseout", (event, d) => {
            d3.selectAll("circle")
                .style("opacity", 1.0)
                .style("stroke", "none");
            tooltip4.style("display", "none");
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