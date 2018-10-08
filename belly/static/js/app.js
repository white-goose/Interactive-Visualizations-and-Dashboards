  // function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

// let metaDataDisplay = d3.select('#sample-metadata');
// function buildMetadata(sample) {
//     d3.json(`metadata/${sample}`).then(data => {
//         metaDataDisplay.html('');
//         Object.entries(data).forEach(([key, value]) => {
//             metaDataDisplay
//                 .append('p').text(`${key}: ${value}`)
//                 .append('hr');
//         });
//     });
// }

// function buildCharts(sample) {

//   // @TODO: Use `d3.json` to fetch the sample data for the plots

//     // @TODO: Build a Bubble Chart using the sample data

//     // @TODO: Build a Pie Chart
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
// }
// function createPie(data) {
//   data.sort((a, b) => b.sample_value - a.sample_value);
//   data = data.slice(0, 10);
//   let sample_values = data.map(x => x.sample_value),
//       ids = data.map(x => x.otu_id),
//       labels = data.map(x => x.otu_label),
//       plot_data = [{
//           values: sample_values,
//           labels: ids,
//           text: labels,
//           hoverinfo: 'labels',
//           textinfo: 'percent',
//           hole: 0.2,
//           marker: {
//               colors: ['#AA9B94', '#F09D84', '#F6C379', '#FADB7D', '#FEF498', '#E3EB95', '#BFDA9B', '#A0CD9B', '#7FBFB7', '#84D5E3']
//           },
//           type: 'pie'
//       }],
//       layout = {
//           title: 'Button Life',
//           plot_bgcolor: 'rgba(0, 0, 0, 0)',
//           paper_bgcolor: 'rgba(0, 0, 0, 0)',
//       };
//   Plotly.newPlot('pie', plot_data, layout);
// }

// function init() {
//   // Grab a reference to the dropdown select element
//   var selector = d3.select("#selDataset");

//   // Use the list of sample names to populate the select options
//   d3.json("/names").then((sampleNames) => {
//     sampleNames.forEach((sample) => {
//       selector
//         .append("option")
//         .text(sample)
//         .property("value", sample);
//     });

//     // Use the first sample from the list to build the initial plots
//     const firstSample = sampleNames[0];
//     buildCharts(firstSample);
//     buildMetadata(firstSample);
//   });
// }

// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
// }

// // Initialize the dashboard
// init();

function updateMetaData(data) {
  // Reference to Panel element for sample metadata
  var PANEL = document.getElementById("sample-metadata");
  // Clear any existing metadata
  PANEL.innerHTML = '';
  // Loop through all of the keys in the json response and
  // create new metadata tags
  for(var key in data) {
      h6tag = document.createElement("h6");
      h6Text = document.createTextNode(`${key}: ${data[key]}`);
      h6tag.append(h6Text);
      PANEL.appendChild(h6tag);
  }
}
function buildCharts(sampleData, otuData) {
  // Loop through sample data and find the OTU Taxonomic Name
  var labels = sampleData[0]['otu_ids'].map(function(item) {
      return otuData[item]
  });
  // Build Bubble Chart
  var bubbleLayout = {
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' }
  };
  var bubbleData = [{
      x: sampleData[0]['otu_ids'],
      y: sampleData[0]['sample_values'],
      text: labels,
      mode: 'markers',
      marker: {
          size: sampleData[0]['sample_values'],
          color: sampleData[0]['otu_ids'],
          colorscale: "Earth",
      }
  }];
  var BUBBLE = document.getElementById('bubble');
  Plotly.plot(BUBBLE, bubbleData, bubbleLayout);
  // Build Pie Chart
  console.log(sampleData[0]['sample_values'].slice(0, 10))
  var pieData = [{
      values: sampleData[0]['sample_values'].slice(0, 10),
      labels: sampleData[0]['otu_ids'].slice(0, 10),
      hovertext: labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
  }];
  var pieLayout = {
      margin: { t: 0, l: 0 }
  };
  var PIE = document.getElementById('pie');
  Plotly.plot(PIE, pieData, pieLayout);
};
function updateCharts(sampleData, otuData) {
  var sampleValues = sampleData[0]['sample_values'];
  var otuIDs = sampleData[0]['otu_ids'];
  // Return the OTU Description for each otuID in the dataset
  var labels = otuIDs.map(function(item) {
      return otuData[item]
  });
  // Update the Bubble Chart with the new data
  var BUBBLE = document.getElementById('bubble');
  Plotly.restyle(BUBBLE, 'x', [otuIDs]);
  Plotly.restyle(BUBBLE, 'y', [sampleValues]);
  Plotly.restyle(BUBBLE, 'text', [labels]);
  Plotly.restyle(BUBBLE, 'marker.size', [sampleValues]);
  Plotly.restyle(BUBBLE, 'marker.color', [otuIDs]);
  // Update the Pie Chart with the new data
  // Use slice to select only the top 10 OTUs for the pie chart
  var PIE = document.getElementById('pie');
  var pieUpdate = {
      values: [sampleValues.slice(0, 10)],
      labels: [otuIDs.slice(0, 10)],
      hovertext: [labels.slice(0, 10)],
      hoverinfo: 'hovertext',
      type: 'pie'
  };
  Plotly.restyle(PIE, pieUpdate);
}
function getData(sample, callback) {
  // Use a request to grab the json data needed for all charts
  Plotly.d3.json(`/samples/${sample}`, function(error, sampleData) {
      if (error) return console.warn(error);
      Plotly.d3.json('/otu', function(error, otuData) {
          if (error) return console.warn(error);
          callback(sampleData, otuData);
      });
  });
  Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
      if (error) return console.warn(error);
      updateMetaData(metaData);
  })
  // BONUS - Build the Gauge Chart
  buildGauge(sample);
}
function getOptions() {
  // Grab a reference to the dropdown select element
  var selDataset = document.getElementById('selDataset');
  // Use the list of sample names to populate the select options
  Plotly.d3.json('/names', function(error, sampleNames) {
      for (var i = 0; i < sampleNames.length;  i++) {
          var currentOption = document.createElement('option');
          currentOption.text = sampleNames[i];
          currentOption.value = sampleNames[i]
          selDataset.appendChild(currentOption);
      }
      getData(sampleNames[0], buildCharts);
  })
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  getData(newSample, updateCharts);
}
function init() {
  getOptions();
}
// Initialize the dashboard
init();
