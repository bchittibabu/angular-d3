import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import * as bpData from "../../assets/bp.json"

type BP = {
  date: string,
  systolic: number,
  diasatolic: number,
  pulse: number,
  parsedDate?: Date
};
@Component({
  selector: 'app-d3playground',
  templateUrl: './d3playground.component.html',
  styleUrls: ['./d3playground.component.scss']
})
export class D3playgroundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.plotXYLineChart();

  }

  renderFruits() {
    let fruits = ['Apple', 'Orange', 'Mango']

    d3.select(".d3_fruit")
      .selectAll("p")
      .data(fruits)
      .join("p")
      .attr("class", "d3_fruit")
      .text((d) => d)

    const el = d3.select("#d3_svg_demo2");
  }

  plotBarChart() {
    const margin = { top: 20, right: 30, bottom: 55, left: 70 };
    const width = document.querySelector("body").clientWidth;
    const height = 500;


    const x_scale = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.1);;
    const y_scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const svg = d3.select("#d3_demo").attr("viewBox", [0, 0, width, height]);
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top + 2)
      .attr("text-anchor", "middle")
      .style("font-size", "22px")
      .style("text-decoration", "underline")
      .text("Nigeria States Population");

    let x_axis = d3.axisBottom(x_scale);

    let y_axis = d3.axisLeft(y_scale);



    d3.json("assets/nigeria.json")
      .then(({ data }) => {
        // const data: { info: any, Name: string} [] = nigerialStates.data;
        // el.selectAll('p')
        // .data(data)
        // .join('p')
        // .text( (d) => d.Name)

        // const x_scale = d3.scaleLinear()
        // .domain([10, 500])
        // .range([2000000, 16000000]);

        data.forEach((d) => (d.Population = +d.info.Population));

        x_scale.domain(data.map(d => d.Name))
        y_scale.domain([0, 16000000]);


        svg.selectAll("rect")
          .data(data)
          .join('rect')
          .attr("class", "bar")
          .attr("style", "fill: green")
          .attr('x', (d) => x_scale((d as any).Name))
          .attr("y", (d) => y_scale((d as any).Population))
          .attr("width", x_scale.bandwidth())
          .attr("height", (d) => height - margin.bottom - y_scale((d as any).Population));
        svg
          .append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(x_axis)
          .selectAll("text") // everything from this point is optional
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

        // add y axis
        svg
          .append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(y_axis);

      });
    // append x axis

  }

  plotAxis() {
    let svg = d3.select("#d3_demo")
      .attr('width', 300)
      .attr('height', 200);

    let scale = d3.scaleLinear().domain([0, 100]).range([0, 200]);

    let bottom_axis = d3.axisBottom(scale);

    svg.append('g').call(bottom_axis);
  }

  plotXYLineChart() {
    const width = 960;
    const height = 500;
    const margin = 5;
    const padding = 5;
    const adj = 30;

    const svg = d3.select('#d3_demo')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-"
        + adj + " -"
        + adj + " "
        + (width + adj * 3) + " "
        + (height + adj * 3))
      .style("padding", padding)
      .style("margin", margin)
      .classed("svg-content", true);

    const parseTime = d3.timeParse("%d-%m-%Y");
    const dataArr = bpData.default;

    dataArr.map((d) => {
      d.parsedDate = parseTime(d.date);
    }
    );

    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xExtent = d3.extent(dataArr, (d) => {
      return (d as any).parsedDate;
    })

    const yMax = d3.max(dataArr, (d) => {
      return (d as any).systolic;
    })
    xScale.domain(xExtent as any);
    yScale.domain([0, yMax as any]);
    const yaxis = d3.axisLeft(yScale)
      .ticks(3)

    const xaxis = d3.axisBottom(xScale)
      .ticks(d3.timeDay.every(1))
      .tickFormat(d3.timeFormat('%b %d'))


    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xaxis);

    svg.append("g")
      .attr("class", "axis")
      .call(yaxis);
  }
}