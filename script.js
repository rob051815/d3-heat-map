const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

let values;
let basetemp;

let xScale;
let yScale;

let minYear;
let maxYear;

const months = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];

const width = 1200;
const height = 600;
const padding = 60;

let canvas = d3.select('#canvas');

let tooltip = d3.select('#tooltip')

const drawCanvas = () => {
    canvas.attr('width', width)
    canvas.attr('height', height)
}

const generateScales = () => {
    minYear = d3.min(values, v => v['year']);
    maxYear = d3.max(values, v => v['year']);
    console.log(maxYear - minYear)
    xScale = d3.scaleLinear()
                .domain([minYear, maxYear])
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([new Date(0, 0), new Date(0, 11)])
                .range([height - padding, padding])
}

const drawAxes = () => {    
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
                    
    canvas.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0, ' + (height -padding) + ')')
    
    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%B'))
    canvas.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + padding + ', 0)')

}

const drawCells = () => {
    canvas.selectAll('rect')
            .data(values)
            .enter()
            .append('rect')
            .attr('class', 'cell',)
            .attr('fill', v => {
                let variance = v['variance'];
                if(variance <= -2) {
                    return 'var(--cool-1)'
                } else if (variance <= -1) {
                    return 'var(--cool-2)'
                } else if (variance <= 0) {
                    return 'var(--lukewarm-1)'
                } else if (variance <= 1) {
                    return 'var(--warm-1)'
                } else {
                    return 'var(--warm-2)'
                }
            })
            .attr('data-month', v => v['month'] - 1)
            .attr('data-year', v => v['year'])
            .attr('data-temp', v => v['variance'] + basetemp)
            .attr('height', ((height - (padding * 2)) / 12))
            .attr('width', () => {
                let years = maxYear - minYear;
                return (width - (padding * 2)) / years
            })
            .attr('x', v => {
                return xScale(v['year'])
            })
            .attr('y', (v) => {
                return yScale(new Date(0, v['month']))
            })
            .on('mouseover', (event, v) => {
                tooltip
                    .transition()
                    .style('visibility', 'visible')

                tooltip.text(v['year'] + ' ' + months[v['month'] - 1] + ' temp: '
                 + (v['variance'] + basetemp) + ' - variance: ' + v['variance']) 

                 tooltip.attr('data-year', v['year'])
            })
            .on('mouseout', () => {
                tooltip
                    .transition()
                    .style('visibility', 'hidden')
            })
}


d3.json(url)
    .then((data) => callback(data))
    .catch((err) => console.log(err))

function callback(data) {
    basetemp = data['baseTemperature'];
    values = data['monthlyVariance']
    drawCanvas();
    generateScales();
    drawAxes();
    drawCells();
}