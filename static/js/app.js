function buildMetadata(sample) {

    // Use `d3.json` to fetch the metadata for a sample
    const url = "/metadata/" + sample;
    let selector = d3.select("#sample-metadata");
    selector.html("");
    d3.json(url).then((metadata) => {
        Object.entries(metadata).forEach(([key, value]) => {
            selector.append("h6")
                .text(key + ":" + value);
        });
    });

}

function buildCharts(sample) {

    const url = "/samples/" + sample;
    d3.json(url).then((samples) => {
        let otu_ids = samples["otu_ids"];
        let sample_values = samples["sample_values"];
        let otu_labels = samples["otu_labels"];

        let trace1 = {
            labels: otu_ids.slice(0, 10),
            values: sample_values.slice(0, 10),
            hovertext: otu_labels.slice(0, 10),
            type: "pie"
        };

        let data = [trace1];
        Plotly.newPlot("pie", data);

        let trace2 = {
            x: otu_ids,
            y: sample_values,
            size: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                opactiy: 0.3,
                color: otu_ids
            }
        };

        let bubble_data = [trace2];
        Plotly.newPlot("bubble", bubble_data);
    });
};
// @TODO: Build a Bubble Chart using the sample data

// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).

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
