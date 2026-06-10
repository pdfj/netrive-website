const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg"));

(async () => {
  for (const f of files) {
    const out = path.join(dir, f.replace(".svg", ".png"));
    await sharp(path.join(dir, f), { density: 300 })
      .resize(1024, 1024)
      .png()
      .toFile(out);
    console.log("converted:", f, "->", path.basename(out));
  }
})();
