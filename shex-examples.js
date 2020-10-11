const Fs = require('fs');
const Path = require('path');

const ShExExamplesModule = {
  root: __dirname,
  manifest: function (from = process.cwd()) {
    const scenario = crawl('scenario');
    return scenario
      ? { scenario }
      : null;

    function crawl (dir) {
      // return dirs.reduce((acc, dir) => {
      const ret = {};
      Fs.readdirSync(Path.join(__dirname, dir)).forEach(nested => {
        const local = Path.join(dir, nested);
        const fpath = Path.join(__dirname, local);
        if (nested.match(/-manifest.json$/)) {
          const manifest = JSON.parse(Fs.readFileSync(fpath), 'utf8').map(entry => {
            // could load and rewrite schemas and graphs
            if ('schemaURL' in entry)
              entry.schemaURL = Path.relative(from, Path.join(__dirname, dir, entry.schemaURL));
            if ('dataURL' in entry)
              entry.dataURL = Path.relative(from, Path.join(__dirname, dir, entry.dataURL));
            return entry;
          });
          ret[nested] = manifest; // { path: Path.relative(from, fpath), manifest }
        } else {
          const stat = Fs.lstatSync(fpath)
          if (stat.isDirectory()) {
            const inner = crawl(local);
            if (inner)
              ret[nested] = inner;
          }
        }
      })
      return ret;
      // }, [])
    }
  },
  manifests: { // Could dynamically generate this to ease maintenance.
    scenario: {
      Issues: {
        "Issues-simple-manifest": wrap('./scenario/Issues/Issues-simple-manifest.json')
      }
    }
  }
}

function objKeyVal (pairs) {
  const ret = {};
  pairs.forEach(pair => ret[pair[0]] = pair[1]);
  return ret;
}

function wrap (path) {
  const ret = require(path);
  return ret;
}

module.exports = ShExExamplesModule
