# DNN webportal #



## What is this repository for? ##
------
* This webportal for creating instance to run DNN.
* Version 0.1.14

## How do I get set up? ##
------
```
npm install
```
* for install modules

```
npm start
```
* need `npm run build` in first
* for development, run dev-server
* open 'localhost:8080' on browser

```
npm run dll
npm run app
```
* package dll(bundle.js,bundle2.js,bundle3.js) and app(app.js)
* the files will generate in build folder

```
npm run styleguide
```
* The compnent document
* open 'localhost:6060' on browser


|#|command|generate|
| - | ----------- | ------------ |
| 1 |npm run dll|`bundle.js`,`bundle.js.gz`,`bundle.manifest.json`,`bundle2.js`,`bundle2.js.gz`,`bundle2.manifest.json`,`bundle3.js`,`bundle3.js.gz`,`bundle3.manifest.json`,`bundle4.js`,`bundle4.js.gz`,`bundle4.manifest.json`,`report.dll.html`,`stats.dll.json`|
| 2 |npm run app|`app.js`,`app.js.gz`,`report.app.html`,`stats.app.json`,`index.html`,`main.css`,`/image`,`/locales`,`/res`|
| 3 |npm start  |`stats.dev.json`|

```
npm run build
```
* package all (dll and app)
* the files will generate in build folder

## Built With (major)
* [Reactjs](https://facebook.github.io/react/)
* [Babel](https://babeljs.io/)
* [Redux](https://github.com/reactjs/redux)
* [material-ui](http://www.material-ui.com/)
* [pdfmake](http://pdfmake.org)
* [React Styleguidist](https://react-styleguidist.js.org/)
* [react-ga](https://github.com/react-ga/react-ga)

## Package With
* [Webpack](https://github.com/webpack/webpack) - module bundler
	* [UglifyJS](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) - minify JavaScript
	* [Compression](https://github.com/webpack-contrib/compression-webpack-plugin) - compressed static assets
	* [HappyPack](https://github.com/amireh/happypack) - allowing you to transform multiple files in parallel
	* [DllPlugin](https://webpack.js.org/plugins/dll-plugin/) - split bundles

## Package Analysis ##
------
###report.app.html
|js|State size|Parse size|Gzipped size|
| --- | --------- | --------- | --------- |
|app.js|613.02KB|280.61KB|70.18KB|

* app.js: kernal code of web
![alt text](/src/app/image/readme/app.PNG "app.js")

###report.dll.html
|js|State size|Parse size|Gzipped size|
| ---------| --------- | --------- | --------- |
|bundle.js|4.97 MB|1.71 MB|456.08 KB|
|bundle2.js|2.83 MB|1.08 MB|483.42 KB|
|bundle3.js|753.74 KB|754.66 KB|531.784 KB|
|bundle4.js|14.86 MB|14.86 MB|8.15 MB|
|All|23.02 MB|18.03 MB|9.34 MB|

* bundle.js: 3rd party modules
* bundle2.js: PDF modules
* bundle3.js: images (with base64)
* bundle4.js: font

![alt text](/src/app/image/readme/dll.PNG "dll.js")

### other Analysis tools
* put JSON file( `stats.dev.json` , `stats.app.json` , `stats.dll.json` ) on these website
	* analyse - https://github.com/webpack/analyse
	* webpack-visualizer - https://chrisbateman.github.io/webpack-visualizer/
	* webpack-chart - https://alexkuz.github.io/webpack-chart/

## Contribution guidelines ##
------
* A40503
* Kevin Huang
* Yenhsuan

### Who do I talk to? ###
------
* Me or my boss, perhaps.

### Change log ###
------
last update 2017-09-12

* `0.1.14` add styleguid
* `0.1.13` add comment on proptype of compnents
* `0.1.12` add base64 image
* `0.1.11` add GA
* `0.1.10` add sshWeb
* `0.1.9` loading status counting, auto refresh after loading 10s
* `0.1.8` add traditional chinese PDF 
* `0.1.7` change history table
* `0.1.6` add PDF tutorial
* `0.1.5` prototype