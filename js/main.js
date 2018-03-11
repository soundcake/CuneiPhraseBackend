$(document).ready(function () {
    $('#div_below').Animify({'effect': 'squares', 'background-color': '#0cf', 'intro': false});
    $(".search-button").on("click", function (evt) {
        evt.preventDefault();
        var searchMethod = $(evt.currentTarget).attr('id');

        var searchString = '', keyword1 = '', keyword2 = '';
        var searchKeywordsArr;
        if ($(evt.currentTarget).attr('id') == 'searchSuggested') {
            searchKeywordsArr = $(evt.currentTarget).data('keywords');

            if (searchKeywordsArr.length > 2) {
                keyword1 = searchKeywordsArr[Math.floor(Math.random() * searchKeywordsArr.length)];
                keyword2 = searchKeywordsArr[Math.floor(Math.random() * searchKeywordsArr.length)];
                while (keyword1 == keyword2) {
                    keyword2 = searchKeywordsArr[Math.floor(Math.random() * searchKeywordsArr.length)];
                }
                searchString = keyword1 + '%20' + keyword2;
            } else {
                searchString = searchStringTmp.join('%20');
            }

        } else {
            searchString = $("#searchField").val();
        }

        if (searchString && searchString.length > 2) {

            if ($.trim(searchString.toLowerCase()) == "i'm sumerian"
                || $.trim(searchString.toLowerCase()) == "i'll be back"
                || $.trim(searchString.toLowerCase()) == "nobody calls me chicken!") {
                window.parent.postMessage('fontme', '*');
            }

            $("#search_results").html('');
            $.getJSON('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' + searchString + '%20open_access:y&format=json&resulttype=core', function (data) {
                // if (
                //     data['hitCount'] == 0
                //     && searchMethod == 'searchSuggested'
                //     && searchKeywordsArr.length > 2
                // ) {
                //     $('#searchSuggested').click();
                //     return;
                // }

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
                                '<a data-index="' + doi + '|' + url + '|' + title + '|up" class="vote-from-search-link green" href="#">&uarr; </a>' +
                                '<a href="' + url + '" data-index="' + doi + '" target="_blank"> ' + title + '</a>' +
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
            var currentTarget = $(this);
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
                //alert('done is happening');
                currentTarget.hide();
                $('#initial_list').append('<li class="">' +
                    '<span class="vote-count"> </span>' +
                    '<a href="' + explodedDataIndex[1] + '" target="_blank">' + explodedDataIndex[2] + '</a>' +
                    '</li>');
                $('#firstParagraph').html('Our users submitted the following scientific papers related to this article:');
                //possible viable hack
                /*
                if ($('#secondParagraph').hasClass('hidden')) {
                    $('#secondParagraph').removeClass('hidden')
                }
                */
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
                vote_count: '' + voteCount
            }).done(function () {
                voteCount++;
                //remove this one line below to stop vote spamming
                currentTarget.attr('data-index', pageToPaperId + '|' + voteCount);
                currentTarget.parents('.link-listing').children('.vote-count').html('[' + voteCount + ']');
                currentTarget.parents('.link-listing').children('.vote-down').attr('data-index', pageToPaperId + '|' + voteCount);
            });
        });

    $(document)
        .on('click', '.vote-down', function (evt) {
            evt.preventDefault();
            var currentTarget = $(this);
            var dataIndex = $(this).attr('data-index');
            var explodedDataIndex = dataIndex.split('|');
            var pageToPaperId = explodedDataIndex[0];
            var voteCount = explodedDataIndex[1];
            //alert('page to paper id: ' + pageToPaperId + ' ---- vote count: ' + voteCount);
            $.post('https://cuneiphrase.xyz/votedown.php', {
                page_to_paper_id: '' + pageToPaperId,
                vote_count: '' + voteCount
            }).done(function () {
                voteCount--;
                //remove this one line below to stop vote spamming
                if (voteCount > 0) {
                    currentTarget.attr('data-index', pageToPaperId + '|' + voteCount);
                    currentTarget.parents('.link-listing').children('.vote-count').html('[' + voteCount + ']');
                    currentTarget.parents('.link-listing').children('.vote-up').attr('data-index', pageToPaperId + '|' + voteCount);
                }
                if (voteCount == 0) {
                    currentTarget.parents('.link-listing').css({'display': 'none'});
                    currentTarget.parents('.link-listing').remove();
                }
            });
        });
});
