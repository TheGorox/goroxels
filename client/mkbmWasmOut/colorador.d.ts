/* tslint:disable */
/* eslint-disable */
export function alloc_buffer(size: number): number;
export function free_buffer(ptr: number, capacity: number): void;
/**
 * apply_whitelist_raw:
 * ptr - указатель на RGBA buffer (len байт)
 * len - длина buffer в байтах (должна быть width*height*4)
 * whitelist_ptr - указатель на плоский [r,g,b, r,g,b, ...]
 * whitelist_len - длина whitelist в байтах (кол-во байт, должно быть кратно 3)
 * disabled_alpha - значение альфы, которое нужно записать (0..255)
 */
export function apply_whitelist_raw(ptr: number, len: number, whitelist_ptr: number, whitelist_len: number, disabled_alpha: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly alloc_buffer: (a: number) => number;
  readonly free_buffer: (a: number, b: number) => void;
  readonly apply_whitelist_raw: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
