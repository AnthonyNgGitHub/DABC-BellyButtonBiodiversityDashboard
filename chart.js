function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesReturnArray = samplesArray.filter(chartSampleobj => chartSampleobj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesReturnArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = samplesResult.otu_ids ;
    var otu_label = samplesResult.otu_labels ;
    var sample_value = samplesResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    console.log(samplesResult);


    var yticks = otu_id.map(function(item){
      return `OTU ${item}`
    }).slice(0,10).reverse();

  
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_value.slice(0,10).reverse(),
      y: yticks,
      text: otu_label.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      width: 450,
      height: 350,
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    var config = {responsive: true};

    Plotly.newPlot("bar",barData,barLayout,config )

    // Deliverable 2:
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x : otu_id,
      y : sample_value,
      text : otu_label,
      mode : 'markers',
      marker: {
        size: sample_value,
        color: otu_id
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title : '<b>Bacteria Cultures Per Sample</b>',
      xaxis : {
        title : {
          text: 'OTU ID'
        }
      },
      height: 500,
      width : 1150,
    };

    // 3. Use Plotly to plot the data with the layout.
    var config = {responsive: true};

    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config);

    // Deliverable 3: 

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var washingFrequency = result.wfreq;
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      type: "indicator",
      mode: "gauge+number",
      value: washingFrequency,
      title: {text:"<b>Belly Button Washing Frequency</b><br> Scrubs per Week"},
      gauge: {
        axis:{range: [0,10]},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "darkgreen"}
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450,
      height: 350,
      margin: { t: 25, r: 25, l: 25, b: 25 },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    var config = {responsive: true};

    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
}
