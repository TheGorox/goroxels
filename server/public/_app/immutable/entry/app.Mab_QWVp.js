const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../nodes/0.C_3HXx9p.js","../chunks/CsnEtAjo.js","../chunks/BYvYazV4.js","../chunks/DGvTukkS.js","../chunks/D06Tai5M.js","../chunks/6l8o6Ias.js","../assets/Toast.DWM7Tyxy.css","../nodes/1.DElR6Kpv.js","../chunks/SCUJ82_F.js","../nodes/2.BFv_q2v2.js","../chunks/UZRgTS1n.js","../assets/2.CFy3S9g7.css"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from "../chunks/UZRgTS1n.js";
import { z as set, L as LEGACY_PROPS, o as get, A as flushSync, B as define_property, D as mutable_source, v as push, u as user_pre_effect, l as user_effect, F as onMount, G as tick, i as first_child, j as sibling, w as pop, I as state, x as child, y as reset, t as template_effect, J as user_derived } from "../chunks/BYvYazV4.js";
import { h as hydrate, m as mount, u as unmount, a as append, c as comment, f as from_html, t as text, s as set_text } from "../chunks/CsnEtAjo.js";
import { p as prop, i as if_block, c as component, b as bind_this } from "../chunks/D06Tai5M.js";
function asClassComponent(component2) {
  return class extends Svelte4Component {
    /** @param {any} options */
    constructor(options) {
      super({
        component: component2,
        ...options
      });
    }
  };
}
class Svelte4Component {
  /** @type {any} */
  #events;
  /** @type {Record<string, any>} */
  #instance;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(options) {
    var sources = /* @__PURE__ */ new Map();
    var add_source = (key, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key, s);
      return s;
    };
    const props = new Proxy(
      { ...options.props || {}, $$events: {} },
      {
        get(target, prop2) {
          return get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
        },
        has(target, prop2) {
          if (prop2 === LEGACY_PROPS) return true;
          get(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
          return Reflect.has(target, prop2);
        },
        set(target, prop2, value) {
          set(sources.get(prop2) ?? add_source(prop2, value), value);
          return Reflect.set(target, prop2, value);
        }
      }
    );
    this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover,
      transformError: options.transformError
    });
    if (!options?.props?.$$host || options.sync === false) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key of Object.keys(this.#instance)) {
      if (key === "$set" || key === "$destroy" || key === "$on") continue;
      define_property(this, key, {
        get() {
          return this.#instance[key];
        },
        /** @param {any} value */
        set(value) {
          this.#instance[key] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = /** @param {Record<string, any>} next */
    (next) => {
      Object.assign(props, next);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    this.#instance.$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event, callback) {
    this.#events[event] = this.#events[event] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event].push(cb);
    return () => {
      this.#events[event] = this.#events[event].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
}
const matchers = {};
var root_4 = from_html(`<div id="svelte-announcer" aria-live="assertive" aria-atomic="true" style="position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"><!></div>`);
var root$1 = from_html(`<!> <!>`, 1);
function Root($$anchor, $$props) {
  push($$props, true);
  let components = prop($$props, "components", 23, () => []), data_0 = prop($$props, "data_0", 3, null), data_1 = prop($$props, "data_1", 3, null);
  {
    user_pre_effect(() => $$props.stores.page.set($$props.page));
  }
  user_effect(() => {
    $$props.stores;
    $$props.page;
    $$props.constructors;
    components();
    $$props.form;
    data_0();
    data_1();
    $$props.stores.page.notify();
  });
  let mounted = state(false);
  let navigated = state(false);
  let title = state(null);
  onMount(() => {
    const unsubscribe = $$props.stores.page.subscribe(() => {
      if (get(mounted)) {
        set(navigated, true);
        tick().then(() => {
          set(title, document.title || "untitled page", true);
        });
      }
    });
    set(mounted, true);
    return unsubscribe;
  });
  const Pyramid_1 = user_derived(() => $$props.constructors[1]);
  var fragment = root$1();
  var node = first_child(fragment);
  {
    var consequent = ($$anchor2) => {
      const Pyramid_0 = user_derived(() => $$props.constructors[0]);
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      component(node_1, () => get(Pyramid_0), ($$anchor3, Pyramid_0_1) => {
        bind_this(
          Pyramid_0_1($$anchor3, {
            get data() {
              return data_0();
            },
            get form() {
              return $$props.form;
            },
            get params() {
              return $$props.page.params;
            },
            children: ($$anchor4, $$slotProps) => {
              var fragment_2 = comment();
              var node_2 = first_child(fragment_2);
              component(node_2, () => get(Pyramid_1), ($$anchor5, Pyramid_1_1) => {
                bind_this(
                  Pyramid_1_1($$anchor5, {
                    get data() {
                      return data_1();
                    },
                    get form() {
                      return $$props.form;
                    },
                    get params() {
                      return $$props.page.params;
                    }
                  }),
                  ($$value) => components()[1] = $$value,
                  () => components()?.[1]
                );
              });
              append($$anchor4, fragment_2);
            },
            $$slots: { default: true }
          }),
          ($$value) => components()[0] = $$value,
          () => components()?.[0]
        );
      });
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      const Pyramid_0 = user_derived(() => $$props.constructors[0]);
      var fragment_3 = comment();
      var node_3 = first_child(fragment_3);
      component(node_3, () => get(Pyramid_0), ($$anchor3, Pyramid_0_2) => {
        bind_this(
          Pyramid_0_2($$anchor3, {
            get data() {
              return data_0();
            },
            get form() {
              return $$props.form;
            },
            get params() {
              return $$props.page.params;
            }
          }),
          ($$value) => components()[0] = $$value,
          () => components()?.[0]
        );
      });
      append($$anchor2, fragment_3);
    };
    if_block(node, ($$render) => {
      if ($$props.constructors[1]) $$render(consequent);
      else $$render(alternate, -1);
    });
  }
  var node_4 = sibling(node, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div = root_4();
      var node_5 = child(div);
      {
        var consequent_1 = ($$anchor3) => {
          var text$1 = text();
          template_effect(() => set_text(text$1, get(title)));
          append($$anchor3, text$1);
        };
        if_block(node_5, ($$render) => {
          if (get(navigated)) $$render(consequent_1);
        });
      }
      reset(div);
      append($$anchor2, div);
    };
    if_block(node_4, ($$render) => {
      if (get(mounted)) $$render(consequent_2);
    });
  }
  append($$anchor, fragment);
  pop();
}
const root = asClassComponent(Root);
const nodes = [
  () => __vitePreload(() => import("../nodes/0.C_3HXx9p.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6]) : void 0, import.meta.url),
  () => __vitePreload(() => import("../nodes/1.DElR6Kpv.js"), true ? __vite__mapDeps([7,1,2,5,8]) : void 0, import.meta.url),
  () => __vitePreload(() => import("../nodes/2.BFv_q2v2.js"), true ? __vite__mapDeps([9,1,2,4,10,3,5,6,11]) : void 0, import.meta.url)
];
const server_loads = [];
const dictionary = {
  "/": [2]
};
const hooks = {
  handleError: (({ error }) => {
    console.error(error);
  }),
  reroute: (() => {
  }),
  transport: {}
};
const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));
const hash = false;
const decode = (type, value) => decoders[type](value);
export {
  decode,
  decoders,
  dictionary,
  encoders,
  hash,
  hooks,
  matchers,
  nodes,
  root,
  server_loads
};
//# sourceMappingURL=app.Mab_QWVp.js.map
