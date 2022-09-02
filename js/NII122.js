const width5 = 500;
const height5 = 400;
const padding5 = 50;


let svg5 = d3.select("#NII122").append("svg")
    .attr("width", width5)
    .attr("height", height5);

let xAxis5 = svg5.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height5 - padding5) + ")");

let xLabel5 = xAxis5.append("g")
    .append("text")
    .attr("class", "x axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(${width5 - padding5}, -5)`);

let yAxis5 = svg5.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + padding5 + ",0)");

let yLabel5 = yAxis5.append("g")
    .append("text")
    .attr("class", "y axis-title")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("fill", "black")
    .attr("transform", `translate(10, ${padding5}) rotate(-90)`);

let tooltip5 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none")
    .style("position", "absolute")
    .style("z-index", 1)
    .style("left", 0)
    .style("top", 0);

Promise.all([
    d3.json("data/data.json")
]).then(function(datos) {

    const y = 'NII122/FIR';
    const x = 'Luminosity';

    let data = datos[0];
    console.log(data);

    const xMin = 9.2;
    const xMax = 12.6;
    const yMin = 0.000001;
    const yMax = 0.00015;

    let xScale = d3.scaleLinear()
        .range([padding5, width5 - padding5])
        .domain([xMin, xMax]);
        
    let yScale = d3.scaleLog()
        .range([height5 - padding5, padding5])
        .domain([yMin, yMax]);

    let color = d3.scaleOrdinal(data.map(d => d['Optical_class']), d3.schemeCategory10);

    xAxis5.call(d3.axisBottom(xScale));
    yAxis5.call(d3.axisLeft(yScale));
    xLabel5.text(x)
    yLabel5.text(y)

    let circles = svg5.selectAll("circle")
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

            // Actualizar tooltip5
            tooltip5.html(`<p><strong>Name:</strong> ${d.Name}</p>
                <p><strong>Optical class</strong> ${d.Optical_class}</p>
                <p><strong>Luminosity</strong> ${d[x]}</p>
                <p><strong>NII122/FIR</strong> ${d[y]}</p>`)
                .style("left", (event.pageX + 10) + 'px')
                .style("top", event.pageY + 'px')
                .style("display", "block");
        })
        .on("mouseout", (event, d) => {
            d3.selectAll("circle")
                .style("opacity", 1.0)
                .style("stroke", "none");
            tooltip5.style("display", "none");
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