interface Author {
    name: string;
    image?: any;
}

export interface BlogPosts {
    title: string;
    slug: string;
    publishedAt: string | null;
    mainImage: any | null;
    author: Author | null;
    categories: any[] | null;
    body: any | null;
}
