$(document).ready(function () {
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
                searchString = searchKeywordsArr.join('%20');
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

            if ($.trim(searchString.toLowerCase()) == "test my paper skills") {
                var textblock = $.trim($('#search_results li a.result-lnk').text());

                if (textblock.length < 2) {
                    textblock = 'The quick brown fox jumps over the lazy dog';
                }

                $('#paper_skills_report').remove();

                $('#search_form,#search_results').hide();
                $("body").append("<div class='paper_skills_text'>" + textblock + "</div>");

                $("body").append("<div id='paper_skills_timer'>0m 0s</div>");
                var startTime = new Date().getTime();
                var x = setInterval(function () {
                    var now = new Date().getTime();
                    var distance = now - startTime;
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    $('#paper_skills_timer').html(minutes + "m " + seconds + "s ");
                }, 1000);

                $("body").append("<div class='paper_skills_input'><textarea id='skillsinput' style='width:100%;height:100px;'></textarea></div>");

                $("body").append('<button type="button" id="cancelSkillsButton" class="search-button">Cancel</button>');

                $('#cancelSkillsButton').on('click', function (evt) {
                    evt.preventDefault();
                    clearInterval(x);
                    $('#search_form,#search_results').show();
                    $('.paper_skills_text,#paper_skills_timer,.paper_skills_input,#cancelSkillsButton').remove();
                });


                $('#skillsinput').focus();
                $('#skillsinput').on('keyup', function (x) {
                    var typedSoFar = $('#skillsinput').val();
                    var correctText = '';
                    var wrongText = textblock;
                    if (textblock.indexOf(typedSoFar) == 0) {
                        correctText = typedSoFar;
                        wrongText = textblock.substring(correctText.length);
                    }

                    $('.paper_skills_text').html('<span style="color:green;">' + correctText + '</span><span style="color:red;">' + wrongText + '</span>');

                    if (wrongText.length == 0) {
                        evt.preventDefault();
                        clearInterval(x);
                        $('#search_form,#search_results').show();

                        var now = new Date().getTime();
                        var distance = now - startTime;
                        var totalSeconds = distance / 1000;
                        var minutes = Math.floor(distance / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        $('#paper_skills_timer').html(minutes + "m " + seconds + "s ");

                        var charsPerSecond = correctText.length/totalSeconds;
                        charsPerSecond = parseFloat(charsPerSecond).toFixed(2);
                        var msg = "What Skills! " + correctText.length + " characters in " + minutes + "m " + seconds + "s. That's "+charsPerSecond+" characters a second!";
                        $("#search_results").prepend("<div id='paper_skills_report'>"+msg+"</div>");

                        $('.paper_skills_text,#paper_skills_timer,.paper_skills_input,#cancelSkillsButton').remove();


                    }

                });

                return;
            }

            $("#search_results").html('');
            $.getJSON('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' + searchString + '%20open_access:y&format=json&resulttype=core', function (data) {
                if (
                    data['hitCount'] == 0
                    && searchMethod == 'searchSuggested'
                    && searchKeywordsArr.length > 2
                ) {
                    var count = $('#searchSuggested').data('count');
                    console.log(count);
                    if (count < 10) {
                        $('#searchSuggested').data('count', count + 1);
                        $('#searchSuggested').click();
                    }
                    return;
                }

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
                                '<a class="result-lnk" href="' + url + '" data-index="' + doi + '" target="_blank"> ' + title + '</a>' +
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
