import { createHash } from "node:crypto";
import { copyFile, cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(root, "public");
const siteDirectory = path.join(publicDirectory, "site");
const mediaDirectory = path.join(publicDirectory, "media");

await mkdir(siteDirectory, { recursive: true });
await mkdir(mediaDirectory, { recursive: true });
await cp(path.join(root, "images"), path.join(publicDirectory, "images"), {
  recursive: true,
  force: true
});

const mediaManifest = {};
const mediaHash = createHash("sha256");
const imageSources = [
  { source: path.join(root, "images"), output: path.join(mediaDirectory, "images"), prefix: "images" },
  { source: path.join(publicDirectory, "assets"), output: path.join(mediaDirectory, "assets"), prefix: "assets" }
];

for (const { source, output, prefix } of imageSources) {
  await mkdir(output, { recursive: true });
  const files = (await readdir(source, { withFileTypes: true }))
    .filter(entry => entry.isFile() && /\.(?:png|jpe?g)$/i.test(entry.name));

  for (const file of files) {
    const sourcePath = path.join(source, file.name);
    mediaHash.update(`${prefix}/${file.name}`);
    mediaHash.update(await readFile(sourcePath));
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width) {
      throw new Error(`Could not read image dimensions for ${sourcePath}`);
    }

    const widths = [480, 960, 1600].filter(width => width < metadata.width);
    widths.push(Math.min(metadata.width, 1600));
    const uniqueWidths = [...new Set(widths)].sort((a, b) => a - b);
    const basename = path.parse(file.name).name;
    const variants = [];

    for (const width of uniqueWidths) {
      const outputName = `${basename}-${width}.webp`;
      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 })
        .toFile(path.join(output, outputName));
      variants.push({
        width,
        url: `/media/${prefix}/${encodeURIComponent(outputName)}`
      });
    }

    mediaManifest[`${prefix}/${file.name}`] = variants;
  }
}

const mediaVersion = mediaHash.digest("hex").slice(0, 16);
for (const variants of Object.values(mediaManifest)) {
  for (const variant of variants) {
    variant.url += `?v=${mediaVersion}`;
  }
}

await writeFile(
  path.join(publicDirectory, "media-manifest.json"),
  JSON.stringify({ version: mediaVersion, images: mediaManifest })
);

await Promise.all([
  copyFile(path.join(root, "script.js"), path.join(siteDirectory, "script.js")),
  copyFile(
    path.join(root, "showcase.js"),
    path.join(siteDirectory, "showcase.js")
  ),
  copyFile(path.join(root, "robots.txt"), path.join(publicDirectory, "robots.txt")),
  copyFile(
    path.join(root, "sitemap.xml"),
    path.join(publicDirectory, "sitemap.xml")
  )
]);
