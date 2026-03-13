import { useQuery } from "@tanstack/react-query";
import type { Story } from "../backend.d";
import { Category } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllStories() {
  const { actor, isFetching } = useActor();
  return useQuery<Story[]>({
    queryKey: ["stories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetStoriesByCategory(category: Category | "all") {
  const { actor, isFetching } = useActor();
  return useQuery<Story[]>({
    queryKey: ["stories", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "all") return actor.getAllStories();
      return actor.getStoriesByCategory(category);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetStoryById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Story | null>({
    queryKey: ["story", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getStoryById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 1000 * 60 * 5,
  });
}

export { Category };
