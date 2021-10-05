const fs = require("fs");
const path = require("path");

const rarityJSON = fs.readFileSync(
  path.join(process.cwd(), "./data/rarity.json")
);

const imagesJSON = fs.readFileSync(
  path.join(process.cwd(), "./data/images.json")
);

const rarity = JSON.parse(rarityJSON);
const images = JSON.parse(imagesJSON);

const combined = rarity.map((i) => ({
  tokenId: i.tokenId,
  rank: i.rarest,
  image: images[i.tokenId.toString()],
}));

fs.writeFileSync(
  path.join(process.cwd(), "./data/ranked-flower-images.json"),
  JSON.stringify(combined, null, 2)
);
