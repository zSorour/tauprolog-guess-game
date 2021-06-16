/*Import JS Tau-Prolog library to invoke JS functions later*/
:- use_module(library(js)).

/*Starting clause to be queried once the Prolog Knowledge Base is loaded*/
start :- guess(Person), ask(Person), undo.

/* guesses to be tested */
/*
Once the start clause is queried, the guess(Person) clause gets queried and Prolog
internally creates a search tree structure that is traversed in a DFS fashion until it unifies the Person variable
with the match character
*/

/*The cut operator '!' prevents backtracking after finding a match*/
guess(mohamed_salah)   :- mohamed_salah, !.
guess(halle_berry)     :- halle_berry, !.
guess(messi) :- messi, !.
guess(angelina_jolie)     :- angelina_jolie, !.
guess(barack_obama)   :- barack_obama, !.
guess(dua_lipa)   :- dua_lipa, !.
guess(donald_trump) :- donald_trump, !.
guess(jennifer_aniston) :- jennifer_aniston, !.
guess(leonardo_dicaprio) :- leonardo_dicaprio, !.
guess(ed_sheeran) :- ed_sheeran, !.
guess(will_smith) :- will_smith, !.
guess(ronaldo) :- ronaldo, !.
guess(unknown_character).

/* Person identification rules */
mohamed_salah :- verify(male),
           verify(footballer),
           verify(liverpool_player),
           verify(egyptian).

halle_berry :- female,
         verify(actor),
         verify(dark_skin),
         verify(acted_in_catwoman).

messi :- verify(male),
         verify(footballer),
         verify(barcelona_player),
         verify(argentine).

angelina_jolie :- female,
                verify(actor),
                verify(acted_in_maleficent).

barack_obama :- verify(male),
            verify(president),
            verify(american),
            verify(presidency_2009_2017).

dua_lipa :- female,
          verify(singer),
          verify(british),
          verify(sing_in_champions_league_final_2018).

donald_trump :- verify(male),
            verify(president),
            verify(american),
            verify(presidency_2017_2021).

jennifer_aniston :- female,
                verify(actor),
                verify(acted_in_friends),
                verify(ex_spouse_of_brad_pitt).

leonardo_dicaprio :- verify(male),
              verify(actor),
              verify(american),
              verify(acted_in_the_wolf_of_wall_street),
              verify(oscar_2016).

ed_sheeran :- verify(male),
            verify(singer),
            verify(british),
            verify(sing_in_shape_of_you).

will_smith :- verify(male),
            verify(actor),
            verify(american),
            verify(acted_in_the_pursuit_of_happiness).

ronaldo :- verify(male),
           verify(footballer),
           verify(juventus_player),
           verify(portuguese).           

/* Categorizing related facts in terms of profession and nationality*/
profession(footballer).
profession(actor).
profession(singer).
profession(president).

nationality(egyptian).
nationality(american).
nationality(british).
nationality(portuguese).
nationality(argentine).


/* Rules */
female:- \+ verify(male).
no(X):- yes(Y), profession(X), profession(Y).
no(X):- yes(Y), nationality(X), nationality(Y).


/* Verify a Feature by checking whether we have a yes(Feature) or no(Feature)
  If we have yes(Feature), this means that we already know that the feature exists and no need to ask the server,
  if we have no(Feature), this means that we alreadu know that the feature does not exist and there is no need to ask the server,
  else, we have neither yes or no answer and we do not know, hence we ask the server using ask(Feature).
*/
verify(Feature) :-
   (yes(Feature) -> true ;
    (no(Feature) -> fail ;
    ask(Feature))).

/*
Define a clause setQA/2 that takes Question and Answer variables and invokes a JavaScript function
passing to it the Question and Answer variables.
Function invokation is done using Tau-Prolog's built-in predicates prop/2 that gets an object from the Global JS Object,
and the predicate apply/3 which invokes the function represented in the object retrieved from prop/2.
The last argument of apply/3 represents the return value of the function. Since the function does not return anything,
and we are not concerned with the returned value anyway, we set an anonymous varaible using _.
*/
setQA(Question, Answer) :- prop(setQuestionAnswer, SetQuestionAnswer), apply(SetQuestionAnswer, [Question, Answer], _).

/*
Ask the server whether a feature exists in the target character or not,
Read the response and assert accordingly.

We use atom_concat/3 to form the request url string.
atom_concat/3 is also used to form the authorization header value by concatenating BEARER with the token itself,
following the standard of JWT authoriaztion.

We make HTTP Request to the server using Tau-Prolog's predicate ajax/4.
*/
ask(Question) :-
    atom_concat('http://localhost:8080/ask?q=', Question, URL),
    prop(getToken, GetToken), apply(GetToken, [Question], Token),
    atom_concat('BEARER ', Token, AuthorizationToken),
    ajax(get, URL, RESULT, [headers([-(authorization, AuthorizationToken)])]),
    setQA(Question, RESULT),
    ((RESULT == yes)
      ->
       assertz(yes(Question)) ;
       assertz(no(Question)), fail).

/*
Inform the interpreter that the defintion of predicates yes and no may change throughout running the program,
for example asserting or retracting facts regarding the predicate.
*/
:- dynamic(yes/1).
:- dynamic(no/1).


/*
Define undo predicate to retract (delete) all dynamic assertions created previously for the yes and no predicates.
This typically happens after the character is correctly guessed.
*/
undo :- retract(yes(_)),fail.
undo :- retract(no(_)),fail.
undo.