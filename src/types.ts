export type User = {
  id: number;
  name: string;
};

export type Message = {
  id: number;
  content: string;
  authorId: number;
  createdAt: string;
  author: User;
};

export type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
