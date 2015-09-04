var randomWordDiv = $('#randomWord');
$('#generateRandom').on('click', function(event) {
  event.preventDefault();
  randomWord();
  randomWordDiv.text(random);
});

$('#submit').on('click', function(event) {
  event.preventDefault();
  var translated;
    translate(randomWordDiv.text(), $('.lang-list').val(), function(error, data) {
    if (!error) {
      translated = data;
    } else {
      return error;
    }
  });
  var input = $('#translation').text();
  console.log(translated);
  validate(input, translated);
});
