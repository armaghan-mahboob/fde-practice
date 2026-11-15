export function validateSearchParams(params) {
    if (typeof params !== "object" || params === null) {
        throw new Error("Invalid search parameters: not an object");
    }
    const p = params;
    if (typeof p.term !== "string") {
        throw new Error("Invalid search term: must be a string");
    }
    const trimmedTerm = p.term.trim();
    if (trimmedTerm.length === 0) {
        throw new Error("Search term cannot be blank");
    }
    let category;
    if (p.category !== undefined) {
        if (typeof p.category !== "string") {
            throw new Error("Invalid category: must be a string");
        }
        const trimmedCategory = p.category.trim();
        if (trimmedCategory.length > 0) {
            category = trimmedCategory;
        }
    }
    return { term: trimmedTerm, category };
}
export function validateResourceList(data) {
    if (!Array.isArray(data)) {
        throw new Error("Invalid payload: expected an array of resources");
    }
    const validResources = [];
    for (const item of data) {
        // Malformed resource records are safely excluded according to this rule:
        // Must have string id, title, category, url; and url must be parsable.
        if (typeof item !== "object" || item === null) {
            continue;
        }
        const r = item;
        if (typeof r.id !== "string" ||
            typeof r.title !== "string" ||
            typeof r.category !== "string" ||
            typeof r.url !== "string") {
            continue;
        }
        try {
            new URL(r.url);
        }
        catch {
            continue;
        }
        validResources.push({
            id: r.id,
            title: r.title,
            category: r.category,
            url: r.url,
        });
    }
    return validResources;
}
