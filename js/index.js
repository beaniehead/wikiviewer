var maxResults = 6;
var extractLength = 250;

$('.search').on('click', function(WikipediaSearch) {

  var imageW = [];
  var searchitem = $('.wikisearch').val();

  if (searchitem === '') {
    //$('.resultstitle').html('');
    $('.wikisearch').attr('placeholder', 'Please enter a search term...');
  } else {
    $('.imageButton').attr('id', 'unclicked');
    $('.imageButton').html('Show Images');
    var divConstructor = '';
    for (a = 0; a < maxResults; a++) {

      divConstructor += '<div class="result"><div class="resultsTitle' + a + '"></div><div class="resultsExtract' + a + '"></div><div class="resultsImage' + a + '"></div></div>';

    }
    $('.results').html(divConstructor);
    console.log(divConstructor);

    $('.resultstitle').html('<h3>Results for <em>' + searchitem + '</em></h3>');

    $.getJSON('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&indexpageids=1&generator=search&utf8=1&exchars=' + extractLength + '&exlimit=' + maxResults + '&exintro=1&exsectionformat=plain&gsrlimit=' + maxResults + '&origin=*&gsrsearch=' + searchitem, function(json) {
      var results = (JSON.stringify(json));
      //gets pages key of json
      var pagesw = json.query.pages;
      //gets array of values for pages key of json (contains page ids)
      var keysW = json.query.pageids;
      console.log(keysW);
      var imagelist = "";
      //alert(pagesw[keysW[0]].extract)
      //alert (pagesw[keysVar].title);
      for (i = 0; i < maxResults; i++) {
        //creates dynamic variable to assign resulting title string to
        var resultTitleClass = '.resultsTitle' + i;
        var num = i;
        //gets id for each page as i increases for each value in array
        var keysVar = keysW[num];
        // gets title string for each pageid in results
        var title = pagesw[keysVar].title;
        //creates dynamic variable to assign resulting extract string to
        var resultExtractClass = '.resultsExtract' + i;
        //gets extract string for each pageid in results
        var extracts = pagesw[keysVar].extract;
        //gets extract length
        var extractLength = extracts.length;
        //shortens extract length (removes closing <p> and subsequent ...)
        var shortExtract = extracts.substring(0, extractLength - 7);
        imagelist += keysVar + '%7C';
        //assigns title string to corresponding numbered title div
        $(resultTitleClass).html('<h><a class="titleLink" href="https://en.wikipedia.org/wiki/' + title + '" target="_blank">' + title + '</a></h3>' + shortExtract + '<a href="https://en.wikipedia.org/wiki/' + title + '" target="_blank"><em>...(read more)</em></a></p>');
        //assigns extract string to corresponding numbered title div
        //$(resultExtractClass).html(shortExtract + '<a href="https://en.wikipedia.org/wiki/' + title + '" target="_blank"><em>...(read more)</em></a></p>');
        //console.log(keysW);
      }
      console.log(imagelist);
      $.getJSON('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pilicense=free&origin=*&piprop=original&pilimit=' + maxResults + '&pageids=' + imagelist, function(imgsource) {
        for (j = 0; j < maxResults; j++) {
          var resultsImageClass = '.resultsImage' + j;
          var propcheckoriginal = imgsource.query.pages[keysW[j]];
          var propchecksource = imgsource.query.pages[keysW[j]].original;
          if (propcheckoriginal.hasOwnProperty('original')) {
            if (propchecksource.hasOwnProperty('source')) {
              var imageURL = imgsource.query.pages[keysW[j]].original.source;
              $(resultsImageClass).html('<img src="' + imageURL + '" class="resultsImage"/>');

              if ($('.imageOff').attr('id') == 'active') {

                $(resultsImageClass).css({
                  'overflow': 'hidden',
                  'display': 'none',
                  'align-self': 'end',
                  'margin': '10px 20% 20px 20%',
                  'border': '2px #222534 solid',
                  'border-radius': '10px'
                });
                var imageW = $('.resultsImage').width();
                $('.resultsImage').css('height', imageW + 'px');

              } else if ($('.imageOff').attr('id') == 'inactive') {

                $(resultsImageClass).css({
                  'overflow': 'hidden',
                  'display': 'grid',
                  'align-self': 'end',
                  'margin': '10px 20% 20px 20%',
                  'border': '2px #222534 solid',
                  'border-radius': '10px'
                });
                var imageW = $('.resultsImage').width();
                $('.resultsImage').css('height', imageW + 'px');
                $('.imageButton').html('Hide Images');
                $('.imageButton').attr('id', 'clicked');
              }
            }

          } else {
            $(resultsImageClass).html('');
            $(resultsImageClass).css({
              'overflow': 'hidden',
              'display': 'grid',
              'align-self': 'end',
              'margin': '10px 20% 20px 20%',
              'border': '0',
              'border-radius': '0'
            });

          }

        }
      });
      $('.testing').html(results);
      $('.results').css('display', 'grid');
      $('.imageButton').css('visibility', 'visible');
    });

  }

  $(window).resize(function() {
    var imageW = $('.resultsImage').width();
    $('.resultsImage').css('height', imageW + 'px');
  });

});

$('.imageButton').on('click', function() {

  if ($('.imageButton').attr('id') == 'unclicked') {
    $('.imageButton').html('Hide Images');
    $('.imageButton').attr('id', 'clicked');
    for (k = 0; k < maxResults; k++) {

      var resultsImageClass2 = '.resultsImage' + k;
      var imageW = $('.resultsImage').width();
      $('.resultsImage').css('height', imageW + 'px');
      $(resultsImageClass2).css('display', 'grid');
    }

  } else if ($('.imageButton').attr('id') == 'clicked') {
    $('.imageButton').html('Show Images');
    $('.imageButton').attr('id', 'unclicked');
    for (l = 0; l < maxResults; l++) {

      var resultsImageClass3 = '.resultsImage' + l;
      $(resultsImageClass3).css('display', 'none');

    }
  }

});

$('.minus').on('click', function() {
  if ($('.resultsNumber').html() <= 20 && $('.resultsNumber').html() > 1) {
    var numbers = +$('.resultsNumber').html();
    $('.resultsNumber').html(numbers - 1);
    maxResults -= 1;
  }

});

$('.plus').on('click', function() {
  if ($('.resultsNumber').html() >= 0 && $('.resultsNumber').html() <= 20) {
    var numbers = +$('.resultsNumber').html();
    console.log(numbers);
    $('.resultsNumber').html(numbers + 1);

    maxResults += 1;
  }

  if ($('.resultsNumber').html() == 21) {
    alert('20 is the maximum number of results');
    $('.resultsNumber').html(20);
    maxResults = 20;
  }

});

$('.settingsButton').on('click', function() {
  $('.settings').css('z-index', '0');
  $('.settings').css('opacity', '0');
  $('.details').css('z-index', '1');
  $('.details').css('opacity', '1');
});

$('.closer').click(function() {
  $('.settings').css('z-index', '1');
  $('.settings').css('opacity', '1');
  $('.details').css('z-index', '0');
  $('.details').css('opacity', '0');
})

$('.searchIconShow').click(function() {
  $('.wikisearch').css({
    'width': '70%',
    'opacity': '1'
  });
  $('.searchIconShow').css('display', 'none');
  $('.searchArea').css('opacity', '1');
  $('hr').css('width', '90%');
});

$('.wikisearch').keypress(function(e) {
  if (e.which == 13) {
    console.log('You pressed enter!');
    $('.search').click();
  }
});

$('.imageOn').click(function() {
  $('.imageOff').css({
    'background-color': '#CBCEDD',
    'color': '#222534',
    'font-weight': 'normal'
  });
  $('.imageOff').attr('id', 'inactive');
  $('.imageOn').attr('id', 'active');
  $('.imageOn').css({
    'background-color': 'red',
    'color': '#CBCEDD',
    'font-weight': 'bold'
  });
})

$('.imageOff').click(function() {
  $('.imageOn').css({
    'background-color': '#CBCEDD',
    'color': '#222534',
    'font-weight': 'normal'
  });

  $('.imageOn').attr('id', 'inactive');
  $('.imageOff').attr('id', 'active');
  $('.imageOff').css({
    'background-color': 'red',
    'color': '#CBCEDD',
    'font-weight': 'bold'
  });
})