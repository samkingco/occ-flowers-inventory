const fs = require("fs");
const path = require("path");

const attributesJSON = fs.readFileSync(
  path.join(process.cwd(), "./data/attributes.json")
);

const rarityJSON = fs.readFileSync(
  path.join(process.cwd(), "./data/rarity.json")
);

const imagesJSON = fs.readFileSync(
  path.join(process.cwd(), "./data/images.json")
);

const attributes = JSON.parse(attributesJSON);
const rarity = JSON.parse(rarityJSON);
const images = JSON.parse(imagesJSON);

const combined = rarity.map((i) => ({
  tokenId: i.tokenId,
  attributes: {
    ...attributes[i.tokenId],
  },
  image: {
    base64: images[i.tokenId.toString()],
  },
  rank: i.rarest,
}));

fs.writeFileSync(
  path.join(process.cwd(), "./data/ranked-flower-images.json"),
  JSON.stringify(combined, null, 2)
);
