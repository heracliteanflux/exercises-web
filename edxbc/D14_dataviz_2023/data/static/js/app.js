function buildMetadata (sample) {

}

function buildCharts (sample) {

}

function init () {
  let selector = d3.select('#selDataset');
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then((data) => {
      let sampleNames = data.names;
    });
}

function optionChanged (newSample) {

}

init();