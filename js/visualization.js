// JS file that makes all the visualizations

// Data creation
//-------------------------------------------------
function dataCreation(data) {
  dataset = [];

  for (let i = 0; i < 4000; i += 50) {
    obj = { 
      id: i / 50, 
      max_student: i, 
      color: "#785EF0", // a shade of purple/indigo used as defauly
      onscreen: false,
      loa: false,
      time_off: false
    };
    dataset.push(obj);
  }

  return dataset;
}

//-------------------------------------------------------------------------

// Generates a stick figure centered at coordinates (x, y)
create_person = (g) => {
  const x = 0;
  const y = 0;

  g.attr("class", "person");

  g.append("circle")
    .attr("cx", x)
    .attr("cy", y - 20)
    .attr("r", 10)
    .style("fill", "none")
    .style("stroke-width", "5");

  g.append("line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", y - 10)
    .attr("y2", y + 10)
    .style("stroke-width", "5");

  g.append("line")
    .attr("x1", x)
    .attr("x2", x + 15)
    .attr("y1", y)
    .attr("y2", y - 10)
    .style("stroke-width", "5");

  g.append("line")
    .attr("x1", x)
    .attr("x2", x - 15)
    .attr("y1", y)
    .attr("y2", y - 10)
    .style("stroke-width", "5");

  g.append("line")
    .attr("x1", x)
    .attr("x2", x + 10)
    .attr("y1", y + 10)
    .attr("y2", y + 30)
    .style("stroke-width", "5");

  g.append("line")
    .attr("x1", x)
    .attr("x2", x - 10)
    .attr("y1", y + 10)
    .attr("y2", y + 30)
    .style("stroke-width", "5");
   
}

// Makes the box to outline typical campus capacity (2500)
function make_box(svg) {
  let box = svg.append("g").attr("opacity", 0).attr("stroke", "#002f6c");

  box
    .append("line")
    .attr("x1", 10)
    .attr("x2", 690)
    .attr("y1", 10)
    .attr("y2", 10)
    .style("stroke", "black")
    .style("stroke-width", "2");

  box
    .append("line")
    .attr("x1", 690)
    .attr("x2", 690)
    .attr("y1", 10)
    .attr("y2", 430)
    .style("stroke", "black")
    .style("stroke-width", "2");

  box
    .append("line")
    .attr("x1", 690)
    .attr("x2", 150)
    .attr("y1", 430)
    .attr("y2", 430)
    .style("stroke", "black")
    .style("stroke-width", "2");

  box
    .append("line")
    .attr("x1", 150)
    .attr("x2", 150)
    .attr("y1", 430)
    .attr("y2", 510)
    .style("stroke", "black")
    .style("stroke-width", "2");

  box
    .append("line")
    .attr("x1", 150)
    .attr("x2", 10)
    .attr("y1", 510)
    .attr("y2", 510)
    .style("stroke", "black")
    .style("stroke-width", "2");

  box
    .append("line")
    .attr("x1", 10)
    .attr("x2", 10)
    .attr("y1", 510)
    .attr("y2", 10)
    .style("stroke", "black")
    .style("stroke-width", "2");

  return box;
}

// Main function
async function manageVisualizations() {
  const width = 700;
  const height = 600;
  const speed = 500;

  // Load in our data
  const data = await d3.json("data/enrollment_data.json");
  const dataset = dataCreation(data);

  const title = d3
    .select("#vis")
    .append("text")
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "24px")
    .attr("x", width / 2)
    .attr("y", 0)

  // Create the SVG (our canvas)
  const svg = d3
    .select("#vis")
    .append("svg")
    .attr("viewbox", [0, 0, width, height])
    .style("height", `${height}px`)
    .style("width", `${width}px`);


  // Make scales
  const x = d3
    .scaleLinear()
    .range([50, width - 50])
    .domain([0, 9]);

  const y = d3
    .scaleLinear()
    .range([50, height - 50])
    .domain([0,6]); // we want 7 rows

  // Returns next available index
  function update_data(num_student, id, color, abroad, remote, onscreen, loa, time_off) {
    let figures = num_student / 50;

    let end_index = figures + id;

    // update contiguous stickfigures as of that index
    for (let i = id; i < end_index; i++) {
      dataset[i].color = color;
      dataset[i].abroad = abroad;
      dataset[i].remote = remote;
      dataset[i].onscreen = onscreen;
      dataset[i].loa = loa;
      dataset[i].time_off = time_off;
    }
    
    return Math.round(end_index); // for this purpose, just round up or down
  }
  
  // Make the box showing typical campus make capacity, with opacity set to 0
  const box = make_box(svg);

  // Make a function to avoid redundancy
  function update_visualization(svg, dataset) {
    svg
      .selectAll(".person")
      .data(dataset, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("g")
            .style("stroke", (d) => d.color)
            .attr("transform", function(d) {
              const x_trans = x(d.id % 10);
              const y_trans = y(Math.trunc(d.id / 10));
              return `translate(${x_trans}, ${y_trans})`;
            })
            .each(function(d,i) {
              create_person(d3.select(this))
            })
            .call((enter) => enter.transition().duration(speed).attr("opacity", (d) => d.onscreen ? 1 : 0)),
        (update) => 
          update
            .call((update) => 
              update.
                transition()
                .duration(speed)
                .attr("opacity", (d) => d.onscreen ? 1 : 0)
                .style("stroke", (d) => d.color)
            ),
        (exit) => 
            (exit)
      );

  };
   //declare index 6-8 since we need them in multiple cases
   let index3;
   let index6;
   let index7;
   let index8;
  
  // Detect changes in scroll
  const scroll = scroller();
  scroll(d3.selectAll(".step"));
  scroll.on("step-change", (step) => {
    console.log(step); // helpful for debugging
    switch (step) {
     
      case 0:
        box.transition().duration(speed).attr("opacity", 0);
        title.text("'Typical' Pre-2020 Semester");

        // The purple people
        let index = update_data(2580, 0, "#785EF0", false, false, true);
        update_data(dataset.length * 50 - 2600, index, "", false, false, false); // anyone else should be removed

        // Update the visualization given the data
        update_visualization(svg, dataset);

        break;

      case 1: // show first year class size
        box.transition().duration(speed).attr("opacity", 0);

        let first_year_regs = data["first_f18"]; //update_data(fy21, index15, "#18256D", false, false, true); // show febs
        let first_year_febs = data["feb_s19"];
        
        // slightly smaller feb class size in s18 (107) than s19 (144) -- aftermath of charles murray?
        let regs_index = update_data(first_year_regs, 0, "#FFB000", false, false, true); // show regs
        let febs_index = update_data(first_year_febs, regs_index, "#0840FF", false, false, true); // show febs
        update_data(2580 - first_year_regs - first_year_febs, febs_index, "#785EF0", false, false, true);

        update_visualization(svg, dataset);

        break;

      case 2:
        title.text("'Typical' Pre-2020 Semester");
        box.transition().duration(speed).attr("opacity", 1);
        
        break;

      case 3: // Show study abroad students. Keep the box as that makes somewhat sense.
        
        box.transition().duration(speed).attr("opacity", 1);
        title.text("'Typical' Pre-2020 Semester");

        let new_index = update_data(2580, 0, "#785EF0", false, false, true); // color only by purple people again
        update_data(300, new_index, "#DC267F", true, false, true); // color study abroad folks

        // Show students studying abroad on a given year
        svg
          .selectAll(".person")
          .data(dataset, (d) => d.id)
          .join(
            (enter) => 
            enter
              .append("g")
              .style("stroke", (d) => d.color)
              .attr("transform", function(d) {
                const x_trans = x(d.id % 10);
                const y_trans = y(Math.trunc(d.id / 10));
                return `translate(${x_trans}, ${y_trans})`;
              })
              .each(function(d,i) {
                create_person(d3.select(this))
              })
              .call((enter) => enter.transition().duration(speed).attr("opacity", (d) => d.onscreen ? 1 : 0)),
            (update) => 
              update
                .call((update) => 
                  update.
                    transition()
                    .duration(speed)
                    .attr("opacity", (d) => d.onscreen ? 1 : 0)
                    .style("stroke", d => d.abroad ? "#DC267F" : "#785EF0")
                ),
            (exit) => 
                (exit)
          );

        break;
        

      case 4: // now let's show on-campus vs. remote students in spring 2021
        // box goes away 
        box.transition().duration(speed).attr("opacity", 0);
        title.text("Spring 2021");

        index3 = update_data(data["pop_in_person_s21"], 0, "#785EF0", false, false, true);
        let index4 = update_data(data["pop_remote_s21"], index3, "#FE6100", false, true, true);
        console.log(dataset);

        update_data(dataset.length * 50 - data["pop_s21"] - 20, index4, "", false, false, false);

        update_visualization(svg, dataset);

        break;

      case 5: // let's show spring 2021 study abroad students, LOA and time_off students
        title.text("Spring 2021");

        index3 = update_data(data["pop_in_person_s21"], 0, "#785EF0", false, false, true);
        index6 = update_data(data["pop_remote_s21"], index3, "#FE6100", false, true, true);
        update_data(dataset.length * 50 - data["pop_s21"] - 50, index6, "", false, false, false); // remove people

        index7 = update_data(data["abroad_s21"], index6, "#DC267F", true, false, true); // show study abroad
        index8 = update_data(data["loa"], index7, "#5AB1BB", true, false, true, true); // show loa
        update_data(data["time_off"], index8, "#A5C882", true, false, true, false, true); // show time off

        update_visualization(svg, dataset);

        break;

      case 6: // fade out the abroad / loa / time_off people
        title.text("Spring 2021");
        box.transition().duration(speed).attr("opacity", 0);

        // Anyone not on campus should get color gray and should be made slightly opaque
        index3 = update_data(data["pop_in_person_s21"], 0, "#785EF0", false, false, true);
        index6 = update_data(data["pop_remote_s21"], index3, "gray", false, true, true);
        update_data(dataset.length * 50 - data["pop_s21"] - 50, index6, "", false, false, false); // remove people
        index7 = update_data(data["abroad_s21"], index6, "gray", true, false, true);
        index8 = update_data(data["loa"], index7, "gray", true, false, true, true);
        update_data(data["time_off"], index8, "gray", true, false, true, false, true);

        svg
          .selectAll(".person")
          .data(dataset, (d) => d.id)
          .join(
            (enter) => 
            enter
              .append("g")
              .style("stroke", (d) => d.color)
              .attr("transform", function(d) {
                const x_trans = x(d.id % 10);
                const y_trans = y(Math.trunc(d.id / 10));
                return `translate(${x_trans}, ${y_trans})`;
              })
              .each(function(d,i) {
                create_person(d3.select(this))
              })
              .call((enter) => 
                enter
                  .transition()
                  .duration(speed)
                  .attr("opacity", function(d) {
                    if(d.color === "gray") { return 0.3; }
                    else if (d.onscreen) { return 1; }
                    else { return 0; }
                  })
                ),
            (update) => 
              update
                .call((update) =>
                  update.
                    transition()
                    .duration(speed)
                    .attr("opacity", function(d) {
                      if(d.color === "gray") { return 0.3; }
                      else if (d.onscreen) { return 1; }
                      else { return 0; }
                    })
                    .style("stroke", (d) => d.color)
                ),
            (exit) =>
                (exit)
          );

          break;
      
        case 7: // show the box stand-alone again
          title.text("")
          box.transition().duration(speed).attr("opacity", 1);
          update_data(3000, 0, "", false, false, false); // remove people
          update_visualization(svg, dataset)
          
          break;

        case 8: // fall 2021: just color by all the different parties
          box.transition().duration(speed).attr("opacity", 1);
          title.text("Fall 2021")

          let index_local_1 = update_data(data["pop_f21"], 0, "green", false, false, true); //temp color
          update_data(dataset.length * 50 - data["pop_f21"] - 50, index_local_1, "", false, false, false); // remove anyone else

          update_visualization(svg, dataset);
          
          break;

        case 9: 
          box.transition().duration(speed).attr("opacity", 1);
          title.text("Fall 2021")
          let fy_regs_21 = data["first_f21"];
          
          update_data(data["pop_f21"], 0, "green", false, false, true); // color in all standard students
          let index_regs = update_data(fy_regs_21, 0, "#FFB000", false, false, true); // regs 
          update_data(data["time_off"], index_regs, "#A5C882", true, false, true, true); // 1st years who deferred

          let next_ind = Math.round((data["pop_f21"] - data["loa"]) / 50);
          let index16 = update_data(data["loa"], next_ind, "#5AB1BB", true, false, true, false, true);
          update_data(dataset.length * 50 - data["pop_f21"], index16, "", false, false, false); // remove anyone else
          
          update_visualization(svg, dataset);
          
          break; // wait wait wait: are the 75 deferrals included in the 680 first-year students? Or are those figures separate?

        case 10:
          box.transition().duration(speed).attr("opacity", 1);
          title.text("They don't fit on campus");
          
          break;
          
      default:
        console.log("something is going wrong");
    }
  });
}

manageVisualizations();
