  // function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

let metaDataDisplay = d3.select('#sample-metadata');
function buildMetadata(sample) {
    d3.json(`metadata/${sample}`).then(data => {
        metaDataDisplay.html('');
        Object.entries(data).forEach(([key, value]) => {
            metaDataDisplay
                .append('p').text(`${key}: ${value}`)
                .append('hr');
        });
    });
}

// function buildCharts(sample) {

//   // @TODO: Use `d3.json` to fetch the sample data for the plots

//     // @TODO: Build a Bubble Chart using the sample data

//     // @TODO: Build a Pie Chart
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
// }
function createPie(data) {
  data.sort((a, b) => b.sample_value - a.sample_value);
  data = data.slice(0, 10);
  let sample_values = data.map(x => x.sample_value),
      ids = data.map(x => x.otu_id),
      labels = data.map(x => x.otu_label),
      plot_data = [{
          values: sample_values,
          labels: ids,
          text: labels,
          hoverinfo: 'labels',
          textinfo: 'percent',
          hole: 0.2,
          marker: {
              colors: ['#AA9B94', '#F09D84', '#F6C379', '#FADB7D', '#FEF498', '#E3EB95', '#BFDA9B', '#A0CD9B', '#7FBFB7', '#84D5E3']
          },
          type: 'pie'
      }],
      layout = {
          title: 'Button Life',
          plot_bgcolor: 'rgba(0, 0, 0, 0)',
          paper_bgcolor: 'rgba(0, 0, 0, 0)',
      };
  Plotly.newPlot('pie', plot_data, layout);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
