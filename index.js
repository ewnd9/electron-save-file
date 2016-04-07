'use strict';

const imageType = require('file-type');
const dialog = require('electron').dialog;
const fs = require('fs');
const through2 = require('through2');

module.exports = function(url) {
  function pipePromise(source, outputPath) {
    if (!outputPath) {
      return Promise.resolve();
    }

    const stream = source.pipe(fs.createWriteStream(outputPath));

    return new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  };

  const isFs = url.indexOf('file://') === 0 || url.indexOf('/') === 0;
  const isWeb = url.indexOf('http') === 0;

  if (!isFs && !isWeb) {
    throw new Error('unsupported protocol');
  }

  function getOutputPath(ext) {
    return dialog.showSaveDialog({ defaultPath: 'image.' + ext });
  };

  if (isFs) {
    const uri = url.replace('file\:\/\/', '');
    const buffer = require('read-chunk').sync(uri, 0, 12);

    const ext = imageType(buffer).ext;

    return pipePromise(fs.createReadStream(uri), getOutputPath(ext));
  } else if (isWeb) {
    const got = require('got');

    const promise = new Promise(resolve => {
      let resolved;

      const stream = got.stream(url).pipe(
        through2(function(chunk, enc, callback) {
          if (!resolved) {
            resolve({ ext: imageType(chunk).ext, stream });
            resolved = true;
          }

          this.push(chunk);
          callback();
        }
      ));
    });

    return promise
      .then(result => pipePromise(result.stream, getOutputPath(result.ext)));
  }
};
