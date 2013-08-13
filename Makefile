all: clean gapminder.js 

gapminder.js: $(shell smash --list src/gapminder.js)
	smash src/gapminder.js | uglifyjs - -b -o $@

gapminder.min.js: gapminder.js
	uglifyjs gapminder.js -m -c -o $@

clean:
	rm -f gapminder.js
