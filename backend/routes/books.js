let express = require('express');
let request = require('request');
let convert = require('xml-js');
const apikey = require(__dirname + '/../config/apikey.json');
let router = express.Router();

/**
 * @swagger
 * /books:
 *  get:
 *    summary: "랜덤으로 책 추천"
 *    tags:
 *    - "Book"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Book"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/', (req, res, next) => {
  // 네이버 api 불러서 책 2개 반환

  var catg = '320040010';
  var publ = '우';

  const options = {
    url:
      'https://openapi.naver.com/v1/search/book_adv.xml?d_titl=' +
      encodeURI(publ) +
      '&d_catg=' +
      encodeURI(catg) +
      '&display=2',
    headers: {
      'X-Naver-Client-Id': apikey.Client_ID,
      'X-Naver-Client-Secret': apikey.Client_Secret
    }
  };
  temp(options).then(data => {
    console.log(data);
    res.send(data);
  });
});

/**
 * @swagger
 * /books/find:
 *  get:
 *    summary: "독후감 작성 시 책 검색할 때 사용"
 *    tags:
 *    - "Book"
 *    parameters:
 *      - in: "query"
 *        name: "query"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/BookFindForm"
 *        description: "책 이름으로 책 정보 검색위한 폼"
 *    responses:
 *      200:
 *        description: "성공"
 *        schema:
 *          $ref: "#/definitions/Book"
 *      404:
 *        $ref: "#/components/res/BadRequest"
 */
router.get('/find', (req, res, next) => {
  // 네이버 api 불러서 책 2개 반환
  console.log('test');
  var bookname = req.query.bookName;
  console.log(bookname);

  const options = {
    url:
      'https://openapi.naver.com/v1/search/book_adv.xml?d_titl=' +
      encodeURI(bookname) +
      '&display=1',
    headers: {
      'X-Naver-Client-Id': apikey.Client_ID,
      'X-Naver-Client-Secret': apikey.Client_Secret
    }
  };
  temp(options).then(data => {
    console.log(data);
    res.send(data);
  });
});

const temp = options => {
  return new Promise((resolve, reject) => {
    var bookArray = new Array();
    var book = new Object();

    request.get(options, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        var xmlToJson = convert.xml2json(body, { compact: true, spaces: 4 });
        console.log(xmlToJson);
        var json = JSON.parse(xmlToJson);

        var items = json.rss.channel.item;
        var itemNum = items.length;
        console.log('item 개수 : ' + itemNum);

        if (itemNum == undefined) {
          book.title = json.rss.channel.item.title._text;
          book.image = json.rss.channel.item.image._text;
          book.author = json.rss.channel.item.author._text;
          book.description = json.rss.channel.item.description._text;

          bookArray.push(book);
        }

        for (var i = 0; i < itemNum; i++) {
          book.title = json.rss.channel.item[i].title._text;
          book.image = json.rss.channel.item[i].image._text;
          book.author = json.rss.channel.item[i].author._text;
          book.description = json.rss.channel.item[i].description._text;

          bookArray.push(book);
        }
        resolve(bookArray);
      } else {
        console.log('error');
      }
    });
  });
};

module.exports = router;
