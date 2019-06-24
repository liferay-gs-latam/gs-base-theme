# GS Base Theme

## Install dependencies

> Yeoman to create themes

```js
npm install -g yo
```

> Liferay theme generator

```js
npm install -g generator-liferay-theme@^8.x.x
```

> Project dependencies

```js
npm i
```

## Configuring your theme app server

```js
gulp init
```

## Deploy theme

```
gulp deploy

```

## Webpack JS Bundle

> Generate Webpack Bundle.js (Production Mode)

```js
npm run build-webpack
```

*OBS*: This mode is already executed when you run `gulp deploy` liferay theme task.

> Generate Webpack Bundle.js (Developer Mode)

```js
npm run dev-webpack
```