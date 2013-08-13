all: clean gapminder.js 

css:
	cat src/**/*.css | cleancss -o gapminder.css

js: $(shell smash --list src/gapminder.js)
	smash src/gapminder.js | uglifyjs - -b -o $@

min: gapminder.js
	uglifyjs gapminder.js -m -c -o $@

clean:
	rm -f gapminder.js
