export const PRODUCT_LISTING_SEARCH_PARAM = "search";
export const HEADER_SEARCH_PARAM = "headerSearch";

export function normalizeProductSearchTerm(value: string) {
  return value.trim().toLowerCase();
}

function levenshteinDistance(source: string, target: string) {
  if (source === target) {
    return 0;
  }

  if (!source.length) {
    return target.length;
  }

  if (!target.length) {
    return source.length;
  }

  const distanceMatrix = Array.from({ length: source.length + 1 }, () =>
    Array<number>(target.length + 1).fill(0),
  );

  for (let sourceIndex = 0; sourceIndex <= source.length; sourceIndex += 1) {
    distanceMatrix[sourceIndex][0] = sourceIndex;
  }

  for (let targetIndex = 0; targetIndex <= target.length; targetIndex += 1) {
    distanceMatrix[0][targetIndex] = targetIndex;
  }

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const substitutionCost =
        source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1;

      distanceMatrix[sourceIndex][targetIndex] = Math.min(
        distanceMatrix[sourceIndex - 1][targetIndex] + 1,
        distanceMatrix[sourceIndex][targetIndex - 1] + 1,
        distanceMatrix[sourceIndex - 1][targetIndex - 1] + substitutionCost,
      );
    }
  }

  return distanceMatrix[source.length][target.length];
}

export function getProductSearchScore(title: string, query: string) {
  const normalizedTitle = normalizeProductSearchTerm(title);
  const normalizedQuery = normalizeProductSearchTerm(query);

  if (!normalizedQuery) {
    return Number.POSITIVE_INFINITY;
  }

  if (normalizedTitle === normalizedQuery) {
    return 0;
  }

  if (normalizedTitle.startsWith(normalizedQuery)) {
    return 1;
  }

  const wordPrefixMatchIndex = normalizedTitle
    .split(/\s+/)
    .findIndex((word) => word.startsWith(normalizedQuery));
  if (wordPrefixMatchIndex !== -1) {
    return 2 + wordPrefixMatchIndex / 10;
  }

  const includesIndex = normalizedTitle.indexOf(normalizedQuery);
  if (includesIndex !== -1) {
    return 5 + includesIndex / 100;
  }

  return 20 + levenshteinDistance(normalizedTitle, normalizedQuery);
}

export function getClosestProductTitleSuggestions(
  titles: string[],
  query: string,
  limit = 5,
) {
  const normalizedQuery = normalizeProductSearchTerm(query);
  if (!normalizedQuery) {
    return [];
  }

  const uniqueTitles = new Set<string>();

  return titles
    .map((title) => ({
      title,
      score: getProductSearchScore(title, normalizedQuery),
    }))
    .sort((left, right) => left.score - right.score || left.title.localeCompare(right.title))
    .filter((candidate) => {
      const normalizedTitle = candidate.title.toLowerCase();
      if (uniqueTitles.has(normalizedTitle)) {
        return false;
      }

      uniqueTitles.add(normalizedTitle);
      return true;
    })
    .slice(0, limit)
    .map((candidate) => candidate.title);
}
