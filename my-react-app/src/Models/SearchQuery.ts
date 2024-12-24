
export class SearchQuery {
    keyword: string;
    tags: string[];
    ingredients: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;

    constructor(
        keyword: string = '',
        tags: string[] = [],
        ingredients: string[] = [],
        sortBy: string = 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc',
        page: number = 1,
        limit: number = 10
    ) {
        this.keyword = keyword;
        this.tags = tags;
        this.ingredients = ingredients;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.page = page;
        this.limit = limit;
    }

    toQueryParams(): string {
        const params = new URLSearchParams();
        if (this.keyword) params.append('keyword', this.keyword);
        if (this.tags.length) params.append('tags', this.tags.join(','));
        if (this.ingredients.length) params.append('ingredients', this.ingredients.join(','));
        params.append('sortBy', this.sortBy);
        params.append('sortOrder', this.sortOrder);
        params.append('page', this.page.toString());
        params.append('limit', this.limit.toString());
        return params.toString();
    }
}
