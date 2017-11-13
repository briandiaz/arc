let AdaptiveFS = require('arc-fs');

class AdaptivePlugin {
  constructor({ flags, proxy } = {}) {
    if(!flags && !proxy) {
      throw new Error('The AdaptivePlugin should be passed flags or proxy should be true.');
    }

    this.flags = flags;
    this.proxy = proxy || false;
  }
  apply(compiler) {
    compiler.plugin('normal-module-factory', nmf => {
      let resolver = compiler.resolvers.normal;
      let fs = resolver.fileSystem;
      let afs = new AdaptiveFS({ fs, flags:this.flags });
      resolver.fileSystem = afs;
      resolver.plugin('before-existing-file', (request, callback) => {
          let path = afs.resolveSync(request.path);
          callback(null, Object.assign({}, request, { path }));
      });
    });
    // compiler.plugin('context-module-factory', cmf => {
    //   let context = compiler.resolvers.context;
    //   let fs = context.fileSystem;
    //   let afs = new AdaptiveFS({ fs, flags:this.flags });
    //   context.fileSystem = afs;
    //   context.plugin('before-existing-file', (request, callback) => {
    //       let path = afs.resolveSync(request.path);
    //       callback(null, Object.assign({}, request, { path }));
    //   });
    // });
  }
}

module.exports = AdaptivePlugin;
