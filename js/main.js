$(document).ready(function () {
    $("#searchButton").on("click", function () {
        if ($("#searchField").val() && $("#searchField").val().length > 2) {
            $("#search_results").html('');
            $.getJSON('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' + $("#searchField").val() + '%20open_access:y&format=json&resulttype=core', function (data) {
                var i = 0;
                $("#search_results").append('<ul>');
                $.each(data['resultList']['result'], function (key, val) {
                    if (i < 5) {
                        var url;
                        var doi = val['doi'];
                        var title = val['title'];
                        $.each(val['fullTextUrlList'], function (newKey, value) {
                            url = value[0]['url'];
                            //$("#search_results").append('<p>url: ' + value[0]['url'] + ' --- title: ' + title + ' --- doi: ' + doi + '</p>');
                            $("#search_results").append('<li>' +
                                '<a href="' + url + '" data-indext="' + doi + '" target="_blank">' + title + '</a>' +
                                '</li>');
                        });
                        i++;
                    }
                });
                $("#search_results").append('</ul>');
            });
        }
    });
});
