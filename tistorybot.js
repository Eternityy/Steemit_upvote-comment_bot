// This program comment / vote to post satisfying certain conditions!!
steem = require('steem')
config = require('./config.json') // 이거 welcomebot 용 비밀번호 새로 만들어서 입력.
const wif = config.post //password. kr-qna 봇의 비밀번호를 입력해야 합니다.
// config.post -> 포스팅 키를 이용함
var fs = require('fs'); // 파일 입출력 불러오기

var voter = 'jekhy'; // 유저의 아이디를 입력합니다.
var account = 'jekhy'; // 보상 받을 때 쓸 아이디. voter랑 같음.

var Author; // 보팅할 게시글의 저자를 입력합니다. 
var Permlink; //보팅할 게시글의 고유주소
var category = '';

var Realpermlink; // 보팅할 댓글의 고유주소
var Title = ''; // 댓글 제목. 비워둔다.
// myIndex = 0~40, inclusive. num is postNum
var myIndex = Math.floor(Math.random() * 41);
var enBody = 'Thanks for the post[.](https://iamfoodie.tistory.com/'.concat(myIndex, ')');
var krBody = '포스팅 잘 봤습니다[.](https://iamfoodie.tistory.com/'.concat(myIndex, ')');

var jsonMetadata = {"tags" : ['just_a_test']}; //포스팅과 관련된 부수적인 정보. 아무정보나 가능.

var Originalpermlink; // 텍스트 파일에 있는 고유주소 링크.

var beforeDate = '2015-01-01T00:00:00' // 저자로 게시글 찾을 때 필요함. search_again()에서. 걍 냅둬.

var Weight = 8000; // 포스팅에 보팅할 보팅무게 설정

// Switch 쓰려다가 말았다.
//var Switch = 1; // search_again() 함수에서, 보팅한 사람 있을 때 switch값을 0으로 바꿔서 실행 안하게!

function readfile() {
	console.log("read start");
	fs.readFile('qna.txt', 'utf8', function(err, data) {
		if (err) {
			console.log('read error');
		} else {
			console.log("Link in the text file is ", data);
			Originalpermlink = data
			console.log('File read completed');
			setTimeout(search, 2 * 1000);	
		}

	});

}	
/*
function search2() {

	steem.api.getDiscussionsByCreated({"tag": "thisisjustabottest", "limit": 1}, function(err, result) {

		Author = result[0].author;
		Permlink = result[0].permlink;
		Title = result[0].title;
		category = result[0].category;
		Realpermlink = steem.formatter.commentPermlink(Author, Permlink);
		console.log('serach completed');
		steem.api.getAccounts([Author], function(err, result) {
			is_same();
		});
	});

}

var oldDate = new Date();
var oldest_id = 0;
steem.api.getDiscussionsByTrending({"limit": 100}, function(err, result) {
    for (var i = 0; i < 100; i++) {
        postDate = new Date(result[i].created);
        if (oldDate - postDate > 0) {
            oldest_id = i
            oldDate = postDate
        }
    }
    console.log(result[oldest_id].title);

});
*/

var oldDate = new Date();
var oldest_id = 0;
function search() {

	steem.api.getDiscussionsByTrending({"limit": 100}, function(err, result) {
		for (var i = 0; i < 100; i++) {
			postDate = new Date(result[i].created);
			if (oldDate - postDate > 0) {
				oldest_id = i
				oldDate = postDate
			}
		}
	 
		Author = result[oldest_id].author;
		Permlink = result[oldest_id].permlink;
		Title = result[oldest_id].title;
		category = result[oldest_id].category;
		Realpermlink = steem.formatter.commentPermlink(Author, Permlink);
		console.log('search completed');
		steem.api.getAccounts([Author], function(err, result) {
			is_same();
		});
	});

}


function is_same() {
	if (Originalpermlink === Permlink) {
		console.log('Link are the same!');
		return 0;
	} else {
		console.log(Originalpermlink, Permlink);
		fs.writeFile('qna.txt', Permlink, function(err) {
			if(err) {
				console.log(err);
			}
			 else { 
				console.log(Permlink,'Permlink write completed');
				comment();				
			}
		});
		
	}

}

function comment() {
	let Body;
	if (category == 'kr') {Body = krBody}
	else {Body = enBody}
	steem.broadcast.comment(wif, Author, Permlink, voter, Realpermlink, Title, Body, jsonMetadata, function(err, result) {
		if(err) {
			console.log(err, result);
		} else {
		console.log('Comment Completed');
	}

	});

}

console.log('New Start');
readfile();
