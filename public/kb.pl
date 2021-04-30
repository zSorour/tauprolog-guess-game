/* start with ?- start.     */

/*Import JS Tau-Prolog library to invoke JS functions later*/
:- use_module(library(js)).

start :- guess(Animal), ask(Animal), undo.

/* guesses to be tested */
guess(cheetah)   :- cheetah, !.
guess(tiger)     :- tiger, !.
guess(giraffe)   :- giraffe, !.
guess(zebra)     :- zebra, !.
guess(ostrich)   :- ostrich, !.
guess(penguin)   :- penguin, !.
guess(albatross) :- albatross, !.
guess(unknown).             /* no diagnosis */

/* animal identification rules */
cheetah :- mammal,
           carnivore,
           verify(has_tawny_color),
           verify(has_dark_spots).
tiger :- mammal,
         carnivore,
         verify(has_tawny_color),
         verify(has_black_stripes).
giraffe :- ungulate,
           verify(has_long_neck),
           verify(has_long_legs).
zebra :- ungulate,
         verify(has_black_stripes).

ostrich :- bird,
           verify(does_not_fly),
           verify(has_long_neck).
penguin :- bird,
           verify(does_not_fly),
           verify(swims),
           verify(is_black_and_white).
albatross :- bird,
             verify(appears_in_story_Ancient_Mariner),
             verify(flys_well).

/* classification rules */
mammal    :- verify(has_hair), !.
mammal    :- verify(gives_milk).
bird      :- verify(has_feathers), !.
bird      :- verify(flys),
             verify(lays_eggs).
carnivore :- verify(eats_meat), !.
carnivore :- verify(has_pointed_teeth),
             verify(has_claws),
             verify(has_forward_eyes).
ungulate :- mammal,
            verify(has_hooves), !.
ungulate :- mammal,
            verify(chews_cud).


/* How to verify something */
/*
REWRITE COMMENT HERE
*/
verify(Feature) :-
   (yes(Feature) -> true ;
    (no(Feature) -> fail ;
    ask(Feature))).


/* How to ask questions */

/*Invoke JS function to create a prompt and get answer from the user*/
ask(Question) :-
    prop(ask, Ask), apply(Ask, [Question], Response),
    ( (Response == yes ; Response == y)
      ->
       assertz(yes(Question)) ;
       assertz(no(Question)), fail).

:- dynamic(yes/1).
:- dynamic(no/1).

/* undo all yes/no assertions */
undo :- retract(yes(_)),fail.
undo :- retract(no(_)),fail.
undo.