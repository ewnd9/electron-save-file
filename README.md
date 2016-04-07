# electron-save-file

Save file function for [`electron`](https://github.com/electron-userland/electron-prebuilt).

Handle both remote and local links and auto-detect file extensions via [`file-type`](https://github.com/sindresorhus/file-type) module

## Install

```
$ npm install electron-save-file --save
```

## Usage

```js
// in renderer
const saveFile = require('remote').require('electron-save-file');
saveFile('<path>') // should begins with 'http' or 'file://' or '/'
  .then(() => console.log('saved'))
  .catch(err => console.error(err.stack));
```

## Acknowledgement

- https://github.com/jdittrich/Electron_appFileOperations doesn't handle extensions

## License

MIT © [ewnd9](http://ewnd9.com)
