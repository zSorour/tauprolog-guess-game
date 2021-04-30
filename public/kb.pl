/* prolog tutorial 2.17 Animal identification game.

    start with ?- go.     */
:- use_module(library(js)).

start :- guess(Animal), undo.

/* hypotheses to be tested */
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
Instead of ask(S) if there is no yes or no predicates in the KB,
we return a result as false.
We check on client side, if it is false, we ask the server for answer.
We then assertz the answer whether it is a yes or no.
*/
verify(S) :-
   (yes(S) -> true ;
    (no(S) -> fail ;
    prop(ask, Ask), apply(Ask, [S], _))).


/* PROBABLY REFACTORED!!! how to ask questions */
/*ask(Question) :-
    write('Does the animal have the following attribute: '),
    write(Question),
    write('? '),
    read(Response),
    nl,
    ( (Response == yes ; Response == y)
      ->
       assert(yes(Question)) ;
       assert(no(Question)), fail).*/

:- dynamic(yes/1).
:- dynamic(no/1).



/* undo all yes/no assertions */
undo :- retract(yes(_)),fail.
undo :- retract(no(_)),fail.
undo.
