// @ts-nocheck


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree
export function Tree(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
  path = null, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
  parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
  children = undefined, // if hierarchical data, given a d in data, returns its children
  tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
  sort = null, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
  label, // given a node d, returns the display name
  title, // given a node d, returns its hover text
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links (if any)
  width = 640, // outer width, in pixels
  height = undefined, // outer height, in pixels
  r = 5, // radius of nodes
  padding = 1, // horizontal padding for first and last column
  fill = "#999", // fill for nodes
  stroke = "#555", // stroke for links
  strokeWidth = 1.5, // stroke width for links
  strokeOpacity = 0.4, // stroke opacity for links
  strokeLinejoin = undefined, // stroke line join for links
  strokeLinecap = undefined, // stroke line cap for links
  halo = "#fff", // color of label halo
  haloWidth = 3, // padding around the labels
  curve = d3.curveBumpX, // curve for the link
} = {}) {

  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  const root = path !== null ? d3.stratify().path(path)(data)
    : id !== null || parentId !== null ? d3.stratify().id(id).parentId(parentId)(data)
      : d3.hierarchy(data, children);

  // Sort the nodes.
  if (sort !== null) {
    root.sort(sort);
  }

  // Compute labels and titles.
  const descendants = root.descendants();
  const LABELS = label === null ? null : descendants.map(d => label(d.data, d));

  // Compute the layout.
  const dx = 25; // line height
  const dy = width / (root.height + padding);
  tree().nodeSize([dx, dy])(root);

  // Center the tree.
  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) {
      x1 = d.x;
    }
    if (d.x < x0) {
      x0 = d.x;
    }
  });

  // Compute the default height.
  if (height === undefined) {
    height = x1 - x0 + dx * 2;
  }

  // Use the required curve
  if (typeof curve !== "function") {
    throw new Error(`tree.js: Unsupported curve`);
  }

  const svg = d3.create("svg")
    .attr("viewBox", [-dy * padding / 2, x0 - dx, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("class", "lock-tree");

  // connections
  svg.append("g")
    .attr('class', 'node-link')
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-width", strokeWidth)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", d3.link(curve)
      .x(d => d.y)
      .y(d => d.x));

  // nodes
  const node = svg.append("g")
    .selectAll("a")
    .data(root.descendants())
    .join("a")
    .attr('class', 'node')
    .attr("xlink:href", link === null ? null : d => link(d.data, d))
    .attr("target", link === null ? null : linkTarget)
    .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
    .attr('class', 'node-circle')
    .attr("fill", d => d.children ? stroke : fill)
    .attr("r", r);

  if (title !== null) {
    node.append("title")
      .text(d => title(d.data, d));
  }

  const marginCircleToText = 8;
  if (LABELS) {
    node.append("text")
      .attr("class", "node-label")
      .attr("dy", "0.32em")
      .attr("x", d => d.children ? -marginCircleToText : marginCircleToText)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("paint-order", "stroke")
      .attr("stroke", halo)
      .attr("stroke-width", haloWidth)
      .text((d, i) => LABELS[i]);
  }

  return svg.node();
}
