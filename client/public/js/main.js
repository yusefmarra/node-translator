var token, random, langs;
var langCodes = '["ar", "bs-Latn", "bg", "ca", "zh-CHS", "zh-CHT", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "ht", "he", "hi", "mww", "hu", "id", "it", "ja", "tlh", "tlh-Qaak", "ko", "lv", "lt", "ms", "mt", "yua", "no", "otq", "fa", "pl", "pt", "ro", "ru", "sr-Cyrl", "sr-Latn", "sk", "sl", "es", "sv", "th", "tr", "uk", "ur", "vi", "cy"]';
var codeArray = ["ar", "bs-Latn", "bg", "ca", "zh-CHS", "zh-CHT", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "ht", "he", "hi", "mww", "hu", "id", "it", "ja", "tlh", "tlh-Qaak", "ko", "lv", "lt", "ms", "mt", "yua", "no", "otq", "fa", "pl", "pt", "ro", "ru", "sr-Cyrl", "sr-Latn", "sk", "sl", "es", "sv", "th", "tr", "uk", "ur", "vi", "cy"];

$(window).on('load',function() {
  console.log('loaded');
  getToken();
  randomWord();
  setTimeout(languages, 200);
});

function createList(items, codes) {
  for (var i = 0; i < items.length; i++) {
    $('.lang-list').append('<option value="' + codes[i] + '">' + items[i] + '</option>');
  }
}

function randomWord() {
  $.ajax({
    url: '/api/random',
    method: 'GET',
  }).done(function(data) {
    random = data.random;
  }).fail(function(error) {
    console.log(error.status);
  });
}

function translate(word, langTo) {
  $.ajax({
    url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
    dataType: 'jsonp',
    data: {
      appId: 'Bearer ' + token,
      from: getLanguage(word),
      to: langTo,
      contentType: 'text/plain',
      text: word
    },
    jsonp: 'oncomplete',
  }).done(function(data){
    console.log(data);
    //Boom!
  }).fail(function(error) {
    getToken();
  });
}

function getLanguage(string) {
  $.ajax({
    url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Detect',
    method: 'GET',
    data: {
      appId: 'Bearer ' + token,
      text: string
    }
  }).done(function(data) {
    langs = data;
  }).fail(function(error) {
    return error.status;
  });
}

function getToken() {
  $.ajax({
    url: '/api/token',
    method: 'GET',
    success: function(data) {
      token = data.token;
    },
    error: function(error) {
      return error.status;
    }
  });
}
function languages() {
  $.ajax({
    url: 'http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguageNames',
    data: {
      appId: 'Bearer ' + token,
      locale: 'en',
      languageCodes: langCodes
    }
  }).done(function(data) {
    langs = JSON.parse(data);
    setTimeout(createList(langs, codeArray), 500);
  }).fail(function(error) {
    console.log(error.status);
  });
}

function compare(userWord, correctWord) {
  if (userWord === correctWord) {
    console.log('Correct!');
    // push correct++
  } else {
    console.log('Incorrect');
    // push incorect++
  }
}
function validate(apiWord, userWord) {
  var d = []; //2d matrix
  var n = apiWord.length;
  var m = userWord.length;
  if (n === 0) return m;
  if (m === 0) return n;
  for (var i = n; i >= 0; i--) d[i] = [];
  for (var i = n; i >= 0; i--) d[i][0] = i;
  for (var j = m; j >= 0; j--) d[0][j] = j;
  for (var i = 1; i <= n; i++) {
    var apiWord_i = apiWord.charAt(i - 1);
      for (var j = 1; j <= m; j++) {
        if (i == j && d[i][j] > 4) return n;
           var userWord_j = userWord.charAt(j - 1);
           var cost = (apiWord_i == userWord_j) ? 0 : 1; // Step 5
           var mi = d[i - 1][j] + 1;
           var b = d[i][j - 1] + 1;
           var c = d[i - 1][j - 1] + cost;
           if (b < mi) mi = b;
           if (c < mi) mi = c;
           d[i][j] = mi; // Step 6
           if (i > 1 && j > 1 && apiWord_i == userWord.charAt(j - 2) && apiWord.charAt(i - 2) == userWord_j) {
               d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
           }
       }
   }
   // Step 7
   if (d[n][m] <= 1) {
       return true;
     } else {
         return false;
   }
}
