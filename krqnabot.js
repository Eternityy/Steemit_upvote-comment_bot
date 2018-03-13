// This program comment / vote to post satisfying certain conditions!!

steem = require('steem')
config = require('./config.json') // 이거 welcomebot 용 비밀번호 새로 만들어서 입력.
const wif = config.active //password. kr-qna 봇의 비밀번호를 입력해야 합니다.
var fs = require('fs'); // 파일 입출력 불러오기

var voter = 'eternittyyy'; // 유저의 아이디를 입력합니다.
var account = 'eternittyyy'; // 보상 받을 때 쓸 아이디. voter랑 같음.

var Author; // 보팅할 게시글의 저자를 입력합니다. 
var Permlink; //보팅할 게시글의 고유주소

var Realpermlink; // 보팅할 댓글의 고유주소
var Title = ''; // 댓글 제목. 비워둔다.
var Body = 'kr-qna 태그 게시글에 소량의 보팅을 하고 있어요.<br/>';
Body = Body + 'kr-qna 태그, 앞으로도 많이 이용해 주세요!<br/>';
Body = Body + 'Qna서포터즈나 질문내용을 잘아시는 스티미언님이 오셔서 답변해주실겁니다. &#128519;<br/>'
Body = Body + '(해당 댓글은 로봇이 작성했어요! &#129302;&#129302;&#129302;)' // 댓글 내용. 추후 추가하도록.
var jsonMetadata = {"tags" : ['kr-qna']}; //포스팅과 관련된 부수적인 정보. 아무정보나 가능.

var Body_guide = 'kr-qna태그는 "주로 뉴비" 분들이 "스티밋에 대해 질문을 할 때" 쓰이는 태그입니다! &#128541; <br/>'
Body_guide = Body_guide + '순수한 질문이 아닌 게시글에는 보팅 지원을 하지 않고 있어요 :) <br/><br/>'
Body_guide = Body_guide + 'kr-qna태그가 순수한 질문들이 아닌 글들에 붙게 되면, 서포터즈'
Body_guide = Body_guide + '분들이 뉴비 분들을 도와드리기 힘들어진답니다. &#128534; <br/> \n'
Body_guide = Body_guide + '**kr-qna태그를 이용하여 순수하게 질문글을 올리고 싶을 때는 제목에 꼭 "질문"이라는 단어를 넣어'
Body_guide = Body_guide + '주세요!**&#128515;<br/><br/>' 
Body_guide = Body_guide + '이상 kr-qna 서포터즈 가이드 봇이였습니다! &#129302;&#129302;&#129302; \n'
Body_guide = Body_guide + '>**[&#128279;올바른 #kr-qna태그 사용법 소개글 링크](https://steemit.com/kr/@eternittyyy/4q2jbo-kr-qna)**'


var reputation; // 명성 표시. 명성이 45이하인 사람 들에만 보팅하자.
var Votingpower; // 보팅 파워. 파워가 95프로 정도 이상일때만 보팅.
var Originalpermlink; // 텍스트 파일에 있는 고유주소 링크.

var beforeDate = '2017-01-01T00:00:00' // 저자로 게시글 찾을 때 필요함. search_again()에서. 걍 냅둬.

var Weight = 8000; // 포스팅에 보팅할 보팅무게 설정

// Switch 쓰려다가 말았다.
//var Switch = 1; // search_again() 함수에서, 보팅한 사람 있을 때 switch값을 0으로 바꿔서 실행 안하게!

function readfile() {
	fs.readFile('qna.txt', 'utf8', function(err, data) {
		console.log("Link in the text file is ", data);
		Originalpermlink = data
		console.log('File read completed');
		setTimeout(search, 2 * 1000);
	});

}	


function search() {

	steem.api.getDiscussionsByCreated({"tag": "kr-qna", "limit": 1}, function(err, result) {

		Author = result[0].author;
		Permlink = result[0].permlink;
		Title = result[0].title;
		Realpermlink = steem.formatter.commentPermlink(Author, Permlink);
		console.log('serach completed');
		steem.api.getAccounts([Author], function(err, result) {
			reputation = steem.formatter.reputation(result[0].reputation);
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
				search_title('질문', Title);
			}
		});
		
	}

}


function search_title (str, strArray) {
    
      if (strArray.match(str)) {
		is_reputation();
       	console.log('Ok. This is a question.');
       } else if (strArray.match('QnA') || strArray.match('qna')) {
       	is_reputation();
       	console.log('Ok. This is a question.');
       } else {
	    console.log('This post is not a question!!!');
    	guide_comment();
       }
}

//Check if author's reputation is under 52
function is_reputation() {
	if (reputation > 52) {
		console.log('Reputation is '+ reputation +'. too high!');
	} else {
		console.log('Reputation is '+ reputation + '. Moving on!');
		votingpower();
	}
}

// 보팅파워 값 입력.
function votingpower() {
	steem.api.getAccounts(['eternittyyy'], function(err, result) {
	Votingpower = result[0].voting_power
	console.log('Votingpower Check completed')
	setTimeout(is_votingpower, 2 * 1000);
	});
}

// 보팅파워 8000 이상인지 확인
function is_votingpower() {
	if(Votingpower < 8000) {
		console.log('Not enough voting power')
		setTimeout(reward_claim, 3 * 1000);
	} else {
		console.log('Votingpower is enough');
		setTimeout (search_again, 3 * 1000);
	}
}

// 보팅파워 적으면 리워드 클레임이나 해라
function reward_claim() {
	steem.api.getAccounts([account], function(err, response){
    //if it errors
    if(err){console.log("ERROR: Something Went Wrong Grabbing @" + account +"'s Account Info!");}
    //if it works
    if(response){
      // capture output into a variable
      rewardvests = response[0];
      rv = rewardvests["reward_vesting_balance"];
      rvnum = parseFloat(rv);
      rs = rewardvests["reward_vesting_steem"];
      rd = rewardvests["reward_sbd_balance"];
      console.log("Pending Rewards: " + rd + " / " + rs + " / " + rv);
        if (rvnum > 0){
          console.log("Pending Rewards Found! Claiming Now!");
          steem.broadcast.claimRewardBalance(wif, account,'0.000 STEEM', '0.000 SBD', rv, function(err, result) {
            if(err){
              console.log("ERROR Claiming Rewards! :(");
              console.log(err);
            	}
            if(result){
              console.log("Woot! Rewards Claimed!");
            	}//END if(result)
          	});//END steem.broadcast.claimRewardBalance
        	}//END if (rvnum > 0)
    	}//END if(response)
  	});//END steem.api.getAccounts

}

// Search again to check CURRENT ACTIVE VOTES!!!
// Is there my vote already? Do not vote if i already vote the post!!!!
// Also DO NOT COMMENT!!

function search_again() {
	steem.api.getDiscussionsByAuthorBeforeDate(Author, '', beforeDate, 1, function(err, result) {
		votecheck = result[0].active_votes; // 보팅한 사람 목록 저장
	  
	  	// 보팅한 사람 중 내가 있는지 확인하기
	  	for (i = 0; i < votecheck.length; i++) {
	  		if (votecheck[i].voter === 'eternittyyy') {
	  			console.log('I already voted this post. I\'m out!');
	  			process.exit();
	  		}
	  	}
		setTimeout(vote_to_post, 3 * 1000);	  	
	});
	
}



// 게시글에 보팅하기
function vote_to_post() {
	steem.broadcast.vote(wif, voter, Author, Permlink, Weight, function(err, result) {
	console.log('Vote to posting completed');
	setTimeout(comment, 2 * 1000);
	});
}



function comment() {
	steem.broadcast.comment(wif, Author, Permlink, voter, Realpermlink, Title, Body, jsonMetadata, function(err, result) {
		if(err) {
			console.log(err, result);
		} else {
		console.log('Comment Completed');
		//setTimeout(self_vote, 3 * 1000);
	}

	});

}

//질문 글이 아닐 경우 가이드 해주는 댓글 달기.
function guide_comment() {

	steem.broadcast.comment(wif, Author, Permlink, voter, Realpermlink, Title, Body_guide, jsonMetadata, function(err, result) {
		if(err) {
			console.log(err, result);
		} else {
		console.log('Guide_comment Completed');
		//setTimeout(self_vote, 3 * 1000);
	}

	});
}

/*
// 내 댓글에 보팅?
function self_vote() {
	steem.broadcast.vote(wif, voter, voter, Realpermlink, 2000, function(err, result) {
	console.log('Vote complete');
	});
	console.log('Self vote completed');
}
*/

/*
//아직 쓸 일 없는 함수.. ㅎㅎ 
function end_program() {
	console.log('End program by doing nothing...');
	process.exit();
}

*/


readfile();

/* 

//자바스크립트의 asynchronous 문제를 해결하기 위해,
//function을 쪼개서 실행 시키면 된다.

var onepiece = 'hell';

function readFile(input, func) 
{
 	func(input, lastone);
}

function writefile(input, func)
{
	func(input);
}

function lastone(input)
{
	console.log(input);
}


readFile(onepiece, writefile);

*/
