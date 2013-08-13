all: clean gapminder.css gapminder.js gapminder.min.js

gapminder.css:
	cat src/**/*.css | cleancss -o $@

gapminder.js: $(shell smash --list src/gapminder.js)
	smash src/gapminder.js | uglifyjs - -b -o $@

gapminder.min.js: gapminder.js
	uglifyjs gapminder.js -m -c -o $@

clean:
	rm -f gapminder.js
	rm -f gapminder.min.js
	rm -f gapminder.css
