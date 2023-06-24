//used some types from https://github.com/piotrwitek/utility-types
type ObjectKey = string | number | symbol;
type AnyObject = Record<ObjectKey, any> & object & {};
type UnknownObject = Record<ObjectKey, unknown> & object;
type Constructor<T = any> = new (...args: any[]) => T;
type WithAnyPrototype<C extends Function> = C & { prototype: any };
type WithPrototype<C extends Function, P extends {} | object | AnyObject = C> = C & P & { prototype?: P };
type Class<T extends _ClassFunction<T> | Constructor<T>> = T & _ClassFunction<T> & Constructor<T> & WithPrototype<T & (_ClassFunction<T> | Constructor<T>), T> & Object;
type _ClassFunction<T extends _ClassFunction<T> | Constructor<T>> = (...args: any[]) => Class<T>;
type RecordClass<T extends _ClassFunction<T> | Constructor<T>> = Class<T> & AsRecord<T> & UnknownObject;
type AnyFunction = (...args: unknown[]) => unknown;
type UnknownFunction = (...args: unknown[]) => unknown;
type MethodNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type PropertyNames<T> = {
    [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];
type AsRecord<T> = { [K in keyof T]: T[K] };
/** Excludes all props of U from T for use in other types. Use OmitAll if you want to create a type like this.  */
type ExcludeAll<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
/** An exclusive type that one of T or U but never both of them*/
type OneOf<T, U> = (ExcludeAll<T, U> & U) | (ExcludeAll<U, T> & T);
/** A type that is equivalent to T without the props from K */
type OmitAll<T, K> = Pick<T, Exclude<keyof T, K>>;
/** A type that represents the props from A that or not in B & the types from B that are not in A */
type Diff<A, B> = Exclude<A | B, A & B>;
/** A strongly type record object. ie only existing key names are allowed and the return the appropriate type. */
type TypedRecord<K extends ObjectKey, V> = { [P in K]: V };
/**  A type representing the union of values in a const array (["value"] as const)*/
type ArrayValues<T extends unknown[]> = T[number];
/** The value type of prop or index K of T */
type ValueType<T extends { [P in K & any]: any }, K extends keyof T | number> = T[K];
type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;
type Void = void | undefined;
type Falsy = false | '' | 0 | null | undefined;
type Nullish = null | undefined;
type NonNullish<T> = T extends Nullish ? never : T;
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
  
  type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
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
