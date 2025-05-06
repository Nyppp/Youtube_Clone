var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseWWN/WordRel';
var access_key = '495469be-0399-4e67-9af5-086ef64c73d8';
var firstWord = '배';
var secondWord = '사과';

var requestJson = {
    'argument': {
        'first_word': firstWord,
        'second_word': secondWord,
    }
};

import pkg from 'request';
const { post } = pkg;
var options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: {'Content-Type':'application/json','Authorization':access_key}
};

post(options, function (error, response, body) {
    const responseData = JSON.parse(body);

    const key = responseData.return_object['WWN WordRelInfo'].WordRelInfo.Similarity;
    let sum = 0;
    let count = 0;
    key.forEach(function(simularity){
        count++;
        sum += simularity.SimScore;
    });

    console.log("유사도 평균값은 : " + sum/count);
});