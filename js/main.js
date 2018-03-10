$(document).ready(function () {
    $.get("https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=chicken%20open_access:y&format=json&resulttype=core", function (data) {
        //$("#search_results").html(data);
        //alert('done');
        var parsedData = parseJSON(data);
        $("#search_results").html(parsedData);
    });
});
