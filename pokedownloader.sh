#!/bin/bash

for i in `seq 1 152`; do
	#DO YOU EVEN LIFT?
	curl http://www.pokeapi.co/media/img/$i.png > $i.png
done
