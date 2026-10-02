import type { Option, Question, SetData } from './data';

const mc = (label: string, text: string): Option => ({ label, text });
const q = (setId: string, number: number, questionText: string, answer: string, options: Option[] = [], sourcePage: string, answerType: 'mc' | 'tita' = 'mc', choices?: Option[]): Question => ({
  id: `generic-q${number}`,
  number,
  setId,
  questionText,
  answer,
  options,
  sourcePage,
  answerType,
  visualRequired: false,
  ...(choices ? { choices } : {}),
});

const set = (number: number, title: string, topic: string, range: [number, number], directions: string, commonInformation: string, sourcePages: string[]): SetData => ({
  id: `generic-set-${number}`,
  number,
  title,
  topic,
  questionRange: range,
  directions,
  commonInformation,
  sourcePages,
  questions: [],
});

const set1 = set(1, 'CAT study — brands & shirts', 'Matching / assignment', [1, 5], 'Directions for Questions 1 to 5: Answer the following questions based on the given information:', `Six friends Pawan, Qureshi, Raman, Shyam, Tarun and Unnat study for CAT in Mindworkzz and work in different brands namely—Adobe, Bennett, Clarks, Deloitte, Evergrande and Falguni, and each wears a different coloured, company-sponsored shirt, viz., blue, green, pink, yellow, purple and red, though not necessarily in the same order.
(i) The one wearing the blue shirt works in Deloitte and the one wearing a green shirt works in Adobe.
(ii) Unnat does not work in Clarks or Evergrande.
(iii) Pawan wears pink shirt and works in Bennett.
(iv) Shyam does not work in Evergrande and the purple coloured shirt is not sponsored by Clarks.
(v) Tarun works in Falguni and neither Shyam nor Qureshi work in Deloitte.
(vi) Evergrande does not sponsor purple or yellow coloured shirts and Raman works in Adobe.`, ['1.132']);
set1.questions = [
  q(set1.id,1,'Which colour shirt is sponsored by Clarks?','a',[mc('a','Yellow'),mc('b','Blue'),mc('c','Pink'),mc('d','Cannot be determined')],'1.132'),
  q(set1.id,2,'Which pair is correctly matched?','b',[mc('a','Red-Clarks -Pawan'),mc('b','Red-Evergrande- Qureshi'),mc('c','Green-Clarks-Raman'),mc('d','None of these')],'1.132'),
  q(set1.id,3,'Which of the following is true?','d',[mc('a','Falguni sponsors green shirts.'),mc('b','Shyam is working in Bennett'),mc('c','Tarun wears red shirt.'),mc('d','Red shirt is sponsored by Evergrande.')],'1.132'),
  q(set1.id,4,'What is the sequence of companies representing Pawan, Qureshi, Raman, Shyam, Tarun and Unnat?','b',[mc('a','Bennett, Deloitte, Adobe, Clarks, Evergrande, Falguni'),mc('b','Bennett, Evergrande, Adobe, Clarks, Falguni, Deloitte'),mc('c','Bennett, Adobe, Deloitte, Clarks, Evergrande, Falguni'),mc('d','None of these')],'1.132'),
  q(set1.id,5,'If Clarks and Deloitte decide to interchange the colours of the sponsored shirts, then which two persons will have to interchange their shirts?','a',[mc('a','Shyam and Unnat'),mc('b','Pawan and Raman'),mc('c','Tarun and Pawan'),mc('d','Qureshi and Shyam')],'1.132'),
];

const set2 = set(2, 'Weekend hiking friends', 'Sports & T-shirts', [6, 8], 'Directions for Questions 6 to 8: Answer the questions based on the information given below:', `Five friends Praveen, Bhuvan, Charlie, Dhawan and Elangovan go hiking together every weekend.
(i) Each of them wear T-shirts of different colours—red, yellow, blue, white and green (not necessarily in this order).
(ii) Each one of them like to play different sports, viz., Cricket, Tennis, Soccer, Pickleball and Padel.
(iii) Bhuvan, who likes to play Pickleball does not wear a yellow shirt. Charlie wears a red T-Shirt and does not like to play Cricket or Padel. Elangovan likes to play Tennis and does not wear a blue or yellow T-Shirt. Praveen likes to play Padel and Dhawan does not wear a yellow or green T-shirt.`, ['1.133']);
set2.questions = [
  q(set2.id,6,"What is the colour of Bhuvan’s T-Shirt?",'d',[mc('a','White'),mc('b','Blue'),mc('c','Green'),mc('d','Data inadequate')],'1.133'),
  q(set2.id,7,'What sports does Charlie like to play?','b',[mc('a','Padel'),mc('b','Soccer'),mc('c','Cricket'),mc('d','Data inadequate')],'1.133'),
  q(set2.id,8,'Which of the following combinations of person-colour-liking is correct?','c',[mc('a','Dhawan-Blue-Cricket'),mc('b','Elangovan-White-Tennis'),mc('c','Praveen-Yellow-Padel'),mc('d','None of these')],'1.133'),
];

const set3 = set(3, 'MBA students & books', 'Subject / student / author', [9, 11], 'Directions for Questions 9 to 11: Answer the questions on the basis of the information given below:', `Five MBA students—Arun, Bhavya, Cauvery, Dhritiman and Evaan have total five books on subjects—Organisational Behaviour, Business Mathematics, Accounting, Communication and Corporate Finance, which are written by authors Verma, Damodaran, Aswath, Sharma and Sinha. Each student has only one book on one of the five subjects.
(ii) Verma is the author of the Organisational Behaviour book which is not owned by Evaan or Arun. Dhritiman owns the book written by Sinha.
(iii) Cauvery owns the Accounting book. Evaan has the Corporate Finance book, which is not written by Damodaran. The book on Communication is written by Sharma.`, ['1.133']);
set3.questions = [
  q(set3.id,9,'Which of the following is the correct combination of subject-student and author?','d',[mc('a','Accounting-Cauvery-Aswath'),mc('b','Organisational Behaviour-Dhritiman-Verma'),mc('c','Corporate Finance-Evaan-Sinha'),mc('d','Communication-Arun-Sharma')],'1.133'),
  q(set3.id,10,'The Business Mathematics book has been penned by whom?','b',[mc('a','Verma'),mc('b','Sinha'),mc('c','Aswath'),mc('d','Data inadequate')],'1.133'),
  q(set3.id,11,'Who is the owner of the book written by Aswath?','b',[mc('a','Bhavya'),mc('b','Evaan'),mc('c','Arun'),mc('d','Dhritiman')],'1.133'),
];

const set4 = set(4, 'Four houses in sequence', 'Ordering / adjacency', [12, 12], '', `Persons X, Y, Z and Q live in red, green, yellow or blue coloured houses which are in a sequence on a street. Z lives in a yellow house. The green house is adjacent to the blue house. X does not live adjacent to Z. The yellow house is in between the green and red house.`, ['1.133']);
set4.questions = [q(set4.id,12,'The colour of the house, X lives in is:','a',[mc('a','Blue'),mc('b','Green'),mc('c','Red'),mc('d','Not possible to determine')],'1.133')];

const set5 = set(5, 'Five persons & residences', 'Residence / colour matching', [13, 13], '', `Five persons with names P, M, U, T and X live separately in any one of the following: in a palace, a hut, a fort, a house or a hotel. Each one likes two different colours from among the following: blue, black, red, yellow and green. U likes red and blue. T likes black. The person living in a palace does not like black or blue. P likes blue and red. M likes yellow. X lives in a hotel.`, ['1.133']);
set5.questions = [q(set5.id,13,'M lives in:','b',[mc('a','Hut'),mc('b','Palace'),mc('c','Fort'),mc('d','House')],'1.133')];

const set6 = set(6, 'Sunday lunch traditions', 'Meal / time / chinaware', [14, 14], '', `The Banerjees, the Sharmas, and the Pattabhiramans each have a tradition of eating Sunday lunch as a family. Each family serves a special meal at a certain time of day. Each family has a particular set of chinaware used for this meal. Use the clues below to answer the following questions:
(i) The Sharma family eats at noon.
(ii) The family that serves fried brinjal uses blue chinaware.
(iii) The Banerjee family eats at 2 o’clock.
(iv) The family that serves sambar does not use red chinaware.
(v) The family that eats at 1 o’clock serves fried brinjal.
(vi) The Pattabhiraman family does not use white chinaware.
(vii) The family that eats last likes makki-ki-roti.`, ['1.133']);
set6.questions = [q(set6.id,14,'Which one of the following statement is true?','c',[mc('a','The Banerjees eat makki-ki-roti at 2 o’clock, the Sharmas eat fried brinjal at 12 o’clock and the Pattabhiramans eat sambar from red chinaware.'),mc('b','The Sharmas eat sambar served in white chinaware, the Pattabhiramans eat fried brinjal at 1 o’clock and the Banerjees eat makki-ki-roti served in blue chinaware.'),mc('c','The Sharmas eat sambar at noon, the Pattabhiramans ent fried brinjal served in blue chinaware and the Banerjees eat makki-ki-roti served in red chinaware.'),mc('d','The Banerjees eat makki-ki-roti served in white chinaware, the Sharmas eat fried brinjal at 12 o’clock and the Pattabhiramans eat sambar from red chinaware.')],'1.133')];

const set7 = set(7, 'Students & favourite subjects', 'Family relations / subjects', [15, 16], 'Directions for Questions 15 to 16: Read the information and answer the questions.', `Amitabh, Bhagyashree, Chunky, Dharmendra, Ekta, Farhan and Govinda are students of a class. Each of them has a different favourite subject, viz., Economics, Commerce, Zoology, Sociology, Statistics, Urdu and Computers, but not necessarily in the same order. There are two such students whose one sister each is there in the group. There is no other relation among the students. No boy likes Commerce or Urdu. Dharmendra, who does not like Sociology and Statistics, is the brother of that student who likes Computers. The student who likes Sociology is the sister of that boy student who likes Economics. F is a boy student, B is sister of A.`, ['1.134']);
set7.questions = [
  q(set7.id,15,'Which of the following is a pair of brother-sister other than Amitabh and Bhagyashree?','d',[mc('a','Dharmendra and Govinda'),mc('b','Dharmendra and Chunky'),mc('c','Dharmendra and Ekta'),mc('d','Data Inadequate')],'1.134'),
  q(set7.id,16,'Which of the following is true?','c',[mc('a','Dharmendra likes Commerce.'),mc('b','Chunky, Bhagyashree and Dharmendra are girl students.'),mc('c','The number of girls is more than that of the number of boys in the group.'),mc('d','None of these.')],'1.134'),
];

const set8 = set(8, 'Class presentations', 'Day / subject scheduling', [17, 19], 'Directions for Questions 17 to 19: Read the information and answer the questions that follow.', `Five friends—Ramesh, Suresh, Tanveer, Umesh and Vikram—each present one paper to their class on Mathematics, History, Biology, Chemistry or Dermatology—one day a week, Monday through Friday.
(i) Vikram does not do Chemistry and does not give his presentation on Tuesday.
(ii) Suresh makes the Dermatology presentation and does not do it on Monday or Friday.
(iii) The Mathematics presentation is made on Thursday.
(iv) Tanveer presents his presentation, which is not on Chemistry, on Wednesday.
(v) The Biology presentation is on Friday, and not by Umesh.
(vi) Ramesh makes his presentation on Monday.`, ['1.134']);
set8.questions = [
  q(set8.id,17,'What day is the Chemistry presentation made?','b',[mc('a','Friday'),mc('b','Monday'),mc('c','Tuesday'),mc('d','Wednesday')],'1.134'),
  q(set8.id,18,'What presentation does Vikram do?','d',[mc('a','Chemistry'),mc('b','Dermatology'),mc('c','Mathematics'),mc('d','Biology')],'1.134'),
  q(set8.id,19,'What day does Umesh make his presentation on?','d',[mc('a','Monday'),mc('b','Tuesday'),mc('c','Wednesday'),mc('d','Thursday')],'1.134'),
];

const set9 = set(9, 'Students, colleges & cities', 'Three-way matching', [20, 24], 'Directions for Questions 20 to 24: Answer the questions on the basis of the information given below:', `Eight students A, B, C, D, E, F, G and H study in eight different colleges namely—Motilal College, Nagarjuna College, Oregon International, Presidium, Queen’s College, Ramjas College, Sriniwasan College and Thapar College, not necessarily in the same order. They live in eight different cities Delhi, Mumbai, Chandigarh, Patna, Lucknow, Kanpur, Chennai and Pune, not necessarily in the same order. It is also known that:
(i) G studies in Thapar College.
(ii) D who lives in Mumbai is not a student of Presidium.
(iii) C lives in Patna and studies in Queen’s College.
(iv) H lives in Chandigarh and studies in Nagarjuna College.
(v) The student who studies in Motilal College lives in Pune.
(vi) E is not from Pune.
(vii) B lives neither in Delhi nor in Chennai and he studies in Sriniwasan College.
(viii) Neither E nor F studies in Oregon International and the student who studies in Oregon International lives in Lucknow.`, ['1.134']);
set9.questions = [
  q(set9.id,20,'Who lives in Delhi?','d',[mc('a','A'),mc('b','E'),mc('c','F'),mc('d',"Can’t be determined")],'1.134'),
  q(set9.id,21,'Who studies in Ramjas College?','b',[mc('a','A'),mc('b','D'),mc('c','E'),mc('d','F')],'1.134'),
  q(set9.id,22,'Which of the following is a correct combination of student- college- city?','d',[mc('a','E- Motilal college -Pune'),mc('b','H- Thapar college- Delhi'),mc('c','E- Presidium - Delhi'),mc('d','D- Ramjas- Mumbai')],'1.134'),
  q(set9.id,23,'Which of the following combinations is not possible?','c',[mc('a','E- Presidium- Chennai'),mc('b','G- Thapar college- Delhi'),mc('c','H- Nagarjuna- Patna'),mc('d','E- Presidium- Delhi')],'1.134'),
  q(set9.id,24,'If additional information is given that Thapar College is in Delhi, which of the following is definitely false?','d',[mc('a','E lives in Chennai.'),mc('b','Presidium is in Chennai.'),mc('c','G lives in Delhi.'),mc('d','G lives in Chennai.')],'1.134'),
];

const set10 = set(10, 'Software engineers & tech summit', 'Company / day / salary', [25, 28], 'Directions for Questions 25 to 28: Five software engineers:', `Alan, Ben, Chris, Danny and Ervin participated in the International Tech Summit-2015 in Silicon Valley, California. They work in companies: Google, Microsoft, Facebook, Apple and Samsung, not necessarily in that order. They flew to California on different days of the week Monday, Tuesday, Wednesday, Thursday and Friday, not necessarily in that order. Their monthly salaries (in thousand dollars) are 11, 9, 58, 20 and 38, not necessarily in that order. It is also known that:
(i) Danny’s salary is second least in the group and he attended the summit on Thursday.
(ii) Chris does not work in Google and his salary package is 20,000 dollars per annum.
(iii) Engineers who attended the summit on Monday and Friday are from Samsung and Facebook respectively.
(iv) Ervin did not attend the summit on Monday.
(v) Ervin’s salary was equal to the sum of salaries of the engineers who reached on Tuesday and Wednesday.
(vi) Ben neither worked in Google nor is his salary the least amongst all engineers.`, ['1.135']);
set10.questions = [
  q(set10.id,25,'Who works in Microsoft?','d',[mc('a','Alan'),mc('b','Ben'),mc('c','Danny'),mc('d','Cannot be determined')],'1.135'),
  q(set10.id,26,'Which amongst the following is the possible sum of salaries of engineers working in Google and Apple? (figures are in dollars per annum)','a',[mc('a','49,000'),mc('b','47,000'),mc('c','58,000'),mc('d','69,000')],'1.135'),
  q(set10.id,27,'How much does Ervin make (in dollars per annum)?','58000',[],'1.135','tita'),
  q(set10.id,28,'When did the engineer working in Samsung attend the summit?','a',[mc('a','Monday'),mc('b','Tuesday'),mc('c','Wednesday'),mc('d','Friday')],'1.135'),
];

const set11 = set(11, 'Entry-level engineers', 'Salary / company / height', [29, 33], 'Directions for Questions 29 to 33: Five students namely—', `A, B, C, D and E got placed as entry level engineers in Microsoft, Yahoo, Google, Samsung and Facebook not necessarily in that order. They all have different heights, in the decreasing order of the person placed at Facebook, Samsung, Google, Microsoft and Yahoo. It is also known that:
(i) The Monthly salaries offered by Google, Microsoft and Yahoo to their entry-level engineers are 23970, 23790 and 12130 INR.
(ii) One of the remaining two companies offered 11230 INR per month and other offered a sum between 12010 and 22880 INR per month.
(iii) The sum of the monthly salaries of A and C is same as the sum of monthly salaries of B and E.
(iv) E was taller than B and A was taller than C.`, ['1.135']);
set11.questions = [
  q(set11.id,29,'Who could be placed at Samsung?','A, D or E',[],'1.135','tita'),
  q(set11.id,30,'Who could be placed at Facebook?','A, D or E',[],'1.135','tita'),
  q(set11.id,31,'Who could be placed at Google?','A or E',[],'1.135','tita'),
  q(set11.id,32,"What was D's monthly salary?",'11230',[],'1.135','tita'),
  q(set11.id,33,"What was the value of the 5th (unknown) salary package (per month)?",'12310',[],'1.135','tita'),
];

const set12 = set(12, 'Company trip — hosts & destinations', 'Four-way matching', [34, 38], 'Directions for Questions 34 to 38: Answer the questions on the basis of the information given below:', `Five employees - Amritesh, Bhanu, Chirag, Dhiraj and Edwin - work in five different companies - A, B, C, D and E - not necessarily in the same order. During their last company trip, they visited five different places- Hyderabad, Rio, Japan, Karachi and Guyana, not necessarily in the same order. Each of the five places was hosted by five different persons among Pawan, Ishan, Dipen, Bhupendra and Tarun. It is also known that:
(i) Amritesh who works in E, visited Guyana.
(ii) Dhiraj went to Rio, hosted by Dipen.
(iii) Bhanu visited the place where he was hosted by Tarun.
(iv) Chirag went to Karachi where he was hosted by Bhupendra.
(v) The employee who works in B visited the place where he was hosted by Ishan.
(vi) The employee who works in C visited Hyderabad.`, ['1.135']);
set12.questions = [
  q(set12.id,34,'Chirag works in which company?','d',[mc('a','A'),mc('b','B'),mc('c','E'),mc('d','Cannot be determined')],'1.135'),
  q(set12.id,35,'Who hosted Amritesh?','a',[mc('a','Pawan')],'1.135'),
  q(set12.id,36,'Who works in B?','c',[mc('a','Amritesh'),mc('b','Bhanu'),mc('c','Edwin'),mc('d','Cannot be determined')],'1.135'),
  q(set12.id,37,'Tarun hosted his guest in which of the following place?','b',[mc('a','Guyana'),mc('b','Hyderabad'),mc('c','Rio'),mc('d','Japan')],'1.135'),
  q(set12.id,38,'Which of the following is a correct combination of Person - Company of Work - Place Visited - Host For?','a',[mc('a','Bhanu - C - Hyderabad - Tarun'),mc('b','Dhiraj - D - Rio - Dipen'),mc('c','Chirag - A - Karachi - Bhupendra'),mc('d','Edwin - E - Guyana - Ishan')],'1.135'),
];

const set13 = set(13, 'Club friends', 'Professions / marriages', [39, 40], 'Directions for Questions 39 to 40: These questions are based on the situation given below:', `A, B, C, D, E and F are a group of friends from a club. There are two housewives, one lecturer, one architect, one accountant and one lawyer in the group. There are two married couples in the group. The lawyer is married to D who is a housewife. No lady in the group is either an architect or an accountant. C, the accountant, is married to F who is a lecturer. A is married to D and E is not a housewife.`, ['1.135','1.136']);
set13.questions = [
  q(set13.id,39,'What is E?','b',[mc('a','Lawyer'),mc('b','Architect'),mc('c','Lecturer'),mc('d','Accountant')],'1.136'),
  q(set13.id,40,'How many members of the group are male?','b',[mc('a','2'),mc('b','3'),mc('c','4'),mc('d','None of these')],'1.136'),
];

const set14 = set(14, 'Robot and five machines', 'Distance / timing', [41, 42], 'Directions for Questions 41 to 42: There are five machines', `There are five machines A, B, C, D and E situated on a straight line at distances of 10 metres, 20 metres, 30 metres, 40 metres and 50 metres respectively from the origin of the line. A robot is stationed at the origin of the line. The robot serves the machines with raw material whenever a machine becomes idle. All the raw material is located at the origin. The robot is in an idle state at the origin at the beginning of a day. As soon as one or more machines become idle, they send messages to the robot-station and the robot starts and serves all the machines from which it received messages. If a message is received at the station while the robot is away from it, the robot takes notice of message only when it returns to the station. While moving, it serves the machines in the sequence in which they are encountered, and then returns to the origin. If any messages are pending at the station when it returns, it repeats the process again. Otherwise, it remains idle at the origin till the next message(s) is (are) received.`, ['1.136']);
set14.questions = [
  q(set14.id,41,'Suppose on a certain day, machines A and D have sent the first two messages to the origin at the beginning of the first second, and C has sent a message at the beginning of the 5th second and B at the beginning of the 6th second, and E at the beginning of the 10th second. How much distance in metres has the robot travelled since the beginning of the day, when it notices the message of E? Assume that the speed of movement of the robot is 10 metres per second.','a',[mc('a','140'),mc('b','80'),mc('c','340'),mc('d','360')],'1.136'),
  q(set14.id,42,'Suppose there is a second station with raw material for the robot at the other extreme of the line which is 60 metres from the origin, that is, 10 metres from E. After finishing the services in a trip, the robot returns to the nearest station. If both stations are equidistant, it chooses the origin as the station to return to. Assuming that both stations receive the messages sent by the machines and that all the other data remains the same, what would be the answer to the above question?','a',[mc('a','120'),mc('b','140'),mc('c','340'),mc('d','70')],'1.136'),
];

const set15 = set(15, 'Stack of books', 'Minimum moves', [43, 43], 'Directions for Question 43:', `There is a vertical stack of books marked 1, 2, and 3 on Table-A, with 1 at the bottom and 3 on top. These are to be placed vertically on Table-B with 1 at the bottom and 2 on the top, by making a series of moves from one table to the other. During a move, the topmost book, or the topmost two books, or all the three, can be moved from one of the tables to the other. If there are any books on the other table, the stack being transferred should be placed on top of the existing books, without changing the order of books in the stack that is being moved in that move. If there are no books on the other table, the stack is simply placed on the other table without disturbing the order of books in it.`, ['1.136']);
set15.questions = [q(set15.id,43,'What is the minimum number of moves in which the above task can be accomplished?','d',[mc('a','One'),mc('b','Two'),mc('c','Three'),mc('d','Four')],'1.136')];

const set16 = set(16, 'Three independent puzzles', 'Ordering / matching', [44, 46], 'Directions for Questions 44 to 46: Read the three problems given below and choose the answer from among the four given choices.', ``, ['1.136','1.137']);
set16.questions = [
  q(set16.id,44,'Persons X, Y, Z and Q live in red, green, yellow or blue coloured houses placed in a sequence on a street. Z lives in a yellow house. The green house is adjacent to the blue house. X does not live adjacent to Z. The yellow house is in between the green and red houses. The colour of the house X lives in is:','a',[mc('a','blue'),mc('b','green'),mc('c','red'),mc('d','not possible to determine')],'1.136'),
  q(set16.id,45,'Five persons with names P, M, U, T and X live separately in any one of the following: A palace, a hut, a fort, a house or a hotel. Each one likes two different colours from among the following blue, black, red, yellow and green. U likes red and blue. T likes black. The person living in a palace does not like black or blue. P likes blue and red. M likes yellow. X lives in a hotel. M lives in a:','b',[mc('a','hut'),mc('b','palace'),mc('c','fort'),mc('d','house')],'1.136'),
  q(set16.id,46,'There are ten animals—two each of lion, panther, bison, bear, and deer, in a zoo. The enclosures in the zoo are named X, Y, Z, P and Q and each enclosure is allotted to one of the following attendants Jack, Mohan, Shalini, Suman and Rita. Two animals of different species are housed in each enclosure. A lion and a deer cannot be together. A panther cannot be with either a deer or a bison. Suman attends to animals from among bison, deer, bear and panther only. Mohan attends to a lion and a panther. Jack does not attend to deer, lion or bison. X, Y and Z are allotted to Mohan, Jack and Rita respectively. X and Q enclosures have one of the same species. Z and P have the same pair of animals. The animals attended by Shalini are','c',[mc('a','Bear and bison'),mc('b','Bison and deer'),mc('c','Bear and lion'),mc('d','Bear and panther')],'1.137'),
];

const set17 = set(17, 'Family gathering', 'Family tree / minimum count', [47, 47], 'Directions for Question 47:', `In a family gathering there are two males who are grandfathers and four males who are fathers. In the same gathering there are two females who are grandmothers and four females who are mothers. There is at least one grandson or a granddaughter present in this gathering. There are two husband wife pairs in this group. These can either be a grandfather and a grandmother, or a father and a mother. The single grandfather (whose wife is not present) has two grandsons and a son present. The single grandmother (whose husband is not present) has two grand daughters and a daughter present. A grandfather or a grandmother present with their spouses does not have any grandson or granddaughter present.`, ['1.137']);
set17.questions = [q(set17.id,47,'What is the minimum number of people present in this gathering?','b',[mc('a','10'),mc('b','12'),mc('c','14'),mc('d','16')],'1.137')];

const set18 = set(18, 'Dog description', 'Truth / lie logic', [48, 49], 'Directions for Questions 48 to 49: Answer the questions independent of each other.', '', ['1.137']);
set18.questions = [
  q(set18.id,48,'While Balbir had his back turned, a dog ran into his butcher shop, snatched a piece of meat off the counter and ran out. Balbir was mad when he realised what had happened. He asked three other shopkeepers, who had seen the dog, to describe it. The shopkeepers really didn’t want to help Balbir. So each of them made a statement which contained one truth and one lie.\n\nA. Shopkeeper Number 1 said: “The dog had black hair and a long tail.”\nB. Shopkeeper Number 2 said: “The dog had a short tail and wore a collar.”\nC. Shopkeeper Number 3 said: “The dog had white hair and no collar.”\n\nBased on the above statements, which of the following could be a correct description?','b',[mc('a','The dog had white hair, short tail and no collar.'),mc('b','The dog had white hair, long tail and a collar.'),mc('c','The dog had black hair, long tail and a collar.'),mc('d','The dog had black hair, long tail and no collar.')],'1.137'),
  q(set18.id,49,'Mrs. Ranga has three children and has difficulty remembering their ages and the months of their birth. The clues below may help her remember.\n\nA. The boy, who was born in June, is 7 years old.\nB. One of the children is 4 years old, but is not Anshuman.\nC. Vaibhav is older than Supriya.\nD. One of the children was born in September but it was not Vaibhav.\nE. Supriya’s birthday is in April.\nF. The youngest child is only 2 years old.\n\nBased on the above clues, which one of the following statements is true?','c',[mc('a','Vaibhav is the oldest, followed by Anshuman who was born in September, and the youngest is Supriya who was born in April.'),mc('b','Anshuman is the oldest being born in June, followed by Supriya who is 4 years old, and the youngest is Vaibhav who is 2 years old.'),mc('c','Vaibhav is the oldest being 7 years old, followed by Supriya who was born in April, and the youngest is Anshuman who was born in September.'),mc('d','Supriya is the oldest, who was born in April, followed by Vaibhav who was born in June, and Anshuman who was born in September.')],'1.137'),
];

const dataSuffDirections = `In each question there are two statements A and B.\n\nChoose (a) if the question can be answered by one of the statements alone but not by the other.\n\nChoose (b) if the question can be answered by using either statement alone.\n\nChoose (c) if the question can be answered by using both the statements together but cannot be answered using either statement alone.\n\nChoose (d) if the question cannot be answered even by using both the statements A and B.`;
const dsChoices50: Option[] = [
  mc('a', 'The question can be answered by one of the statements alone but not by the other.'),
  mc('b', 'The question can be answered by using either statement alone.'),
  mc('c', 'The question can be answered by using both the statements together but cannot be answered using either statement alone.'),
  mc('d', 'The question cannot be answered even by using both the statements A and B.'),
];
const dsChoices54: Option[] = [
  mc('a', 'The question can be answered by using statement A alone but not by using B alone.'),
  mc('b', 'The question can be answered by using statement B alone but not by using A alone.'),
  mc('c', 'The question can be answered by using either statement alone.'),
  mc('d', 'The question can be answered by using both the statements together but not by either Statement alone.'),
];
const set19 = set(19, 'Family data sufficiency', 'Data sufficiency', [50, 50], 'Directions for Question 50:', dataSuffDirections, ['1.137']);
set19.questions = [q(set19.id,50,'F and M are father and mother of S, respectively. S has four uncles and three aunts. F has two siblings. The siblings of F and M are unmarried. How many brothers does M have?','a',[mc('a','F has two brothers.'),mc('b','M has five siblings.')],'1.137','mc',dsChoices50)];

const set20 = set(20, 'Friends & professions', 'Professions / marriages', [51, 53], 'Directions for Questions 51 to 53: Answer the questions on the basis of the information given below:', `A, B, C, D, E and F are a group of friends. There are two housewives, one professor, one engineer, one accountant and one lawyer in the group. There are only two married couples in the group. The lawyer is married to D, who is a housewife. No woman in the group is either an engineer or an accountant. C, the accountant, is married to F, who is a professor. A is married to a housewife. E is not a housewife.`, ['1.137','1.138']);
set20.questions = [
  q(set20.id,51,'Which of the following is one of the married couples?','d',[mc('a','A and B'),mc('b','B and E'),mc('c','D and E'),mc('d','A and D')],'1.138'),
  q(set20.id,52,'What is E’s profession?','a',[mc('a','Engineer'),mc('b','Lawyer'),mc('c','Professor'),mc('d','Accountant')],'1.138'),
  q(set20.id,53,'How many members of the group are males?','c',[mc('a','2'),mc('b','2'),mc('c','3'),mc('d',"Can't be determined")],'1.138'),
];

const set21 = set(21, 'Cricket man of the match', 'Data sufficiency', [54, 54], 'Directions for Question 54: The question given below is followed by two statements, A and B. Answer the question using the following instructions:', `Choose (a): if the question can be answered by using statement A alone but not by using B alone.\nChoose (b): if the question can be answered by using statement B alone but not by using A alone.\nChoose (c): if the question can be answered by using either statement alone.\nChoose (d): if the question can be answered by using both the statements together but not by either Statement alone.`, ['1.138']);
set21.questions = [q(set21.id,54,'In a cricket match, the ‘man of the match’ award is given to the player scoring the highest number of runs. In case of a tie, the player (out of those locked in the tie) who has taken the higher number of catches is chosen. Even thereafter if there is a tie, the player (out of those locked in the tie) who has dropped fewer catches is selected. Aakash, Biplab and Chirag, who were contenders for the award dropped at least one catch each. Biplab dropped 2 catches more than Aakash did, scored 50, and took 2 catches. Chirag got two chances to catch and dropped both. Who was the ‘man of the match’?','d',[mc('a','Chirag made 15 runs less than both Aakash and Biplab.'),mc('b','The catches dropped by Biplab are 1 more than the catches taken by Aakash.')],'1.138','mc',dsChoices54)];

const set22 = set(22, 'Passport application', 'Day / sequence', [55, 55], 'Directions for Question 55:', `Divayabh gave an application for a new passport to the clerk on Monday afternoon. Next day was a holiday. So the clerk cleared the papers on the next working day on resumption of duty. The senior clerk checked it on the same day but forwarded it to the head clerk on the next day. The head clerk decided to dispose the case on the subsequent day.`, ['1.138']);
set22.questions = [q(set22.id,55,'On which of the following days was the case put up to the head clerk by the senior clerk?','b',[mc('a','Wednesday'),mc('b','Thursday'),mc('c','Friday'),mc('d','None of these')],'1.138')];

export const genericSets: SetData[] = [set1,set2,set3,set4,set5,set6,set7,set8,set9,set10,set11,set12,set13,set14,set15,set16,set17,set18,set19,set20,set21,set22];
export const genericQuestions = genericSets.flatMap(s => s.questions);
