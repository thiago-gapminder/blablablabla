Description
-----------

**gapminder.js** is a JavaScript library that provides visualizations of world
data using [D3.js](http://d3js.com). **gapminder.js** is developed at Gapminder in Stockholm
as part of the Gapminder School project, and is distributed under the CC 3.0
(see LICENSE).

Building
--------

In case you make changes to the source code and you want to create a new `gapminder.js`
file, follow the instructions below.

First, download the project from the command line:

```
git clone git://github.com/thiago-gapminder/blablablabla.git
```

Next, install [clean-css](http://github.com/GoalSmashers/clean-css), [Smash](http://github.com/mbostock/smash) and [UglifyJS](https://github.com/mishoo/UglifyJS2):

```
npm install clean-css smash uglify-js
```

This will install these three node-js libraries. Make sure the path to cleancss, smash and
uglifyjs is exported to the `$PATH` variable. If not, you have two options: export the path
to cleancss, smash and uglifyjs to `$PATH` or edit `Makefile` and change where it reads
`cleancss` to `/path/to/cleancss`, `smash` to `/path/to/smash` and `uglifyjs` to
`/path/to/uglifyjs`.

To export the paths to `$PATH`, add the following to your `~/.bash_profile`:

```sh
export SMASH_PATH=/path/to/smash
export UGLIFYJS_PATH=/path/to/uglifyjs
export CLEANCSS_PATH=/path/to/cleancss
export PATH=$PATH:$SMASH_PATH:$UGLIFYJS_PATH
```

Usually, the path to these are `~/node_modules/clean-css/bin`, `~/node_modules/smash` and
`~/node_modules/uglify-js/bin`.

Now, head to the directory where you cloned the repository. Type `make`. This will generate
three files, `gapminder.css`, `gapminder.js` and `gapminder.min.js`, which can now be
imported into html and used.

Usage
-----

To use `gapminder.js` you will need to add the following to the `<head>` tag of
your html page:

```html
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="gapminder.js" charset="utf-8">
<link href="gapminder.js.css" rel="stylesheet" charset="utf-8">
```

Data
----

Example
-------

The following example creates a *Income Mountain* visualization. Make sure you have the
data.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Income Mountain Viz</title>
  </head>
  <body>
    <div id="income_mountain"></div>
  </body>
  <script type="text/javascript" src="../../d3.v3.js" charset="utf-8"></script>
  <script type="text/javascript" src="../../gapminder.js" charset="utf-8"></script>
  <link type="text/css" href="../../gapminder.css" rel="stylesheet" charset="utf-8">
  <script type="text/javascript">
    var o = gapminder.income_mountain({
      div: "#income_mountain",
      geo: "WORLD"
    });
  </script>
</html>
```


About Gapminder School
======================

*Gapminder School* is a free teaching material that makes it easy to understand
global development. Our vision is to give all students a fact-based worldview.

Gapminder School is composed of educational videos, slideshow presentations,
print-material, data-visualization tools, data tables, exercises,
exam-questions and teacher guides. Together, the material gives students a
consistent visual framework for learning and remembering macro-trends and
patterns of contemporary social, economic and demographic statistics.

By combining local and global perspectives in the same visualizations, and
showing the long historic trends leading up to the world today, students can
understand what the world is like. All statistics can be traced back to the
original sources. Gapminder will keep updating the data as new numbers are
released.

An international teacher-community helps improve and translate the material,
making it useful in more and more classrooms across the world.

The project is funded by Gapminder’s own resources together with multiple
independent donors. Gapminder School does not require computers or print
material in the classroom. With computers it can be used online or downloaded
on Windows, Mac & Linux.

All material is free to copy, change, integrate, sell and spread under the
creative common attribution license with open source code.

The Gapminder Foundation is a Swedish not-for-profit organization, independent
from political, commercial and religious affiliations. Gapminder’s mission is
to fight devastating ignorance with a fact-based worldview that everyone can
understand. Gapminder’s chairman Hans Rosling is a professor of International
Health at the Karolinska Institute, Stockholm, Sweden.

Copyright
---------

The product is provided under Creative Common License: Attribution License (CC BY 3.0).

The source code is provided under the new BSD license.

<p align="right">
  <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank"><img src="http://i.creativecommons.org/l/by/3.0/88x31.png"></a>
</p>
