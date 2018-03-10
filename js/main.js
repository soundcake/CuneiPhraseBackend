$(document).ready(function () {
    $("#searchButton").on("click", function (evt) {
        evt.preventDefault();
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
                                '<button data-index="' + doi + '|' + url + '|' + title + '" class="add-link" type="button">Add</button>' +
                                '</li>');
                        });
                        i++;
                    }
                });
                $("#search_results").append('</ul>');
            });
        }
    });
    //
    $(document)
        .on('click', '.add-link', function (evt) {
            alert('click is happening');
            var dataIndex = $(this).attr('data-index');
            var explodedDataIndex = dataIndex.split('|');
            var page = $('body').attr('data-index');
            //$.post('https://cuneiphrase.xyz/addlink.php', {
            //    page: '' + page,
            //    doi: '' + explodedDataIndex[0],
            //    paper_title: '' + explodedDataIndex[2],
            ////    paper_link: '' + explodedDataIndex[1],
            //    context: 'yes yes',
            //    reason: 'because'
            //}).done(function () {
            $(this).hide();
            $('#initial_list').append('<li>' +
                '<a href="' + explodedDataIndex[1] + '" target="_blank">' + explodedDataIndex[2] + '</a>' +
                '</li>');
            //});

        });
});
