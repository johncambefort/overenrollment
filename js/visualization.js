// JS file that makes all the visualizations

// Initialize data to be bound with the stickfigures
//-------------------------------------------------
function dataCreation() {
  on_campus_dataset = [];
  off_campus_dataset = [];
  hacky_dataset = []

  for (let i = 0; i < 3000; i += 50) {
    let obj1 = { 
      id: i / 50, 
      color: null,
      onscreen: false,
      grad: false
    };
    on_campus_dataset.push(obj1);
  }

  for (let i = 0; i < 3000; i += 50) {
    let obj2 = { 
      id: i / 50, 
      color: null,
      onscreen: false,
      grad: false
    };
    off_campus_dataset.push(obj2);
  }

  for (let i = 0; i < 1000; i += 50) {
    let obj3 = { 
      id: i / 50, 
      color: null,
      onscreen: false,
      grad: false
    };
    hacky_dataset.push(obj3);
  }

  return [on_campus_dataset, off_campus_dataset, hacky_dataset];
}

//-------------------------------------------------------------------------

// Generates a stick figure centered at coordinates (x, y)
create_person = (g) => {
  const x = 0;
  const y = 0;
  const scale = 0.8;

  g.attr("class", "person");

  g.append("circle")
    .attr("cx", x * scale)
    .attr("cy", (y - 20 ) * scale)
    .attr("r", 10 * scale)
    .style("fill", "none")
    .style("stroke-width", 5 * scale);

  g.append("line")
    .attr("x1", x * scale)
    .attr("x2", x * scale)
    .attr("y1", (y - 10) * scale)
    .attr("y2", (y + 10) * scale)
    .style("stroke-width", 5 * scale);

  g.append("line")
    .attr("x1", x * scale)
    .attr("x2", (x + 15) * scale)
    .attr("y1", y * scale)
    .attr("y2", (y - 10) * scale)
    .style("stroke-width", 5 * scale);

  g.append("line")
    .attr("x1", x * scale)
    .attr("x2", (x - 15) * scale)
    .attr("y1", y * scale)
    .attr("y2", (y - 10) * scale)
    .style("stroke-width", 5 * scale);

  g.append("line")
    .attr("x1", x * scale)
    .attr("x2", (x + 10) * scale)
    .attr("y1", (y + 10) * scale)
    .attr("y2", (y + 30) * scale)
    .style("stroke-width", 5 * scale);

  g.append("line")
    .attr("x1", x * scale)
    .attr("x2", (x - 10) * scale)
    .attr("y1", (y + 10) * scale)
    .attr("y2", (y + 30) * scale)
    .style("stroke-width", 5 * scale);
   
}

// Makes the box to outline typical campus capacity (2500)
function make_box(svg, top, width, height, margins, stroke) {
  let box = svg.append("g").attr("opacity", 0);
  // let box = svg.append("g").attr("opacity", 1).attr("stroke", "black");

  box // top line
    .append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", top)
    .attr("y2", top)
    .style("stroke", "black")
    .style("stroke-width", stroke);

    
  box // right-down line
    .append("line")
    .attr("x1", width)
    .attr("x2", width)
    .attr("y1", top)
    .attr("y2", height - 68)
    .style("stroke", "black")
    .style("stroke-width", stroke);


  box // bottom right line
    .append("line")
    .attr("x1", width)
    .attr("x2", 95)
    .attr("y1", height - 68)
    .attr("y2", height - 68)
    .style("stroke", "black")
    .style("stroke-width", stroke);
    // .attr("lineWidth", stroke);

  box // small down right line
    .append("line")
    .attr("x1", 95)
    .attr("x2", 95)
    .attr("y1", height - 68)
    .attr("y2", height)
    .style("stroke", "black")
    .style("stroke-width", stroke);


  box // small bottom-most line
    .append("line")
    .attr("x1", 95)
    .attr("x2", 0)
    .attr("y1", height)
    .attr("y2", height)
    .style("stroke", "black")
    .style("stroke-width", stroke);

  box // left line
    .append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", height)
    .attr("y2", top)
    .style("stroke", "black")
    .style("stroke-width", stroke);

  return box;
}

// Main function
async function manageVisualizations() {
  const width = 500;
  const height = 500;
  const timelineHeight = height - 150;
  const timelineWidth = 200;
  const margins = { left: 10, top: 20, right: 30, bottom: 20, padding: 2.3 * height / 12 }
  
  const offCampusHeight = 2 * height / 12;
  const onCampusHeight = 6 * height / 12;
  
  const colors = { default: "#1F78B4", abroad: "#B80C09", remote: "#33A02C", time_off: "#83BAD8", loa: "#8BCF4F", grad: "#682D63" };
  const speed = 500; // for animations
  
  // Load in our data
  const data = await d3.json("data/enrollment_data.json");
  let [ on_campus_dataset, off_campus_dataset, hacky_dataset ] = dataCreation(); // generate 'fake' data to represent each stickfigure

  // Create the SVG (our canvas)
  const svg = d3
    .select("#vis")
    .append("svg")
    .attr("viewbox", [0, 0, width, height])
    .style("height", `${height}px`)
    .style("width", `${width}px`);

  const svg_timeline = d3
    .select("#timeline")
    .append("svg")
    .attr("viewbox", [0, 0, timelineWidth, timelineHeight])
    .style("height", `${timelineHeight}px`)
    .style("width", `${timelineWidth}px`);

  const graphLabel = d3
    .select("#timeline")
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "24px");

  graphLabel.text("1 stick-figure = 50 students");

  const onCampusTextNumber = d3
    .select("#timeline")
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "24px")
    .text(`On Campus: `)
    .append("text");

  const offCampusTextNumber = d3
    .select("#timeline")
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "24px")
    .text(`Off Campus: `)
    .append("text");


  const innerOnCampusGraph = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

  const innerOffCampusGraph = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${height - margins.bottom - offCampusHeight})`);

  const hackyOffCampusGraph = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${height + 1000})`);

  // Make scales for both graphs
  const xOnCampus = d3
    .scaleLinear()
    .range([margins.left, width - margins.right])
    .domain([0, 9]); // 10 columns

  const yOnCampus = d3
    .scaleLinear()
    .range([margins.top, height - margins.bottom - offCampusHeight - margins.padding])
    .domain([0, 5]); // 6 rows

    // Returns next available index
  function update_data(dataset, num_student, id, color, onscreen, grad) {
    let figures = num_student / 50;

    let end_index = figures + id;

    // update contiguous stickfigures as of that index
    for (let i = id; i < end_index; i++) {
      dataset[i].color = color;
      dataset[i].onscreen = onscreen;
      dataset[i].grad = grad;
    }
    
    return Math.round(end_index); // for this purpose, just round up or down
  }

  // Iterates from the index given until the end of that dataset and sets attribute onscreen to false
  function remove_offscreen(dataset, index) {
    for (let i = index; i < dataset.length; i++) {
      dataset[i].onscreen = false; 
    }
  }

  function update_visualization(graphElement, dataset) {

    graphElement
      .selectAll(".person")
      .data(dataset, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("g")
            .style("stroke", (d) => d.color)
            .attr("transform", function (d) {
              let x_trans = xOnCampus(d.id % 10);
              let y_trans = yOnCampus(Math.trunc(d.id / 10));
              return `translate(${x_trans}, ${y_trans})`;
            })
            .each(function (d, i) {
              create_person(d3.select(this));
            })
            .call((enter) =>
              enter
                .transition()
                .duration(speed)
                .attr("opacity", (d) => (d.onscreen ? 1 : 0))
            ),

        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(speed)
              .attr("opacity", (d) => (d.onscreen ? 1 : 0))
              .style("stroke", (d) => d.color)
          ),
        (exit) => exit
      );

  }
  
  // Make the box showing typical campus make capacity, with opacity set to 0
  const box = make_box(svg, 10, width, 360, margins, 3);

  // Initialize useful people indices
  let index_ons21;
  let index_offs21;
  
  // Detect changes in scroll
  const scroll = scroller();
  scroll(d3.selectAll(".step"));
  scroll.on("step-change", (step) => {
    console.log(step); // helpful for debugging
    switch (step) {
      case 0:
        box.transition().duration(speed).attr("opacity", 0);
        
        // show campus on a typical year, with study abroad people
        graphLabel.text("1 stick-figure = 50 students");
        onCampusTextNumber
          .text(`${data["pop_f18"]}`)
          .style("color", colors.default);
        offCampusTextNumber.text("300").style("color", colors.abroad);

        let index_on = update_data(
          on_campus_dataset,
          2580,
          0,
          colors.default,
          true,
          false
        ); // add default on-campus students

        let index_off = update_data(
          off_campus_dataset,
          300,
          0,
          colors.abroad,
          true
        ); // color study abroad folks

        remove_offscreen(on_campus_dataset, index_on);
        remove_offscreen(off_campus_dataset, index_off);

        update_visualization(innerOnCampusGraph, on_campus_dataset);
        update_visualization(innerOffCampusGraph, off_campus_dataset);

        break;

      case 1: // introduce the box
        box.transition().duration(speed).attr("opacity", 1);
        graphLabel.text("1 stick-figure = 50 students");
        onCampusTextNumber
          .text(`${data["pop_f18"]}`)
          .style("color", colors.default);
        offCampusTextNumber.text("300").style("color", colors.abroad);

        let step2_index_on = update_data(
          on_campus_dataset,
          2580,
          0,
          colors.default,
          true,
          false
        ); // add default on-campus students

        let step2_index_off = update_data(
          off_campus_dataset,
          300,
          0,
          colors.abroad,
          true
        ); // color study abroad folks

        remove_offscreen(on_campus_dataset, step2_index_on);
        remove_offscreen(off_campus_dataset, step2_index_off);

        update_visualization(innerOnCampusGraph, on_campus_dataset);
        update_visualization(innerOffCampusGraph, off_campus_dataset);
        break;

      case 2:
        // fast forward to spring 2021 -- show on-campus & remote students
        graphLabel.text("1 stick-figure = 50 students");
        onCampusTextNumber
          .text(`${data["pop_in_person_s21"]}`)
          .style("color", colors.default);
        offCampusTextNumber
          .text(`${data["pop_remote_s21"]}`)
          .style("color", colors.remote);

        index_ons21 = update_data(
          on_campus_dataset,
          data["pop_in_person_s21"],
          0,
          colors.default,
          true,
          false
        ); // add default on-campus students

        index_offs21 = update_data(
          off_campus_dataset,
          data["pop_remote_s21"],
          0,
          colors.remote,
          true
        ); // remote students

        remove_offscreen(on_campus_dataset, index_ons21);
        remove_offscreen(off_campus_dataset, index_offs21);

        update_visualization(innerOnCampusGraph, on_campus_dataset);
        update_visualization(innerOffCampusGraph, off_campus_dataset);

        break;

      case 3: // Spring 2021 -- add loa and time_off students
        box.transition().duration(speed).attr("opacity", 1);
        graphLabel.text("1 stick-figure = 50 students");
        onCampusTextNumber
          .text(`${data["pop_in_person_s21"]}`)
          .style("color", colors.default);
        offCampusTextNumber
          .text(`${data["pop_remote_s21"] + data["time_off"] + data["loa"]}`)
          .style("color", "black"); // back to black?

        hackyOffCampusGraph
          .transition()
          .duration(3 * speed)
          .ease(d3.easeLinear)
          .attr("transform", `translate(${margins.left}, ${height + 1000})`);

        innerOffCampusGraph
          .transition()
          .duration(speed)
          .ease(d3.easeCubicInOut)
          .attr("transform", `translate(${margins.left}, ${height - margins.bottom - offCampusHeight})`);


        index_ons21 = update_data(
          on_campus_dataset,
          data["pop_in_person_s21"],
          0,
          colors.default,
          true,
          false
        ); // add default on-campus students

        index_offs21 = update_data(
          off_campus_dataset,
          data["pop_remote_s21"],
          0,
          colors.remote,
          true,
          false
        ); // remote students

        let localind1 = update_data(
          off_campus_dataset,
          data["loa"],
          index_offs21,
          colors.loa,
          true,
          false
        ); // LOA students

        let localind2 = update_data(
          off_campus_dataset,
          data["time_off"],
          localind1,
          colors.time_off,
          true,
          false
        ); // Time off students

        let localind3 = update_data(
          off_campus_dataset,
          data["abroad_s21"],
          localind2,
          colors.abroad,
          true,
          false
        ); // Abroad students

        remove_offscreen(on_campus_dataset, index_ons21);
        remove_offscreen(off_campus_dataset, localind3);

        update_visualization(innerOnCampusGraph, on_campus_dataset);
        update_visualization(innerOffCampusGraph, off_campus_dataset);

        break;

      case 4: // just move around the different g's
        box.transition().duration(speed).attr("opacity", 1);
        graphLabel.text("1 stick-figure = 50 students");
        onCampusTextNumber
          .text(`${data["pop_f21"]}`)
          .style("color", colors.default);
        offCampusTextNumber
          .text(`${data["abroad_f21"]}`)
          .style("color", colors.abroad);

        update_data(hacky_dataset, data["abroad_f21"], 0, colors.abroad, true);

        let step4_index_onf21 = update_data(
          on_campus_dataset,
          data["pop_in_person_s21"],
          0,
          colors.default,
          true,
          false
        ); // add default on-campus students

        // We're going to do something slightly hacky: move the off campus g to right under the on campus g
        // that'll give the impression that we're taking the people off campus and putting them on campus.
        // We'll replace the initial off_campus graph g with a third new g that will include study abroad students.
        let step4_index_onf21_1 = update_data(
          off_campus_dataset,
          data["pop_remote_s21"],
          0,
          colors.default, // we'll give the formerly-remote students the default color now
          true,
          false
        );

        let step4_index_onf21_2 = update_data(
          off_campus_dataset,
          data["loa"],
          step4_index_onf21_1,
          colors.loa,
          true,
          false
        );

        let step4_index_onf21_3 = update_data(
          off_campus_dataset,
          data["time_off"],
          step4_index_onf21_2,
          colors.time_off,
          true,
          false
        );

        remove_offscreen(on_campus_dataset, step4_index_onf21);
        remove_offscreen(off_campus_dataset, step4_index_onf21_3);

        update_visualization(innerOnCampusGraph, on_campus_dataset);
        update_visualization(innerOffCampusGraph, off_campus_dataset);
        update_visualization(hackyOffCampusGraph, hacky_dataset);

        // we'll move the g's here, after the data has been appended / created

        innerOffCampusGraph
          .transition()
          .delay(2 * speed)
          .duration(3 * speed)
          .ease(d3.easeCubicInOut)
          .attr("transform", `translate(${margins.left}, ${margins.top + 5.4 * height / 12})`);

        hackyOffCampusGraph
          .transition()
          .delay(2 * speed)
          .duration(3 * speed)
          .ease(d3.easeCubicInOut)
          .attr("transform", `translate(${margins.left}, ${height - margins.bottom - offCampusHeight})`);

        break;

      case 5:
        box.transition().duration(speed).attr("opacity", 1);
        graphLabel.text("1 stick-figure = 50 students");
        onCampusTextNumber
          .text(`${data["pop_f21"]}`)
          .style("color", colors.default);
        offCampusTextNumber
          .text(`${data["abroad_f21"]}`)
          .style("color", colors.abroad);

        update_data(hacky_dataset, data["abroad_f21"], 0, colors.abroad, true);

        innerOffCampusGraph
          .attr("transform", `translate(${margins.left}, ${margins.top + 5.4 * height / 12})`);

        hackyOffCampusGraph
          .attr("transform", `translate(${margins.left}, ${height - margins.bottom - offCampusHeight})`);

        let step5_index_onf21 = update_data(
          on_campus_dataset,
          data["pop_in_person_s21"],
          0,
          colors.default,
          true,
          false
        ); // add default on-campus students

        // We're going to do something slightly hacky: move the off campus g to right under the on campus g
        // that'll give the impression that we're taking the people off campus and putting them on campus.
        // We'll replace the initial off_campus graph g with a third new g that will include study abroad students.
        let step5_index_onf21_1 = update_data(
          off_campus_dataset,
          data["pop_remote_s21"],
          0,
          colors.default, // we'll give the formerly-remote students the default color now
          true,
          false
        );

        let step5_index_onf21_2 = update_data(
          off_campus_dataset,
          data["loa"],
          step5_index_onf21_1,
          colors.loa,
          true,
          false
        );

        let step5_index_onf21_3 = update_data(
          off_campus_dataset,
          data["time_off"],
          step5_index_onf21_2,
          colors.time_off,
          true,
          false
        );

        remove_offscreen(on_campus_dataset, step5_index_onf21);
        remove_offscreen(off_campus_dataset, step5_index_onf21_3);

        update_visualization(innerOnCampusGraph, on_campus_dataset);
        update_visualization(innerOffCampusGraph, off_campus_dataset);
        update_visualization(hackyOffCampusGraph, hacky_dataset);

        break;

      default:
        console.log("something is going wrong");
    }
  });
}

manageVisualizations();