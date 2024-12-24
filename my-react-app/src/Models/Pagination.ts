
export class Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;

    constructor(currentPage: number = 1, pageSize: number = 10, totalItems: number = 0) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }

    setTotalItems(total: number) {
        this.totalItems = total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }

    setCurrentPage(page: number) {
        if (page < 1) this.currentPage = 1;
        else if (page > this.totalPages) this.currentPage = this.totalPages;
        else this.currentPage = page;
    }

    setPageSize(size: number) {
        this.pageSize = size;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }
}
