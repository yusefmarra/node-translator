$('#generateRandom').on('click', function(event) {
  event.preventDefault();
  randomWord(
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

$('#submit').on('click', function(event) {
  event.preventDefault();
  $('#translatedWord').empty();
  $('#userWord').empty();
  var translated = translate(
    $('#randomWord').text(),
    $('.lang-list').val(),
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
        console.log(validate(data, $('#translation').val().toLowerCase()));
        return data;
      } else {
        return error;
      }
    });
  // validate(input, translated);
});
