//used some types from https://github.com/piotrwitek/utility-types
export type AnyObject = Record<PropertyKey, any> & {};
export type UnknownObject = Record<PropertyKey, unknown> & {};
export type AnyFunction = Function & ((...args: any[]) => any);
export type UnknownFunction = (...args: unknown[]) => unknown;
export type Constructor<T = any> = (new (...args: any) => T) & AnyFunction & AnyObject & { name: string };
export type _ClassConstructor<T = any> = (new (...args: ConstructorParameters<Constructor<T>>) => ClassInstance<T>) & AnyFunction & AnyObject;
export type WithPrototype<P extends {} = any> = { prototype: P };
export type WithConstructorPrototype<C extends AnyFunction & Constructor, P extends {} = any> = WithPrototype<P> & { constructor: Constructor<C> } & { prototype: P & { constructor: Constructor<C> } };
export type ClassInstance<T = any> = InstanceType<Constructor<T>> & WithConstructorPrototype<_ClassConstructor<T>>;
export type Class<T = any> = _ClassFunction<T> & _ClassConstructor<T> & WithConstructorPrototype<T & _ClassConstructor<T>, T & object> & object;
export type _ClassFunction<T = any> = (...args: Parameters<Constructor<T>>) => ClassInstance<T>;
export type RecordClass<T extends AnyFunction & Constructor<T>> = Class<T> & AsRecord<T> & UnknownObject;
export type AnyClass = Class<any>;
export type AnyRecordClass = RecordClass<any>;
export type RecordsStartWith<T, S extends string> = {
    [K in keyof T as K extends `${S}${infer R}` ? R : never]: T[K]
}
export type RecordsRemovePrefix<T, P extends string> = {
    [K in keyof T as K extends `${P}${infer R}` ? R : K]: T[K]
}
export type RecordsRemovePrefixAndUncapitalize<T, P extends string> = {
    [K in keyof T as K extends `${P}${infer R}` ? Uncapitalize<R> : K]: T[K]
}
export type FunctionNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type PropertyNames<T> = {
  [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];
export type RecordFunctions<T> = Pick<T, FunctionNames<T>>;
export type RecordProperties<T> = Pick<T, PropertyNames<T>>;
export type GetterFunctions<T> = RecordFunctions<RecordsStartWith<T, 'get'>>;
export type GetterNames<T> = FunctionNames<RecordsRemovePrefixAndUncapitalize<GetterFunctions<T>, 'get'>>;
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

export interface IDisposable {
    get isDisposed(): boolean;
    dispose(): void;
}

export interface IAsyncDisposable {
    get isDisposed(): boolean;
    dispose(): Promise<void>;
}

declare global {
    interface Function {
        bind<T extends AnyFunction>(this: T, thisArg: ThisParameterType<T>): T;
    }
}