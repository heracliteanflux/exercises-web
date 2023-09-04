// samples.json is an `object` of three `arrays`
//   names
//   metadata (id, ehtnicity, gender, age, location, bbtype, wfreq)
//   samples  (id, otu_ids, sample_values, otu_labels)

function buildMetadata (sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then((data) => {

      let metadata    = data.metadata;                                        // an array of metadata objects
      // FILTER DATA SET for the object with `sample`'s id
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample); // an array of a single metadata object
      let result      = resultArray[0];                                       // a single metadata object

      let PANEL       = d3.select('#sample-metadata');                        // select tag `div` with id `sample-metadata`...
          PANEL.html('');                                                     // ...and clear any preexisting metadata
      // iterate over the keys (id, ehtnicity, gender, age, location, bbtype, wfreq) of the metadata object
      for (key in result) {                                                   // for each key...
        PANEL
          .append('h6')                                                       // ...create a tag `h6` under the sample-metadata tag
          .text(`${key.toUpperCase()}: ${result[key]}`);                      // whose text content is the key and its value
      }

      buildGauge(result.wfreq);
    });
}

function buildCharts (sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then((data) => {
      
      let samples       = data.samples;                                        // an array of sample objects
      // FILTER DATA SET for the object with `sample`'s id
      let resultArray   = samples.filter(sampleObj => sampleObj.id == sample); // an array of a single sample object
      let result        = resultArray[0];                                      // a single sample object

      let otu_ids       = result.otu_ids;                                      // an array of numbers
      let otu_labels    = result.otu_labels;                                   // an array of strings
      let sample_values = result.sample_values;                                // an array of numbers

      // PLOTLY BUBBLE PLOT
      let bubbleLayout = {
        hovermode : 'closest',
        margin    : {t : 0},
        title     : 'Bacteria Cultures Per Sample',
        xaxis     : {title : 'OTU ID'},
      }
      let bubbleData   = [{
        marker : {
          color      : otu_ids,
          colorscale : 'Earth',
          size       : sample_values,
        },
        mode   : 'markers',
        text   : otu_labels,
        x      : otu_ids,
        y      : sample_values,
      }];
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);

      // PLOTLY BAR PLOT
      let barLayout = {
        margin : {t : 30, l : 150},
        title  : 'Top 10 Bacteria Cultures Found',
      };
      let barData   = [{
        orientation : 'h',
        text        : otu_labels   .slice(0, 10).reverse(),
        type        : 'bar',
        x           : sample_values.slice(0, 10).reverse(),
        y           : otu_ids      .slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      }];
      Plotly.newPlot('bar', barData, barLayout);
    });
}

function buildGauge (wfreq) {
  let level    = parseFloat(wfreq) * 20; // a washing frequency between 0 and 180

  let degrees  = 180 - level;
  let radius   = 0.5;
  let radians  = (degrees * Math.PI) / 180;
  let x        = radius * Math.cos(radians);
  let y        = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.05 L .0 0.05 L ';
  let pathX    = String(x);
  let space    = ' ';
  let pathY    = String(y);
  let pathEnd  = ' Z';
  let path     = mainPath.concat(pathX, space, pathY, pathEnd);

  let gaugeLayout = {
    height : 500,
    shapes : [{
      fillcolor : '850000',
      line      : {color : '850000'},
      path      : path,
      type      : 'path',
    }],
    title  : '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
    width  : 500,
    xaxis  : {
      range          : [-1, 1],
      showgrid       : false,
      showticklabels : false,
      zeroline       : false,
    },
    yaxis  : {
      range          : [-1, 1],
      showgrid       : false,
      showticklabels : false,
      zeroline       : false,
    },
  };
  let gaugeData   = [
    {
      hoverinfo  : 'text+name',
      marker     : {color : '850000', size : 12},
      name       : 'Freq',
      showlegend : false,
      text       : level,
      type       : 'scatter',
      x          : [0],
      y          : [0],
    },
    {
      hole         : 0.5,
      hoverinfo    : 'label',
      labels       : [ "8-9",  "7-8",  "6-7",  "5-6",  "4-5",  "3-4",  "2-3",  "1-2",  "0-1", ""],
      marker       : {colors : [
        "rgba(0, 105, 11, .5)",
        "rgba(10, 120, 22, .5)",
        "rgba(14, 127, 0, .5)",
        "rgba(110, 154, 22, .5)",
        "rgba(170, 202, 42, .5)",
        "rgba(202, 209, 95, .5)",
        "rgba(210, 206, 145, .5)",
        "rgba(232, 226, 202, .5)",
        "rgba(240, 230, 215, .5)",
        "rgba(255, 255, 255, 0)"
      ]},
      rotation     : 90,
      showlegend   : false,
      text         : [ "8-9",  "7-8",  "6-7",  "5-6",  "4-5",  "3-4",  "2-3",  "1-2",  "0-1", ""],
      textinfo     : 'text',
      textposition : 'inside',
      type         : 'pie',
      values       : [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
    },
  ];
  let GAUGE    = document.getElementById('gauge');
  Plotly.newPlot(GAUGE, gaugeData, gaugeLayout)
}

function init () {
  let selector = d3.select('#selDataset');
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then((data) => {

      let sampleNames = data.names;                  // an array of strings

      for (let i = 0; i < sampleNames.length; i++) { // for each sample...
        selector
          .append('option')                          // ...create a tag `option` under tag `select`
          .text(sampleNames[i])                      // with the sample's name as text
          .property('value', sampleNames[i]);        // and set the property `value` to the sample's name
      }

      // plot initialization
      let firstSample = sampleNames[0];
      buildCharts  (firstSample);
      buildMetadata(firstSample);

    });
}

// EVENT HANDLER
// rebuild the plots each time a new sample is selected
function optionChanged (newSample) {
  buildCharts  (newSample);
  buildMetadata(newSample);
}

init();