import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Story {
    id: bigint;
    title: string;
    content: Array<string>;
    description: string;
    category: Category;
    coverPath: string;
}
export enum Category {
    adventure = "adventure",
    puzzle = "puzzle",
    racing = "racing",
    fantasy = "fantasy"
}
export interface backendInterface {
    getAllStories(): Promise<Array<Story>>;
    getStoriesByCategory(category: Category): Promise<Array<Story>>;
    getStoryById(id: bigint): Promise<Story | null>;
}
