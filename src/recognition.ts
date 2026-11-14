import type { CatBox } from "./types";
import { cropCat } from "./image";

let detectorPromise: ReturnType<typeof loadDetector> | null = null;
async function loadDetector() {
  const tf = await import("@tensorflow/tfjs");
  try {
    await tf.setBackend("webgl");
  } catch {
    await tf.setBackend("cpu");
  }
  await tf.ready();
  const coco = await import("@tensorflow-models/coco-ssd");
  return coco.load({ base: "lite_mobilenet_v2" });
}
export async function detectCats(blob: Blob): Promise<CatBox[]> {
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("image-read");
    ctx.drawImage(bitmap, 0, 0);
    const detector = await (detectorPromise ??= loadDetector().catch(
      (error) => {
        detectorPromise = null;
        throw error;
      },
    ));
    const predictions = await detector.detect(canvas, 20, 0.35);
    return predictions
      .filter((item) => item.class === "cat" && item.score >= 0.4)
      .map((item) => ({ bbox: item.bbox, score: item.score }));
  } finally {
    bitmap.close();
  }
}
export async function warmDetector() {
  await (detectorPromise ??= loadDetector().catch((error) => {
    detectorPromise = null;
    throw error;
  }));
}
const breeds = [
  ["Siamese", "a slender Siamese cat with point coloration and blue eyes"],
  ["Maine Coon", "a large long-haired Maine Coon cat with tufted ears"],
  [
    "British Shorthair",
    "a round-faced British Shorthair cat with dense plush fur",
  ],
  ["Persian", "a fluffy Persian cat with a flat face"],
  ["Bengal", "a Bengal cat with spotted rosette markings"],
  ["Sphynx", "a hairless Sphynx cat with wrinkled skin"],
  ["Ragdoll", "a long-haired Ragdoll cat with blue eyes and colorpoint fur"],
  ["Russian Blue", "a Russian Blue cat with short silver-blue fur"],
  ["Scottish Fold", "a Scottish Fold cat with folded ears"],
  ["Abyssinian", "an Abyssinian cat with short ticked fur"],
  ["Birman", "a Birman cat with white paws and blue eyes"],
  ["Norwegian Forest Cat", "a Norwegian Forest Cat with a thick long coat"],
  ["Domestic Shorthair", "a domestic shorthair house cat"],
  ["Domestic Longhair", "a domestic longhair house cat"],
  ["Mixed-breed cat", "a mixed breed house cat"],
] as const;
let classifierPromise: ReturnType<typeof loadClassifier> | null = null;
async function loadClassifier() {
  const { pipeline, env } = await import("@huggingface/transformers");
  env.allowLocalModels = false;
  return pipeline(
    "zero-shot-image-classification",
    "Xenova/clip-vit-base-patch32",
    { dtype: "q8" },
  );
}
export async function classifyBreed(
  blob: Blob,
  box: CatBox,
): Promise<string | null> {
  const cropped = await cropCat(blob, box.bbox);
  const url = URL.createObjectURL(cropped);
  try {
    const classifier = await (classifierPromise ??= loadClassifier().catch(
      (error) => {
        classifierPromise = null;
        throw error;
      },
    ));
    const raw = await classifier(
      url,
      breeds.map(([, description]) => `a photo of ${description}`),
    );
    const results = (Array.isArray(raw[0]) ? raw[0] : raw) as {
      label: string;
      score: number;
    }[];
    const sorted = [...results].sort((a, b) => b.score - a.score);
    if (
      !sorted.length ||
      sorted[0].score < 0.16 ||
      sorted[0].score - (sorted[1]?.score ?? 0) < 0.035
    )
      return null;
    return (
      breeds.find(
        ([, description]) => sorted[0].label === `a photo of ${description}`,
      )?.[0] ?? null
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
