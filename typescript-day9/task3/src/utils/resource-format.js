export function rankResources(resources, term) {
    const lowerTerm = term.toLowerCase();
    return [...resources].sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(lowerTerm);
        const bTitleMatch = b.title.toLowerCase().includes(lowerTerm);
        if (aTitleMatch && !bTitleMatch)
            return -1;
        if (!aTitleMatch && bTitleMatch)
            return 1;
        return a.title.localeCompare(b.title);
    });
}
export function formatSearchResults(results, term) {
    let output = `Search Results for "${term}"\n\n`;
    let totalValid = 0;
    for (const result of results) {
        output += `[Provider: ${result.provider}]\n`;
        if (result.error) {
            output += `  Error: Provider unavailable (${result.error})\n\n`;
            continue;
        }
        const ranked = rankResources(result.resources, term);
        totalValid += ranked.length;
        if (ranked.length === 0) {
            output += `  No resources found in this provider.\n\n`;
            continue;
        }
        for (const res of ranked) {
            output += `  - ${res.title} [${res.category}]\n    URL: ${res.url}\n`;
        }
        output += `\n`;
    }
    if (totalValid === 0) {
        output += `No results found for your search criteria.\n`;
    }
    return output.trim();
}
