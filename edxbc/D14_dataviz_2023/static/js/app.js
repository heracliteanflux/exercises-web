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