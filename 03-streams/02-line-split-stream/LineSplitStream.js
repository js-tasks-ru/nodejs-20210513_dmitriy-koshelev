const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._chunkBuff = '';
  }

  _transform(chunk, encoding, callback) {
    try {
      const fullChunk = this._chunkBuff + chunk.toString();
      const chunkArr = fullChunk.split(os.EOL);
      if (chunkArr[chunkArr.length-1] !== '') {
        this._chunkBuff = chunkArr.pop();
      }
      chunkArr.forEach( (el) =>{
        if (el) {
          this.push(el);
        }
      });
      callback();
    } catch (e) {
      callback(e);
    }
  }

  _flush(callback) {
    this.push(this._chunkBuff);
    callback();
  }
}

module.exports = LineSplitStream;
