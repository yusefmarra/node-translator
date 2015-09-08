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
  $('#showPractice').show();
  $('#showChallenge').show();
  $('#showRecords').show();
  // $('#lang-list').show();
  // console.log(name);
});

$('#showPractice').on('click', function(e) {
  e.preventDefault();
  $('#practiceForm').show();
  $('#challengeForm').hide();
  $('#recordDiv').empty();
});

$('#showChallenge').on('click', function(e) {
  e.preventDefault();
  $('#challengeForm').show();
  $('#practiceForm').hide();
  $('#recordDiv').empty();
});

$('#showRecords').on('click', function(e) {
  $('tbody').empty();
  $('table').show();
  e.preventDefault();
  $.ajax({
    url: '/api/records',
    method: 'POST',
    data: {
      name: name
    }
  }).done(function(data) {
    for (var i = 0; i < data.length; i++) {
      $('#recordDiv tbody').append('<tr><td>'+data[i].name.toUpperCase()+'</td><td>'+data[i].langFrom.toUpperCase()+'</td><td>'+data[i].langTo.toUpperCase()+'</td><td>'+data[i].correct+'</td><td>'+data[i].incorrect+'</td><td>'+(data[i].correct/(data[i].incorrect+data[i].correct))+'%</td></tr>'
      );
    }
    console.log(data);
  }).fail(function(error) {
    console.log(error);
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
  e.preventDefault();
  randomWord(20, function(error, data) {
    if (!error) {
      //do something with my array of random words
      $('#generateChallenge').hide();
      $('#lang-list').hide();
      startChallenge(data);
      // console.log(data);
    } else {
      console.log(error);
    }
  });
});

$('#challengeSubmit').on('click', function(e) {
  e.preventDefault();
  $('#showPractice').hide();
  $('#showChallenge').hide();
  var userInput = $('#chalTranslation').val();
  var currentWord = getCurrentWord();
  translate(currentWord, $('#lang-list').val(), function(error, data) {
    if (!error) {
      // console.log(data);
      if (validate(data, userInput) > 1) {
        $('#'+currentQuestion).append('Your answer: "' + userInput + '" Correct Answer: ' + data).css('color', 'red');
        // speak(currentWord, $('.lang-list').val());
        nextChallenge(false);
      } else {
        $('#'+currentQuestion).append(userInput).css('color', 'green');
        // speak(currentWord, $('#lang-list').val());
        nextChallenge(true);
      }
    } else {
      console.log(error);
    }
  });
  $('#chalTranslation').val('');
});
