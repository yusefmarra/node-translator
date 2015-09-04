$('#generateRandom').on('click', function(event) {
  event.preventDefault();
  var random = randomWord(
    function(error, data){
      if (!error) {
        // console.log(data);
        return data.random;
      } else {
        // console.log(error);
        return error;
      }
    });
  $('#randomWord').text(random);
});

$('#submit').on('click', function(event) {
  event.preventDefault();
  var translated = translate(
    randomWordDiv.text(),
    $('.lang-list').val(),
    function(error, data) {
      if (!error) {
        return data;
      } else {
        return error;
      }
    });
  var input = $('#translation').text();
  console.log(translated);
  // validate(input, translated);
});
