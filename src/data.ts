import cricketPage from './assets/cricket-source-page-1.253.png';
import davisPage from './assets/davis-cup-source-page-1.255.png';

export type Option = { label:string; text:string };
export type Question = {
  id:string; number:number; setId:string; questionText:string; options:Option[];
  answer:string; answerType:'mc'|'tita'; sourcePage:string; visualRequired:boolean; visualIds?:string[];
  // Data Sufficiency only: `options` holds Statements A/B; `choices` holds the selectable (a)-(d) answer choices.
  choices?:Option[];
};
export type Visual = { id:string; type:'table'|'diagram'; sourcePage:string; src:string; description:string };
export type SetData = { id:string; number:number; title:string; topic:string; questionRange:[number,number]; directions:string; commonInformation:string; sourcePages:string[]; visuals?:Visual[]; questions:Question[]; questionNumbers?:number[] };
export type ChapterData = { id:string; title:string; level:string; description:string; sets:SetData[]; questions:Question[] };

const mc=(label:string,text:string):Option=>({label,text});
const q=(setId:string,number:number,questionText:string,answer:string,options:Option[]=[],sourcePage:string,answerType:'mc'|'tita'='mc',visualRequired=false,visualIds?:string[]):Question=>({id:`Q${number}`,number,setId,questionText,answer,options,sourcePage,answerType,visualRequired,visualIds});

const set1: SetData={
 id:'set-1',number:1,title:'Boxing championship',topic:'Matches & qualification',questionRange:[1,4],
 directions:'Directions for Questions 1 to 4: Answer the following questions based on the given information:',
 commonInformation:`Eight boxers P, Q, R, S, T, U, V and W participated in an international boxing championship. In the first round of the championship, these eight players were divided into two groups of four players each. In a group, each player had to play two matches against each of the other players in its group. No match ended in a tie and the players with the highest and the second highest number of wins in both the groups reached the semifinal. Q, U, W, V reached the semifinal.

It is also known that in the first round:
(i) Each player of each group won different number of matches.
(ii) R lost all of his matches against all the other players except S, who won at least one match against each of the other player except one.
(iii) V won both the matches against U.
(iv) P and W won the same number of matches.`,sourcePages:['1.252'],questions:[]};
set1.questions=[
 q(set1.id,1,'Who won the least number of matches after 1st round?','d',[mc('a','P'),mc('b','R'),mc('c','S'),mc('d','T')],'1.252'),
 q(set1.id,2,'What was the total number of wins of P after the first round?','c',[mc('a','1'),mc('b','2'),mc('c','3'),mc('d','4')],'1.252'),
 q(set1.id,3,'Who won the most number of matches after 1st round?','a',[mc('a','Q'),mc('b','U'),mc('c','W'),mc('d','V')],'1.252'),
 q(set1.id,4,'Which of the following player lost at least one match against P in the 1st round?','d',[mc('a','Q'),mc('b','S'),mc('c','U'),mc('d','V')],'1.252')
];

const set2:SetData={id:'set-2',number:2,title:'Six-team sports event',topic:'Two-stage tournament',questionRange:[5,8],directions:'Directions for Questions 5 to 8: Answer the following questions based on the information given below:',commonInformation:`In a sports event, six teams (A, B, C, D, E and F) are competing against each other. Matches are scheduled in two stages. Each team plays three matches in stage 1 and two matches in stage 2. No team plays against the same team more than once in the event. No ties are permitted in any of the matches. The observations after the completion of stage 1 and stage 2 are as given below.

Stage 1:
• One team won all the three matches.
• Two teams lost all the matches.
• D lost to A but won against C and F.
• E lost to B but won against C and F.
• B lost at least one match.
• F did not play against the top team of stage 1.

Stage 2:
• The leader of stage 1 lost the next two matches.
• Of the two teams at the bottom after stage 1, one team won both the matches, while the other lost both the matches.
• One more team lost both the matches in stage 2.`,sourcePages:['1.252'],questions:[]};
set2.questions=[
 q(set2.id,5,'The only team(s) that won both the matches in stage 2 is/are:','d',[mc('a','B'),mc('b','E and F'),mc('c','A, E and F'),mc('d','B, E and F')],'1.252'),
 q(set2.id,6,'The teams that won exactly two matches in the event are:','d',[mc('a','A, D and F'),mc('b','D and E'),mc('c','E and F'),mc('d','D and F')],'1.252'),
 q(set2.id,7,'The team(s) with the most wins in the event is/are:','d',[mc('a','A'),mc('b','A and C'),mc('c','F'),mc('d','B and E')],'1.252'),
 q(set2.id,8,'The two teams that defeated the leader of stage 1 are:','b',[mc('a','F and D'),mc('b','E and F'),mc('c','B and D'),mc('d','E and D')],'1.252')
];

const set3:SetData={id:'set-3',number:3,title:'Indian Cricket Team',topic:'Tables & partnerships',questionRange:[9,12],directions:'Directions for Questions 9 to 12: Answer the questions on the basis of the information given below:',commonInformation:`The following tables show the batting performance of the Indian Cricket Team in the final match of Asia Cup 2014. Table 1 indicates the score of the team at the fall of each wicket (from 1 to 10). Table 2 gives the runs scored by the 11 batsmen and the order in which they appeared in the batting line up.

Additional Information:
(i) At any point, there are two batsmen on the field, till the fall of the 10th wicket. Whenever the team loses a wicket, the new batsman comes as per the batting order. E.g., if one of the openers gets out, the no. 3 batsman takes the field.
(ii) A partnership between any two batsmen is the number of runs scored while both of them are batting.`,sourcePages:['1.252','1.253'],visuals:[
 {id:'cricket-tables-source',type:'table',sourcePage:'1.253',src:cricketPage,description:'Original source page 1.253 — Cricket Tables 1 and 2'}
],questions:[]};
set3.questions=[
 q(set3.id,9,"How many batsmen lost their wicket between Sachin's and Dhoni's dismissal?",'a',[mc('a','0'),mc('b','1'),mc('c','2'),mc('d','More than 2')],'1.253','mc',true,['cricket-tables-source']),
 q(set3.id,10,'How many runs were scored by the batsman who was the 7th to be dismissed?','d',[mc('a','11'),mc('b','18'),mc('c','0'),mc('d','5')],'1.253','mc',true,['cricket-tables-source']),
 q(set3.id,11,'What was the percentage contribution to the second highest partnership of the batsman, to be dismissed first in that partnership?','a',[mc('a','33.33%'),mc('b','61.53%'),mc('c','71.43%'),mc('d','None of these')],'1.253','mc',true,['cricket-tables-source']),
 q(set3.id,12,"If India's total comprised only 'Singles' and 'Fours'. The number of Fours scored cannot exceed:",'c',[mc('a','27'),mc('b','24'),mc('c','21'),mc('d','20')],'1.253','mc',true,['cricket-tables-source'])
];

const set4:SetData={id:'set-4',number:4,title:'Rajesh & Kanhaiya coin game',topic:'Misère coin game',questionRange:[13,15],directions:'Directions for Questions 13 to 15: Answer these questions on the basis of the information given below:',commonInformation:`Rajesh and Kanhaiya are playing a game of coins. There are N coins on the table to start with. Each player, in his turn, picks up at least one coin and at most eight coins. The two players take turns alternately. They continue playing till the last coin is picked up off the table. The player who picks up the last coin loses. Assume that each player plays intelligently with an objective of winning. Rajesh has the first move. No player is allowed to pass his turn without picking up any coins.`,sourcePages:['1.253'],questions:[]};
set4.questions=[
 q(set4.id,13,'If there are 88 coins in the game then how many coins should Rajesh pick in his first turn to ensure his win?','a',[mc('a','6'),mc('b','7'),mc('c','2'),mc('d',"He can't win in this game.")],'1.253'),
 q(set4.id,14,'If, for some N, it is known that the number of coins picked up by Rajesh, in his first four moves were 6, 5, 5 and 6 respectively, then how many coins would Kanhaiya have picked up in his third move? Assume that both have played intelligently and Rajesh wins the game.','a',[mc('a','3'),mc('b','5'),mc('c','6'),mc('d','Insufficient data')],'1.253'),
 q(set4.id,15,'If it is known that the game was completed in 12 moves, what is the maximum possible value for N?','c',[mc('a','51'),mc('b','53'),mc('c','54'),mc('d','None of these')],'1.253')
];

const set5:SetData={id:'set-5',number:5,title:'Coin game — last coin wins',topic:'Normal coin game',questionRange:[16,17],directions:'Directions for Questions 16 to 17: Assume that the player who picks the last coin wins the game.',commonInformation:'',sourcePages:['1.253'],questions:[]};
set5.questions=[
 q(set5.id,16,'If it is known that N is greater than 11 but less than 55, for how many values of N will Rajesh certainly lose the game, irrespective of how he plays?','b',[mc('a','4'),mc('b','5'),mc('c','6'),mc('d','8')],'1.253'),
 q(set5.id,17,'If it is known that N is greater than 88 but less than 98 and that Rajesh picked up 6 coins in his first move, then what is the value of N?','d',[mc('a','91'),mc('b','94'),mc('c','95'),mc('d','96')],'1.253')
];

const set6:SetData={id:'set-6',number:6,title:'128-player knockout tennis',topic:'Knockout bracket',questionRange:[18,21],directions:'Directions for Questions 18 to 21: These questions are based on the following information.',commonInformation:`128 players taking part in a knockout tennis tournament, are seeded from 1 to 128 with seed 1 being the top seed, seed 2 the second seed and so on. In the first round, seed 1 plays seed 128 which is termed match 1 of round 1, seed 2 plays seed 127, which is termed match 2 of round 1 and so on till match 64 of round 1, where seed 64 plays seed 65. In the next round, the winner of match 1 of round 1 plays the winner of the last match (match 64) of round 1, the winner of match 2 of round 1 plays the winner of the second last match (match 63) of round 1 and so on. This continues till only one player is left undefeated. If, in any match a lower seeded player defeats a higher seeded player, it is called an upset.`,sourcePages:['1.254'],questions:[]};
set6.questions=[
 q(set6.id,18,'How many matches are played in the tournament?','127',[],'1.254','tita'),
 q(set6.id,19,'If the player seeded 37 reaches the third round, who would he play against, assuming there are no upsets in the first two rounds, apart from the upsets required to make the seed number 37 reach the third round?','Seed 5',[],'1.254','tita'),
 q(set6.id,20,'If the number of upsets in the tournament is only three, then who is the lowest seeded player, who could have won the tournament?','Seed 8',[],'1.254','tita'),
 q(set6.id,21,'Which of the seeded player could have faced the player seeded 76 in the second round?','Seed 12 or 117',[],'1.254','tita')
];

const set7:SetData={id:'set-7',number:7,title:'Formula 1 race betting',topic:'Odds & returns',questionRange:[22,25],directions:'Directions for Questions 22 to 25: Read the information and answer the questions that follow:',commonInformation:`In a Formula 1 race, drivers from 4 teams Ferrari, McLaren, Suzuki and Nippon were participating. This particular year, the bookies were having a field day during the races. The official odds provided for winning, for each of these drivers by Mr. Varun, were 3:2, 8:5, 3:1 and 2:1 respectively. The odds of 3:2 mean that for a bet of 2, you get a profit of 3, if the bet proves correct - i.e., the team you put your bet wins. In other words, you get back ₹5 for a bet of ₹2, if you place a bet on team Ferrari, where ₹2 is the return of your bet amount and ₹3 is the profit you gained.

It is also known that if your team finished second, you would gain only 20% of the profit, while getting the entire bet amount back. However, if your team finishes third or fourth in the race, you would lose the entire bet amount and get nothing back.

There are a total of 4 races held, with all the 4 teams and their drivers participating in each race. Sameer Contractor placed equal bets of ₹40,000, on all the four teams and their drivers in all the 4 races. For the purpose of this question, assume that: [Return = Amount of profit + Amount of bet]`,sourcePages:['1.254'],questions:[]};
set7.questions=[
 q(set7.id,22,'If Sameer Contractor received a return of ₹184,000 in a race, then which team finished first in that race?','d',[mc('a','Ferrari'),mc('b','McLaren'),mc('c','Suzuki'),mc('d','Nippon')],'1.254'),
 q(set7.id,23,'If return received is of ₹176,000 in all the four races from his bets placed on Nippon, then how many times did Nippon finish in the top two?','2',[],'1.254','tita'),
 q(set7.id,24,'If return received is of ₹172,000, ₹216,000 and ₹152,800 in three of the four races, then what was the minimum return in the fourth race, given that each team won only 1 race?','156000',[],'1.254','tita'),
 q(set7.id,25,'For the above question, if it is known that there is no repetition for the second place finish too, then which team finished second in the fourth race?','c',[mc('a','Ferrari'),mc('b','McLaren'),mc('c','Suzuki'),mc('d','Nippon')],'1.254')
];

const set8:SetData={id:'set-8',number:8,title:'Little Players Football tournament',topic:'Round-robin points',questionRange:[26,29],directions:'Directions for Questions 26 to 29: Read the information below and answer the questions that follow:',commonInformation:`The Little Players Football coaching school organized a tournament, among the students and divided them into 7 teams- A, B, C, D, E, F and G. Each team played exactly once against each other in the tournament. The teams got 3 points for winning and no points for losing the match. If a match was a draw, each team got one point.

Further the following points are known:
(i) Each team won at least one match.
(ii) Team B won four matches.
(iii) Team A drew a match against D, B and E.
(iv) E won the match against D and F and lost the match against B and C.
(v) B did not lose any match.`,sourcePages:['1.254'],questions:[]};
set8.questions=[
 q(set8.id,26,'If the match between D and B was a draw, then for how many matches the result is definitely known?','11',[],'1.254','tita'),
 q(set8.id,27,'What could be the minimum difference between the total points scored by A and C?','0',[],'1.254','tita'),
 q(set8.id,28,'If team B drew with team D, what was the result of the match between team A and C?','d',[mc('a','Team A won.'),mc('b','Team C won.'),mc('c','The match was a draw.'),mc('d','Cannot be determined.')],'1.254'),
 q(set8.id,29,'If F got the maximum possible points for the remaining matches and G won only one match, which was against D and lost all other matches. Which teams got the lowest points among the combination of teams?','a',[mc('a','Team G'),mc('b','Team A'),mc('c','Team C'),mc('d','Cannot be determined')],'1.254')
];

const set9:SetData={id:'set-9',number:9,title:'32-player seeded tennis',topic:'Upsets & bracket logic',questionRange:[30,33],directions:'Directions for Questions 30 to 33: Read the details and then answer the questions that follow:',commonInformation:`In a tennis tournament, players are seeded from 1 to 32, played in a knockout. Knockout means that the winner of a match, advances to the next round and the team losing the match, is eliminated from the competition. The loser is eliminated and the winners of the respective matches qualify for the next round. When the last 8 players are left, they play each other in the quarter finals, the last 4 stage is called the semi final and the final is between the last 2 players standing. In the first round, there are 32 players, and 16 matches are held between the players such that: player seeded 1 plays against the player seeded 32 in match 1 of round 1; match 2 of round 1 is played between seed 2 and 31; match 3 between seeds 3 and 30 and so on. In the second round, match 1 is played between the winners of match 1 and match 16 of round 1; match 2 is played between the winners of match 2 and match 15 of round 1; match 3 between the winners of match 3 and match 14 of round 1 and so on. Subsequent rounds are held in the same way. An upset is said to have taken place, if in any match, in any round, a lower seeded player beats a higher seeded player. For a particular tournament, with 32 players, answer the following questions.`,sourcePages:['1.254','1.255'],questions:[]};
set9.questions=[
 q(set9.id,30,'If during the course of tournament, there are only 2 upsets, then what can be the lowest seed who could be the winner of the tournament?','4',[],'1.255','tita'),
 q(set9.id,31,'If in round 1 and round 2, all even numbered matches result in upsets, odd numbered matches do not result in upset and no upset happens in the further round, then what is the rank of the player who plays against the 27th seed in the quarter finals (the round before semi final)?','3',[],'1.255','tita'),
 q(set9.id,32,'If there are 11 upsets in the 1st round and no upsets in the other rounds, then which seed could be the lowest possible seed who can win the tournament?','12',[],'1.255','tita'),
 q(set9.id,33,'If there are 11 upsets in the 1st round and no upsets in the other rounds, then which seed could be the highest possible seed who can win the tournament?','1',[],'1.255','tita')
];

const set10:SetData={id:'set-10',number:10,title:'Davis Cup',topic:'Singles & doubles scheduling',questionRange:[34,38],directions:'Directions for Questions 34 to 38: Read the information and answer the questions that follow:',commonInformation:`International team tennis is undergoing rapid changes these days. A new format tournament called the Davis Cup, was launched recently, in which India played with Australia in the quarter final and with France in semi final. The match between 2 teams is held in 3 days: day 1: 2 singles matches; day 2: one doubles match and Day 3: 2 reverse singles matches. In the reverse singles matches, the singles opponents of the first day are switched.

4 players played for each team and an individual player can play either in singles or in doubles. The Indian players were: Vijay Amritraj (VA); Ramanathan Krishnan (RK); Leander Paes (LP); Mahesh Bhupathi (MB).

The Australian players were: Rod Laver (RL); Roy Emerson (RE); Pat Cash (PC) and Mark Woodforde (MW).

The French players were: Cedric Pioline (CP); Gael Monfils (GM); Yannick Noah (YN) and Jo-Wilfred Tsonga (JWT).

India beat Australia by 3 - 2 in the quarter finals and France by 4-1 in the semi-finals.

Note: The players who played in single and reverse single matches in that particular round did not play the doubles. Except these matches, there were no extra matches played.

The following diagram provides the data of matches played and wins of all the players of India, France and Australia in Davis cup. A player can play a maximum of 2 matches in a round. VA (4, 3) means that VA (Vijay Amritraj) played 4 matches and won 3 out of those.`,sourcePages:['1.255'],visuals:[{id:'davis-cup-diagram',type:'diagram',sourcePage:'1.255',src:davisPage,description:'Original source page 1.255 — Davis Cup match diagram'}],questions:[]};
set10.questions=[
 q(set10.id,34,"India’s doubles players in their match against Australia were:",'d',[mc('a','Mahesh Bhupathi & Leander Paes'),mc('b','Mahesh Bhupathi & Ramanathan Krishnan'),mc('c','Leander Paes & Ramanathan Krishnan'),mc('d','Either (a) or (b)')],'1.255','mc',true,['davis-cup-diagram']),
 q(set10.id,35,'How many matches did Rod Laver play in the tournament?','c',[mc('a','2'),mc('b','1'),mc('c','Either 1 or 2'),mc('d','Cannot be determined')],'1.255','mc',true,['davis-cup-diagram']),
 q(set10.id,36,'Who were the players against whom Vijay Amritraj played in the semi finals?','a',[mc('a','Cedric Pioline and Gael Monfils'),mc('b','Gael Monfils and Yannick Noah'),mc('c','Cedric Pioline and Yannick Noah'),mc('d','Cannot be determined')],'1.255','mc',true,['davis-cup-diagram']),
 q(set10.id,37,'The players who did not play in any of the doubles match definitely is/are:','d',[mc('a','Vijay Amritraj'),mc('b','Leander Paes'),mc('c','Cedric Pioline'),mc('d','Both Vijay Amritraj and Cedric Pioline')],'1.255','mc',true,['davis-cup-diagram']),
 q(set10.id,38,"Which of the following statement/s are not definitely true?\n1. India lost it's doubles match in the quarter finals.\n2. Vijay Amritraj beat Cedric Pioline.\n3. Leander Paes beat Mark Woodforde.",'c',[mc('a','All 3.'),mc('b','2 only.'),mc('c','Both 2 and 3.'),mc('d','All are not definitely true.')],'1.255','mc',true,['davis-cup-diagram'])
];

const set11:SetData={id:'set-11',number:11,title:'Ghosh Babu card game',topic:'Card-game payoffs',questionRange:[39,41],directions:'Directions for Questions 39 to 41: These questions are based on the situation given below:',commonInformation:`Recently, Ghosh Babu spent his winter vacation on Kyakya Island. During the vacation, he visited the local casino where he came across a new card game. Two players, using a normal deck of 52 playing cards, play this game. One player is called the Dealer and the other is called the Player.

First, the player picks a card at random from the deck. This is called the base card. The amount in rupees equal to the face value of the base card is called the base amount. The face values of Ace, King, Queen and Jack are ten. For other cards, the face value is the number on the card. Once, the Player picks a card from the deck, the Dealer pays him the base amount.

Then the Dealer picks a card from the deck and this card is called the top card. If the top card is of the same suit as the base card, the Player pays twice the base amount to the Dealer. If the top card is of the same colour as the base card (but not the same suit) then the Player pays the base amount to the Dealer. If the top card happens to be of a different colour than the base card, the Dealer pays the base amount to the Player.

Ghosh Babu played the game 4 times. First time he picked eight of clubs and the Dealer picked queen of clubs. Second time, he picked ten of hearts and the dealer picked two of spades. Next time, Ghosh Babu picked six of diamonds and the dealer picked ace of hearts. Lastly, he picked eight of spades and the dealer picked jack of spades. Answer the following questions based on these four games.`,sourcePages:['1.256'],questions:[]};
set11.questions=[
 q(set11.id,39,'If Ghosh Babu stopped playing the game when his gain would have been maximum, the gain in ₹ would have been','a',[mc('a','12'),mc('b','20'),mc('c','16'),mc('d','4')],'1.256'),
 q(set11.id,40,'The initial money Ghosh Babu had (before the beginning of the game sessions) was ₹ X. At no point did he have to borrow any money. What is the minimum possible value of X?','b',[mc('a','16'),mc('b','8'),mc('c','100'),mc('d','24')],'1.256'),
 q(set11.id,41,'If the amount of money that Ghosh Babu had with him at the end was ₹ 100, what was the initial amount he had with him?','d',[mc('a','120'),mc('b','8'),mc('c','4'),mc('d','96')],'1.256')
];

export const gamesSets: SetData[]=[set1,set2,set3,set4,set5,set6,set7,set8,set9,set10,set11];
export const gamesQuestions=gamesSets.flatMap(s=>s.questions);
export const gamesChapter: ChapterData={id:'games-tournaments-l1',title:'Games & Tournaments',level:'Level 1',description:'Games & Tournaments — Level 1',sets:gamesSets,questions:gamesQuestions};

// Backwards-compatible aliases for the original single-chapter implementation.
export const sets=gamesSets;
export const allQuestions=gamesQuestions;
