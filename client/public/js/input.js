$('#generateRandom').on('click', function(event) {
  event.preventDefault();
  randomWord(null,
    function(error, data){
      if (!error) {
        $('#randomWord').text(data);
        return data;
      } else {
        // console.log(error);
        return error;
      }
    });
});

$('#setName').on('click', function(e) {
  e.preventDefault();
  name = $('#userName').val();
  $('#userForm').hide();
  $('#practiceForm').show();

});

$('#showPractice').on('click', function(e) {
  e.preventDefault();
  $('#practiceForm').show();
  $('#challengeForm').hide();
  $('#recordDiv').hide();
});

$('#showChallenge').on('click', function(e) {
  e.preventDefault();
  $('#challengeForm').show();
  $('#practiceForm').hide();
  $('#recordDiv').hide();
});

$('#showRecords').on('click', function(e) {
  $('#recordDiv').show();
  $('tbody').empty();
  $('table').show();
  $('#practiceForm').hide();
  $('#challengeForm').hide();
  e.preventDefault();
  $.ajax({
    url: '/api/records',
    method: 'POST',
    data: {
      name: name
    }
  }).done(function(data) {
    for (var i = 0; i < data.records.length; i++) {
      $('#recordDiv tbody').append('<tr><td>'+data.records[i].name.toUpperCase()+'</td><td>'+data.records[i].langFrom.toUpperCase()+'</td><td>'+data.records[i].langTo.toUpperCase()+'</td><td>'+data.records[i].correct+'</td><td>'+data.records[i].incorrect+'</td><td>'+(data.records[i].correct/(data.records[i].incorrect+data.records[i].correct)*100)+'%</td></tr>'
      );
    }
    console.log(data);
  }).fail(function(error) {
    console.log(error);
  });
});

$('#practiceThing').on('submit', function(e) {
  e.preventDefault();
  $('#translatedWord').empty();
  $('#userWord').empty();
  var translated = translate(
    $('#randomWord').text(),
    $('#lang-list').val(),
    function(error, data) {
      if (!error) {
        if (validate(data, $('#translation').val().toLowerCase()) > 1) {
          $('#translatedWord').append(data);
          $('#userWord').append($('#translation').val());
          $('#userWord').css('color', 'red');
        } else {
          $('#translatedWord').append(data);
          $('#userWord').append($('#translation').val());
          $('#userWord').css('color', 'green');
        }
        $('#translation').val('');

        // console.log(data, $('#translation').val());
        // console.log(validate(data, $('#translation').val().toLowerCase()));
        return data;
      } else {
        return error;
      }
    });
});

$('#submit').on('click', function(event) {
  event.preventDefault();
  $('#translatedWord').empty();
  $('#userWord').empty();
  var translated = translate(
    $('#randomWord').text(),
    $('#lang-list').val(),
    function(error, data) {
      if (!error) {
        if (validate(data, $('#translation').val().toLowerCase()) > 1) {
          $('#translatedWord').append(data);
          $('#userWord').append($('#translation').val());
          $('#userWord').css('color', 'red');
        } else {
          $('#translatedWord').append(data);
          $('#userWord').append($('#translation').val());
          $('#userWord').css('color', 'green');
        }
        $('#translation').val('');

        // console.log(data, $('#translation').val());
        // console.log(validate(data, $('#translation').val().toLowerCase()));
        return data;
      } else {
        return error;
      }
    });
  // validate(input, translated);
});

$('#generateChallenge').on('click', function(e) {
  $('nav').hide();
  e.preventDefault();
  randomWord(20, function(error, data) {
    if (!error) {
      //do something with my array of random words
      $('#generateChallenge').hide();
      // $('#lang-list').hide();
      startChallenge(data);
      // console.log(data);
    } else {
      console.log(error);
    }
  });
});

$('#challengeSubmit').on('click', function(e) {
  e.preventDefault();
  var userInput = $('#chalTranslation').val();
  var currentWord = getCurrentWord();
  translate(currentWord, $('#lang-list').val(), function(error, data) {
    if (!error) {
      // console.log(data);
      if (validate(data, userInput) > 1) {
        $('#userWord').empty();
        $('#translatedWord').empty();
        $('#userWord').append(userInput).css('color', 'red');
        $('#translatedWord').append(data).css('color', 'green');
        speak(currentWord, 'en');
        nextChallenge(false);
      } else {
        $('#userWord').empty();
        $('#translatedWord').empty();
        $('#translatedWord').append(data).css('color', 'green');
        $('#userWord').append(userInput).css('color', 'green');
        speak(currentWord, 'en');
        // $('#'+currentQuestion).append(userInput).css('color', 'green');
        speak(currentWord, $('#lang-list').val());
        nextChallenge(true);
      }
    } else {
      console.log(error);
    }
  });
  $('#chalTranslation').val('');
});

$('#lang-list').on('change', function(e) {
  var lang = $("#lang-list option:selected").text();
  $('#info').html('<h3> USER: '+name.toUpperCase()+'</h3> <h3>LANGUAGE: '+lang.toUpperCase()+'</h3>');
});
