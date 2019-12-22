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

const temp = options => {
  return new Promise((resolve, reject) => {
    let book1Obj = new Object();
    let book2Obj = new Object();
    request.get(options, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        var xmlToJson = convert.xml2json(body, { compact: true, spaces: 4 });
        console.log(xmlToJson);
        var json = JSON.parse(xmlToJson);

        var book1Title = json.rss.channel.item[0].title._text;
        var book1Image = json.rss.channel.item[0].image._text;
        var book1Author = json.rss.channel.item[0].author._text;
        var book1Description = json.rss.channel.item[0].description._text;

        book1Obj.title = book1Title;
        book1Obj.image = book1Image;
        book1Obj.author = book1Author;
        book1Obj.description = book1Description;

        var book2Title = json.rss.channel.item[1].title._text;
        var book2Image = json.rss.channel.item[1].image._text;
        var book2Author = json.rss.channel.item[1].author._text;
        var book2Description = json.rss.channel.item[1].description._text;

        book2Obj.title = book2Title;
        book2Obj.image = book2Image;
        book2Obj.author = book2Author;
        book2Obj.description = book2Description;

        resolve([book1Obj, book2Obj]);
      } else {
        console.log('error');
      }
    });
  });
};

module.exports = router;
