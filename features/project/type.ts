export type ProjectType = {
  _id: string;
  slug: string;
  title: string;
  githubLink: string;
  mainContent?: string;
  description: string;
  isPublished?: boolean;
  isDraft?: boolean;
  isTeam?: boolean;
};

type ProjectLoadingOptionsType = string | null;

export type InitialProjectStateType = {
  projects: ProjectType[];
  currentProject: ProjectType | null;
  projectLoading: ProjectLoadingOptionsType;
};

export type ProjectProps = {
  _id: string;
  slug: string;
  title: string;
  isTeam: boolean;
  description: string;
  githubLink: string;
};
