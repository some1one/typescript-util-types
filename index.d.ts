//used some types from https://github.com/piotrwitek/utility-types
export type AnyObject = Record<PropertyKey, any> & {};
export type UnknownObject = Record<PropertyKey, unknown> & {};
export type Constructor<T extends Function & {} = AnyObject & Function> = new (...args: any[]) => T;
export type WithPrototype<C extends {} = {}, P extends {} = C> = C & { prototype: P };
export type Class<T extends _ClassFunction<T> | Constructor<T>> = T & _ClassFunction<T> & Constructor<T> & WithPrototype<T & (_ClassFunction<T> | Constructor<T>) & object, T> & object;
export type _ClassFunction<T extends _ClassFunction<T> | Constructor<T>> = (...args: any[]) => Class<T>;
export type RecordClass<T extends _ClassFunction<T> | Constructor<T>> = Class<T> & AsRecord<T> & UnknownObject;
export type AnyFunction = (...args: any[]) => any;
export type UnknownFunction = (...args: unknown[]) => unknown;
export type RecordsStartWith<T, S extends string> = {
    [K in keyof T as K extends `${S}${infer R}` ? K : never]: T[K]
}
export type RecordsRemovePrefix<T, P extends string> = {
    [K in keyof T as K extends `${P}${infer R}` ? R : K]: T[K]
}
export type RecordsRemovePrefixAndUcapitalize<T, P extends string> = {
    [K in keyof T as K extends `${P}${infer R}` ? Uncapitalize<R> : K]: T[K]
}
export type FunctionNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type GetterFunctions<T> = RecordsStartWith<FunctionNames<T>, 'get'>;
export type GetterNames<T>  = RecordsRemovePrefixAndUcapitalize<GetterFunctions<T>, 'get'>;
export type PropertyNames<T> = {
    [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];
export type AsRecord<T> = { [K in keyof T]: T[K] };
/** Excludes all props of U from T for use in other types. Use OmitAll if you want to create a type like this.  */
export type ExcludeAll<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
/** An exclusive type that one of T or U but never both of them*/
export type OneOf<T, U> = (ExcludeAll<T, U> & U) | (ExcludeAll<U, T> & T);
/** A type that is equivalent to T without the props from K */
export type OmitAll<T, K> = Pick<T, Exclude<keyof T, K>>;
/** A type that represents the props from A that or not in B & the types from B that are not in A */
export type Diff<A, B> = Exclude<A | B, A & B>;
/**  A type representing the union of values in a const array (["value"] as const)*/
export type ArrayValues<T extends unknown[]> = T[number];
/** The value type of prop or index K of T */
export type ValueType<T extends { [P in K & any]: any }, K extends keyof T | number> = T[K];
export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;
export type Void = void | undefined;
export type Falsy = false | '' | 0 | null | undefined;
export type Nullish = null | undefined;
export type NonNullish<T> = T extends Nullish ? never : T;
/**
 * MutableKeys
 * @desc Get union type of keys that are mutable in object type `T`
 * Credit: Matt McCutchen
 * https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript
 * @example
 *   type Props = { readonly foo: string; bar: number };
 *
 *   // Expect: "bar"
 *   type Keys = MutableKeys<Props>;
 */
export type MutableKeys<T extends object> = {
    [P in keyof T]-?: IfEquals<
      { [Q in P]: T[P] },
      { -readonly [Q in P]: T[P] },
      P
    >;
  }[keyof T];
  /**
 * ReadonlyKeys
 * @desc Get union type of keys that are readonly in object type `T`
 * Credit: Matt McCutchen
 * https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript
 * @example
 *   type Props = { readonly foo: string; bar: number };
 *
 *   // Expect: "foo"
 *   type Keys = ReadonlyKeys<Props>;
 */
export type ReadonlyKeys<T extends object> = {
    [P in keyof T]-?: IfEquals<
      { [Q in P]: T[P] },
      { -readonly [Q in P]: T[P] },
      never,
      P
    >;
  }[keyof T];
  
export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
    T
  >() => T extends Y ? 1 : 2
    ? A
    : B;
/**
 * RequiredKeys
 * @desc Get union type of keys that are required in object type `T`
 * @see https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; optUndef?: number | undefined; };
 *
 *   // Expect: "req" | "reqUndef"
 *   type Keys = RequiredKeys<Props>;
 */
export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
  }[keyof T];
/**
 * OptionalKeys
 * @desc Get union type of keys that are optional in object type `T`
 * @see https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; optUndef?: number | undefined; };
 *
 *   // Expect: "opt" | "optUndef"
 *   type Keys = OptionalKeys<Props>;
 */
export type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
  }[keyof T];
