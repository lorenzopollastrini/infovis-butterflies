function normalize(data) {
    let xValues = data.map(d => d.x);
    let minXValue = d3.min(xValues);
    let maxXValue = d3.max(xValues);

    const normalizeX = d3.scaleLinear()
        .domain([minXValue, maxXValue])
        .range([0, 10]);

    let yValues = data.map(d => d.y);
    let minYValue = d3.min(yValues);
    let maxYValue = d3.max(yValues);

    const normalizeY = d3.scaleLinear()
        .domain([minYValue, maxYValue])
        .range([0, 10]);

    let zValues = [];
    data.forEach(d => {
        zValues.push(d.z0, d.z1, d.z2);
    });
    let minZValue = d3.min(zValues);
    let maxZValue = d3.max(zValues);

    const normalizeZ = d3.scaleLinear()
        .domain([minZValue, maxZValue])
        .range([0.5, 1]);

    data.forEach(d => {
        d.x = normalizeX(d.x);
        d.y = normalizeY(d.y);
        d.z0 = normalizeZ(d.z0);
        d.z1 = normalizeZ(d.z1);
        d.z2 = normalizeZ(d.z2);
    });
}

function join(data) {
    chart.selectAll(".butterfly")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "butterfly")
        .on("click", () => updateWings(data, 1))
        .each(function() {
            d3.select(this)
                .append("svg")
                .attr("class", "wings")
                .attr("width",  function(d) {return z(d["z0"])})
                .attr("height", function(d) {return z(d["z0"])})
                .attr("viewBox", "-13.149 -10.684 500 500")
                .attr("x", function(d) {return x(d["x"]) - z(d["z0"]) / 2})
                .attr("y", function(d) {return y(d["y"]) - z(d["z0"]) / 2})
                .append("path")
                .attr("d", "M 396.937 32.505 C 304.103 19.248 251.298 111.052 236.853 140.59 C 222.399 111.052 " +
                    "169.584 19.248 76.769 32.505 C -8.776 44.724 -30.979 133.78 0.394 188.297 C 29.416 238.699 " +
                    "73.71 264.662 142.432 275.339 C 59.956 302.837 25.621 370.948 82.87 421.971 C 147.398 479.485 " +
                    "217.026 431.344 236.853 359.065 C 256.653 431.343 326.307 479.485 390.818 421.971 C 448.066 " +
                    "370.948 413.739 302.837 331.264 275.339 C 399.986 264.662 444.289 238.699 473.312 188.297 C " +
                    "504.685 133.78 482.462 44.724 396.937 32.505 Z")
                .attr("fill", "rgb(0, 180, 255)");

            d3.select(this)
                .append("svg")
                .attr("class", "body")
                .attr("width",  baseButterflySideLength)
                .attr("height", baseButterflySideLength)
                .attr("viewBox", "-13.149 -10.684 500 500")
                .attr("x", function(d) {return x(d["x"]) - baseButterflySideLength / 2})
                .attr("y", function(d) {return y(d["y"]) - baseButterflySideLength / 2})
                .append("path")
                .attr("d", "M 273.398 99.145 C 279.589 93.336 270.278 84.061 264.104 89.853 C 255.25 98.162 248.114 " +
                    "107.981 243.019 118.967 C 241.086 118.278 239.017 117.884 236.851 117.884 C 234.685 117.884 " +
                    "232.611 118.278 230.682 118.967 C 225.591 107.981 218.453 98.161 209.598 89.853 C 203.424 " +
                    "84.061 194.115 93.335 200.304 99.145 C 209.073 107.372 215.699 116.983 220.432 128.012 C " +
                    "219.176 130.501 218.453 133.305 218.453 136.283 L 218.453 177.913 L 218.453 227.688 L 218.453 " +
                    "372.214 C 218.453 382.375 226.69 390.612 236.851 390.612 C 247.012 390.612 255.248 382.375 " +
                    "255.248 372.214 L 255.248 227.688 L 255.248 177.913 L 255.248 136.283 C 255.248 133.305 254.525 " +
                    "130.5 253.269 128.012 C 258 116.983 264.629 107.371 273.398 99.145 Z")
                .attr("fill", "rgb(205, 127, 50)");
        });
}

function updateWings(data, zIndex) {
    d3.select("#selected-size-text strong")
        .text("z" + zIndex % 3)

    chart.selectAll(".butterfly")
        .data(data)
        .on("click", () => updateWings(data, zIndex + 1))
        .select(".wings")
        .transition().duration(1000)
        .attr("width", function(d) {return z(d["z" + (zIndex % 3).toString()])})
        .attr("height", function(d) {return z(d["z" + (zIndex % 3).toString()])})
        .attr("x", function(d) {return x(d["x"]) - z(d["z" + (zIndex % 3).toString()]) / 2})
        .attr("y", function(d) {return y(d["y"]) - z(d["z" + (zIndex % 3).toString()]) / 2});
}

const chartWidth = 800;
const chartHeight = 800;
const chartMarginTop = 40;
const chartMarginRight = 40;
const chartMarginBottom = 40;
const chartMarginLeft = 40;

// Side length of SVG elements containing butterfly parts when z = 1.
const baseButterflySideLength = 64;

// x (horizontal position) scale.
const x = d3.scaleLinear()
    .domain([0, 10])
    .range([chartMarginLeft, chartWidth - chartMarginRight]);

// y (vertical position) scale.
const y = d3.scaleLinear()
    .domain([0, 10])
    .range([chartHeight - chartMarginBottom, chartMarginTop]);

// z (wing size) scale with Stevens' power law.
const z = d3.scalePow()
    .domain([0, 1])
    .range([0, baseButterflySideLength])
    .exponent(1/Math.sqrt(2))

const chart = d3.select("#chart-container").append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

// x-axis.
const xAxis = chart.append("g")
    .attr("transform", `translate(0, ${chartHeight - chartMarginBottom})`)
    .call(d3.axisBottom(x));
xAxis.raise();

// y-axis.
const yAxis = chart.append("g")
    .attr("transform", `translate(${chartMarginLeft}, 0)`)
    .call(d3.axisLeft(y));

d3.json("butterflies.json")
    .then(function(data) {
        normalize(data);
        join(data);

        xAxis.raise();
        yAxis.raise();
    })
    .catch(function(error) {
        console.log(error);
    })