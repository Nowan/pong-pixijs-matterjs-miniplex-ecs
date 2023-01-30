// Courtesy of https://pawelgrzybek.com/make-the-typescript-interface-partially-optional-required/
export type PartiallyRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartiallyOptional<T, K extends keyof T> = T & Partial<Pick<T, K>>;

export type ExcludeKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function isPartiallyRequired<T, K extends keyof T>(object: T, key: K): object is PartiallyRequired<T, K> {
    return object[key] !== undefined;
}
