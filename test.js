// 태그 기능으로 글 정보 추출 (author, parent_permlink 추출) - OK!
// 글 링크 : https://steemit.com/@parentAuthor/permlink -OK!
// 코멘트 기능으로 댓글 달기 - OK !
// 강좌 11 활용해서 계속 돌아가게 설정하기 - OK !
// 같은 글에는 댓글 1개만! : text file로 최근 저자 저장시켜서 값 비교 후 답글 - OK!
// 강좌 12 활용해서 비정상 종료 프로그램 재 실행 시키기

steem = require('steem')
config = require('./config.json')
wif = config.post
// parenAuthor, parentPermlink는 태그 검색 함수 내의 Author 변수와 Permlink변수를 이용합니다.
RealAuthor = 'eternittyyy'
//permlink 도 함수 내의 변수를 이용합니다.
title = ''
body = 'Final test.'
jsonMetadata = {"tags" : ['kr-qna']};

Author = [];
Permlink = [];
Realpermlink = [];

var CompareThis;

// 바로 아래 부분은 txt 파일을 열기 위한 코드입니다.
// text 파일인 userInfo.txt 에 가장 최근 저자를 저장하는 코드를 짜려 합니다.
var fs = require('fs');

var file = 'userInfo.txt';

fs.readFile('userInfo.txt', 'utf8', function(err, data) {
	console.log(data)
	console.log("파일 이상 없습니다!")
});

fs.readFile('userInfo.txt', 'utf8', function(err, data) {

	steem.api.getDiscussionsByCreated({"tag" : "testtest", "limit" : 1}, function(err, result) { 
		if(err){
			console.log(err)
		} else {
			for (i = 0; i < result.length; i++){
				Author[i] = result[i].author
				Permlink[i] = result[i].permlink
				Realpermlink[i] = steem.formatter.commentPermlink(Author[i], Permlink[i]);
				console.log(Author[i], Permlink[i])

				console.log(data)
				if(Author[i] == data) {
					console.log(Author[i], data, 'They are same')
					break;
				} else {
					fs.writeFile('userInfo.txt', Author[i], function(err) {
					  if(err) throw err;
					  console.log(Author[i],'Author name write completed');
					});
				}

				
				steem.broadcast.comment(wif, Author[i], Permlink[i], RealAuthor, Realpermlink[i], title, body, jsonMetadata, function(err, result) {
					//console.log(err, result);
					console.log("코멘트 완료")
				});
			}

		}


	});

});
