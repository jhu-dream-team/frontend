import * as React from "react";
import * as d3 from "d3";
import { inject, observer } from "mobx-react";
import { when } from "mobx";

@inject("rootStore")
@observer
export default class Wheel extends React.Component<any, any> {
  private node;
  private width;
  private height;
  private radius;
  private color;
  private outerRadius;
  private innerRadius;
  private defaultRotation;
  private selectorPosition;
  private wheelDispatch;
  private rotationTimeMS;
  private imgSize;
  constructor(props) {
    super(props);
    this.width = window.innerWidth / 2;
    this.height = window.innerWidth / 2;
    this.radius = Math.min(this.width, this.height) / 2;
    this.color = "#444444";
    this.innerRadius = 75;
    this.outerRadius = this.radius - 20;
    this.defaultRotation = 90;
    this.selectorPosition = 180;
    this.rotationTimeMS = 700;
    this.imgSize = this.radius / 3;
    this.wheelDispatch = d3.dispatch("spin_received", "mouseover", "mouseout");
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    this.createWheel(this.props.rootStore.gameStore.wheelCategories);
    this.setState({ mounted: true });
  }

  rotateToId(id) {
    var elem = document.getElementById(id);
    var event = new Event("spin_received");
    elem.dispatchEvent(event);
  }

  createWheel(data) {
    const node = this.node;

    var svg = d3.select(node);

    var main = svg.select(".main");

    if (main.empty()) {
      main = svg.append("g").attr("class", "main");
    }
    main.attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );

    var background = main.select(".background");
    if (background.empty()) {
      background = main.append("g").attr("class", "background");
    }
    background
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", this.radius - 10)
      .style("fill", this.color);

    var arcFull = d3
      .arc()
      .outerRadius(this.outerRadius)
      .innerRadius(this.innerRadius);
    var arcDark = d3
      .arc()
      .outerRadius(this.outerRadius)
      .innerRadius(
        this.innerRadius + (4 * (this.outerRadius - this.innerRadius)) / 5
      );
    var arcLight = d3
      .arc()
      .outerRadius(this.outerRadius)
      .innerRadius(
        this.innerRadius - (this.outerRadius - this.innerRadius) / 5
      );

    var pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return 1;
      });

    var arcGroup = main.select(".arc-group");
    if (arcGroup.empty()) {
      arcGroup = main.append("g").attr("class", "arc-group");
    }

    var arcs = arcGroup.selectAll(".arc").data(pie(data));

    data.forEach(d => {
      var arcsEnter = arcs
        .enter()
        .append("g")
        .attr("class", "arc");

      arcsEnter
        .append("path")
        .attr("class", "arc-color")
        .attr("d", arcFull)
        .style("fill", d => d.data.color);
      arcsEnter
        .append("path")
        .attr("d", arcDark)
        .style("fill", "rgba(0, 0, 0, 0.2)");

      var innerRadius = this.innerRadius;
      var outerRadius = this.outerRadius;

      arcsEnter
        .append("text")
        .attr("font-size", "1.5em")
        .attr("fill", "#000")
        .attr("transform", function(d) {
          var pos = arcLight.centroid(d);
          var midAngle =
            d.endAngle < Math.PI
              ? d.startAngle / 2 + d.endAngle / 2
              : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
          return (
            "translate(" +
            pos +
            ") rotate(-90) rotate(" +
            (midAngle * 180) / Math.PI +
            ")"
          );
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
          return d.data.name;
        });

      var timeout = null;
      var selectorPosition = this.selectorPosition;
      var rotationTimeMS = this.rotationTimeMS;
      var updateWithData = this.updateWithData;
      var rotateWheel = this.rotateWheel;
      var selector = this.node;
      var imgSize = this.imgSize;
      arcsEnter
        .append("path")
        .attr("d", arcFull)
        .attr("id", function(d) {
          return d.data.id;
        })
        .style("stroke", "#fff")
        .style("stroke-width", "3px")
        .style("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseover", function(d) {
          d3.select(this).style("fill", "rgba(255,255,255,0.2)");
        })
        .on("mouseout", function(d) {
          d3.select(this).style("fill", "transparent");
        })
        .on("spin_received", function(d) {
          d3.select(this).style("fill", "transparent");

          /* compute rotation angle to get the part under selector and rotate the wheel */
          var rotation = (d.startAngle + d.endAngle) / 2;
          rotation *= 360 / (2 * Math.PI);
          rotation -= selectorPosition;
          rotateWheel(
            rotation,
            true,
            selector,
            innerRadius,
            outerRadius,
            rotationTimeMS,
            imgSize
          );

          /* send selected event */
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(function() {
            timeout = null;
            updateWithData();
          }, rotationTimeMS);
        });
    });
    var selector = main.select("selector");
    if (selector.empty()) {
      selector = main.append("g").attr("class", "selector");
      selector
        .append("path")
        .attr(
          "d",
          `M0 ${-0.9 * this.radius} L ${this.radius / 20} ${-this.radius +
            2} L-${this.radius / 20} ${-this.radius + 2} Z`
        )
        .attr("transform", "rotate(" + this.selectorPosition + " 0 0)")
        .style({
          fill: "#000",
          stroke: "#fff",
          "stroke-width": "2px"
        });
    }
    var axle = main.select(".axle");
    if (axle.empty()) {
      axle = main.append("g").attr("class", "axle");
    }
    axle
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", this.innerRadius - 1)
      .style("fill", "#ccc");

    axle
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", this.innerRadius - 15);
    axle
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", this.innerRadius - 30)
      .style("fill", this.color);

    if (
      this.props.rootStore.gameStore.game.current_spin != null &&
      this.props.rootStore.gameStore.game.current_spin != ""
    ) {
      this.rotateToId(this.props.rootStore.gameStore.game.current_spin);
    }
  }

  rotateWheel(
    angle,
    transition,
    selector,
    innerRadius,
    outerRadius,
    rotationTimeMS,
    imgSize
  ) {
    var svg = d3.select(selector);
    var main = svg.select(".main");
    if (main.empty()) {
      return;
    }
    var arcGroup = main.select(".arc-group");
    if (arcGroup.empty()) {
      return;
    }
    var toTransform = arcGroup;
    if (transition != false) {
      toTransform = toTransform.transition().duration(rotationTimeMS);
    }

    var arcLight = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius - (outerRadius - innerRadius) / 5);

    toTransform.attr("transform", "rotate(" + -angle + ")");

    toTransform = arcGroup.selectAll("text");
    if (transition !== false) {
      toTransform = toTransform.transition().duration(rotationTimeMS);
    }

    toTransform.attr("transform", d => {
      var pos1 = arcLight.centroid(d);
      var midAngle =
        d.endAngle < Math.PI
          ? d.startAngle / 2 + d.endAngle / 2
          : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
      return `translate(${pos1}) rotate(-90) rotate(${(midAngle * 180) /
        Math.PI})`;
    });
  }

  updateWithData = function() {
    var svg = d3.select(this.node);
    var main = svg.select(".main");
    if (main.empty()) {
      return;
    }
    var arcGroup = main.select(".arc-group");
    if (arcGroup.empty()) {
      return;
    }
    var pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return 1;
      });
    var arcs = arcGroup.selectAll(".arc").data(pie(this.state.prizes));
    arcs
      .selectAll(".arc-color")
      .transition()
      .duration(300)
      .style("fill", function(d) {
        return d.data.color;
      });
    /* arc image depends on d.image */
    arcs.selectAll("image").attr("xlink:href", function(d) {
      return d.data.image || "";
    });
  };

  render() {
    if (
      this.props.rootStore.gameStore.game.current_spin != null &&
      this.state.mounted
    ) {
      this.rotateToId(this.props.rootStore.gameStore.game.current_spin);
    }
    return (
      <div style={{ marginRight: "25%", marginLeft: "auto" }}>
        <svg
          className={"d3-wheel"}
          ref={node => (this.node = node)}
          width={this.width}
          height={this.height}
        />
      </div>
    );
  }
}
