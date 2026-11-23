import { Country } from "../schemas/country.schema";

export function formatCountryReport(country: Country): string {
  const lines: string[] = [];

  const commonName = country.names.common || "Not supplied";
  const officialName = country.names.official || "Not supplied";
  const capital =
    country.capitals && country.capitals.length > 0
      ? country.capitals.map((c) => c.name).join(", ")
      : "Not supplied";
  const region = country.region || "Not supplied";
  const population = country.population
    ? country.population.toLocaleString("en-US")
    : "Not supplied";

  const languages =
    country.languages && country.languages.length > 0
      ? country.languages.map((l) => l.name).join(", ")
      : "Not supplied";

  const currencies =
    country.currencies && country.currencies.length > 0
      ? country.currencies.map((c) => `${c.name} (${c.code})`).join(", ")
      : "Not supplied";

  let flagDisplay = "Not supplied";
  if (country.flag?.emoji) {
    flagDisplay = country.flag.emoji;
  } else if (country.flag?.url_png) {
    flagDisplay = country.flag.url_png;
  }

  lines.push(`Country Profile: ${commonName}`);
  lines.push("----------------------------------------");
  lines.push(`Official Name: ${officialName}`);
  lines.push(`Capital:       ${capital}`);
  lines.push(`Region:        ${region}`);
  lines.push(`Population:    ${population}`);
  lines.push(`Languages:     ${languages}`);
  lines.push(`Currencies:    ${currencies}`);
  lines.push(`Flag:          ${flagDisplay}`);

  return lines.join("\n");
}
