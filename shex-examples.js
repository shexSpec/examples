const Fs = require('fs');
const Path = require('path');

const ShExExamplesModule = {
  root: __dirname,
  manifest: function (from = process.cwd()) {
    return crawl('scenario')

    function crawl (dir) {
      // return dirs.reduce((acc, dir) => {
      const acc = [];
        Fs.readdirSync(Path.join(__dirname, dir)).forEach(nested => {
          const rel = Path.join(dir, nested);
          const fpath = Path.join(__dirname, rel);
          if (nested.match(/-manifest.json$/)) {
            const manifest = JSON.parse(Fs.readFileSync(fpath), 'utf8').map(entry => {
              // could load and rewrite schemas and graphs
              if ('schemaURL' in entry)
                entry.schemaURL = Path.relative(from, Path.join(__dirname, dir, entry.schemaURL));
              if ('dataURL' in entry)
                entry.dataURL = Path.relative(from, Path.join(__dirname, dir, entry.dataURL));
              return entry;
            });
            acc.push({ path: Path.relative(from, fpath), manifest })
          } else {
            const stat = Fs.lstatSync(fpath)
            if (stat.isDirectory())
              [].push.apply(acc, crawl(rel))
          }
        })
        return acc;
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

// Object.defineProperty(ShExExamplesModule, 'manifest', {
//   async get() {
//     return /* Your value */;
//   }
// });

function wrap (path) {
  const ret = require(path);
  return ret;
}

module.exports = ShExExamplesModule
