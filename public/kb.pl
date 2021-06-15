/*Import JS Tau-Prolog library to invoke JS functions later*/
:- use_module(library(js)).

start :- guess(Person), ask(Person), undo.

/* guesses to be tested */
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
guess(unknown).

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

/* Facts about some features */
profession(footballer).
profession(actor).
profession(singer).
profession(president).

nationality(egyptian).
nationality(american).
nationality(british).
nationality(portuguese).
nationality(argentine).


/* classification rules */
female:- \+ verify(male).
no(X):- yes(Y), profession(X), profession(Y).
no(X):- yes(Y), nationality(X), nationality(Y).


/* How to verify something */
/*
REWRITE COMMENT HERE
*/
verify(Feature) :-
   (yes(Feature) -> true ;
    (no(Feature) -> fail ;
    ask(Feature))).


consoleLog(Value) :- prop(printtt, Printtt), apply(Printtt, [Value], _).

/* How to ask questions */

/*Invoke JS function to create a prompt and get answer from the user*/
ask(Question) :-
    /*prop(ask, Ask), apply(Ask, [Question], Response),*/
    atom_concat('http://localhost:8080/ask?q=', Question, URL),
    atom_concat('BEARER ', '123', AuthorizationToken),
    ajax(get, URL, RESULT, []), consoleLog(Question), consoleLog(RESULT),
    ((RESULT == yes)
      ->
       assertz(yes(Question)) ;
       assertz(no(Question)), fail).

:- dynamic(yes/1).
:- dynamic(token/1).
:- dynamic(no/1).

/* undo all yes/no assertions */
undo :- retract(yes(_)),fail.
undo :- retract(no(_)),fail.
undo.