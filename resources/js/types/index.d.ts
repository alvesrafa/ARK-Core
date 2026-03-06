export interface IBaseModel {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface IPaginate<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface SharedData {
    app: {
        name: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export interface IPageProps {
    flash: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export type IPaginatedPageProps<T> = IPageProps & {
    page: IPaginate<T>;
};
