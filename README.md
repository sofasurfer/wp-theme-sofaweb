# Cite du temps Prototype

Boilerplate for frontend development @ cubegrafik GmbH.


## Requirements to work on cubestrap

### Install tools for development on your computer
* [Install npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm).
* Install gulp-cli globally `npm install gulp-cli -g` (if you have previously installed a version of gulp globally, please run `npm rm --global gulp` to make sure your old version doesn't collide with gulp-cli.).
* Install Sass
  * [Install ruby](http://rubyinstaller.org/) (check ruby version: `ruby -v`)
  * Install Sass `gem install sass` (check Sass version: `sass --version`).

### Install tools in the folder of cubestrap (`cd` in terminal to the folder of cubestrap on your computer)
* Install gulp locally (`npm install gulp -D`).
* Install all the other stuff via npm `npm install` (you find these things in the `npm_modules` folder).

## Things to consider while developing
* Customize settings in `gulpconfig.js` if necessary.
* Copy [dependencies](#dependencies) into `src` folder with `gulp dependencies` (you need to do this only once).
* Start tooling with `gulp`.

## File structure
```
.
|
|--- .gitignore
|--- README.md
|--- gulpconfig.js
|--- package.json
|
|___ dist (Folder for distribution [generated via gulp])
|
|
|___ gulpfile.js (gulp tasks)
|   |
|   |--- index.js
|   |___ tasks-active
|   |___ tasks-inactive
|
|
|___ src (Folder for development)
|   |
|   |
|   |___ assets
|       |
|   	|___ img
|       |   |
|       |   |___ background
|       |   |___ icon
|       |   
|       |___ js
|       |   |
|       |   |--- full.js
|       |   |--- minimal.js
|       |   |___ fulljs
|       |   |___ legacy
|       |   |___ minimaljs
|       |
|       |___ scss
|           |
|           |--- main.js
|           |___ common
|           |___ components
|           |___ helper
|           |___ layout
|
|
|___ templates
|   |
|   |--- index.html
|   |___ components
|
|
.
```

## Dependencies

OpenSource Dependencies to evaluate for specified use cases/components:

* Carousel/Slider: [Siema](https://pawelgrzybek.github.io/siema/)
* Lazy loading of images: [Lazysizes](https://github.com/aFarkas/lazysizes)

These dependencies could be loaded automatically via a package manager (npm) and copied into `src` folder of cubestrap via gulp task `gulp dependencies`.
