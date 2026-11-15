export interface Resource {
  id: string;
  title: string;
  category: string;
  url: string;
}

export interface SearchParams {
  term: string;
  category?: string;
}

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
}

export interface ProviderResult {
  provider: string;
  resources: Resource[];
  error?: string;
}
