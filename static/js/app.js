var url = "../samples.json";

// Fetch the JSON data 
function Starterpack() {
  d3.json(url).then(function(data) {
    var Dropdown = d3.select("#selDataset")
    var Samplenames = data.names
    Samplenames.forEach((SampleId)=>{
      Dropdown.append("option").text(SampleId).property("value", SampleId)
    });
   
    var FirstSample = Samplenames[0];
    BuildPlots(FirstSample);
    buildTable(FirstSample);
    // BuildMetadata(FirstSample);  
  });
} 

// Plotly.newPlot('myDiv', data, layout);

function BuildPlots(Sample){
  d3.json(url).then(function(data){ 
  // Grab values from the data json object to build the plots
    var samples = data.samples;
    var Sampledata = samples.filter(individualsample => individualsample.id == Sample);
    var FirstSampledata = Sampledata[0];
    var id = FirstSampledata.otu_ids;
    var labels  = FirstSampledata.otu_labels;
    var values = FirstSampledata.sample_values;
    var ylabels = id.slice(0,10).map(OTU => `OTU ${OTU}`).reverse();

    // Horizantal Bar chart
    var trace1 = [{
        type: "bar",
        x: values.slice(0, 10).reverse(),
        y: ylabels,
        text: labels.slice(0,10).reverse(),
        orientation: "h"
    }];
    
    Plotly.newPlot("bar", trace1)

    // // Bublle chart
    var trace2 = {
        x: id,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
            color:id,
            size: values
        }
      };

      var datatrace2 = [trace2];

      var layout = {
        title: 'Samples Bubble chart',
        showlegend: false,
        height: 600,
        width: 1400,
      };

      Plotly.newPlot("bubble", datatrace2, layout);
    });
  }
           // Display each key-value pair from the metadata JSON
      function tablecreation(data) {
        var tbody = d3.select("tbody");
        tbody.html("")
      data.forEach(function(Metadata) {
         var row = tbody.append("tr");
         Object.entries(Metadata).forEach(function([key, value]) {
      
      //     // Append a cell to the row for each value
      //     // in the weather report object
           var cell = row.append("td");
           cell.text(value);
         });
       });
      };

      // Update all of the plots any time that a new sample is selected.
      
      d3.selectAll("#selDataset").on("gauge", updatePlotly);

      // This function is called when a dropdown menu item is selected
      function updatePlotly() {
      // Use D3 to select the dropdown menu
      var dropdownMenu = d3.select("#selDataset");
      // Assign the value of the dropdown menu option to a variable
      var dataset = dropdownMenu.property("samples");
      }

function optionChanged (Sample){
  BuildPlots(Sample)
  buildTable(Sample)
}

function buildTable(Sample) {
  d3.json(url).then(function(data) {
    var Metadata = data.metadata
    var SampleMeta = Metadata.filter(d=>d.id == Sample)
    var table = d3.select("#sample-metadata");
    table.html("")
    console.log(SampleMeta)
    Object.entries(SampleMeta[0]).forEach(([key, value])=>{
      table.append("p").text(`${key}, ${value}`)
    });
  })
}
Starterpack();