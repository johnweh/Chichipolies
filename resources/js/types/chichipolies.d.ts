export interface UserRef {
    id: number;
    name: string;
}

export interface PostSummary {
    id: number;
    title: string;
    body: string;
    category: string;
    county: string;
    photo_url: string | null;
    video_url: string | null;
    true_votes: number;
    false_votes: number;
    is_official: boolean;
    verification_status: 'Unverified' | 'Likely True' | 'Likely False' | 'Disputed';
    comments_count: number;
    created_at: string;
    user: UserRef;
}

export interface CommentItem {
    id: number;
    body: string;
    created_at: string;
    user: UserRef;
}

export interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    current_page: number;
}

export interface NotificationItem {
    id: string;
    type: 'comment' | 'vote';
    post: { id: number; title: string };
    actor: UserRef;
    body?: string;
    is_true?: boolean;
    created_at: string;
}
