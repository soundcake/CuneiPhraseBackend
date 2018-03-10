$(document).ready(function () {
    $.get("https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=chicken&format=json&resulttype=core", function (data) {
        $("#search_results").html(data);

    });
});
