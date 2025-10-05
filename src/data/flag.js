// These icons are from flagcdn.com and https://flagpedia.net/download/api
export default function flag(country = "pk", size = "w80", ext = "webp") {
  return `https://flagcdn.com/${size}/${country}.${ext}`;
}
