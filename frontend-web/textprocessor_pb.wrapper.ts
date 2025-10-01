import pbDefault from "./textprocessor_pb.mjs";

const _pb: any = pbDefault;

function findExport(name: string, root: any, seen = new Set(), depth = 0): any {
  if (!root || (typeof root !== "object" && typeof root !== "function"))
    return undefined;
  if (seen.has(root) || depth > 6) return undefined;
  seen.add(root);
  if (name in root) return root[name];
  for (const k of Object.keys(root)) {
    try {
      const v = root[k];
      const found = findExport(name, v, seen, depth + 1);
      if (found) return found;
    } catch (e) {
      // skip problematic properties
    }
  }
  return undefined;
}

function getOrWarn(name: string) {
  const v = (_pb as any)[name] ?? findExport(name, _pb);
  if (!v) {
    console.error(
      `[wrapper] could not find ${name} in textprocessor_pb exports`,
      _pb
    );
  }
  return v;
}

// export named symbols expected by generated client + app
export const TextRequest = getOrWarn("TextRequest");
export const WordCountResponse = getOrWarn("WordCountResponse");
export const CharCountResponse = getOrWarn("CharCountResponse");
export const WordChunk = getOrWarn("WordChunk");
export const TotalCountResponse = getOrWarn("TotalCountResponse");
export const AnalysisResponse = getOrWarn("AnalysisResponse");

// export default for backward compatibility with your app.ts if needed
export default _pb;
