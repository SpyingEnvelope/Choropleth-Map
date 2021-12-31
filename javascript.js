let svg;
let legend;
let xScale;
let scaleBand = ['15', '25', '35', '45', '55']
let edData;
let countyData;

const w = 1000;
const h = 700;

fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
     .then(response => response.json())
     .then(response => {
         edData = response;
         console.log(edData);
     });

fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
     .then(response => response.json())
     .then(response => {
         countyData = topojson.feature(response, response.objects.counties).features
         console.log(countyData)
         generateSvg();
     });

const generateSvg = () => {
    svg = d3.select('#canvas-div').append('svg').attr('width', w).attr('height', h);

    svg.selectAll('path')
       .data(countyData)
       .enter()
       .append('path')
       .attr('d', d3.geoPath())
       .attr('class', 'county')
       .attr('fill', (d) => returnFill(d.id))
       .attr('data-fips', (d) => d.id)
       .attr('data-education', (d) => returnEd('ed', d.id))
       .attr('data-state', (d) => returnEd('state', d.id));

    legend = d3.select('#legend')
               .append('svg')
               .attr('width', 500)
               .attr('height', 200);

    xScale = d3.scaleBand()
               .domain(scaleBand)
               .range([250, 500]);
}

const returnFill = (fip) => {
    for (let i = 0; i < edData.length; i++) {
        if (edData[i].fips == fip) {
            if (edData[i].bachelorsOrHigher < 15) {
                return '#B7B2FF';
            } else if (edData[i].bachelorsOrHigher < 25) {
                return '#968FFF';
            } else if (edData[i].bachelorsOrHigher < 35) {
                return '#756BFF';
            } else if (edData[i].bachelorsOrHigher < 45) {
                return '#4A3DFF';
            } else if (edData[i].bachelorsOrHigher < 55) {
                return '#1F0FFF';
            } else {
                return '#1100FC';
            }
        }
    }
}

const returnEd = (action, fip) => {
    if (action == 'ed') {
        for (let i = 0; i < edData.length; i++) {
            if (edData[i].fips == fip) {
                return edData[i].bachelorsOrHigher;
            }
        }
    } else {
        for (let i = 0; i < edData.length; i++) {
            if (edData[i].fips == fip) {
                return {
                    state: edData[i].state,
                    county: edData[i]['area_name']
                }
            }
        }
    }
}