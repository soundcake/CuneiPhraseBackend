$(document).ready(function () {
    $("#searchButton").on("click", function (evt) {
        evt.preventDefault();
        if ($("#searchField").val() && $("#searchField").val().length > 2) {

            if ($.trim($("#searchField").val().toLowerCase()) == "i'm sumerian"
                || $.trim($("#searchField").val().toLowerCase()) == "i'll be back"
                || $.trim($("#searchField").val().toLowerCase()) == "nobody calls me chicken!") {
                window.parent.postMessage('fontme', '*');
            }

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
                                '<a data-index="' + doi + '|' + url + '|' + title + '|up" class="vote-from-search-link green" href="#">&uarr;</a>' +
                                '<a href="' + url + '" data-index="' + doi + '" target="_blank">' + title + '</a>' +
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
        .on('click', '.vote-from-search-link', function (evt) {
            //alert('click is happening');
            evt.preventDefault();
            var dataIndex = $(this).attr('data-index');
            var explodedDataIndex = dataIndex.split('|');
            var page = $('body').attr('data-index');
            $.post('https://cuneiphrase.xyz/addlink.php', {
                page: '' + page,
                doi: '' + explodedDataIndex[0],
                paper_title: '' + explodedDataIndex[2],
                paper_link: '' + explodedDataIndex[1],
                context: 'yes yes',
                reason: 'because'
            }).done(function () {
                $(this).hide();
                $('#initial_list').append('<li class="link-listing">' +
                    '<a data-index="' + explodedDataIndex[0] + '|' + explodedDataIndex[1] + '|' + explodedDataIndex[2] + '|up" class="vote-link green" href="#">&uarr;</a>' +
                    '<span class="vote-count">[1]</span>' +
                    '<a data-index="' + explodedDataIndex[0] + '|' + explodedDataIndex[1] + '|' + explodedDataIndex[2] + '|down" class="vote-link red" href="#">&darr;</a>' +
                    '<a href="' + explodedDataIndex[1] + '" target="_blank">' + explodedDataIndex[2] + '</a>' +
                    '</li>');
                $('#firstParagraph').html('Our users submitted the following scientific papers related to this article:');
            });
        });

    $(document)
        .on('click', '.vote-up', function (evt) {
            evt.preventDefault();
            var currentTarget = $(this);
            var dataIndex = $(this).attr('data-index');
            var explodedDataIndex = dataIndex.split('|');
            var pageToPaperId = explodedDataIndex[0];
            var voteCount = explodedDataIndex[1];
            //alert('page to paper id: ' + pageToPaperId + ' ---- vote count: ' + voteCount);
            $.post('https://cuneiphrase.xyz/voteup.php', {
                page_to_paper_id: '' + pageToPaperId,
                vote_count: '' + voteCount,
            }).done(function () {
                voteCount++;
                currentTarget.parents('.link-listing').children('.vote-count').html('[' + voteCount + ']');
            });
        });
});
