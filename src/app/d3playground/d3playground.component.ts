import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from "d3";
import * as moment from 'moment';
import * as bpData from "../../assets/bp.json"

type BP = {
  date: string,
  systolic: number,
  diasatolic: number,
  pulse: number,
  parsedDate?: Date,
  moment?: any
};
@Component({
  selector: 'app-d3playground',
  templateUrl: './d3playground.component.html',
  styleUrls: ['./d3playground.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class D3playgroundComponent implements OnInit {

  private graph = {
		x: {
			range: [],
			diff: null,
			domain: [],
			scale: null
		},
		y: {
			range: [],
			diff: null,
			domain: [],
			scale: null
		},
		g: null,
		line: null,
		focus: null,
		rect: null
	};
  @ViewChild('graphBody') private graphBody: ElementRef;

  private bisectDate;
  private xScale;
	private yScale;
  mouseDate: any;
  timespan: string = 'week';
  xDomain: any[];
  yDomain: number[];
  slices: any[];
  dataArr: BP[];
  constructor() { }

  ngOnInit(): void {

   

  }

  ngAfterViewInit() {
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
    let width = 960;
    let height = 500;
    const margin = 25;
    const padding = 25;
    const adj = 30;
    const graphSize = {
      height: this.graphBody.nativeElement.offsetHeight,
      width: this.graphBody.nativeElement.offsetWidth
    };
    //Creating SVG
    const svg = d3.select(this.graphBody.nativeElement).append('svg')
       // .attr('width', width)
			 //.attr('height',height)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "-"
        + adj + " -"
        + adj + " "
        + (width + adj * 3) + " "
        + (height + adj * 3))
      .style("padding", padding)
      .style("margin", margin);
      // .classed("svg-content", true);
    // width = graphSize.width;
    // height = graphSize.height;
    var aspect = width / height;
    // d3.select(window)
    //   .on("resize", function () {
    //     var targetWidth = (svg.node() as any).getBoundingClientRect().width;
    //     svg.attr("width", targetWidth);
    //     svg.attr("height", targetWidth / aspect);
    //   });
    // Data
    const parseTime = d3.timeParse("%d-%m-%Y");
    this.dataArr = bpData.default;
    this.slices = [];
    const keys = Object.keys(this.dataArr[0]);
    for (const key of keys) {
      if (key !== 'date') {
        this.slices.push({ id: key, values: [] })
      }
    }

    this.dataArr.map((d) => {
      d.parsedDate = parseTime(d.date);
      d.moment = moment(d.parsedDate)
      this.slices[0].values.push({ date: d.parsedDate, measurement: +d.systolic, moment: moment(d.parsedDate) });
      this.slices[1].values.push({ date: d.parsedDate, measurement: +d.diasatolic, moment: moment(d.parsedDate) });
      this.slices[2].values.push({ date: d.parsedDate, measurement: +d.pulse, moment: moment(d.parsedDate) });

    }
    );

    //Scales


    const xRange = d3.extent(this.dataArr, (d) => {
      return (d as any).moment;
    })

    const xDiff = (xRange[1] - xRange[0]) * 0.1;


    const yMax = d3.max(this.dataArr, (d) => {
      return +(d as any).systolic;
    })

    const yMin = d3.min( this.dataArr, (d) => {
      return +(d.diasatolic)
    });

    const yMinMx = [yMin, yMax];

    const yRange = [
      Math.floor( (yMinMx[0] - 1)/10 )* 10,
      Math.floor( (yMinMx[1] /10) * 10+ 10)
    ];
    const yDiff = (yRange[1] - yRange[0]) * 0.1;
    this.xScale = d3.scaleTime().range([0, width]);
    this.yScale = d3.scaleLinear().range([height, 0]);

    this.xDomain = xRange;
		this.yDomain = [yRange[0] - yDiff, yRange[1] + yDiff];

    this.xScale.domain(this.xDomain as any);
    this.yScale.domain(this.yDomain);
    const yaxis = d3.axisLeft(this.yScale)
      .ticks(3)

    this.graph.x = {
      range: xRange,
      diff: xDiff,
      domain: this.xDomain,
      scale: this.xScale
    };
    this.graph.y = {
      range: yRange,
      diff: yDiff,
      domain: this.yDomain,
      scale: this.yScale
    };
    //Axis
    const xaxis = d3.axisBottom(this.xScale)
      .ticks(d3.timeDay.every(1))
      .tickFormat(d3.timeFormat('%b %d'))
    this.graph.g = svg.append('g');
    // this.graph.g.append("g")
    //   .attr("class", "axis")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xaxis);

    // this.graph.g.append("g")
    //   .attr("class", "axis")
    //   .call(yaxis);

    // Lines
    const lineX = (d) => {
      return this.xScale(d.date);
    };

    const lineY = (d) => {
      return this.yScale(d.measurement);
    };
    const line = d3.line()
      .x(lineX)
      .y(lineY)
      .curve(d3.curveCatmullRom.alpha(0.5));

    let id = 0;
    const ids = function (type: string) {
      return `line-` + id++;
    }
    const lines = this.graph.g.selectAll("lines")
      .data(this.slices)
      .enter()
      .append("g");

    const path = lines.append("path")
      .attr("class", ids)
      .attr("d", (d) => {
        console.log(d)
        return line(d.values);
      })

    id = 0

    //animate paths
    path.nodes().forEach(element => {
      const totalLength = element.getTotalLength();
      console.log(totalLength)
      d3.select(element)
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", `${totalLength}`)
        .transition()
        .duration(1000)
        .ease(d3.easeSinOut)
        .attr("stroke-dashoffset", 0);
    });

    //Add points
    this.slices.forEach((el) => {
      console.log(el)
      const circleClass = ids('circle');
      this.graph.g.selectAll('circles')
        .data(el.values)
        .enter()
        .append('circle')
        .attr('class', circleClass)
        .attr('cy', lineY)
        .attr('cx', lineX)
        .attr('r', 2).style('opacity', 0)
        .transition().duration(1000)
        .style('opacity', 1);;
    });

    this.graph.focus =  this.graph.g.append('g')
    .style('display', 'none');
    this.graph.focus.append('line')
    .attr('id', 'focusLineX')
    .attr('shape-rendering', 'crispEdges')
    .attr('class', 'focus-line');
    
    for( let i = 0; i < 3; i++){
      this.graph.focus.append('circle')
      .attr('id', 'focusCircle'+i)
      .attr('r', 3)
      .attr('class', 'circle focus-circle');
    }

    this.graph.focus.append('circle')
    .attr('id', 'metricFocusCircle')
    .attr('r', 3)
    .attr('class', 'circle metric-focus-circle')
    .style('display', 'none'); 

    let tooltipLabel = 'DATE: ';
    this.graph.focus.append('text')
    .attr('y', -15)
    .attr('dy', '.31em')
    .attr('id', 'tooltip-label')
    .text(tooltipLabel);
    this.graph.focus.append('text')
    .attr('y', -15)
    .attr('dy', '.31em')
    .attr('id', 'tooltip');
    this.bisectDate = d3.bisector((d) => {
      return d.moment;
    }).left;

    const that = this;
    // const startFocus = function() {
    //   this.onFocus(d3.mouse(this))
    // };

    // this.graph.append("line")
    //   .attr('class', 'lowrange')
    //   .attr('x1', 0)
    //   .attr('x2', width)
    //   .attr('y1', 85)
    //   .attr('y2', 85);

      const startFocus = function() {
				//that.graphRefreshing = false;
				that.onFocus(d3.mouse(this));
			};

			this.graph.rect = this.graph.g.append('rect')
				.attr('class', 'overlay')
				.attr('width', width)
				.attr('height', height)
				.on('mousedown', startFocus)
				.on('mousemove', startFocus)
				.on('touchmove', startFocus)
				.on('touchstart', startFocus);

    lines.append("text")
      .attr("class", "label")
      .datum(function (d) {
        return {
          id: d.id,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function (d) {
        return "translate(" + (this.xScale(d.value.date))
          + "," + (this.yScale(d.value.measurement) + 5) + ")";
      })
      .attr("x", 5)
      .text(function (d) { return d.id; });
  }

  public outputFocusData(i) {
		// this.events.publish('graph:getFocusData', i);
	}

  public onFocus(mouseEvent) {
		// Get mouse position data
		if (mouseEvent) {
			this.mouseDate = this.xScale.invert(mouseEvent[0]);
		} else if (!this.mouseDate) {
			// Prevent null event error
			return;
		}
		// Get nearest date/index
		const weightDateAndIndex = this.getPointDateAndIndex(this.dataArr, this.mouseDate);
		const data = weightDateAndIndex[0];
		const dataIndex = weightDateAndIndex[1];

		if (data) {
			this.graph.focus.style('display', 'initial');
			const x = this.xScale(data.moment);
			const ypulse = this.yScale(data.pulse);
			const ysystolic = this.yScale(data.systolic);
			const ydiastolic = this.yScale(data.diasatolic);

			let tooltipX = x;
			const timestamp = this.dataArr[dataIndex].moment;
			this.outputFocusData(this.dataArr[dataIndex][2]);

			const tooltipLabel = this.graph.focus.select('#tooltip-label');
			const tooltip = this.graph.focus.select('#tooltip');

			if (this.timespan === 'week' || this.timespan === 'month') {
				tooltip.text(moment(timestamp).format('MM-DD-YY'));
			} else if (this.timespan === 'year') {
				tooltip.text(moment(timestamp).format('MMMM'));
			} else if (this.timespan === 'total') {
				tooltip.text(moment(timestamp).format('MMM. YYYY'));
			}

			const labelWidth = tooltipLabel.node().getBBox().width + 5;
			const totalWidth = labelWidth + (tooltip.node().getBBox().width > 0 ? tooltip.node().getBBox().width : 60);

			if (tooltipX > this.xScale(this.dataArr[this.dataArr.length - 1].moment) - totalWidth - 20) {
				tooltipX -= totalWidth;
			}

			this.graph.focus.select('#focusCircle0')
				.attr('cx', x)
				.attr('cy', ypulse)
				.style('display', 'initial');
        this.graph.focus.select('#focusCircle1')
				.attr('cx', x)
				.attr('cy', ysystolic)
				.style('display', 'initial');			
        this.graph.focus.select('#focusCircle2')
				.attr('cx', x)
				.attr('cy', ydiastolic)
				.style('display', 'initial');
			this.graph.focus.select('#focusLineX')
				.attr('x1', x).attr('y1', this.yScale(this.yDomain[0]))
				.attr('x2', x).attr('y2', this.yScale(this.yDomain[1]))
				.style('display', 'initial');
			tooltipLabel.attr('x', tooltipX)
				.attr('y1', this.yScale(this.yDomain[0]))
				.style('display', 'initial');
			tooltip.attr('x', tooltipX + labelWidth)
				.attr('y1', this.yScale(this.yDomain[0]))
				.style('display', 'initial');
		}

	}

	private getPointDateAndIndex(momentArray, mouseDate) {
		// Returns the index of the mouseDate if it was to be inserted into the array.
		// This will always be to the right of the click/touch
		const index = this.bisectDate(momentArray, mouseDate);

		// Get the dates to the left and right of the click/touch
		const min: BP = momentArray[index - 1];
		const max: BP = momentArray[index];

		// Find the closest date to the mouseDate
		let date;
		let dateIndex;
		if (min && max) {
			date = mouseDate - min.moment > max.moment - mouseDate ? max : min;
			dateIndex = mouseDate - min.moment > max.moment - mouseDate ? index : index - 1;
		} else {
			// If either is null, assign the other by default. This happens when clicking/touching the sides
			date = max ? max : min;
			dateIndex = max ? index : index - 1;
		}

		return [date, dateIndex];
	}

}
