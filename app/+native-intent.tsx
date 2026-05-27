export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}): string {
  console.log("[native-intent] path", path);
  return "/";
}
