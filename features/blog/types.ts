export interface BlogPostType {
  _id: string;
  slug: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: string[];
  comments: CommentType[];
  estimatedReadTime: number;
  intro: string;
  mainContent: string;
  isPublished?: boolean;
  images: BlogImageType[];
  relatedPosts?: RelatedPostType[];
  isSlider?: boolean;
  views: number;
}

export interface RelatedPostType {
  _id: string;
  title: string;
  imageUrl: string;
  intro: string;
}

export interface BlogImageType {
  public_id?: string;
  url?: string;
  size?: number;
  secure_url?: string;
  type?: string;
}

export interface CommentType {
  _id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface InitialBlogStateType {
  blogPosts: BlogPostType[] | null;
  blogLoading: string | null;
  currentBlog: BlogPostType | null;
  draftBlog: any;
  relatedPosts: RelatedPostType[];
  sliderData: any[] | null;
  totalItemsCount: number;
  totalPages: number;
  oldPage: number;
  page: number;
  itemsPerPage: number | null;
}
