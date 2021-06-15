const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    const decodeStrings =
      options && options.hasOwnProperty('decodeStrings') ? options.decodeStrings : false;
    super({...options, decodeStrings});
    this._limit = options.limit;
    this._chunksLength = 0;
  }

  _transform(chunk, encoding, callback) {
    let error;
    try {
      this._chunksLength += Buffer.from(chunk, encoding).length;

      if (this._limit !== undefined && this._limit < this._chunksLength) {
        return callback(new LimitExceededError());
      }
    } catch (e) {
      error = new LimitExceededError(e.message);
    }
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
