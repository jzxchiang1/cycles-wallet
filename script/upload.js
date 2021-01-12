const fs = require("fs");
const path = require("path");
const Dfn = require("@dfinity/agent");

const agent = new Dfn.HttpAgent({
  host: "http://localhost:8000",
  fetch: require("node-fetch"),
});

global.crypto = require("@trust/webcrypto");
global.ic = { agent };

const actor = Dfn.Actor.createActor(
  ({ IDL }) =>
    IDL.Service({
      store: IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    }),
  { agent, canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai" },
);

// Read the blob
const indexJs = fs.readFileSync(path.join(__dirname, "../dist/index.js"));
console.log(`Uploading ${indexJs.byteLength} bytes`);

const buff = [...new Uint8Array(indexJs.slice())];
actor.store(buff).then(() => console.log("Done!"));
