var apiKey = require(__dirname + '/../config/apikey.json');

function all_back_button() {
  location.reload();
}

function page_write_book_find() {
  var bookname = $('#page_write_bookName').val();

  $.ajax({
    url:
      'https://openapi.naver.com/v1/search/book_adv.xml?d_titl=' +
      encodeURI(bookname) +
      '&display=1',
    headers: {
      'X-Naver-Client-Id': 'p45W0fzmWHeSeywJZNe8',
      'X-Naver-Client-Secret': '1JuvnonWI4'
    },
    type: 'get',
    dataType: 'json',
    success: function(data) {
      console.log('success : ' + data);
    }
  });
}

function page_write_open() {
  console.log('화면 전환');

  document.getElementsByClassName('page_view')[0].style.display = 'none';
  document.getElementsByClassName('page_write')[0].style.display = 'block';
}

function page_write_submit() {}
