import { p as assign_nodes, q as should_intro, a as append, f as from_html, c as comment, b as delegate, d as delegated, k as event, s as set_text, t as text, l as from_svg } from "../chunks/CsnEtAjo.js";
import { h as hydrating, a as set_hydrate_node, t as template_effect, f as get_first_child, W as hydrate_next, a1 as active_effect, be as remove_effect_dom, d as hydrate_node, C as COMMENT_NODE, g as get_next_sibling, aP as hydration_mismatch, aJ as HYDRATION_ERROR, aB as create_element, bf as NAMESPACE_SVG, bg as NAMESPACE_MATHML, X as EFFECT_TRANSPARENT, bh as BLOCK_EFFECT, aF as REACTION_RAN, $ as effect, m as untrack, bi as TRANSITION_GLOBAL, ag as is_function, ak as queue_micro_task, M as noop, aA as without_reactive_context, a0 as render_effect, p as deep_read_state, bj as safe_not_equal, bk as listen_to_event_and_reset_event, T as current_batch, G as tick, a7 as proxy, l as user_effect, bl as onDestroy, I as state, o as get, z as set$1, bm as effect_root, bn as derived, bo as writable, O as get$1, v as push, w as pop, J as user_derived, bp as to_array, x as child, j as sibling, y as reset, i as first_child, F as onMount, bq as remove_textarea_child, aw as next } from "../chunks/BYvYazV4.js";
import { p as prop, i as if_block, r as rest_props, b as bind_this, s as spread_props, a as setup_stores, d as store_get } from "../chunks/D06Tai5M.js";
import { _ as __vitePreload } from "../chunks/UZRgTS1n.js";
import { t as toast, s as snippet, b as set_style, c as attribute_effect, e as each, i as index, d as set_class, S as STYLE, f as clsx, g as clsx$1, a as set_attribute, C as CLASS, T as Toast } from "../chunks/DGvTukkS.js";
function html(node, get_value, is_controlled = false, svg = false, mathml = false, skip_warning = false) {
  var anchor = node;
  var value = "";
  if (is_controlled) {
    var parent_node = (
      /** @type {Element} */
      node
    );
    if (hydrating) {
      anchor = set_hydrate_node(get_first_child(parent_node));
    }
  }
  template_effect(() => {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (value === (value = get_value() ?? "")) {
      if (hydrating) hydrate_next();
      return;
    }
    if (is_controlled && !hydrating) {
      effect2.nodes = null;
      parent_node.innerHTML = /** @type {string} */
      value;
      if (value !== "") {
        assign_nodes(
          /** @type {TemplateNode} */
          get_first_child(parent_node),
          /** @type {TemplateNode} */
          parent_node.lastChild
        );
      }
      return;
    }
    if (effect2.nodes !== null) {
      remove_effect_dom(
        effect2.nodes.start,
        /** @type {TemplateNode} */
        effect2.nodes.end
      );
      effect2.nodes = null;
    }
    if (value === "") return;
    if (hydrating) {
      hydrate_node.data;
      var next2 = hydrate_next();
      var last = next2;
      while (next2 !== null && (next2.nodeType !== COMMENT_NODE || /** @type {Comment} */
      next2.data !== "")) {
        last = next2;
        next2 = get_next_sibling(next2);
      }
      if (next2 === null) {
        hydration_mismatch();
        throw HYDRATION_ERROR;
      }
      assign_nodes(hydrate_node, last);
      anchor = set_hydrate_node(next2);
      return;
    }
    var ns = svg ? NAMESPACE_SVG : mathml ? NAMESPACE_MATHML : void 0;
    var wrapper = (
      /** @type {HTMLTemplateElement | SVGElement | MathMLElement} */
      create_element(svg ? "svg" : mathml ? "math" : "template", ns)
    );
    wrapper.innerHTML = /** @type {any} */
    value;
    var node2 = svg || mathml ? wrapper : (
      /** @type {HTMLTemplateElement} */
      wrapper.content
    );
    assign_nodes(
      /** @type {TemplateNode} */
      get_first_child(node2),
      /** @type {TemplateNode} */
      node2.lastChild
    );
    if (svg || mathml) {
      while (get_first_child(node2)) {
        anchor.before(
          /** @type {TemplateNode} */
          get_first_child(node2)
        );
      }
    } else {
      anchor.before(node2);
    }
  });
}
const now = () => performance.now();
const raf = {
  // don't access requestAnimationFrame eagerly outside method
  // this allows basic testing of user code without JSDOM
  // bunder will eval and remove ternary when the user's app is built
  tick: (
    /** @param {any} _ */
    (_) => requestAnimationFrame(_)
  ),
  now: () => now(),
  tasks: /* @__PURE__ */ new Set()
};
function run_tasks() {
  const now2 = raf.now();
  raf.tasks.forEach((task) => {
    if (!task.c(now2)) {
      raf.tasks.delete(task);
      task.f();
    }
  });
  if (raf.tasks.size !== 0) {
    raf.tick(run_tasks);
  }
}
function loop(callback) {
  let task;
  if (raf.tasks.size === 0) {
    raf.tick(run_tasks);
  }
  return {
    promise: new Promise((fulfill) => {
      raf.tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      raf.tasks.delete(task);
    }
  };
}
function dispatch_event(element, type) {
  without_reactive_context(() => {
    element.dispatchEvent(new CustomEvent(type));
  });
}
function css_property_to_camelcase(style) {
  if (style === "float") return "cssFloat";
  if (style === "offset") return "cssOffset";
  if (style.startsWith("--")) return style;
  const parts = style.split("-");
  if (parts.length === 1) return parts[0];
  return parts[0] + parts.slice(1).map(
    /** @param {any} word */
    (word) => word[0].toUpperCase() + word.slice(1)
  ).join("");
}
function css_to_keyframe(css) {
  const keyframe = {};
  const parts = css.split(";");
  for (const part of parts) {
    const [property, value] = part.split(":");
    if (!property || value === void 0) break;
    const formatted_property = css_property_to_camelcase(property.trim());
    keyframe[formatted_property] = value.trim();
  }
  return keyframe;
}
const linear = (t2) => t2;
function transition(flags, element, get_fn, get_params) {
  var is_global = (flags & TRANSITION_GLOBAL) !== 0;
  var direction = "both";
  var current_options;
  var inert = element.inert;
  var overflow = element.style.overflow;
  var intro;
  var outro;
  function get_options() {
    return without_reactive_context(() => {
      return current_options ??= get_fn()(element, get_params?.() ?? /** @type {P} */
      {}, {
        direction
      });
    });
  }
  var transition2 = {
    is_global,
    in() {
      element.inert = inert;
      intro = animate(element, get_options(), outro, 1, () => {
        dispatch_event(element, "introend");
        intro?.abort();
        intro = current_options = void 0;
        element.style.overflow = overflow;
      });
    },
    out(fn) {
      element.inert = true;
      outro = animate(element, get_options(), intro, 0, () => {
        dispatch_event(element, "outroend");
        fn?.();
      });
    },
    stop: () => {
      intro?.abort();
      outro?.abort();
    }
  };
  var e = (
    /** @type {Effect & { nodes: EffectNodes }} */
    active_effect
  );
  (e.nodes.t ??= []).push(transition2);
  if (should_intro) {
    var run = is_global;
    if (!run) {
      var block = (
        /** @type {Effect | null} */
        e.parent
      );
      while (block && (block.f & EFFECT_TRANSPARENT) !== 0) {
        while (block = block.parent) {
          if ((block.f & BLOCK_EFFECT) !== 0) break;
        }
      }
      run = !block || (block.f & REACTION_RAN) !== 0;
    }
    if (run) {
      effect(() => {
        untrack(() => transition2.in());
      });
    }
  }
}
function animate(element, options2, counterpart, t2, on_finish) {
  var is_intro = t2 === 1;
  if (is_function(options2)) {
    var a;
    var aborted = false;
    queue_micro_task(() => {
      if (aborted) return;
      var o = options2({ direction: is_intro ? "in" : "out" });
      a = animate(element, o, counterpart, t2, on_finish);
    });
    return {
      abort: () => {
        aborted = true;
        a?.abort();
      },
      deactivate: () => a.deactivate(),
      reset: () => a.reset(),
      t: () => a.t()
    };
  }
  counterpart?.deactivate();
  if (!options2?.duration && !options2?.delay) {
    dispatch_event(element, is_intro ? "introstart" : "outrostart");
    on_finish();
    return {
      abort: noop,
      deactivate: noop,
      reset: noop,
      t: () => t2
    };
  }
  const { delay = 0, css, tick: tick2, easing = linear } = options2;
  var keyframes = [];
  if (is_intro && counterpart === void 0) {
    if (tick2) {
      tick2(0, 1);
    }
    if (css) {
      var styles = css_to_keyframe(css(0, 1));
      keyframes.push(styles, styles);
    }
  }
  var get_t = () => 1 - t2;
  var animation = element.animate(keyframes, { duration: delay, fill: "forwards" });
  animation.onfinish = () => {
    animation.cancel();
    dispatch_event(element, is_intro ? "introstart" : "outrostart");
    var t1 = counterpart?.t() ?? 1 - t2;
    counterpart?.abort();
    var delta = t2 - t1;
    var duration = (
      /** @type {number} */
      options2.duration * Math.abs(delta)
    );
    var keyframes2 = [];
    if (duration > 0) {
      var needs_overflow_hidden = false;
      if (css) {
        var n = Math.ceil(duration / (1e3 / 60));
        for (var i = 0; i <= n; i += 1) {
          var t3 = t1 + delta * easing(i / n);
          var styles2 = css_to_keyframe(css(t3, 1 - t3));
          keyframes2.push(styles2);
          needs_overflow_hidden ||= styles2.overflow === "hidden";
        }
      }
      if (needs_overflow_hidden) {
        element.style.overflow = "hidden";
      }
      get_t = () => {
        var time = (
          /** @type {number} */
          /** @type {globalThis.Animation} */
          animation.currentTime
        );
        return t1 + delta * easing(time / duration);
      };
      if (tick2) {
        loop(() => {
          if (animation.playState !== "running") return false;
          var t4 = get_t();
          tick2(t4, 1 - t4);
          return true;
        });
      }
    }
    animation = element.animate(keyframes2, { duration, fill: "forwards" });
    animation.onfinish = () => {
      get_t = () => t2;
      tick2?.(t2, 1 - t2);
      on_finish();
    };
  };
  return {
    abort: () => {
      if (animation) {
        animation.cancel();
        animation.effect = null;
        animation.onfinish = noop;
      }
    },
    deactivate: () => {
      on_finish = noop;
    },
    reset: () => {
      if (t2 === 0) {
        tick2?.(1, 0);
      }
    },
    t: () => get_t()
  };
}
function action(dom, action2, get_value) {
  effect(() => {
    var payload = untrack(() => action2(dom, get_value?.()) || {});
    if (get_value && payload?.update) {
      var inited = false;
      var prev = (
        /** @type {any} */
        {}
      );
      render_effect(() => {
        var value = get_value();
        deep_read_state(value);
        if (inited && safe_not_equal(prev, value)) {
          prev = value;
          payload.update(value);
        }
      });
      inited = true;
    }
    if (payload?.destroy) {
      return () => (
        /** @type {Function} */
        payload.destroy()
      );
    }
  });
}
function bind_value(input, get2, set2 = get2) {
  var batches = /* @__PURE__ */ new WeakSet();
  listen_to_event_and_reset_event(input, "input", async (is_reset) => {
    var value = is_reset ? input.defaultValue : input.value;
    value = is_numberlike_input(input) ? to_number(value) : value;
    set2(value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
    await tick();
    if (value !== (value = get2())) {
      var start = input.selectionStart;
      var end = input.selectionEnd;
      var length = input.value.length;
      input.value = value ?? "";
      if (end !== null) {
        var new_length = input.value.length;
        if (start === end && end === length && new_length > length) {
          input.selectionStart = new_length;
          input.selectionEnd = new_length;
        } else {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, new_length);
        }
      }
    }
  });
  if (
    // If we are hydrating and the value has since changed,
    // then use the updated value from the input instead.
    hydrating && input.defaultValue !== input.value || // If defaultValue is set, then value == defaultValue
    // TODO Svelte 6: remove input.value check and set to empty string?
    untrack(get2) == null && input.value
  ) {
    set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
  }
  render_effect(() => {
    var value = get2();
    if (input === document.activeElement) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (batches.has(batch)) {
        return;
      }
    }
    if (is_numberlike_input(input) && value === to_number(input.value)) {
      return;
    }
    if (input.type === "date" && !value && !input.value) {
      return;
    }
    if (value !== input.value) {
      input.value = value ?? "";
    }
  });
}
function is_numberlike_input(input) {
  var type = input.type;
  return type === "number" || type === "range";
}
function to_number(value) {
  return value === "" ? null : +value;
}
class ResizeObserverSingleton {
  /** */
  #listeners = /* @__PURE__ */ new WeakMap();
  /** @type {ResizeObserver | undefined} */
  #observer;
  /** @type {ResizeObserverOptions} */
  #options;
  /** @static */
  static entries = /* @__PURE__ */ new WeakMap();
  /** @param {ResizeObserverOptions} options */
  constructor(options2) {
    this.#options = options2;
  }
  /**
   * @param {Element} element
   * @param {(entry: ResizeObserverEntry) => any} listener
   */
  observe(element, listener) {
    var listeners = this.#listeners.get(element) || /* @__PURE__ */ new Set();
    listeners.add(listener);
    this.#listeners.set(element, listeners);
    this.#getObserver().observe(element, this.#options);
    return () => {
      var listeners2 = this.#listeners.get(element);
      listeners2.delete(listener);
      if (listeners2.size === 0) {
        this.#listeners.delete(element);
        this.#observer.unobserve(element);
      }
    };
  }
  #getObserver() {
    return this.#observer ?? (this.#observer = new ResizeObserver(
      /** @param {any} entries */
      (entries) => {
        for (var entry of entries) {
          ResizeObserverSingleton.entries.set(entry.target, entry);
          for (var listener of this.#listeners.get(entry.target) || []) {
            listener(entry);
          }
        }
      }
    ));
  }
}
var resize_observer_border_box = /* @__PURE__ */ new ResizeObserverSingleton({
  box: "border-box"
});
function bind_element_size(element, type, set2) {
  var unsub = resize_observer_border_box.observe(element, () => set2(element[type]));
  effect(() => {
    untrack(() => set2(element[type]));
    return unsub;
  });
}
function isMobile() {
  const mobRegEx = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return navigator.userAgentData?.mobile || mobRegEx.test(navigator.userAgent) || navigator.maxTouchPoints > 1 && window.innerWidth <= 1024;
}
function getPathsafeDate() {
  const date = /* @__PURE__ */ new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const today = `${day}.${month}.${year}`;
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const time = `${hours}-${minutes}-${seconds}`;
  return `${today} - ${time}`;
}
const core = proxy({
  isMobile: isMobile(),
  persistent: null,
  config: null,
  gameConfig: null,
  player: null,
  me: null,
  ui: null,
  online: null,
  tools: null,
  stickersCache: null,
  mainCanvas: null,
  fxCanvas: null,
  renderer: null,
  chunkManager: null,
  fx: null,
  camera: null,
  socket: null,
  input: null,
  brush: {
    imData: null,
    offsetX: 0,
    offsetY: 0,
    shape: null,
    renderMode: 0,
    changed: false
  }
});
function useGameCore$1() {
  return core;
}
const mainPalette = [
  [255, 255, 255],
  [180, 180, 180],
  [133, 133, 133],
  [90, 90, 90],
  [61, 61, 61],
  [30, 30, 30],
  [19, 19, 19],
  [0, 0, 0],
  [14, 7, 27],
  [26, 25, 50],
  [42, 47, 78],
  [66, 76, 110],
  [101, 115, 146],
  [146, 161, 185],
  [216, 220, 255],
  [187, 254, 255],
  [12, 241, 255],
  [0, 205, 249],
  [0, 172, 237],
  [0, 152, 220],
  [0, 105, 170],
  [0, 57, 109],
  [3, 25, 63],
  [28, 20, 67],
  [37, 27, 90],
  [56, 42, 115],
  [88, 56, 143],
  [133, 72, 202],
  [168, 113, 231],
  [255, 173, 225],
  [228, 109, 230],
  [202, 72, 202],
  [146, 220, 186],
  [93, 175, 141],
  [50, 132, 100],
  [35, 103, 78],
  [36, 82, 59],
  [26, 122, 62],
  [20, 160, 46],
  [89, 193, 53],
  [156, 219, 67],
  [185, 228, 90],
  [255, 235, 87],
  [255, 200, 37],
  [255, 162, 20],
  [237, 118, 20],
  [234, 89, 22],
  [195, 64, 3],
  [57, 31, 33],
  [93, 44, 40],
  [138, 72, 54],
  [191, 111, 74],
  [230, 156, 105],
  [246, 202, 159],
  [255, 223, 191],
  [246, 129, 135],
  [245, 85, 93],
  [234, 50, 60],
  [196, 36, 48],
  [137, 30, 43],
  [87, 28, 39],
  [59, 20, 67],
  [98, 36, 97],
  [147, 56, 143]
];
const secondPalette = [[46, 34, 47], [62, 53, 70], [98, 85, 101], [150, 108, 108], [171, 148, 122], [105, 79, 98], [127, 112, 138], [155, 171, 178], [199, 220, 208], [255, 255, 255], [110, 39, 39], [179, 56, 49], [234, 79, 54], [245, 125, 74], [174, 35, 52], [232, 59, 59], [251, 107, 29], [247, 150, 23], [249, 194, 43], [122, 48, 69], [158, 69, 57], [205, 104, 61], [230, 144, 78], [251, 185, 84], [76, 62, 36], [103, 102, 51], [162, 169, 71], [213, 224, 75], [251, 255, 134], [22, 90, 76], [35, 144, 99], [30, 188, 115], [145, 219, 105], [205, 223, 108], [49, 54, 56], [55, 78, 74], [84, 126, 100], [146, 169, 132], [178, 186, 144], [11, 94, 101], [11, 138, 143], [14, 175, 155], [48, 225, 185], [143, 248, 226], [50, 51, 83], [72, 74, 119], [77, 101, 180], [77, 155, 230], [143, 211, 255], [69, 41, 63], [107, 62, 117], [144, 94, 169], [168, 132, 243], [234, 173, 237], [117, 60, 84], [162, 75, 111], [207, 101, 127], [237, 128, 153], [131, 28, 93], [195, 36, 84], [240, 79, 120], [246, 129, 129], [252, 167, 144], [253, 203, 176]];
const config$2 = {
  "canvases": [
    {
      "name": "main",
      "cooldown": {
        "GUEST": [100, 25],
        "USER": [30, 40],
        "TRUSTED": [0, 32],
        "MOD": [0, 32]
      },
      "chunkSize": 256,
      "boardWidth": 32,
      "boardHeight": 32,
      "palette": [...mainPalette, ...secondPalette],
      "extra": {
        "palettes": [
          {
            "name": "Goroxels Old",
            "slice": [0, 64]
          },
          {
            "name": "Goroxels New",
            "slice": [64]
          }
        ]
      }
    },
    {
      "name": "test",
      "require": null,
      "cooldown": {
        "GUEST": [100, 16],
        "USER": [50, 32],
        "TRUSTED": [20, 600],
        "MOD": [25, 32]
      },
      "chunkSize": 512,
      "boardWidth": 8,
      "boardHeight": 8,
      "palette": [
        [255, 255, 255],
        [127, 127, 127],
        [0, 0, 0]
      ]
    },
    {
      "name": "timgorox",
      "cooldown": {
        "GUEST": [0, 32],
        "USER": [0, 32],
        "TRUSTED": [0, 32],
        "MOD": [0, 32]
      },
      "chunkSize": 480,
      "boardWidth": 4,
      "boardHeight": 4,
      "palette": mainPalette
    },
    {
      "name": "nsfw",
      "cooldown": {
        "GUEST": [1, 0],
        "USER": [30, 40],
        "TRUSTED": [20, 60],
        "MOD": [0, 32]
      },
      "chunkSize": 256,
      "boardWidth": 10,
      "boardHeight": 5,
      "require": "user",
      "palette": mainPalette
    },
    {
      "name": "timo",
      "cooldown": {
        "GUEST": [1, 0],
        "USER": [30, 40],
        "TRUSTED": [20, 60],
        "MOD": [0, 32]
      },
      "chunkSize": 256,
      "boardWidth": 5,
      "boardHeight": 2,
      "require": "user",
      "palette": mainPalette
    },
    {
      "name": "gorox",
      "cooldown": {
        "GUEST": [1, 0],
        "USER": [30, 40],
        "TRUSTED": [7, 60],
        "MOD": [0, 32]
      },
      "chunkSize": 256,
      "boardWidth": 18,
      "boardHeight": 13,
      "require": "user",
      "palette": mainPalette
    },
    {
      "name": "BEARZ",
      "cooldown": {
        "GUEST": [100, 25],
        "USER": [30, 40],
        "TRUSTED": [0, 32],
        "MOD": [0, 32]
      },
      "chunkSize": 256,
      "boardWidth": 8,
      "boardHeight": 8,
      "palette": [...mainPalette, ...secondPalette],
      "extra": {
        "palettes": [
          {
            "name": "Goroxels Old",
            "slice": [0, 64]
          },
          {
            "name": "Goroxels New",
            "slice": [64]
          }
        ]
      }
    },
    {
      "name": "elka",
      "cooldown": {
        "GUEST": [100, 25],
        "USER": [30, 40],
        "TRUSTED": [0, 32],
        "MOD": [0, 32]
      },
      "chunkSize": 256,
      "boardWidth": 10,
      "boardHeight": 14,
      "palette": [...mainPalette, ...secondPalette],
      "extra": {
        "palettes": [
          {
            "name": "Goroxels Old",
            "slice": [0, 64]
          },
          {
            "name": "Goroxels New",
            "slice": [64]
          }
        ]
      }
    }
  ],
  "telek": {
    x: 3280,
    y: 1524,
    size: 250,
    canvas: 0
  }
};
function rgb2abgr(r, g, b) {
  return 4278190080 | b << 16 | g << 8 | r;
}
function component2hex(c) {
  return c.toString(16).padStart(2, "0");
}
function rgb2hex(rgb) {
  return "#" + component2hex(rgb[0]) + component2hex(rgb[1]) + component2hex(rgb[2]);
}
const luminanceCache = /* @__PURE__ */ new Map();
function getLuminance(hex) {
  if (luminanceCache.has(hex)) return luminanceCache.get(hex);
  const rgb = hex.startsWith("#") ? hex.slice(1) : hex;
  const res = (rgb.length === 3 ? rgb.split("").map((c) => c + c).join("") : rgb).match(/.{2}/g).map((v) => {
    const val = parseInt(v, 16) / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  const luminance = res[0] * 0.2126 + res[1] * 0.7152 + res[2] * 0.0722;
  luminanceCache.set(hex, luminance);
  return luminance;
}
function checkCssContrast(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}
let initialized$1 = false;
const config$1 = proxy({
  canvasName: "default",
  canvasId: 0,
  chunkSize: 0,
  boardWidth: 0,
  boardHeight: 0,
  chunksX: 0,
  chunksY: 0,
  colors: [],
  colorsBGR: [],
  colorsHex: [],
  shared: {}
});
function initConfig() {
  if (initialized$1) return;
  initialized$1 = true;
  const url = new URL(window.location.href);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const canvasName = pathParts.at(-1) || "main";
  const index2 = config$2.canvases.findIndex((canvas2) => canvas2.name === canvasName);
  const canvasId = index2 === -1 ? 0 : index2;
  const canvCfg = config$2.canvases[canvasId];
  config$1.canvasName = canvasName;
  config$1.canvasId = canvasId;
  config$1.chunkSize = canvCfg.chunkSize;
  config$1.boardWidth = canvCfg.chunkSize * canvCfg.boardWidth;
  config$1.boardHeight = canvCfg.chunkSize * canvCfg.boardHeight;
  config$1.chunksX = canvCfg.boardWidth;
  config$1.chunksY = canvCfg.boardHeight;
  preparePalettes(config$1, canvCfg.palette);
  config$1.shared = config$2;
  console.log(`[config] Canvas initialized: ${canvasName}`);
  return config$1;
}
function preparePalettes(config2, allColors) {
  config2.colors = allColors;
  config2.colorsBGR = new Uint32Array(allColors.map((rgb) => rgb2abgr(...rgb)));
  config2.colorsHex = allColors.map(rgb2hex);
}
function screenToBoardSpace(x2, y2, rounded = false) {
  const core2 = useGameCore$1();
  const canvas2 = core2.mainCanvas;
  const camera = core2.camera;
  const worldX = camera.x + (x2 - canvas2.clientWidth / 2) / camera.currentZoom;
  const worldY = camera.y + (y2 - canvas2.clientHeight / 2) / camera.currentZoom;
  if (rounded) {
    return [Math.floor(worldX), Math.floor(worldY)];
  }
  return [worldX, worldY];
}
function boardToScreenSpace(worldX, worldY, rounded = false) {
  const core2 = useGameCore$1();
  const canvas2 = core2.mainCanvas;
  const camera = core2.camera;
  const screenX = canvas2.clientWidth / 2 + (worldX - camera.x) * camera.currentZoom;
  const screenY = canvas2.clientHeight / 2 + (worldY - camera.y) * camera.currentZoom;
  if (rounded) {
    return [Math.floor(screenX), Math.floor(screenY)];
  }
  return [screenX, screenY];
}
function isAreaVisible(x2, y2, w, h) {
  const core2 = useGameCore$1();
  core2.mainCanvas;
  const [x1, y1] = boardToScreenSpace(x2, y2);
  const [x22, y22] = boardToScreenSpace(x2 + w, y2 + h);
  return x1 < window.innerWidth && x22 >= 0 && y1 < window.innerHeight && y22 >= 0;
}
function isChunkVisible(cx, cy) {
  const core2 = useGameCore$1();
  const chunkSize = core2.config.chunkSize;
  return isAreaVisible(cx * chunkSize, cy * chunkSize, chunkSize, chunkSize);
}
let _visibleChunks = [];
let _lastVisChunksKey = "";
function getVisibleChunks() {
  const core2 = useGameCore$1();
  const chunkSize = core2.config.chunkSize;
  const boardChunkWid = core2.config.chunksX;
  const boardChunkHei = core2.config.chunksY;
  let [sx, sy] = screenToBoardSpace(0, 0);
  let [ex, ey] = screenToBoardSpace(window.innerWidth, window.innerHeight);
  let startX = sx / chunkSize | 0;
  let endX = ex / chunkSize + 1 | 0;
  let startY = sy / chunkSize | 0;
  let endY = ey / chunkSize + 1 | 0;
  startX = startX < 0 ? 0 : startX;
  endX = endX > boardChunkWid ? boardChunkWid : endX;
  startY = startY < 0 ? 0 : startY;
  endY = endY > boardChunkHei ? boardChunkHei : endY;
  const key = startX + "," + endX + "," + startY + "," + endY;
  if (key === _lastVisChunksKey) return _visibleChunks;
  _lastVisChunksKey = key;
  _visibleChunks.length = 0;
  for (let x2 = startX; x2 < endX; x2++) {
    for (let y2 = startY; y2 < endY; y2++) {
      _visibleChunks.push(x2, y2);
    }
  }
  return _visibleChunks;
}
function createCamera(canvas2, canvasConfig) {
  const camera = proxy({
    x: 0,
    // camera center x
    y: 0,
    // camera center y
    currentZoom: 1,
    targetZoom: 1,
    // world point that should stay under the mouse
    pivotWorldX: 0,
    pivotWorldY: 0,
    // current mouse pos
    mouseScreenX: 0,
    mouseScreenY: 0,
    noMoving: false,
    lerpFactor: 0.22
  });
  const minZoom = 0.1;
  const maxZoom = 64;
  const halfW = canvasConfig.boardWidth / 2;
  const halfH = canvasConfig.boardHeight / 2;
  function clamp2() {
    camera.x = Math.max(-halfW, Math.min(camera.x, halfW));
    camera.y = Math.max(-halfH, Math.min(camera.y, halfH));
  }
  function clampZoom() {
    camera.targetZoom = Math.max(minZoom, Math.min(camera.targetZoom, maxZoom));
  }
  const cameraApi = {
    centerOn: (x2, y2) => {
      camera.x = x2;
      camera.y = y2;
    },
    updateMouse(screenX, screenY) {
      camera.mouseScreenX = screenX;
      camera.mouseScreenY = screenY;
      const [pivWorldX, pivWorldY] = screenToBoardSpace(screenX, screenY);
      camera.pivotWorldX = pivWorldX;
      camera.pivotWorldY = pivWorldY;
    },
    moveBy(dx, dy) {
      if (camera.noMoving) return;
      camera.x += dx / camera.currentZoom;
      camera.y += dy / camera.currentZoom;
      clamp2();
    },
    setTargetZoom(value) {
      camera.targetZoom = value;
      clampZoom();
    },
    disableMove() {
      camera.noMoving = true;
    },
    enableMove() {
      camera.noMoving = false;
    },
    updateLerp() {
      if (camera.currentZoom === camera.targetZoom) return;
      const prevZoom = camera.currentZoom;
      camera.currentZoom += (camera.targetZoom - camera.currentZoom) * camera.lerpFactor;
      if (Math.abs(camera.currentZoom - prevZoom) > 1e-4) {
        camera.x = camera.pivotWorldX - (camera.mouseScreenX - canvas2.clientWidth / 2) / camera.currentZoom;
        camera.y = camera.pivotWorldY - (camera.mouseScreenY - canvas2.clientHeight / 2) / camera.currentZoom;
      }
    }
  };
  Object.assign(camera, cameraApi);
  return camera;
}
const placeholderImgPath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEABAMAAACuXLVVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURbu9v35/f05ehN4AAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuMTITAUd0AAAAuGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAADAAAAMQECABEAAABaAAAAaYcEAAEAAABsAAAAAAAAAJOTAADoAwAAk5MAAOgDAABQYWludC5ORVQgNS4xLjEyAAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlgAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAACDw8TdzEtbPAAAAQVJREFUeNrt21EKwyAMAFC9gd7/smOjtdlwo+3YrPDyVWKqDwzij2l45Do0CgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwEUB4R1eeXy3ZC/dZirhDd+Sri/VAHMAQuk6fk89rZRDZRuMs3UmAZgLsLTSLkAY2vq004QZYCpAZ6XTTfghBXAQ0Hby3DnwI0CnGuBbwNv7QPhlx31gjXr4HAC4AOB/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsL2VHhMp3QDvZic5clpb2QAAAABJRU5ErkJggg==";
function clamp(v, min, max) {
  return Math.max(Math.min(v, max), min);
}
function remap(value, inputMin, inputMax, outputMin, outputMax) {
  return (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
}
function encodeCoord(x2, y2) {
  return (x2 & 65535) << 16 | y2 & 65535;
}
function decodeCoord(encoded) {
  const x2 = encoded >> 16;
  const y2 = encoded << 16 >> 16;
  return [x2, y2];
}
const bayer2x2 = [
  [0, 2],
  [3, 1]
];
const bayer4x4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];
const bayer8x8 = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21]
];
const bayer16x16 = [
  [0, 128, 32, 160, 8, 136, 40, 168, 2, 130, 34, 162, 10, 138, 42, 170],
  [192, 64, 224, 96, 200, 72, 232, 104, 194, 66, 226, 98, 202, 74, 234, 106],
  [48, 176, 16, 144, 56, 184, 24, 152, 50, 178, 18, 146, 58, 186, 26, 154],
  [240, 112, 208, 80, 248, 120, 216, 88, 242, 114, 210, 82, 250, 122, 218, 90],
  [12, 140, 44, 172, 4, 132, 36, 164, 14, 142, 46, 174, 6, 134, 38, 166],
  [204, 76, 236, 108, 196, 68, 228, 100, 206, 78, 238, 110, 198, 70, 230, 102],
  [60, 188, 28, 156, 52, 180, 20, 148, 62, 190, 30, 158, 54, 182, 22, 150],
  [252, 124, 220, 92, 244, 116, 212, 84, 254, 126, 222, 94, 246, 118, 214, 86],
  [3, 131, 35, 163, 11, 139, 43, 171, 1, 129, 33, 161, 9, 137, 41, 169],
  [195, 67, 227, 99, 203, 75, 235, 107, 193, 65, 225, 97, 201, 73, 233, 105],
  [51, 179, 19, 147, 59, 187, 27, 155, 49, 177, 17, 145, 57, 185, 25, 153],
  [243, 115, 211, 83, 251, 123, 219, 91, 241, 113, 209, 81, 249, 121, 217, 89],
  [15, 143, 47, 175, 7, 135, 39, 167, 13, 141, 45, 173, 5, 133, 37, 165],
  [207, 79, 239, 111, 199, 71, 231, 103, 205, 77, 237, 109, 197, 69, 229, 101],
  [63, 191, 31, 159, 55, 183, 23, 151, 61, 189, 29, 157, 53, 181, 21, 149],
  [255, 127, 223, 95, 247, 119, 215, 87, 253, 125, 221, 93, 245, 117, 213, 85]
];
const custom4x4 = [
  [0, 0, 0, 1],
  [0, 5, 4, 2],
  [0, 0, 0, 3],
  [0, 0, 0, 0]
];
const custom8x8 = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 13, 0, 0, 0, 8],
  [0, 15, 14, 12, 0, 10, 9, 7],
  [0, 0, 0, 11, 23, 0, 0, 6],
  [0, 0, 25, 24, 22, 0, 0, 0],
  [0, 0, 0, 3, 21, 0, 0, 18],
  [0, 5, 4, 2, 0, 20, 19, 17],
  [0, 0, 0, 1, 0, 0, 0, 16]
];
const custom7x7 = [
  [1, 3, 37, 9, 11, 45, 43],
  [4, 2, 47, 12, 10, 26, 28],
  [30, 44, 17, 47, 36, 29, 27],
  [13, 15, 46, 5, 7, 38, 40],
  [16, 14, 42, 8, 6, 41, 39],
  [48, 22, 24, 31, 33, 18, 20],
  [35, 25, 23, 34, 32, 21, 19]
];
const bayer = {
  2: bayer2x2,
  4: bayer4x4,
  8: bayer8x8,
  16: bayer16x16,
  c4: custom4x4,
  c8: custom8x8,
  c7: custom7x7
};
const CHUNK_FADEOUT_MS = 700;
function createRenderer(canvas2, core2) {
  const ctx2 = canvas2.getContext("2d", { alpha: false });
  let chunkPlaceholder = null;
  let needRender = true;
  const camera = core2.camera;
  user_effect(() => {
    camera.x;
    camera.y;
    camera.currentZoom;
    needRender = true;
  });
  let placeholderLevels = null;
  function init2() {
    loadPlaceholderLoop();
  }
  function loadPlaceholderLoop() {
    const csize = core2.config.chunkSize;
    loadImg(placeholderImgPath, csize, csize).then((img) => {
      chunkPlaceholder = img;
      placeholderLevels = preparePlaceholderDithering(img, 4);
      requestRender();
    }).catch((err) => {
      console.error(`unable to load chunk placeholder: ${err}, retrying in 3s`);
      setTimeout(loadPlaceholderLoop, 3e3);
    });
  }
  function render() {
    if (!needRender) return;
    needRender = false;
    correctSmoothing();
    const camX = camera.x;
    const camY = camera.y;
    const zoom = camera.currentZoom;
    const chunkSize = core2.config.chunkSize;
    const halfW = canvas2.width / 2;
    const halfH = canvas2.height / 2;
    ctx2.fillStyle = "#A187FF";
    ctx2.fillRect(0, 0, canvas2.clientWidth, canvas2.clientHeight);
    const now2 = Date.now();
    const chunkManager = core2.chunkManager;
    const chunks = getVisibleChunks();
    for (let i = 0; i < chunks.length; i += 2) {
      ctx2.globalAlpha = 1;
      const cx = chunks[i];
      const cy = chunks[i + 1];
      const worldLeft = cx * chunkSize;
      const worldTop = cy * chunkSize;
      let screenLeft = halfW + (worldLeft - camX) * zoom;
      let screenTop = halfH + (worldTop - camY) * zoom;
      let screenRight = halfW + (worldLeft + chunkSize - camX) * zoom;
      let screenBottom = halfH + (worldTop + chunkSize - camY) * zoom;
      screenLeft = Math.floor(screenLeft);
      screenTop = Math.floor(screenTop);
      screenRight = Math.floor(screenRight);
      screenBottom = Math.floor(screenBottom);
      const screenW = screenRight - screenLeft;
      const screenH = screenBottom - screenTop;
      const chunk = chunkManager.getChunk(cx, cy);
      if (chunk) {
        chunk.redraw();
        ctx2.drawImage(chunk.canvas, screenLeft, screenTop, screenW, screenH);
        const sinceLoad = now2 - chunk.loadedAt;
        if (sinceLoad < CHUNK_FADEOUT_MS && placeholderLevels?.length) {
          if (zoom > 0.99) {
            const curLevel = Math.floor(remap(sinceLoad, 0, CHUNK_FADEOUT_MS, 0, placeholderLevels.length - 1));
            const curPlaceholder = placeholderLevels[curLevel];
            ctx2.drawImage(curPlaceholder, screenLeft, screenTop, screenW, screenH);
          } else {
            ctx2.globalAlpha = 1 - sinceLoad / CHUNK_FADEOUT_MS;
            ctx2.drawImage(chunkPlaceholder, screenLeft, screenTop, screenW, screenH);
          }
          needRender = true;
        }
      } else if (chunkPlaceholder) {
        ctx2.drawImage(chunkPlaceholder, screenLeft, screenTop, screenW, screenH);
      }
    }
  }
  let lastZoom = null;
  function correctSmoothing() {
    if (lastZoom === camera.targetZoom) {
      return;
    }
    lastZoom = camera.targetZoom;
    if (core2.isMobile) {
      ctx2.imageSmoothingEnabled = false;
      ctx2.canvas.style.imageRendering = "pixelated";
      return;
    }
    if (camera.targetZoom < 1) {
      ctx2.imageSmoothingEnabled = true;
      ctx2.canvas.style.imageRendering = "auto";
    } else {
      ctx2.imageSmoothingEnabled = false;
      ctx2.canvas.style.imageRendering = "pixelated";
    }
  }
  function requestRender() {
    needRender = true;
  }
  return { init: init2, requestRender, render };
}
function preparePlaceholderDithering(placeholder, msize = 4) {
  const levels = [];
  const matrix = bayer[msize];
  const w = placeholder.width;
  const h = placeholder.height;
  for (let level = 0; level < msize ** 2; level++) {
    const canvas2 = document.createElement("canvas");
    canvas2.width = w;
    canvas2.height = h;
    const ctx2 = canvas2.getContext("2d");
    ctx2.drawImage(placeholder, 0, 0);
    const imd = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
    const dataData = new Uint32Array(imd.data.buffer);
    for (let j = 0; j < w * h; j++) {
      const x2 = j % w;
      const y2 = j / w | 0;
      const mx = x2 % msize;
      const my = y2 % msize;
      if (level > matrix[my][mx]) {
        dataData[j] = 127;
      }
    }
    ctx2.putImageData(imd, 0, 0);
    levels.push(canvas2);
  }
  return levels;
}
async function loadImg(path, targetWidth, targetHeight) {
  return new Promise((res, rej) => {
    const image = new Image();
    image.src = path;
    image.onload = () => {
      const canvas2 = document.createElement("canvas");
      canvas2.width = targetWidth ?? image.width;
      canvas2.height = targetHeight ?? image.height;
      canvas2.getContext("2d").drawImage(image, 0, 0, canvas2.width, canvas2.height);
      res(canvas2);
    };
    image.onerror = (err) => {
      rej(err);
    };
  });
}
class EventEmitter {
  constructor() {
    this._events = /* @__PURE__ */ Object.create(null);
  }
  on(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError(`The "listener" argument must be of type Function. Received type ${typeof listener}`);
    }
    const existing = this._events[eventName];
    if (existing === void 0) {
      this._events[eventName] = listener;
    } else if (typeof existing === "function") {
      this._events[eventName] = [existing, listener];
    } else {
      existing.push(listener);
    }
    return this;
  }
  off(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError(`The "listener" argument must be of type Function. Received type ${typeof listener}`);
    }
    const existing = this._events[eventName];
    if (existing === void 0) return this;
    if (typeof existing === "function") {
      if (existing === listener) {
        delete this._events[eventName];
      }
      return this;
    }
    const index2 = existing.indexOf(listener);
    if (index2 !== -1) {
      existing.splice(index2, 1);
      if (existing.length === 1) {
        this._events[eventName] = existing[0];
      } else if (existing.length === 0) {
        delete this._events[eventName];
      }
    }
    return this;
  }
  once(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError(`The "listener" argument must be of type Function. Received type ${typeof listener}`);
    }
    function onceWrapper(...args) {
      this.off(eventName, onceWrapper);
      listener.call(this, ...args);
    }
    this.on(eventName, onceWrapper);
    return this;
  }
  emit(eventName, ...args) {
    const handler = this._events[eventName];
    if (handler === void 0) return false;
    if (typeof handler === "function") {
      handler.call(this, ...args);
      return true;
    }
    const currentListeners = handler.slice();
    for (let i = 0; i < currentListeners.length; i++) {
      currentListeners[i].call(this, ...args);
    }
    return true;
  }
}
const emitter = new EventEmitter();
const originalOn = emitter.on.bind(emitter);
emitter.on = function(eventName, listener) {
  originalOn(eventName, listener);
  onDestroy(() => {
    emitter.off(eventName, listener);
  });
  return () => emitter.off(eventName, listener);
};
emitter.emit.bind(emitter);
emitter.on.bind(emitter);
emitter.once.bind(emitter);
emitter.off.bind(emitter);
function createInputHandler(canvas2) {
  canvas2.getContext("2d", { alpha: true });
  const activePointers = /* @__PURE__ */ new Map();
  let prevAvgX = 0;
  let prevAvgY = 0;
  let prevDist = 0;
  function getPointersArray() {
    return Array.from(activePointers.values());
  }
  function getAveragePosition() {
    const points = getPointersArray();
    if (points.length === 0) return { x: 0, y: 0 };
    let sx = 0, sy = 0;
    for (const p of points) {
      sx += p.x;
      sy += p.y;
    }
    return { x: sx / points.length, y: sy / points.length };
  }
  function getFingerDistance() {
    const points = getPointersArray();
    if (points.length < 2) return 0;
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.hypot(dx, dy);
  }
  function onPointerDown(e) {
    canvas2.setPointerCapture(e.pointerId);
    activePointers.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY
    });
    let isGesture = false;
    if (activePointers.size > 1) {
      const avg = getAveragePosition();
      prevAvgX = avg.x;
      prevAvgY = avg.y;
      prevDist = getFingerDistance();
      isGesture = true;
    }
    e.gesture = isGesture;
    emitter.emit("pointerdown", e);
  }
  function onPointerMove(e) {
    const pointer = activePointers.get(e.pointerId);
    if (!pointer) {
      emitter.emit("pointermove", e);
      return;
    }
    const oldX = pointer.x;
    const oldY = pointer.y;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    const count = activePointers.size;
    if (count === 1) {
      e.startX = pointer.startX;
      e.startY = pointer.startY;
      e.dx = pointer.x - oldX;
      e.dy = pointer.y - oldY;
      emitter.emit("pointerdrag", e);
    } else if (count === 2) {
      const avg = getAveragePosition();
      const dx = avg.x - prevAvgX;
      const dy = avg.y - prevAvgY;
      const currentDist = getFingerDistance();
      emitter.emit("pointerpinch", {
        ds: currentDist / prevDist,
        dx,
        dy,
        centerX: avg.x,
        centerY: avg.y
      });
      prevAvgX = avg.x;
      prevAvgY = avg.y;
      prevDist = currentDist;
    }
  }
  function onPointerUp(e) {
    const oldPointer = activePointers.get(e.pointerId);
    if (!oldPointer) return;
    activePointers.delete(e.pointerId);
    e.startX = oldPointer.startX;
    e.startY = oldPointer.startY;
    emitter.emit("pointerup", e);
  }
  function onWheel(e) {
    e.preventDefault();
    emitter.emit("wheel", e);
  }
  canvas2.addEventListener("pointerdown", onPointerDown, { passive: true });
  canvas2.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas2.addEventListener("pointerup", onPointerUp, { passive: true });
  canvas2.addEventListener("pointercancel", onPointerUp, { passive: true });
  canvas2.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("keydown", (e) => emitter.emit("keydown", e));
  document.addEventListener("keyup", (e) => emitter.emit("keyup", e));
}
const OPCODES = {
  ping: 6
};
const STRING_OPCODES = {
  userJoin: "u",
  userLeave: "l",
  subscribeChat: "s",
  chatMessage: "c",
  batch: "b"
};
const SEND_INTERVAL_MS = 50;
function createPixelBufferizer(socket2, core2) {
  const flushInterval = setInterval(
    () => {
      if (pixelsQueue.length) {
        flushQueue();
      }
    },
    SEND_INTERVAL_MS
  );
  const pixelsQueue = [];
  const lastFlags = 0;
  function flushQueue() {
    if (!pixelsQueue.length || !socket2.isConnected) {
      return false;
    }
    socket2.sendPixels(pixelsQueue, lastFlags);
    pixelsQueue.length = 0;
    return true;
  }
  return {
    terminate: () => {
      clearInterval(flushInterval);
    }
  };
}
const PING_INTERVAL = 25e3;
class Socket {
  #isConnected = state(false);
  get isConnected() {
    return get(this.#isConnected);
  }
  set isConnected(value) {
    set$1(this.#isConnected, value, true);
  }
  #socket = null;
  #eventTarget = null;
  #core = null;
  #pingWorker = null;
  #alive = false;
  #justStarted = true;
  #connectAttempts = 0;
  #reconnectTimeoutFactor = 1.5;
  #reconnectMaxTimeout = 2e4;
  pixelsBufferizer = null;
  init(core2) {
    this.#core = core2;
    this.#eventTarget = emitter;
    this.#open();
    this.#initPingWorker();
    this.pixelsBufferizer = createPixelBufferizer(this);
  }
  send(data) {
    console.log("sending", data);
    this.#alive = true;
    if (!this.isConnected) {
      console.error("trying to send something on closed socket!", data);
      return false;
    }
    this.#socket.send(data);
    return true;
  }
  sendPing() {
    const uarr = new Uint8Array(1);
    uarr[0] = OPCODES.ping;
    this.send(uarr);
  }
  sendPixels(pixels, flags, options2 = {}) {
  }
  sendChatMessage(msg, channel) {
    const packet = { c: STRING_OPCODES.chatMessage, ch: channel, msg };
    return this.send(JSON.stringify(packet));
  }
  sendChatSubscribe(channel, isReconnect) {
    const packet = {
      c: STRING_OPCODES.subscribeChat,
      ch: channel,
      reconnect: isReconnect
    };
    this.send(JSON.stringify(packet));
  }
  terminate() {
  }
  #open = () => {
    if (this.#socket && this.#socket.readyState !== WebSocket.CLOSED) {
      this.#removeAllListeners();
      this.#socket.close();
      this.#onclose(false);
    }
    const canvasName = config$1.canvasName;
    if (!canvasName) throw new Error("socket should be initialized after the config!");
    const isHttps = document.location.protocol.startsWith("https");
    const host = document.location.host;
    const path = `${isHttps ? "wss" : "ws"}:${host}/${canvasName}`;
    this.#socket = new WebSocket(path);
    this.#socket.binaryType = "arraybuffer";
    this.#socket.addEventListener("open", this.#onopen);
    this.#socket.addEventListener("message", this.#onmessage);
    this.#socket.addEventListener("close", this.#onclose);
  };
  #initPingWorker() {
    const workerCode = `
			let timer = null;
			self.onmessage = function(e) {
				if (e.data === 'start') {
					clearInterval(timer);
					timer = setInterval(() => {
						self.postMessage('tick');
					}, ${PING_INTERVAL});
				} else if (e.data === 'stop') {
					clearInterval(timer);
				}
			};
		`;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    this.#pingWorker = new Worker(URL.createObjectURL(blob));
    this.#pingWorker.postMessage("start");
    this.#pingWorker.onmessage = () => {
      console.log("pingtick");
      this.#executePingTick();
    };
  }
  #executePingTick() {
    if (!this.isConnected) return;
    if (!this.#alive) {
      this.sendPing();
    }
    this.#alive = false;
    this.sendPing();
  }
  #onopen = () => {
    this.#connectAttempts = 0;
    this.isConnected = true;
    this.#alive = false;
    this.#dispatch("connected");
    console.log("socket opened");
    this.#subscribeChats();
    this.#justStarted = false;
  };
  #subscribeChats() {
    const isReconnect = !this.#justStarted;
    this.sendChatSubscribe("global", isReconnect);
    this.sendChatSubscribe(this.#core.config.canvasName, isReconnect);
  }
  #onmessage = (ev) => {
    const data = ev.data;
    if (typeof data === "string") {
      this.#handleStringMessage(data);
    } else {
      new DataView(ev.data);
    }
    console.log("socket message", ev);
  };
  #handleStringMessage(msg) {
    const parsed = typeof msg === "object" ? msg : JSON.parse(msg);
    const op = parsed.c;
    switch (op) {
      case STRING_OPCODES.batch: {
        for (const packet of parsed.packets) {
          this.#handleStringMessage(packet);
        }
        break;
      }
      case STRING_OPCODES.userJoin: {
        const user = parsed.user;
        this.#dispatch("userJoin", user);
        if (user.isMe) {
          this.#dispatch("me", user);
        }
        break;
      }
      case STRING_OPCODES.userLeave: {
        this.#dispatch("userLeave", parsed.id);
        break;
      }
      case STRING_OPCODES.chatMessage: {
        delete parsed["c"];
        this.#dispatch("chatMessage", parsed);
        break;
      }
    }
  }
  #onclose = (reopen = true) => {
    this.isConnected = false;
    if (reopen) {
      const time = Math.min(300 * Math.pow(this.#reconnectTimeoutFactor, this.#connectAttempts), this.#reconnectMaxTimeout);
      this.#connectAttempts++;
      setTimeout(this.#open, time);
    }
  };
  #removeAllListeners() {
    if (!this.#socket) return;
    this.#socket.removeEventListener("open", this.#onopen);
    this.#socket.removeEventListener("message", this.#onmessage);
    this.#socket.removeEventListener("close", this.#onclose);
  }
  #dispatch(evName, data = null) {
    this.#eventTarget.emit("sock." + evName, data);
  }
}
const socket = new Socket();
function persistent(key, initial, debounceMs = 600) {
  console.log(key, JSON.parse(localStorage.getItem(key) ?? "null") ?? initial, `localStorage.getItem('${key}')=`, localStorage.getItem(key), initial);
  let value = state(proxy(JSON.parse(localStorage.getItem(key) ?? "null") ?? initial));
  let timer;
  effect_root(() => {
    user_effect(() => {
      get(value);
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          console.log("save");
          localStorage.setItem(key, JSON.stringify(get(value)));
        },
        debounceMs
      );
    });
  });
  return {
    get v() {
      return get(value);
    },
    set v(newVal) {
      set$1(value, newVal, true);
    }
  };
}
function persistentPerCanvas(key, initial, debounceMs = 600) {
  const core2 = useGameCore$1();
  if (!core2.config?.canvasName) throw new Error("trying to make persistent store without config loaded");
  const storageKey = `${core2.config.canvasName}-${key}`;
  return persistent(storageKey, initial, debounceMs);
}
class Player {
  palette = null;
  maxPlaced = persistent("maxPlaced", 5e3);
  maxActions = persistent("maxActions", 5);
  primaryCol = null;
  seconaryCol = null;
  brushSize = null;
  #nickname = state("");
  get nickname() {
    return get(this.#nickname);
  }
  set nickname(value) {
    set$1(this.#nickname, value, true);
  }
  #socketId = state(-1);
  get socketId() {
    return get(this.#socketId);
  }
  set socketId(value) {
    set$1(this.#socketId, value, true);
  }
  #isGuest = state(true);
  get isGuest() {
    return get(this.#isGuest);
  }
  set isGuest(value) {
    set$1(this.#isGuest, value, true);
  }
  #x = state(0);
  get x() {
    return get(this.#x);
  }
  set x(value) {
    set$1(this.#x, value, true);
  }
  #y = state(0);
  get y() {
    return get(this.#y);
  }
  set y(value) {
    set$1(this.#y, value, true);
  }
  #suspendedClrs = state(null);
  get suspendedClrs() {
    return get(this.#suspendedClrs);
  }
  set suspendedClrs(value) {
    set$1(this.#suspendedClrs, value, true);
  }
  #placed = state(proxy([]));
  get placed() {
    return get(this.#placed);
  }
  set placed(value) {
    set$1(this.#placed, value, true);
  }
  #bucket = state(null);
  get bucket() {
    return get(this.#bucket);
  }
  set bucket(value) {
    set$1(this.#bucket, value, true);
  }
  init() {
    this.primaryCol = persistentPerCanvas("color1", 0);
    this.seconaryCol = persistentPerCanvas("color2", -1);
    this.brushSize = persistentPerCanvas("brushSize", 1);
    emitter.on("sock.me", (user) => {
      this.socketId = user.id;
      this.nickname = user.nick ?? null;
      this.isGuest = !(user.registered ?? false);
    });
  }
  switchColor(id) {
    if (!this.primaryCol || !this.seconaryCol) return;
    if (this.seconaryCol.v === id && id !== -1) this.switchSecondColor(-1);
    if (this.primaryCol.v === id) id = -1;
    this.primaryCol.v = id;
    const core2 = useGameCore();
    core2.requestRender?.();
  }
  getColorByCoord(x2, y2) {
    let col1 = player.primaryCol?.v ?? -1;
    let col2 = player.seconaryCol?.v ?? -1;
    if (col1 === -1 && col2 !== -1) {
      col1 = col2;
    } else if (col2 === -1 && col1 !== -1) {
      col2 = col1;
    } else if (col1 === -1 && col2 === -1) {
      return -1;
    }
    return (x2 + y2) % 2 === 0 ? col1 : col2;
  }
  switchSecondColor(id) {
    if (!this.primaryCol || !this.seconaryCol) return;
    if (this.primaryCol.v === id && id !== -1) this.switchColor(-1);
    if (this.seconaryCol.v === id) id = -1;
    this.seconaryCol.v = id;
  }
  swapColors() {
    if (!this.primaryCol || !this.seconaryCol) return;
    const temp = this.primaryCol.v;
    this.switchColor(this.seconaryCol.v);
    this.switchSecondColor(temp);
  }
  suspendColors() {
    if (!this.primaryCol || !this.seconaryCol) return;
    this.suspendedClrs = [this.primaryCol.v, this.seconaryCol.v];
    this.primaryCol.v = -1;
    this.seconaryCol.v = -1;
  }
  restoreColors() {
    if (!this.suspendedClrs) return;
    this.switchColor(this.suspendedClrs[0]);
    this.switchSecondColor(this.suspendedClrs[1]);
    this.suspendedClrs = null;
  }
  updateBucket(delay, max) {
    this.bucket = new Bucket(delay, max);
  }
}
const player = new Player();
function mapUserObject(serverUser) {
  return {
    username: serverUser?.nick,
    userId: serverUser?.userId,
    registered: serverUser.registered,
    role: serverUser.role,
    connections: [serverUser.id],
    badges: serverUser.badges ?? [],
    lastCoords: [0, 0],
    lastColor: null
  };
}
class OnlineManager {
  #users = state(proxy([]));
  get users() {
    return get(this.#users);
  }
  set users(value) {
    set$1(this.#users, value, true);
  }
  init() {
    emitter.on("sock.userJoin", (userData) => this.addUser(userData));
    emitter.on("sock.userLeave", (socketId) => this.removeUser(socketId));
    emitter.on("sock.userUpdate", (data) => this.updateUser(data));
  }
  addUser(user) {
    const existing = this.users.find((u) => u.connections.includes(user.id));
    if (existing) {
      existing.connections.push(user.id);
    } else {
      const newUsr = mapUserObject(user);
      this.users.push(newUsr);
    }
  }
  removeUser(socketId) {
    const existing = this.users.find((u) => u.connections.includes(socketId));
    if (!existing) return;
    const existingIdx = existing.connections.indexOf(socketId);
    existing.connections.splice(existingIdx, 1);
    if (existing.connections.length === 0) {
      this.users.splice(this.users.indexOf(existing), 1);
    }
  }
  updateUser(data) {
    const user = this.users.find((u) => u.socketId === data.socketId);
    if (user) {
      if (data.lastCoords) user.lastCoords = data.lastCoords;
      if (data.lastColor) user.lastColor = data.lastColor;
    }
  }
}
const online = new OnlineManager();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var cjs;
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  var isMergeableObject = function isMergeableObject2(value) {
    return isNonNullObject(value) && !isSpecial(value);
  };
  function isNonNullObject(value) {
    return !!value && typeof value === "object";
  }
  function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
  }
  var canUseSymbol = typeof Symbol === "function" && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? /* @__PURE__ */ Symbol.for("react.element") : 60103;
  function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
  }
  function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
  }
  function cloneUnlessOtherwiseSpecified(value, options2) {
    return options2.clone !== false && options2.isMergeableObject(value) ? deepmerge2(emptyTarget(value), value, options2) : value;
  }
  function defaultArrayMerge(target, source, options2) {
    return target.concat(source).map(function(element) {
      return cloneUnlessOtherwiseSpecified(element, options2);
    });
  }
  function getMergeFunction(key, options2) {
    if (!options2.customMerge) {
      return deepmerge2;
    }
    var customMerge = options2.customMerge(key);
    return typeof customMerge === "function" ? customMerge : deepmerge2;
  }
  function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
      return Object.propertyIsEnumerable.call(target, symbol);
    }) : [];
  }
  function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
  }
  function propertyIsOnObject(object, property) {
    try {
      return property in object;
    } catch (_) {
      return false;
    }
  }
  function propertyIsUnsafe(target, key) {
    return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
  }
  function mergeObject(target, source, options2) {
    var destination = {};
    if (options2.isMergeableObject(target)) {
      getKeys(target).forEach(function(key) {
        destination[key] = cloneUnlessOtherwiseSpecified(target[key], options2);
      });
    }
    getKeys(source).forEach(function(key) {
      if (propertyIsUnsafe(target, key)) {
        return;
      }
      if (propertyIsOnObject(target, key) && options2.isMergeableObject(source[key])) {
        destination[key] = getMergeFunction(key, options2)(target[key], source[key], options2);
      } else {
        destination[key] = cloneUnlessOtherwiseSpecified(source[key], options2);
      }
    });
    return destination;
  }
  function deepmerge2(target, source, options2) {
    options2 = options2 || {};
    options2.arrayMerge = options2.arrayMerge || defaultArrayMerge;
    options2.isMergeableObject = options2.isMergeableObject || isMergeableObject;
    options2.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
      return cloneUnlessOtherwiseSpecified(source, options2);
    } else if (sourceIsArray) {
      return options2.arrayMerge(target, source, options2);
    } else {
      return mergeObject(target, source, options2);
    }
  }
  deepmerge2.all = function deepmergeAll(array, options2) {
    if (!Array.isArray(array)) {
      throw new Error("first argument should be an array");
    }
    return array.reduce(function(prev, next2) {
      return deepmerge2(prev, next2, options2);
    }, {});
  };
  var deepmerge_1 = deepmerge2;
  cjs = deepmerge_1;
  return cjs;
}
var cjsExports = requireCjs();
const deepmerge = /* @__PURE__ */ getDefaultExportFromCjs(cjsExports);
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t2) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t2[p] = s[p];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t2 = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t2[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t2[p[i]] = s[p[i]];
    }
  return t2;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function memoize(fn, options2) {
  var cache = options2 && options2.cache ? options2.cache : cacheDefault;
  var serializer = options2 && options2.serializer ? options2.serializer : serializerDefault;
  var strategy = options2 && options2.strategy ? options2.strategy : strategyDefault;
  return strategy(fn, {
    cache,
    serializer
  });
}
function isPrimitive(value) {
  return value == null || typeof value === "number" || typeof value === "boolean";
}
function monadic(fn, cache, serializer, arg) {
  var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.call(this, arg);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function variadic(fn, cache, serializer) {
  var args = Array.prototype.slice.call(arguments, 3);
  var cacheKey = serializer(args);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.apply(this, args);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function assemble(fn, context, strategy, cache, serialize) {
  return strategy.bind(context, fn, cache, serialize);
}
function strategyDefault(fn, options2) {
  var strategy = fn.length === 1 ? monadic : variadic;
  return assemble(fn, this, strategy, options2.cache.create(), options2.serializer);
}
function strategyVariadic(fn, options2) {
  return assemble(fn, this, variadic, options2.cache.create(), options2.serializer);
}
var serializerDefault = function() {
  return JSON.stringify(arguments);
};
var ObjectWithoutPrototypeCache = (
  /** @class */
  (function() {
    function ObjectWithoutPrototypeCache2() {
      this.cache = /* @__PURE__ */ Object.create(null);
    }
    ObjectWithoutPrototypeCache2.prototype.get = function(key) {
      return this.cache[key];
    };
    ObjectWithoutPrototypeCache2.prototype.set = function(key, value) {
      this.cache[key] = value;
    };
    return ObjectWithoutPrototypeCache2;
  })()
);
var cacheDefault = {
  create: function create() {
    return new ObjectWithoutPrototypeCache();
  }
};
var strategies = {
  variadic: strategyVariadic
};
var ErrorKind;
(function(ErrorKind2) {
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
  ErrorKind2[ErrorKind2["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
  ErrorKind2[ErrorKind2["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
  ErrorKind2[ErrorKind2["INVALID_TAG"] = 23] = "INVALID_TAG";
  ErrorKind2[ErrorKind2["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
  ErrorKind2[ErrorKind2["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
  ErrorKind2[ErrorKind2["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
})(ErrorKind || (ErrorKind = {}));
var TYPE;
(function(TYPE2) {
  TYPE2[TYPE2["literal"] = 0] = "literal";
  TYPE2[TYPE2["argument"] = 1] = "argument";
  TYPE2[TYPE2["number"] = 2] = "number";
  TYPE2[TYPE2["date"] = 3] = "date";
  TYPE2[TYPE2["time"] = 4] = "time";
  TYPE2[TYPE2["select"] = 5] = "select";
  TYPE2[TYPE2["plural"] = 6] = "plural";
  TYPE2[TYPE2["pound"] = 7] = "pound";
  TYPE2[TYPE2["tag"] = 8] = "tag";
})(TYPE || (TYPE = {}));
var SKELETON_TYPE;
(function(SKELETON_TYPE2) {
  SKELETON_TYPE2[SKELETON_TYPE2["number"] = 0] = "number";
  SKELETON_TYPE2[SKELETON_TYPE2["dateTime"] = 1] = "dateTime";
})(SKELETON_TYPE || (SKELETON_TYPE = {}));
function isLiteralElement(el) {
  return el.type === TYPE.literal;
}
function isArgumentElement(el) {
  return el.type === TYPE.argument;
}
function isNumberElement(el) {
  return el.type === TYPE.number;
}
function isDateElement(el) {
  return el.type === TYPE.date;
}
function isTimeElement(el) {
  return el.type === TYPE.time;
}
function isSelectElement(el) {
  return el.type === TYPE.select;
}
function isPluralElement(el) {
  return el.type === TYPE.plural;
}
function isPoundElement(el) {
  return el.type === TYPE.pound;
}
function isTagElement(el) {
  return el.type === TYPE.tag;
}
function isNumberSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.number);
}
function isDateTimeSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.dateTime);
}
var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;
var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function parseDateTimeSkeleton(skeleton) {
  var result = {};
  skeleton.replace(DATE_TIME_REGEX, function(match) {
    var len = match.length;
    switch (match[0]) {
      // Era
      case "G":
        result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
        break;
      // Year
      case "y":
        result.year = len === 2 ? "2-digit" : "numeric";
        break;
      case "Y":
      case "u":
      case "U":
      case "r":
        throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
      // Quarter
      case "q":
      case "Q":
        throw new RangeError("`q/Q` (quarter) patterns are not supported");
      // Month
      case "M":
      case "L":
        result.month = ["numeric", "2-digit", "short", "long", "narrow"][len - 1];
        break;
      // Week
      case "w":
      case "W":
        throw new RangeError("`w/W` (week) patterns are not supported");
      case "d":
        result.day = ["numeric", "2-digit"][len - 1];
        break;
      case "D":
      case "F":
      case "g":
        throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
      // Weekday
      case "E":
        result.weekday = len === 4 ? "long" : len === 5 ? "narrow" : "short";
        break;
      case "e":
        if (len < 4) {
          throw new RangeError("`e..eee` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      case "c":
        if (len < 4) {
          throw new RangeError("`c..ccc` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      // Period
      case "a":
        result.hour12 = true;
        break;
      case "b":
      // am, pm, noon, midnight
      case "B":
        throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
      // Hour
      case "h":
        result.hourCycle = "h12";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "H":
        result.hourCycle = "h23";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "K":
        result.hourCycle = "h11";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "k":
        result.hourCycle = "h24";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "j":
      case "J":
      case "C":
        throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
      // Minute
      case "m":
        result.minute = ["numeric", "2-digit"][len - 1];
        break;
      // Second
      case "s":
        result.second = ["numeric", "2-digit"][len - 1];
        break;
      case "S":
      case "A":
        throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
      // Zone
      case "z":
        result.timeZoneName = len < 4 ? "short" : "long";
        break;
      case "Z":
      // 1..3, 4, 5: The ISO8601 varios formats
      case "O":
      // 1, 4: milliseconds in day short, long
      case "v":
      // 1, 4: generic non-location format
      case "V":
      // 1, 2, 3, 4: time zone ID or city
      case "X":
      // 1, 2, 3, 4: The ISO8601 varios formats
      case "x":
        throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
    }
    return "";
  });
  return result;
}
var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function parseNumberSkeletonFromString(skeleton) {
  if (skeleton.length === 0) {
    throw new Error("Number skeleton cannot be empty");
  }
  var stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter(function(x2) {
    return x2.length > 0;
  });
  var tokens = [];
  for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
    var stringToken = stringTokens_1[_i];
    var stemAndOptions = stringToken.split("/");
    if (stemAndOptions.length === 0) {
      throw new Error("Invalid number skeleton");
    }
    var stem = stemAndOptions[0], options2 = stemAndOptions.slice(1);
    for (var _a2 = 0, options_1 = options2; _a2 < options_1.length; _a2++) {
      var option = options_1[_a2];
      if (option.length === 0) {
        throw new Error("Invalid number skeleton");
      }
    }
    tokens.push({ stem, options: options2 });
  }
  return tokens;
}
function icuUnitToEcma(unit) {
  return unit.replace(/^(.*?)-/, "");
}
var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?[rs]?$/g;
var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
function parseSignificantPrecision(str) {
  var result = {};
  if (str[str.length - 1] === "r") {
    result.roundingPriority = "morePrecision";
  } else if (str[str.length - 1] === "s") {
    result.roundingPriority = "lessPrecision";
  }
  str.replace(SIGNIFICANT_PRECISION_REGEX, function(_, g1, g2) {
    if (typeof g2 !== "string") {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length;
    } else if (g2 === "+") {
      result.minimumSignificantDigits = g1.length;
    } else if (g1[0] === "#") {
      result.maximumSignificantDigits = g1.length;
    } else {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length + (typeof g2 === "string" ? g2.length : 0);
    }
    return "";
  });
  return result;
}
function parseSign(str) {
  switch (str) {
    case "sign-auto":
      return {
        signDisplay: "auto"
      };
    case "sign-accounting":
    case "()":
      return {
        currencySign: "accounting"
      };
    case "sign-always":
    case "+!":
      return {
        signDisplay: "always"
      };
    case "sign-accounting-always":
    case "()!":
      return {
        signDisplay: "always",
        currencySign: "accounting"
      };
    case "sign-except-zero":
    case "+?":
      return {
        signDisplay: "exceptZero"
      };
    case "sign-accounting-except-zero":
    case "()?":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting"
      };
    case "sign-never":
    case "+_":
      return {
        signDisplay: "never"
      };
  }
}
function parseConciseScientificAndEngineeringStem(stem) {
  var result;
  if (stem[0] === "E" && stem[1] === "E") {
    result = {
      notation: "engineering"
    };
    stem = stem.slice(2);
  } else if (stem[0] === "E") {
    result = {
      notation: "scientific"
    };
    stem = stem.slice(1);
  }
  if (result) {
    var signDisplay = stem.slice(0, 2);
    if (signDisplay === "+!") {
      result.signDisplay = "always";
      stem = stem.slice(2);
    } else if (signDisplay === "+?") {
      result.signDisplay = "exceptZero";
      stem = stem.slice(2);
    }
    if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
      throw new Error("Malformed concise eng/scientific notation");
    }
    result.minimumIntegerDigits = stem.length;
  }
  return result;
}
function parseNotationOptions(opt) {
  var result = {};
  var signOpts = parseSign(opt);
  if (signOpts) {
    return signOpts;
  }
  return result;
}
function parseNumberSkeleton(tokens) {
  var result = {};
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    switch (token.stem) {
      case "percent":
      case "%":
        result.style = "percent";
        continue;
      case "%x100":
        result.style = "percent";
        result.scale = 100;
        continue;
      case "currency":
        result.style = "currency";
        result.currency = token.options[0];
        continue;
      case "group-off":
      case ",_":
        result.useGrouping = false;
        continue;
      case "precision-integer":
      case ".":
        result.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        result.style = "unit";
        result.unit = icuUnitToEcma(token.options[0]);
        continue;
      case "compact-short":
      case "K":
        result.notation = "compact";
        result.compactDisplay = "short";
        continue;
      case "compact-long":
      case "KK":
        result.notation = "compact";
        result.compactDisplay = "long";
        continue;
      case "scientific":
        result = __assign(__assign(__assign({}, result), { notation: "scientific" }), token.options.reduce(function(all, opt2) {
          return __assign(__assign({}, all), parseNotationOptions(opt2));
        }, {}));
        continue;
      case "engineering":
        result = __assign(__assign(__assign({}, result), { notation: "engineering" }), token.options.reduce(function(all, opt2) {
          return __assign(__assign({}, all), parseNotationOptions(opt2));
        }, {}));
        continue;
      case "notation-simple":
        result.notation = "standard";
        continue;
      // https://github.com/unicode-org/icu/blob/master/icu4c/source/i18n/unicode/unumberformatter.h
      case "unit-width-narrow":
        result.currencyDisplay = "narrowSymbol";
        result.unitDisplay = "narrow";
        continue;
      case "unit-width-short":
        result.currencyDisplay = "code";
        result.unitDisplay = "short";
        continue;
      case "unit-width-full-name":
        result.currencyDisplay = "name";
        result.unitDisplay = "long";
        continue;
      case "unit-width-iso-code":
        result.currencyDisplay = "symbol";
        continue;
      case "scale":
        result.scale = parseFloat(token.options[0]);
        continue;
      case "rounding-mode-floor":
        result.roundingMode = "floor";
        continue;
      case "rounding-mode-ceiling":
        result.roundingMode = "ceil";
        continue;
      case "rounding-mode-down":
        result.roundingMode = "trunc";
        continue;
      case "rounding-mode-up":
        result.roundingMode = "expand";
        continue;
      case "rounding-mode-half-even":
        result.roundingMode = "halfEven";
        continue;
      case "rounding-mode-half-down":
        result.roundingMode = "halfTrunc";
        continue;
      case "rounding-mode-half-up":
        result.roundingMode = "halfExpand";
        continue;
      // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
      case "integer-width":
        if (token.options.length > 1) {
          throw new RangeError("integer-width stems only accept a single optional option");
        }
        token.options[0].replace(INTEGER_WIDTH_REGEX, function(_, g1, g2, g3, g4, g5) {
          if (g1) {
            result.minimumIntegerDigits = g2.length;
          } else if (g3 && g4) {
            throw new Error("We currently do not support maximum integer digits");
          } else if (g5) {
            throw new Error("We currently do not support exact integer digits");
          }
          return "";
        });
        continue;
    }
    if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
      result.minimumIntegerDigits = token.stem.length;
      continue;
    }
    if (FRACTION_PRECISION_REGEX.test(token.stem)) {
      if (token.options.length > 1) {
        throw new RangeError("Fraction-precision stems only accept a single optional option");
      }
      token.stem.replace(FRACTION_PRECISION_REGEX, function(_, g1, g2, g3, g4, g5) {
        if (g2 === "*") {
          result.minimumFractionDigits = g1.length;
        } else if (g3 && g3[0] === "#") {
          result.maximumFractionDigits = g3.length;
        } else if (g4 && g5) {
          result.minimumFractionDigits = g4.length;
          result.maximumFractionDigits = g4.length + g5.length;
        } else {
          result.minimumFractionDigits = g1.length;
          result.maximumFractionDigits = g1.length;
        }
        return "";
      });
      var opt = token.options[0];
      if (opt === "w") {
        result = __assign(__assign({}, result), { trailingZeroDisplay: "stripIfInteger" });
      } else if (opt) {
        result = __assign(__assign({}, result), parseSignificantPrecision(opt));
      }
      continue;
    }
    if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
      result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
      continue;
    }
    var signOpts = parseSign(token.stem);
    if (signOpts) {
      result = __assign(__assign({}, result), signOpts);
    }
    var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
    if (conciseScientificAndEngineeringOpts) {
      result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
    }
  }
  return result;
}
var timeData = {
  "001": [
    "H",
    "h"
  ],
  "419": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "AC": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "AD": [
    "H",
    "hB"
  ],
  "AE": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "AF": [
    "H",
    "hb",
    "hB",
    "h"
  ],
  "AG": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "AI": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "AL": [
    "h",
    "H",
    "hB"
  ],
  "AM": [
    "H",
    "hB"
  ],
  "AO": [
    "H",
    "hB"
  ],
  "AR": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "AS": [
    "h",
    "H"
  ],
  "AT": [
    "H",
    "hB"
  ],
  "AU": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "AW": [
    "H",
    "hB"
  ],
  "AX": [
    "H"
  ],
  "AZ": [
    "H",
    "hB",
    "h"
  ],
  "BA": [
    "H",
    "hB",
    "h"
  ],
  "BB": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "BD": [
    "h",
    "hB",
    "H"
  ],
  "BE": [
    "H",
    "hB"
  ],
  "BF": [
    "H",
    "hB"
  ],
  "BG": [
    "H",
    "hB",
    "h"
  ],
  "BH": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "BI": [
    "H",
    "h"
  ],
  "BJ": [
    "H",
    "hB"
  ],
  "BL": [
    "H",
    "hB"
  ],
  "BM": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "BN": [
    "hb",
    "hB",
    "h",
    "H"
  ],
  "BO": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "BQ": [
    "H"
  ],
  "BR": [
    "H",
    "hB"
  ],
  "BS": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "BT": [
    "h",
    "H"
  ],
  "BW": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "BY": [
    "H",
    "h"
  ],
  "BZ": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "CA": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "CC": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "CD": [
    "hB",
    "H"
  ],
  "CF": [
    "H",
    "h",
    "hB"
  ],
  "CG": [
    "H",
    "hB"
  ],
  "CH": [
    "H",
    "hB",
    "h"
  ],
  "CI": [
    "H",
    "hB"
  ],
  "CK": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "CL": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "CM": [
    "H",
    "h",
    "hB"
  ],
  "CN": [
    "H",
    "hB",
    "hb",
    "h"
  ],
  "CO": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "CP": [
    "H"
  ],
  "CR": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "CU": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "CV": [
    "H",
    "hB"
  ],
  "CW": [
    "H",
    "hB"
  ],
  "CX": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "CY": [
    "h",
    "H",
    "hb",
    "hB"
  ],
  "CZ": [
    "H"
  ],
  "DE": [
    "H",
    "hB"
  ],
  "DG": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "DJ": [
    "h",
    "H"
  ],
  "DK": [
    "H"
  ],
  "DM": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "DO": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "DZ": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "EA": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "EC": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "EE": [
    "H",
    "hB"
  ],
  "EG": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "EH": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "ER": [
    "h",
    "H"
  ],
  "ES": [
    "H",
    "hB",
    "h",
    "hb"
  ],
  "ET": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "FI": [
    "H"
  ],
  "FJ": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "FK": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "FM": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "FO": [
    "H",
    "h"
  ],
  "FR": [
    "H",
    "hB"
  ],
  "GA": [
    "H",
    "hB"
  ],
  "GB": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "GD": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "GE": [
    "H",
    "hB",
    "h"
  ],
  "GF": [
    "H",
    "hB"
  ],
  "GG": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "GH": [
    "h",
    "H"
  ],
  "GI": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "GL": [
    "H",
    "h"
  ],
  "GM": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "GN": [
    "H",
    "hB"
  ],
  "GP": [
    "H",
    "hB"
  ],
  "GQ": [
    "H",
    "hB",
    "h",
    "hb"
  ],
  "GR": [
    "h",
    "H",
    "hb",
    "hB"
  ],
  "GT": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "GU": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "GW": [
    "H",
    "hB"
  ],
  "GY": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "HK": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "HN": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "HR": [
    "H",
    "hB"
  ],
  "HU": [
    "H",
    "h"
  ],
  "IC": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "ID": [
    "H"
  ],
  "IE": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "IL": [
    "H",
    "hB"
  ],
  "IM": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "IN": [
    "h",
    "H"
  ],
  "IO": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "IQ": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "IR": [
    "hB",
    "H"
  ],
  "IS": [
    "H"
  ],
  "IT": [
    "H",
    "hB"
  ],
  "JE": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "JM": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "JO": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "JP": [
    "H",
    "K",
    "h"
  ],
  "KE": [
    "hB",
    "hb",
    "H",
    "h"
  ],
  "KG": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "KH": [
    "hB",
    "h",
    "H",
    "hb"
  ],
  "KI": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "KM": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "KN": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "KP": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "KR": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "KW": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "KY": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "KZ": [
    "H",
    "hB"
  ],
  "LA": [
    "H",
    "hb",
    "hB",
    "h"
  ],
  "LB": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "LC": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "LI": [
    "H",
    "hB",
    "h"
  ],
  "LK": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "LR": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "LS": [
    "h",
    "H"
  ],
  "LT": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "LU": [
    "H",
    "h",
    "hB"
  ],
  "LV": [
    "H",
    "hB",
    "hb",
    "h"
  ],
  "LY": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "MA": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "MC": [
    "H",
    "hB"
  ],
  "MD": [
    "H",
    "hB"
  ],
  "ME": [
    "H",
    "hB",
    "h"
  ],
  "MF": [
    "H",
    "hB"
  ],
  "MG": [
    "H",
    "h"
  ],
  "MH": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "MK": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "ML": [
    "H"
  ],
  "MM": [
    "hB",
    "hb",
    "H",
    "h"
  ],
  "MN": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "MO": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "MP": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "MQ": [
    "H",
    "hB"
  ],
  "MR": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "MS": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "MT": [
    "H",
    "h"
  ],
  "MU": [
    "H",
    "h"
  ],
  "MV": [
    "H",
    "h"
  ],
  "MW": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "MX": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "MY": [
    "hb",
    "hB",
    "h",
    "H"
  ],
  "MZ": [
    "H",
    "hB"
  ],
  "NA": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "NC": [
    "H",
    "hB"
  ],
  "NE": [
    "H"
  ],
  "NF": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "NG": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "NI": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "NL": [
    "H",
    "hB"
  ],
  "NO": [
    "H",
    "h"
  ],
  "NP": [
    "H",
    "h",
    "hB"
  ],
  "NR": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "NU": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "NZ": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "OM": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "PA": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "PE": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "PF": [
    "H",
    "h",
    "hB"
  ],
  "PG": [
    "h",
    "H"
  ],
  "PH": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "PK": [
    "h",
    "hB",
    "H"
  ],
  "PL": [
    "H",
    "h"
  ],
  "PM": [
    "H",
    "hB"
  ],
  "PN": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "PR": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "PS": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "PT": [
    "H",
    "hB"
  ],
  "PW": [
    "h",
    "H"
  ],
  "PY": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "QA": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "RE": [
    "H",
    "hB"
  ],
  "RO": [
    "H",
    "hB"
  ],
  "RS": [
    "H",
    "hB",
    "h"
  ],
  "RU": [
    "H"
  ],
  "RW": [
    "H",
    "h"
  ],
  "SA": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "SB": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "SC": [
    "H",
    "h",
    "hB"
  ],
  "SD": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "SE": [
    "H"
  ],
  "SG": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "SH": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "SI": [
    "H",
    "hB"
  ],
  "SJ": [
    "H"
  ],
  "SK": [
    "H"
  ],
  "SL": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "SM": [
    "H",
    "h",
    "hB"
  ],
  "SN": [
    "H",
    "h",
    "hB"
  ],
  "SO": [
    "h",
    "H"
  ],
  "SR": [
    "H",
    "hB"
  ],
  "SS": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "ST": [
    "H",
    "hB"
  ],
  "SV": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "SX": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "SY": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "SZ": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "TA": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "TC": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "TD": [
    "h",
    "H",
    "hB"
  ],
  "TF": [
    "H",
    "h",
    "hB"
  ],
  "TG": [
    "H",
    "hB"
  ],
  "TH": [
    "H",
    "h"
  ],
  "TJ": [
    "H",
    "h"
  ],
  "TL": [
    "H",
    "hB",
    "hb",
    "h"
  ],
  "TM": [
    "H",
    "h"
  ],
  "TN": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "TO": [
    "h",
    "H"
  ],
  "TR": [
    "H",
    "hB"
  ],
  "TT": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "TW": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "TZ": [
    "hB",
    "hb",
    "H",
    "h"
  ],
  "UA": [
    "H",
    "hB",
    "h"
  ],
  "UG": [
    "hB",
    "hb",
    "H",
    "h"
  ],
  "UM": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "US": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "UY": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "UZ": [
    "H",
    "hB",
    "h"
  ],
  "VA": [
    "H",
    "h",
    "hB"
  ],
  "VC": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "VE": [
    "h",
    "H",
    "hB",
    "hb"
  ],
  "VG": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "VI": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "VN": [
    "H",
    "h"
  ],
  "VU": [
    "h",
    "H"
  ],
  "WF": [
    "H",
    "hB"
  ],
  "WS": [
    "h",
    "H"
  ],
  "XK": [
    "H",
    "hB",
    "h"
  ],
  "YE": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "YT": [
    "H",
    "hB"
  ],
  "ZA": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "ZM": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "ZW": [
    "H",
    "h"
  ],
  "af-ZA": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "ar-001": [
    "h",
    "hB",
    "hb",
    "H"
  ],
  "ca-ES": [
    "H",
    "h",
    "hB"
  ],
  "en-001": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "en-HK": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "en-IL": [
    "H",
    "h",
    "hb",
    "hB"
  ],
  "en-MY": [
    "h",
    "hb",
    "H",
    "hB"
  ],
  "es-BR": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-ES": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "es-GQ": [
    "H",
    "h",
    "hB",
    "hb"
  ],
  "fr-CA": [
    "H",
    "h",
    "hB"
  ],
  "gl-ES": [
    "H",
    "h",
    "hB"
  ],
  "gu-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "hi-IN": [
    "hB",
    "h",
    "H"
  ],
  "it-CH": [
    "H",
    "h",
    "hB"
  ],
  "it-IT": [
    "H",
    "h",
    "hB"
  ],
  "kn-IN": [
    "hB",
    "h",
    "H"
  ],
  "ml-IN": [
    "hB",
    "h",
    "H"
  ],
  "mr-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "pa-IN": [
    "hB",
    "hb",
    "h",
    "H"
  ],
  "ta-IN": [
    "hB",
    "h",
    "hb",
    "H"
  ],
  "te-IN": [
    "hB",
    "h",
    "H"
  ],
  "zu-ZA": [
    "H",
    "hB",
    "hb",
    "h"
  ]
};
function getBestPattern(skeleton, locale) {
  var skeletonCopy = "";
  for (var patternPos = 0; patternPos < skeleton.length; patternPos++) {
    var patternChar = skeleton.charAt(patternPos);
    if (patternChar === "j") {
      var extraLength = 0;
      while (patternPos + 1 < skeleton.length && skeleton.charAt(patternPos + 1) === patternChar) {
        extraLength++;
        patternPos++;
      }
      var hourLen = 1 + (extraLength & 1);
      var dayPeriodLen = extraLength < 2 ? 1 : 3 + (extraLength >> 1);
      var dayPeriodChar = "a";
      var hourChar = getDefaultHourSymbolFromLocale(locale);
      if (hourChar == "H" || hourChar == "k") {
        dayPeriodLen = 0;
      }
      while (dayPeriodLen-- > 0) {
        skeletonCopy += dayPeriodChar;
      }
      while (hourLen-- > 0) {
        skeletonCopy = hourChar + skeletonCopy;
      }
    } else if (patternChar === "J") {
      skeletonCopy += "H";
    } else {
      skeletonCopy += patternChar;
    }
  }
  return skeletonCopy;
}
function getDefaultHourSymbolFromLocale(locale) {
  var hourCycle = locale.hourCycle;
  if (hourCycle === void 0 && // @ts-ignore hourCycle(s) is not identified yet
  locale.hourCycles && // @ts-ignore
  locale.hourCycles.length) {
    hourCycle = locale.hourCycles[0];
  }
  if (hourCycle) {
    switch (hourCycle) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw new Error("Invalid hourCycle");
    }
  }
  var languageTag = locale.language;
  var regionTag;
  if (languageTag !== "root") {
    regionTag = locale.maximize().region;
  }
  var hourCycles = timeData[regionTag || ""] || timeData[languageTag || ""] || timeData["".concat(languageTag, "-001")] || timeData["001"];
  return hourCycles[0];
}
var _a;
var SPACE_SEPARATOR_START_REGEX = new RegExp("^".concat(SPACE_SEPARATOR_REGEX.source, "*"));
var SPACE_SEPARATOR_END_REGEX = new RegExp("".concat(SPACE_SEPARATOR_REGEX.source, "*$"));
function createLocation(start, end) {
  return { start, end };
}
var hasNativeStartsWith = !!String.prototype.startsWith && "_a".startsWith("a", 1);
var hasNativeFromCodePoint = !!String.fromCodePoint;
var hasNativeFromEntries = !!Object.fromEntries;
var hasNativeCodePointAt = !!String.prototype.codePointAt;
var hasTrimStart = !!String.prototype.trimStart;
var hasTrimEnd = !!String.prototype.trimEnd;
var hasNativeIsSafeInteger = !!Number.isSafeInteger;
var isSafeInteger = hasNativeIsSafeInteger ? Number.isSafeInteger : function(n) {
  return typeof n === "number" && isFinite(n) && Math.floor(n) === n && Math.abs(n) <= 9007199254740991;
};
var REGEX_SUPPORTS_U_AND_Y = true;
try {
  var re = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec("a")) === null || _a === void 0 ? void 0 : _a[0]) === "a";
} catch (_) {
  REGEX_SUPPORTS_U_AND_Y = false;
}
var startsWith = hasNativeStartsWith ? (
  // Native
  function startsWith2(s, search, position) {
    return s.startsWith(search, position);
  }
) : (
  // For IE11
  function startsWith3(s, search, position) {
    return s.slice(position, position + search.length) === search;
  }
);
var fromCodePoint = hasNativeFromCodePoint ? String.fromCodePoint : (
  // IE11
  function fromCodePoint2() {
    var codePoints = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      codePoints[_i] = arguments[_i];
    }
    var elements = "";
    var length = codePoints.length;
    var i = 0;
    var code;
    while (length > i) {
      code = codePoints[i++];
      if (code > 1114111)
        throw RangeError(code + " is not a valid code point");
      elements += code < 65536 ? String.fromCharCode(code) : String.fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320);
    }
    return elements;
  }
);
var fromEntries = (
  // native
  hasNativeFromEntries ? Object.fromEntries : (
    // Ponyfill
    function fromEntries2(entries) {
      var obj = {};
      for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a2 = entries_1[_i], k = _a2[0], v = _a2[1];
        obj[k] = v;
      }
      return obj;
    }
  )
);
var codePointAt = hasNativeCodePointAt ? (
  // Native
  function codePointAt2(s, index2) {
    return s.codePointAt(index2);
  }
) : (
  // IE 11
  function codePointAt3(s, index2) {
    var size = s.length;
    if (index2 < 0 || index2 >= size) {
      return void 0;
    }
    var first = s.charCodeAt(index2);
    var second;
    return first < 55296 || first > 56319 || index2 + 1 === size || (second = s.charCodeAt(index2 + 1)) < 56320 || second > 57343 ? first : (first - 55296 << 10) + (second - 56320) + 65536;
  }
);
var trimStart = hasTrimStart ? (
  // Native
  function trimStart2(s) {
    return s.trimStart();
  }
) : (
  // Ponyfill
  function trimStart3(s) {
    return s.replace(SPACE_SEPARATOR_START_REGEX, "");
  }
);
var trimEnd = hasTrimEnd ? (
  // Native
  function trimEnd2(s) {
    return s.trimEnd();
  }
) : (
  // Ponyfill
  function trimEnd3(s) {
    return s.replace(SPACE_SEPARATOR_END_REGEX, "");
  }
);
function RE(s, flag) {
  return new RegExp(s, flag);
}
var matchIdentifierAtIndex;
if (REGEX_SUPPORTS_U_AND_Y) {
  var IDENTIFIER_PREFIX_RE_1 = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index2) {
    var _a2;
    IDENTIFIER_PREFIX_RE_1.lastIndex = index2;
    var match = IDENTIFIER_PREFIX_RE_1.exec(s);
    return (_a2 = match[1]) !== null && _a2 !== void 0 ? _a2 : "";
  };
} else {
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index2) {
    var match = [];
    while (true) {
      var c = codePointAt(s, index2);
      if (c === void 0 || _isWhiteSpace(c) || _isPatternSyntax(c)) {
        break;
      }
      match.push(c);
      index2 += c >= 65536 ? 2 : 1;
    }
    return fromCodePoint.apply(void 0, match);
  };
}
var Parser = (
  /** @class */
  (function() {
    function Parser2(message, options2) {
      if (options2 === void 0) {
        options2 = {};
      }
      this.message = message;
      this.position = { offset: 0, line: 1, column: 1 };
      this.ignoreTag = !!options2.ignoreTag;
      this.locale = options2.locale;
      this.requiresOtherClause = !!options2.requiresOtherClause;
      this.shouldParseSkeletons = !!options2.shouldParseSkeletons;
    }
    Parser2.prototype.parse = function() {
      if (this.offset() !== 0) {
        throw Error("parser can only be used once");
      }
      return this.parseMessage(0, "", false);
    };
    Parser2.prototype.parseMessage = function(nestingLevel, parentArgType, expectingCloseTag) {
      var elements = [];
      while (!this.isEOF()) {
        var char = this.char();
        if (char === 123) {
          var result = this.parseArgument(nestingLevel, expectingCloseTag);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        } else if (char === 125 && nestingLevel > 0) {
          break;
        } else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
          var position = this.clonePosition();
          this.bump();
          elements.push({
            type: TYPE.pound,
            location: createLocation(position, this.clonePosition())
          });
        } else if (char === 60 && !this.ignoreTag && this.peek() === 47) {
          if (expectingCloseTag) {
            break;
          } else {
            return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
          }
        } else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
          var result = this.parseTag(nestingLevel, parentArgType);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        } else {
          var result = this.parseLiteral(nestingLevel, parentArgType);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        }
      }
      return { val: elements, err: null };
    };
    Parser2.prototype.parseTag = function(nestingLevel, parentArgType) {
      var startPosition = this.clonePosition();
      this.bump();
      var tagName = this.parseTagName();
      this.bumpSpace();
      if (this.bumpIf("/>")) {
        return {
          val: {
            type: TYPE.literal,
            value: "<".concat(tagName, "/>"),
            location: createLocation(startPosition, this.clonePosition())
          },
          err: null
        };
      } else if (this.bumpIf(">")) {
        var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
        if (childrenResult.err) {
          return childrenResult;
        }
        var children = childrenResult.val;
        var endTagStartPosition = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !_isAlpha(this.char())) {
            return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
          }
          var closingTagNameStartPosition = this.clonePosition();
          var closingTagName = this.parseTagName();
          if (tagName !== closingTagName) {
            return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
          }
          this.bumpSpace();
          if (!this.bumpIf(">")) {
            return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
          }
          return {
            val: {
              type: TYPE.tag,
              value: tagName,
              children,
              location: createLocation(startPosition, this.clonePosition())
            },
            err: null
          };
        } else {
          return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
        }
      } else {
        return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
      }
    };
    Parser2.prototype.parseTagName = function() {
      var startOffset = this.offset();
      this.bump();
      while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
        this.bump();
      }
      return this.message.slice(startOffset, this.offset());
    };
    Parser2.prototype.parseLiteral = function(nestingLevel, parentArgType) {
      var start = this.clonePosition();
      var value = "";
      while (true) {
        var parseQuoteResult = this.tryParseQuote(parentArgType);
        if (parseQuoteResult) {
          value += parseQuoteResult;
          continue;
        }
        var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
        if (parseUnquotedResult) {
          value += parseUnquotedResult;
          continue;
        }
        var parseLeftAngleResult = this.tryParseLeftAngleBracket();
        if (parseLeftAngleResult) {
          value += parseLeftAngleResult;
          continue;
        }
        break;
      }
      var location = createLocation(start, this.clonePosition());
      return {
        val: { type: TYPE.literal, value, location },
        err: null
      };
    };
    Parser2.prototype.tryParseLeftAngleBracket = function() {
      if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || // If at the opening tag or closing tag position, bail.
      !_isAlphaOrSlash(this.peek() || 0))) {
        this.bump();
        return "<";
      }
      return null;
    };
    Parser2.prototype.tryParseQuote = function(parentArgType) {
      if (this.isEOF() || this.char() !== 39) {
        return null;
      }
      switch (this.peek()) {
        case 39:
          this.bump();
          this.bump();
          return "'";
        // '{', '<', '>', '}'
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if (parentArgType === "plural" || parentArgType === "selectordinal") {
            break;
          }
          return null;
        default:
          return null;
      }
      this.bump();
      var codePoints = [this.char()];
      this.bump();
      while (!this.isEOF()) {
        var ch = this.char();
        if (ch === 39) {
          if (this.peek() === 39) {
            codePoints.push(39);
            this.bump();
          } else {
            this.bump();
            break;
          }
        } else {
          codePoints.push(ch);
        }
        this.bump();
      }
      return fromCodePoint.apply(void 0, codePoints);
    };
    Parser2.prototype.tryParseUnquoted = function(nestingLevel, parentArgType) {
      if (this.isEOF()) {
        return null;
      }
      var ch = this.char();
      if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) {
        return null;
      } else {
        this.bump();
        return fromCodePoint(ch);
      }
    };
    Parser2.prototype.parseArgument = function(nestingLevel, expectingCloseTag) {
      var openingBracePosition = this.clonePosition();
      this.bump();
      this.bumpSpace();
      if (this.isEOF()) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      if (this.char() === 125) {
        this.bump();
        return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
      var value = this.parseIdentifierIfPossible().value;
      if (!value) {
        return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
      this.bumpSpace();
      if (this.isEOF()) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      switch (this.char()) {
        // Simple argument: `{name}`
        case 125: {
          this.bump();
          return {
            val: {
              type: TYPE.argument,
              // value does not include the opening and closing braces.
              value,
              location: createLocation(openingBracePosition, this.clonePosition())
            },
            err: null
          };
        }
        // Argument with options: `{name, format, ...}`
        case 44: {
          this.bump();
          this.bumpSpace();
          if (this.isEOF()) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
          }
          return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
        }
        default:
          return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
    };
    Parser2.prototype.parseIdentifierIfPossible = function() {
      var startingPosition = this.clonePosition();
      var startOffset = this.offset();
      var value = matchIdentifierAtIndex(this.message, startOffset);
      var endOffset = startOffset + value.length;
      this.bumpTo(endOffset);
      var endPosition = this.clonePosition();
      var location = createLocation(startingPosition, endPosition);
      return { value, location };
    };
    Parser2.prototype.parseArgumentOptions = function(nestingLevel, expectingCloseTag, value, openingBracePosition) {
      var _a2;
      var typeStartPosition = this.clonePosition();
      var argType = this.parseIdentifierIfPossible().value;
      var typeEndPosition = this.clonePosition();
      switch (argType) {
        case "":
          return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
        case "number":
        case "date":
        case "time": {
          this.bumpSpace();
          var styleAndLocation = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var styleStartPosition = this.clonePosition();
            var result = this.parseSimpleArgStyleIfPossible();
            if (result.err) {
              return result;
            }
            var style = trimEnd(result.val);
            if (style.length === 0) {
              return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            var styleLocation = createLocation(styleStartPosition, this.clonePosition());
            styleAndLocation = { style, styleLocation };
          }
          var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
          if (argCloseResult.err) {
            return argCloseResult;
          }
          var location_1 = createLocation(openingBracePosition, this.clonePosition());
          if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, "::", 0)) {
            var skeleton = trimStart(styleAndLocation.style.slice(2));
            if (argType === "number") {
              var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
              if (result.err) {
                return result;
              }
              return {
                val: { type: TYPE.number, value, location: location_1, style: result.val },
                err: null
              };
            } else {
              if (skeleton.length === 0) {
                return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
              }
              var dateTimePattern = skeleton;
              if (this.locale) {
                dateTimePattern = getBestPattern(skeleton, this.locale);
              }
              var style = {
                type: SKELETON_TYPE.dateTime,
                pattern: dateTimePattern,
                location: styleAndLocation.styleLocation,
                parsedOptions: this.shouldParseSkeletons ? parseDateTimeSkeleton(dateTimePattern) : {}
              };
              var type = argType === "date" ? TYPE.date : TYPE.time;
              return {
                val: { type, value, location: location_1, style },
                err: null
              };
            }
          }
          return {
            val: {
              type: argType === "number" ? TYPE.number : argType === "date" ? TYPE.date : TYPE.time,
              value,
              location: location_1,
              style: (_a2 = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a2 !== void 0 ? _a2 : null
            },
            err: null
          };
        }
        case "plural":
        case "selectordinal":
        case "select": {
          var typeEndPosition_1 = this.clonePosition();
          this.bumpSpace();
          if (!this.bumpIf(",")) {
            return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
          }
          this.bumpSpace();
          var identifierAndLocation = this.parseIdentifierIfPossible();
          var pluralOffset = 0;
          if (argType !== "select" && identifierAndLocation.value === "offset") {
            if (!this.bumpIf(":")) {
              return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            this.bumpSpace();
            var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
            if (result.err) {
              return result;
            }
            this.bumpSpace();
            identifierAndLocation = this.parseIdentifierIfPossible();
            pluralOffset = result.val;
          }
          var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
          if (optionsResult.err) {
            return optionsResult;
          }
          var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
          if (argCloseResult.err) {
            return argCloseResult;
          }
          var location_2 = createLocation(openingBracePosition, this.clonePosition());
          if (argType === "select") {
            return {
              val: {
                type: TYPE.select,
                value,
                options: fromEntries(optionsResult.val),
                location: location_2
              },
              err: null
            };
          } else {
            return {
              val: {
                type: TYPE.plural,
                value,
                options: fromEntries(optionsResult.val),
                offset: pluralOffset,
                pluralType: argType === "plural" ? "cardinal" : "ordinal",
                location: location_2
              },
              err: null
            };
          }
        }
        default:
          return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
      }
    };
    Parser2.prototype.tryParseArgumentClose = function(openingBracePosition) {
      if (this.isEOF() || this.char() !== 125) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      this.bump();
      return { val: true, err: null };
    };
    Parser2.prototype.parseSimpleArgStyleIfPossible = function() {
      var nestedBraces = 0;
      var startPosition = this.clonePosition();
      while (!this.isEOF()) {
        var ch = this.char();
        switch (ch) {
          case 39: {
            this.bump();
            var apostrophePosition = this.clonePosition();
            if (!this.bumpUntil("'")) {
              return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
            }
            this.bump();
            break;
          }
          case 123: {
            nestedBraces += 1;
            this.bump();
            break;
          }
          case 125: {
            if (nestedBraces > 0) {
              nestedBraces -= 1;
            } else {
              return {
                val: this.message.slice(startPosition.offset, this.offset()),
                err: null
              };
            }
            break;
          }
          default:
            this.bump();
            break;
        }
      }
      return {
        val: this.message.slice(startPosition.offset, this.offset()),
        err: null
      };
    };
    Parser2.prototype.parseNumberSkeletonFromString = function(skeleton, location) {
      var tokens = [];
      try {
        tokens = parseNumberSkeletonFromString(skeleton);
      } catch (e) {
        return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
      }
      return {
        val: {
          type: SKELETON_TYPE.number,
          tokens,
          location,
          parsedOptions: this.shouldParseSkeletons ? parseNumberSkeleton(tokens) : {}
        },
        err: null
      };
    };
    Parser2.prototype.tryParsePluralOrSelectOptions = function(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
      var _a2;
      var hasOtherClause = false;
      var options2 = [];
      var parsedSelectors = /* @__PURE__ */ new Set();
      var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
      while (true) {
        if (selector.length === 0) {
          var startPosition = this.clonePosition();
          if (parentArgType !== "select" && this.bumpIf("=")) {
            var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
            if (result.err) {
              return result;
            }
            selectorLocation = createLocation(startPosition, this.clonePosition());
            selector = this.message.slice(startPosition.offset, this.offset());
          } else {
            break;
          }
        }
        if (parsedSelectors.has(selector)) {
          return this.error(parentArgType === "select" ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
        }
        if (selector === "other") {
          hasOtherClause = true;
        }
        this.bumpSpace();
        var openingBracePosition = this.clonePosition();
        if (!this.bumpIf("{")) {
          return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
        }
        var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
        if (fragmentResult.err) {
          return fragmentResult;
        }
        var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
        if (argCloseResult.err) {
          return argCloseResult;
        }
        options2.push([
          selector,
          {
            value: fragmentResult.val,
            location: createLocation(openingBracePosition, this.clonePosition())
          }
        ]);
        parsedSelectors.add(selector);
        this.bumpSpace();
        _a2 = this.parseIdentifierIfPossible(), selector = _a2.value, selectorLocation = _a2.location;
      }
      if (options2.length === 0) {
        return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
      }
      if (this.requiresOtherClause && !hasOtherClause) {
        return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
      }
      return { val: options2, err: null };
    };
    Parser2.prototype.tryParseDecimalInteger = function(expectNumberError, invalidNumberError) {
      var sign = 1;
      var startingPosition = this.clonePosition();
      if (this.bumpIf("+")) ;
      else if (this.bumpIf("-")) {
        sign = -1;
      }
      var hasDigits = false;
      var decimal = 0;
      while (!this.isEOF()) {
        var ch = this.char();
        if (ch >= 48 && ch <= 57) {
          hasDigits = true;
          decimal = decimal * 10 + (ch - 48);
          this.bump();
        } else {
          break;
        }
      }
      var location = createLocation(startingPosition, this.clonePosition());
      if (!hasDigits) {
        return this.error(expectNumberError, location);
      }
      decimal *= sign;
      if (!isSafeInteger(decimal)) {
        return this.error(invalidNumberError, location);
      }
      return { val: decimal, err: null };
    };
    Parser2.prototype.offset = function() {
      return this.position.offset;
    };
    Parser2.prototype.isEOF = function() {
      return this.offset() === this.message.length;
    };
    Parser2.prototype.clonePosition = function() {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    };
    Parser2.prototype.char = function() {
      var offset = this.position.offset;
      if (offset >= this.message.length) {
        throw Error("out of bound");
      }
      var code = codePointAt(this.message, offset);
      if (code === void 0) {
        throw Error("Offset ".concat(offset, " is at invalid UTF-16 code unit boundary"));
      }
      return code;
    };
    Parser2.prototype.error = function(kind, location) {
      return {
        val: null,
        err: {
          kind,
          message: this.message,
          location
        }
      };
    };
    Parser2.prototype.bump = function() {
      if (this.isEOF()) {
        return;
      }
      var code = this.char();
      if (code === 10) {
        this.position.line += 1;
        this.position.column = 1;
        this.position.offset += 1;
      } else {
        this.position.column += 1;
        this.position.offset += code < 65536 ? 1 : 2;
      }
    };
    Parser2.prototype.bumpIf = function(prefix) {
      if (startsWith(this.message, prefix, this.offset())) {
        for (var i = 0; i < prefix.length; i++) {
          this.bump();
        }
        return true;
      }
      return false;
    };
    Parser2.prototype.bumpUntil = function(pattern) {
      var currentOffset = this.offset();
      var index2 = this.message.indexOf(pattern, currentOffset);
      if (index2 >= 0) {
        this.bumpTo(index2);
        return true;
      } else {
        this.bumpTo(this.message.length);
        return false;
      }
    };
    Parser2.prototype.bumpTo = function(targetOffset) {
      if (this.offset() > targetOffset) {
        throw Error("targetOffset ".concat(targetOffset, " must be greater than or equal to the current offset ").concat(this.offset()));
      }
      targetOffset = Math.min(targetOffset, this.message.length);
      while (true) {
        var offset = this.offset();
        if (offset === targetOffset) {
          break;
        }
        if (offset > targetOffset) {
          throw Error("targetOffset ".concat(targetOffset, " is at invalid UTF-16 code unit boundary"));
        }
        this.bump();
        if (this.isEOF()) {
          break;
        }
      }
    };
    Parser2.prototype.bumpSpace = function() {
      while (!this.isEOF() && _isWhiteSpace(this.char())) {
        this.bump();
      }
    };
    Parser2.prototype.peek = function() {
      if (this.isEOF()) {
        return null;
      }
      var code = this.char();
      var offset = this.offset();
      var nextCode = this.message.charCodeAt(offset + (code >= 65536 ? 2 : 1));
      return nextCode !== null && nextCode !== void 0 ? nextCode : null;
    };
    return Parser2;
  })()
);
function _isAlpha(codepoint) {
  return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
}
function _isAlphaOrSlash(codepoint) {
  return _isAlpha(codepoint) || codepoint === 47;
}
function _isPotentialElementNameChar(c) {
  return c === 45 || c === 46 || c >= 48 && c <= 57 || c === 95 || c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 183 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 893 || c >= 895 && c <= 8191 || c >= 8204 && c <= 8205 || c >= 8255 && c <= 8256 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
}
function _isWhiteSpace(c) {
  return c >= 9 && c <= 13 || c === 32 || c === 133 || c >= 8206 && c <= 8207 || c === 8232 || c === 8233;
}
function _isPatternSyntax(c) {
  return c >= 33 && c <= 35 || c === 36 || c >= 37 && c <= 39 || c === 40 || c === 41 || c === 42 || c === 43 || c === 44 || c === 45 || c >= 46 && c <= 47 || c >= 58 && c <= 59 || c >= 60 && c <= 62 || c >= 63 && c <= 64 || c === 91 || c === 92 || c === 93 || c === 94 || c === 96 || c === 123 || c === 124 || c === 125 || c === 126 || c === 161 || c >= 162 && c <= 165 || c === 166 || c === 167 || c === 169 || c === 171 || c === 172 || c === 174 || c === 176 || c === 177 || c === 182 || c === 187 || c === 191 || c === 215 || c === 247 || c >= 8208 && c <= 8213 || c >= 8214 && c <= 8215 || c === 8216 || c === 8217 || c === 8218 || c >= 8219 && c <= 8220 || c === 8221 || c === 8222 || c === 8223 || c >= 8224 && c <= 8231 || c >= 8240 && c <= 8248 || c === 8249 || c === 8250 || c >= 8251 && c <= 8254 || c >= 8257 && c <= 8259 || c === 8260 || c === 8261 || c === 8262 || c >= 8263 && c <= 8273 || c === 8274 || c === 8275 || c >= 8277 && c <= 8286 || c >= 8592 && c <= 8596 || c >= 8597 && c <= 8601 || c >= 8602 && c <= 8603 || c >= 8604 && c <= 8607 || c === 8608 || c >= 8609 && c <= 8610 || c === 8611 || c >= 8612 && c <= 8613 || c === 8614 || c >= 8615 && c <= 8621 || c === 8622 || c >= 8623 && c <= 8653 || c >= 8654 && c <= 8655 || c >= 8656 && c <= 8657 || c === 8658 || c === 8659 || c === 8660 || c >= 8661 && c <= 8691 || c >= 8692 && c <= 8959 || c >= 8960 && c <= 8967 || c === 8968 || c === 8969 || c === 8970 || c === 8971 || c >= 8972 && c <= 8991 || c >= 8992 && c <= 8993 || c >= 8994 && c <= 9e3 || c === 9001 || c === 9002 || c >= 9003 && c <= 9083 || c === 9084 || c >= 9085 && c <= 9114 || c >= 9115 && c <= 9139 || c >= 9140 && c <= 9179 || c >= 9180 && c <= 9185 || c >= 9186 && c <= 9254 || c >= 9255 && c <= 9279 || c >= 9280 && c <= 9290 || c >= 9291 && c <= 9311 || c >= 9472 && c <= 9654 || c === 9655 || c >= 9656 && c <= 9664 || c === 9665 || c >= 9666 && c <= 9719 || c >= 9720 && c <= 9727 || c >= 9728 && c <= 9838 || c === 9839 || c >= 9840 && c <= 10087 || c === 10088 || c === 10089 || c === 10090 || c === 10091 || c === 10092 || c === 10093 || c === 10094 || c === 10095 || c === 10096 || c === 10097 || c === 10098 || c === 10099 || c === 10100 || c === 10101 || c >= 10132 && c <= 10175 || c >= 10176 && c <= 10180 || c === 10181 || c === 10182 || c >= 10183 && c <= 10213 || c === 10214 || c === 10215 || c === 10216 || c === 10217 || c === 10218 || c === 10219 || c === 10220 || c === 10221 || c === 10222 || c === 10223 || c >= 10224 && c <= 10239 || c >= 10240 && c <= 10495 || c >= 10496 && c <= 10626 || c === 10627 || c === 10628 || c === 10629 || c === 10630 || c === 10631 || c === 10632 || c === 10633 || c === 10634 || c === 10635 || c === 10636 || c === 10637 || c === 10638 || c === 10639 || c === 10640 || c === 10641 || c === 10642 || c === 10643 || c === 10644 || c === 10645 || c === 10646 || c === 10647 || c === 10648 || c >= 10649 && c <= 10711 || c === 10712 || c === 10713 || c === 10714 || c === 10715 || c >= 10716 && c <= 10747 || c === 10748 || c === 10749 || c >= 10750 && c <= 11007 || c >= 11008 && c <= 11055 || c >= 11056 && c <= 11076 || c >= 11077 && c <= 11078 || c >= 11079 && c <= 11084 || c >= 11085 && c <= 11123 || c >= 11124 && c <= 11125 || c >= 11126 && c <= 11157 || c === 11158 || c >= 11159 && c <= 11263 || c >= 11776 && c <= 11777 || c === 11778 || c === 11779 || c === 11780 || c === 11781 || c >= 11782 && c <= 11784 || c === 11785 || c === 11786 || c === 11787 || c === 11788 || c === 11789 || c >= 11790 && c <= 11798 || c === 11799 || c >= 11800 && c <= 11801 || c === 11802 || c === 11803 || c === 11804 || c === 11805 || c >= 11806 && c <= 11807 || c === 11808 || c === 11809 || c === 11810 || c === 11811 || c === 11812 || c === 11813 || c === 11814 || c === 11815 || c === 11816 || c === 11817 || c >= 11818 && c <= 11822 || c === 11823 || c >= 11824 && c <= 11833 || c >= 11834 && c <= 11835 || c >= 11836 && c <= 11839 || c === 11840 || c === 11841 || c === 11842 || c >= 11843 && c <= 11855 || c >= 11856 && c <= 11857 || c === 11858 || c >= 11859 && c <= 11903 || c >= 12289 && c <= 12291 || c === 12296 || c === 12297 || c === 12298 || c === 12299 || c === 12300 || c === 12301 || c === 12302 || c === 12303 || c === 12304 || c === 12305 || c >= 12306 && c <= 12307 || c === 12308 || c === 12309 || c === 12310 || c === 12311 || c === 12312 || c === 12313 || c === 12314 || c === 12315 || c === 12316 || c === 12317 || c >= 12318 && c <= 12319 || c === 12320 || c === 12336 || c === 64830 || c === 64831 || c >= 65093 && c <= 65094;
}
function pruneLocation(els) {
  els.forEach(function(el) {
    delete el.location;
    if (isSelectElement(el) || isPluralElement(el)) {
      for (var k in el.options) {
        delete el.options[k].location;
        pruneLocation(el.options[k].value);
      }
    } else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
      delete el.style.location;
    } else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) {
      delete el.style.location;
    } else if (isTagElement(el)) {
      pruneLocation(el.children);
    }
  });
}
function parse(message, opts) {
  if (opts === void 0) {
    opts = {};
  }
  opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
  var result = new Parser(message, opts).parse();
  if (result.err) {
    var error = SyntaxError(ErrorKind[result.err.kind]);
    error.location = result.err.location;
    error.originalMessage = result.err.message;
    throw error;
  }
  if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
    pruneLocation(result.val);
  }
  return result.val;
}
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2["MISSING_VALUE"] = "MISSING_VALUE";
  ErrorCode2["INVALID_VALUE"] = "INVALID_VALUE";
  ErrorCode2["MISSING_INTL_API"] = "MISSING_INTL_API";
})(ErrorCode || (ErrorCode = {}));
var FormatError = (
  /** @class */
  (function(_super) {
    __extends(FormatError2, _super);
    function FormatError2(msg, code, originalMessage) {
      var _this = _super.call(this, msg) || this;
      _this.code = code;
      _this.originalMessage = originalMessage;
      return _this;
    }
    FormatError2.prototype.toString = function() {
      return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
    };
    return FormatError2;
  })(Error)
);
var InvalidValueError = (
  /** @class */
  (function(_super) {
    __extends(InvalidValueError2, _super);
    function InvalidValueError2(variableId, value, options2, originalMessage) {
      return _super.call(this, 'Invalid values for "'.concat(variableId, '": "').concat(value, '". Options are "').concat(Object.keys(options2).join('", "'), '"'), ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueError2;
  })(FormatError)
);
var InvalidValueTypeError = (
  /** @class */
  (function(_super) {
    __extends(InvalidValueTypeError2, _super);
    function InvalidValueTypeError2(value, type, originalMessage) {
      return _super.call(this, 'Value for "'.concat(value, '" must be of type ').concat(type), ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueTypeError2;
  })(FormatError)
);
var MissingValueError = (
  /** @class */
  (function(_super) {
    __extends(MissingValueError2, _super);
    function MissingValueError2(variableId, originalMessage) {
      return _super.call(this, 'The intl string context variable "'.concat(variableId, '" was not provided to the string "').concat(originalMessage, '"'), ErrorCode.MISSING_VALUE, originalMessage) || this;
    }
    return MissingValueError2;
  })(FormatError)
);
var PART_TYPE;
(function(PART_TYPE2) {
  PART_TYPE2[PART_TYPE2["literal"] = 0] = "literal";
  PART_TYPE2[PART_TYPE2["object"] = 1] = "object";
})(PART_TYPE || (PART_TYPE = {}));
function mergeLiteral(parts) {
  if (parts.length < 2) {
    return parts;
  }
  return parts.reduce(function(all, part) {
    var lastPart = all[all.length - 1];
    if (!lastPart || lastPart.type !== PART_TYPE.literal || part.type !== PART_TYPE.literal) {
      all.push(part);
    } else {
      lastPart.value += part.value;
    }
    return all;
  }, []);
}
function isFormatXMLElementFn(el) {
  return typeof el === "function";
}
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
  if (els.length === 1 && isLiteralElement(els[0])) {
    return [
      {
        type: PART_TYPE.literal,
        value: els[0].value
      }
    ];
  }
  var result = [];
  for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
    var el = els_1[_i];
    if (isLiteralElement(el)) {
      result.push({
        type: PART_TYPE.literal,
        value: el.value
      });
      continue;
    }
    if (isPoundElement(el)) {
      if (typeof currentPluralValue === "number") {
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getNumberFormat(locales).format(currentPluralValue)
        });
      }
      continue;
    }
    var varName = el.value;
    if (!(values && varName in values)) {
      throw new MissingValueError(varName, originalMessage);
    }
    var value = values[varName];
    if (isArgumentElement(el)) {
      if (!value || typeof value === "string" || typeof value === "number") {
        value = typeof value === "string" || typeof value === "number" ? String(value) : "";
      }
      result.push({
        type: typeof value === "string" ? PART_TYPE.literal : PART_TYPE.object,
        value
      });
      continue;
    }
    if (isDateElement(el)) {
      var style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTimeElement(el)) {
      var style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : formats.time.medium;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isNumberElement(el)) {
      var style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
      if (style && style.scale) {
        value = value * (style.scale || 1);
      }
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getNumberFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTagElement(el)) {
      var children = el.children, value_1 = el.value;
      var formatFn = values[value_1];
      if (!isFormatXMLElementFn(formatFn)) {
        throw new InvalidValueTypeError(value_1, "function", originalMessage);
      }
      var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
      var chunks = formatFn(parts.map(function(p) {
        return p.value;
      }));
      if (!Array.isArray(chunks)) {
        chunks = [chunks];
      }
      result.push.apply(result, chunks.map(function(c) {
        return {
          type: typeof c === "string" ? PART_TYPE.literal : PART_TYPE.object,
          value: c
        };
      }));
    }
    if (isSelectElement(el)) {
      var opt = el.options[value] || el.options.other;
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
      continue;
    }
    if (isPluralElement(el)) {
      var opt = el.options["=".concat(value)];
      if (!opt) {
        if (!Intl.PluralRules) {
          throw new FormatError('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', ErrorCode.MISSING_INTL_API, originalMessage);
        }
        var rule = formatters.getPluralRules(locales, { type: el.pluralType }).select(value - (el.offset || 0));
        opt = el.options[rule] || el.options.other;
      }
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
      continue;
    }
  }
  return mergeLiteral(result);
}
function mergeConfig(c1, c2) {
  if (!c2) {
    return c1;
  }
  return __assign(__assign(__assign({}, c1 || {}), c2 || {}), Object.keys(c1).reduce(function(all, k) {
    all[k] = __assign(__assign({}, c1[k]), c2[k] || {});
    return all;
  }, {}));
}
function mergeConfigs(defaultConfig, configs) {
  if (!configs) {
    return defaultConfig;
  }
  return Object.keys(defaultConfig).reduce(function(all, k) {
    all[k] = mergeConfig(defaultConfig[k], configs[k]);
    return all;
  }, __assign({}, defaultConfig));
}
function createFastMemoizeCache(store) {
  return {
    create: function() {
      return {
        get: function(key) {
          return store[key];
        },
        set: function(key, value) {
          store[key] = value;
        }
      };
    }
  };
}
function createDefaultFormatters(cache) {
  if (cache === void 0) {
    cache = {
      number: {},
      dateTime: {},
      pluralRules: {}
    };
  }
  return {
    getNumberFormat: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.NumberFormat).bind.apply(_a2, __spreadArray([void 0], args, false)))();
    }, {
      cache: createFastMemoizeCache(cache.number),
      strategy: strategies.variadic
    }),
    getDateTimeFormat: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.DateTimeFormat).bind.apply(_a2, __spreadArray([void 0], args, false)))();
    }, {
      cache: createFastMemoizeCache(cache.dateTime),
      strategy: strategies.variadic
    }),
    getPluralRules: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.PluralRules).bind.apply(_a2, __spreadArray([void 0], args, false)))();
    }, {
      cache: createFastMemoizeCache(cache.pluralRules),
      strategy: strategies.variadic
    })
  };
}
var IntlMessageFormat = (
  /** @class */
  (function() {
    function IntlMessageFormat2(message, locales, overrideFormats, opts) {
      if (locales === void 0) {
        locales = IntlMessageFormat2.defaultLocale;
      }
      var _this = this;
      this.formatterCache = {
        number: {},
        dateTime: {},
        pluralRules: {}
      };
      this.format = function(values) {
        var parts = _this.formatToParts(values);
        if (parts.length === 1) {
          return parts[0].value;
        }
        var result = parts.reduce(function(all, part) {
          if (!all.length || part.type !== PART_TYPE.literal || typeof all[all.length - 1] !== "string") {
            all.push(part.value);
          } else {
            all[all.length - 1] += part.value;
          }
          return all;
        }, []);
        if (result.length <= 1) {
          return result[0] || "";
        }
        return result;
      };
      this.formatToParts = function(values) {
        return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, void 0, _this.message);
      };
      this.resolvedOptions = function() {
        var _a3;
        return {
          locale: ((_a3 = _this.resolvedLocale) === null || _a3 === void 0 ? void 0 : _a3.toString()) || Intl.NumberFormat.supportedLocalesOf(_this.locales)[0]
        };
      };
      this.getAst = function() {
        return _this.ast;
      };
      this.locales = locales;
      this.resolvedLocale = IntlMessageFormat2.resolveLocale(locales);
      if (typeof message === "string") {
        this.message = message;
        if (!IntlMessageFormat2.__parse) {
          throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
        }
        var _a2 = opts || {};
        _a2.formatters;
        var parseOpts = __rest(_a2, ["formatters"]);
        this.ast = IntlMessageFormat2.__parse(message, __assign(__assign({}, parseOpts), { locale: this.resolvedLocale }));
      } else {
        this.ast = message;
      }
      if (!Array.isArray(this.ast)) {
        throw new TypeError("A message must be provided as a String or AST.");
      }
      this.formats = mergeConfigs(IntlMessageFormat2.formats, overrideFormats);
      this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
    }
    Object.defineProperty(IntlMessageFormat2, "defaultLocale", {
      get: function() {
        if (!IntlMessageFormat2.memoizedDefaultLocale) {
          IntlMessageFormat2.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
        }
        return IntlMessageFormat2.memoizedDefaultLocale;
      },
      enumerable: false,
      configurable: true
    });
    IntlMessageFormat2.memoizedDefaultLocale = null;
    IntlMessageFormat2.resolveLocale = function(locales) {
      if (typeof Intl.Locale === "undefined") {
        return;
      }
      var supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales);
      if (supportedLocales.length > 0) {
        return new Intl.Locale(supportedLocales[0]);
      }
      return new Intl.Locale(typeof locales === "string" ? locales : locales[0]);
    };
    IntlMessageFormat2.__parse = parse;
    IntlMessageFormat2.formats = {
      number: {
        integer: {
          maximumFractionDigits: 0
        },
        currency: {
          style: "currency"
        },
        percent: {
          style: "percent"
        }
      },
      date: {
        short: {
          month: "numeric",
          day: "numeric",
          year: "2-digit"
        },
        medium: {
          month: "short",
          day: "numeric",
          year: "numeric"
        },
        long: {
          month: "long",
          day: "numeric",
          year: "numeric"
        },
        full: {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      time: {
        short: {
          hour: "numeric",
          minute: "numeric"
        },
        medium: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        },
        long: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        },
        full: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        }
      }
    };
    return IntlMessageFormat2;
  })()
);
function delve(obj, fullKey) {
  if (fullKey == null)
    return void 0;
  if (fullKey in obj) {
    return obj[fullKey];
  }
  const keys = fullKey.split(".");
  let result = obj;
  for (let p = 0; p < keys.length; p++) {
    if (typeof result === "object") {
      if (p > 0) {
        const partialKey = keys.slice(p, keys.length).join(".");
        if (partialKey in result) {
          result = result[partialKey];
          break;
        }
      }
      result = result[keys[p]];
    } else {
      result = void 0;
    }
  }
  return result;
}
const lookupCache = {};
const addToCache = (path, locale, message) => {
  if (!message)
    return message;
  if (!(locale in lookupCache))
    lookupCache[locale] = {};
  if (!(path in lookupCache[locale]))
    lookupCache[locale][path] = message;
  return message;
};
const lookup = (path, refLocale) => {
  if (refLocale == null)
    return void 0;
  if (refLocale in lookupCache && path in lookupCache[refLocale]) {
    return lookupCache[refLocale][path];
  }
  const locales = getPossibleLocales(refLocale);
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    const message = getMessageFromDictionary(locale, path);
    if (message) {
      return addToCache(path, refLocale, message);
    }
  }
  return void 0;
};
let dictionary;
const $dictionary = writable({});
function getLocaleDictionary(locale) {
  return dictionary[locale] || null;
}
function hasLocaleDictionary(locale) {
  return locale in dictionary;
}
function getMessageFromDictionary(locale, id) {
  if (!hasLocaleDictionary(locale)) {
    return null;
  }
  const localeDictionary = getLocaleDictionary(locale);
  const match = delve(localeDictionary, id);
  return match;
}
function getClosestAvailableLocale(refLocale) {
  if (refLocale == null)
    return void 0;
  const relatedLocales = getPossibleLocales(refLocale);
  for (let i = 0; i < relatedLocales.length; i++) {
    const locale = relatedLocales[i];
    if (hasLocaleDictionary(locale)) {
      return locale;
    }
  }
  return void 0;
}
function addMessages(locale, ...partials) {
  delete lookupCache[locale];
  $dictionary.update((d) => {
    d[locale] = deepmerge.all([d[locale] || {}, ...partials]);
    return d;
  });
}
derived(
  [$dictionary],
  ([dictionary2]) => Object.keys(dictionary2)
);
$dictionary.subscribe((newDictionary) => dictionary = newDictionary);
const queue = {};
function createLocaleQueue(locale) {
  queue[locale] = /* @__PURE__ */ new Set();
}
function removeLoaderFromQueue(locale, loader) {
  queue[locale].delete(loader);
  if (queue[locale].size === 0) {
    delete queue[locale];
  }
}
function getLocaleQueue(locale) {
  return queue[locale];
}
function getLocalesQueues(locale) {
  return getPossibleLocales(locale).map((localeItem) => {
    const localeQueue = getLocaleQueue(localeItem);
    return [localeItem, localeQueue ? [...localeQueue] : []];
  }).filter(([, localeQueue]) => localeQueue.length > 0);
}
function hasLocaleQueue(locale) {
  if (locale == null)
    return false;
  return getPossibleLocales(locale).some(
    (localeQueue) => {
      var _a2;
      return (_a2 = getLocaleQueue(localeQueue)) == null ? void 0 : _a2.size;
    }
  );
}
function loadLocaleQueue(locale, localeQueue) {
  const allLoadersPromise = Promise.all(
    localeQueue.map((loader) => {
      removeLoaderFromQueue(locale, loader);
      return loader().then((partial) => partial.default || partial);
    })
  );
  return allLoadersPromise.then((partials) => addMessages(locale, ...partials));
}
const activeFlushes = {};
function flush(locale) {
  if (!hasLocaleQueue(locale)) {
    if (locale in activeFlushes) {
      return activeFlushes[locale];
    }
    return Promise.resolve();
  }
  const queues = getLocalesQueues(locale);
  activeFlushes[locale] = Promise.all(
    queues.map(
      ([localeName, localeQueue]) => loadLocaleQueue(localeName, localeQueue)
    )
  ).then(() => {
    if (hasLocaleQueue(locale)) {
      return flush(locale);
    }
    delete activeFlushes[locale];
  });
  return activeFlushes[locale];
}
function registerLocaleLoader(locale, loader) {
  if (!getLocaleQueue(locale))
    createLocaleQueue(locale);
  const localeQueue = getLocaleQueue(locale);
  if (getLocaleQueue(locale).has(loader))
    return;
  if (!hasLocaleDictionary(locale)) {
    $dictionary.update((d) => {
      d[locale] = {};
      return d;
    });
  }
  localeQueue.add(loader);
}
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __objRest$1 = (source, exclude) => {
  var target = {};
  for (var prop2 in source)
    if (__hasOwnProp$2.call(source, prop2) && exclude.indexOf(prop2) < 0)
      target[prop2] = source[prop2];
  if (source != null && __getOwnPropSymbols$2)
    for (var prop2 of __getOwnPropSymbols$2(source)) {
      if (exclude.indexOf(prop2) < 0 && __propIsEnum$2.call(source, prop2))
        target[prop2] = source[prop2];
    }
  return target;
};
const defaultFormats = {
  number: {
    scientific: { notation: "scientific" },
    engineering: { notation: "engineering" },
    compactLong: { notation: "compact", compactDisplay: "long" },
    compactShort: { notation: "compact", compactDisplay: "short" }
  },
  date: {
    short: { month: "numeric", day: "numeric", year: "2-digit" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  },
  time: {
    short: { hour: "numeric", minute: "numeric" },
    medium: { hour: "numeric", minute: "numeric", second: "numeric" },
    long: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    },
    full: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    }
  }
};
function defaultMissingKeyHandler({ locale, id }) {
  console.warn(
    `[svelte-i18n] The message "${id}" was not found in "${getPossibleLocales(
      locale
    ).join('", "')}".${hasLocaleQueue(getCurrentLocale()) ? `

Note: there are at least one loader still registered to this locale that wasn't executed.` : ""}`
  );
}
const defaultOptions = {
  fallbackLocale: null,
  loadingDelay: 200,
  formats: defaultFormats,
  warnOnMissingMessages: true,
  handleMissingMessage: void 0,
  ignoreTag: true
};
const options = defaultOptions;
function getOptions() {
  return options;
}
function init(opts) {
  const _a2 = opts, { formats } = _a2, rest = __objRest$1(_a2, ["formats"]);
  let initialLocale = opts.fallbackLocale;
  if (opts.initialLocale) {
    try {
      if (IntlMessageFormat.resolveLocale(opts.initialLocale)) {
        initialLocale = opts.initialLocale;
      }
    } catch (e) {
      console.warn(
        `[svelte-i18n] The initial locale "${opts.initialLocale}" is not a valid locale.`
      );
    }
  }
  if (rest.warnOnMissingMessages) {
    delete rest.warnOnMissingMessages;
    if (rest.handleMissingMessage == null) {
      rest.handleMissingMessage = defaultMissingKeyHandler;
    } else {
      console.warn(
        '[svelte-i18n] The "warnOnMissingMessages" option is deprecated. Please use the "handleMissingMessage" option instead.'
      );
    }
  }
  Object.assign(options, rest, { initialLocale });
  if (formats) {
    if ("number" in formats) {
      Object.assign(options.formats.number, formats.number);
    }
    if ("date" in formats) {
      Object.assign(options.formats.date, formats.date);
    }
    if ("time" in formats) {
      Object.assign(options.formats.time, formats.time);
    }
  }
  return $locale.set(initialLocale);
}
const $isLoading = writable(false);
var __defProp$1 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop2 in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop2))
      __defNormalProp$1(a, prop2, b[prop2]);
  if (__getOwnPropSymbols$1)
    for (var prop2 of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop2))
        __defNormalProp$1(a, prop2, b[prop2]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
let current;
const internalLocale = writable(null);
function getSubLocales(refLocale) {
  return refLocale.split("-").map((_, i, arr) => arr.slice(0, i + 1).join("-")).reverse();
}
function getPossibleLocales(refLocale, fallbackLocale = getOptions().fallbackLocale) {
  const locales = getSubLocales(refLocale);
  if (fallbackLocale) {
    return [.../* @__PURE__ */ new Set([...locales, ...getSubLocales(fallbackLocale)])];
  }
  return locales;
}
function getCurrentLocale() {
  return current != null ? current : void 0;
}
internalLocale.subscribe((newLocale) => {
  current = newLocale != null ? newLocale : void 0;
  if (typeof window !== "undefined" && newLocale != null) {
    document.documentElement.setAttribute("lang", newLocale);
  }
});
const set = (newLocale) => {
  if (newLocale && getClosestAvailableLocale(newLocale) && hasLocaleQueue(newLocale)) {
    const { loadingDelay } = getOptions();
    let loadingTimer;
    if (typeof window !== "undefined" && getCurrentLocale() != null && loadingDelay) {
      loadingTimer = window.setTimeout(
        () => $isLoading.set(true),
        loadingDelay
      );
    } else {
      $isLoading.set(true);
    }
    return flush(newLocale).then(() => {
      internalLocale.set(newLocale);
    }).finally(() => {
      clearTimeout(loadingTimer);
      $isLoading.set(false);
    });
  }
  return internalLocale.set(newLocale);
};
const $locale = __spreadProps(__spreadValues$1({}, internalLocale), {
  set
});
const getLocaleFromNavigator = () => {
  if (typeof window === "undefined")
    return null;
  return window.navigator.language || window.navigator.languages[0];
};
const monadicMemoize = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  const memoizedFn = (arg) => {
    const cacheKey = JSON.stringify(arg);
    if (cacheKey in cache) {
      return cache[cacheKey];
    }
    return cache[cacheKey] = fn(arg);
  };
  return memoizedFn;
};
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop2 in b || (b = {}))
    if (__hasOwnProp.call(b, prop2))
      __defNormalProp(a, prop2, b[prop2]);
  if (__getOwnPropSymbols)
    for (var prop2 of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop2))
        __defNormalProp(a, prop2, b[prop2]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop2 in source)
    if (__hasOwnProp.call(source, prop2) && exclude.indexOf(prop2) < 0)
      target[prop2] = source[prop2];
  if (source != null && __getOwnPropSymbols)
    for (var prop2 of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop2) < 0 && __propIsEnum.call(source, prop2))
        target[prop2] = source[prop2];
    }
  return target;
};
const getIntlFormatterOptions = (type, name) => {
  const { formats } = getOptions();
  if (type in formats && name in formats[type]) {
    return formats[type][name];
  }
  throw new Error(`[svelte-i18n] Unknown "${name}" ${type} format.`);
};
const createNumberFormatter = monadicMemoize(
  (_a2) => {
    var _b = _a2, { locale, format } = _b, options2 = __objRest(_b, ["locale", "format"]);
    if (locale == null) {
      throw new Error('[svelte-i18n] A "locale" must be set to format numbers');
    }
    if (format) {
      options2 = getIntlFormatterOptions("number", format);
    }
    return new Intl.NumberFormat(locale, options2);
  }
);
const createDateFormatter = monadicMemoize(
  (_c) => {
    var _d = _c, { locale, format } = _d, options2 = __objRest(_d, ["locale", "format"]);
    if (locale == null) {
      throw new Error('[svelte-i18n] A "locale" must be set to format dates');
    }
    if (format) {
      options2 = getIntlFormatterOptions("date", format);
    } else if (Object.keys(options2).length === 0) {
      options2 = getIntlFormatterOptions("date", "short");
    }
    return new Intl.DateTimeFormat(locale, options2);
  }
);
const createTimeFormatter = monadicMemoize(
  (_e) => {
    var _f = _e, { locale, format } = _f, options2 = __objRest(_f, ["locale", "format"]);
    if (locale == null) {
      throw new Error(
        '[svelte-i18n] A "locale" must be set to format time values'
      );
    }
    if (format) {
      options2 = getIntlFormatterOptions("time", format);
    } else if (Object.keys(options2).length === 0) {
      options2 = getIntlFormatterOptions("time", "short");
    }
    return new Intl.DateTimeFormat(locale, options2);
  }
);
const getNumberFormatter = (_g = {}) => {
  var _h = _g, {
    locale = getCurrentLocale()
  } = _h, args = __objRest(_h, [
    "locale"
  ]);
  return createNumberFormatter(__spreadValues({ locale }, args));
};
const getDateFormatter = (_i = {}) => {
  var _j = _i, {
    locale = getCurrentLocale()
  } = _j, args = __objRest(_j, [
    "locale"
  ]);
  return createDateFormatter(__spreadValues({ locale }, args));
};
const getTimeFormatter = (_k = {}) => {
  var _l = _k, {
    locale = getCurrentLocale()
  } = _l, args = __objRest(_l, [
    "locale"
  ]);
  return createTimeFormatter(__spreadValues({ locale }, args));
};
const getMessageFormatter = monadicMemoize(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (message, locale = getCurrentLocale()) => new IntlMessageFormat(message, locale, getOptions().formats, {
    ignoreTag: getOptions().ignoreTag
  })
);
const formatMessage = (id, options2 = {}) => {
  var _a2, _b, _c, _d;
  let messageObj = options2;
  if (typeof id === "object") {
    messageObj = id;
    id = messageObj.id;
  }
  const {
    values,
    locale = getCurrentLocale(),
    default: defaultValue
  } = messageObj;
  if (locale == null) {
    throw new Error(
      "[svelte-i18n] Cannot format a message without first setting the initial locale."
    );
  }
  let message = lookup(id, locale);
  if (!message) {
    message = (_d = (_c = (_b = (_a2 = getOptions()).handleMissingMessage) == null ? void 0 : _b.call(_a2, { locale, id, defaultValue })) != null ? _c : defaultValue) != null ? _d : id;
  } else if (typeof message !== "string") {
    console.warn(
      `[svelte-i18n] Message with id "${id}" must be of type "string", found: "${typeof message}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`
    );
    return message;
  }
  if (!values) {
    return message;
  }
  let result = message;
  try {
    result = getMessageFormatter(message, locale).format(values);
  } catch (e) {
    if (e instanceof Error) {
      console.warn(
        `[svelte-i18n] Message "${id}" has syntax error:`,
        e.message
      );
    }
  }
  return result;
};
const formatTime = (t2, options2) => {
  return getTimeFormatter(options2).format(t2);
};
const formatDate = (d, options2) => {
  return getDateFormatter(options2).format(d);
};
const formatNumber = (n, options2) => {
  return getNumberFormatter(options2).format(n);
};
const getJSON = (id, locale = getCurrentLocale()) => {
  return lookup(id, locale);
};
const $format = derived([$locale, $dictionary], () => formatMessage);
derived([$locale], () => formatTime);
derived([$locale], () => formatDate);
derived([$locale], () => formatNumber);
derived([$locale, $dictionary], () => getJSON);
function unwrapFunctionStore(store) {
  let localReference;
  const cancel = store.subscribe((value) => localReference = value);
  const fn = (...args) => localReference(...args);
  fn.freeze = cancel;
  return fn;
}
registerLocaleLoader("ru", () => __vitePreload(() => import("../chunks/BtLIXRhA.js"), true ? [] : void 0, import.meta.url));
const defaultLocale = getLocaleFromNavigator() || "ru";
init({ fallbackLocale: "ru", initialLocale: defaultLocale });
let curLanguage = persistent("language", defaultLocale);
effect_root(() => {
  user_effect(() => {
    const newLang = curLanguage.v;
    untrack(() => {
      if (newLang && newLang !== get$1($locale)) {
        $locale.set(newLang);
      }
    });
  });
});
effect_root(() => {
  const unsubscribe = $locale.subscribe((current2) => {
    untrack(() => {
      if (current2 && current2 !== curLanguage.v) {
        curLanguage.v = current2;
      }
    });
  });
  return unsubscribe;
});
const t = unwrapFunctionStore($format);
const notify = {
  success: (message, opts = {}) => toast.success(message, { duration: 2500, ...opts }),
  error: (message, opts = {}) => toast.error(message, { duration: 5e3, ...opts }),
  info: (message, opts = {}) => toast.info(message, opts),
  warning: (message, opts = {}) => toast.warning(message, opts),
  apiError: (errCode) => {
    const errKey = `errors.${errCode}`;
    let msg = t(errKey);
    if (msg === errKey) {
      msg = t("errors.genericApi", { values: { msg: errCode } });
    }
    toast.error(msg);
  }
};
async function apiGet(path, config2 = {}) {
  return await apiRequest(path, config2);
}
async function apiPost(path, body, config2 = {}) {
  config2.method = "POST";
  if (typeof body === "object" && body !== null) {
    if (!config2.headers) config2.headers = {};
    if (config2.isForm) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(body)) {
        formData.append(key, value);
      }
      config2.body = formData;
      delete config2.headers["Content-Type"];
    } else {
      config2.headers["Content-Type"] = "application/json";
      config2.body = JSON.stringify(body);
    }
  } else if (typeof body === "string") {
    config2.body = body;
  } else {
    throw new Error(`unexpected body: ${body}(${typeof body})`);
  }
  return await apiRequest(path, config2);
}
async function apiRequest(path, config2) {
  if (config2.noCache === true) {
    delete config2.noCache;
    Object.assign(config2, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  }
  try {
    const response = await fetch("/api" + path, config2);
    if (response.headers.get("Content-Type") && response.headers.get("Content-Type").includes("application/json")) {
      const json = await response.json();
      if (json.errors) {
        processApiErrors(json.errors);
      }
      response.json = () => json;
    }
    return response;
  } catch (error) {
    notify.apiError(t(error.message));
    throw error;
  }
}
function processApiErrors(errors) {
  for (const error of errors) {
    notify.apiError(t(`${error?.msg || error}`));
  }
}
async function checkChunks(canvasId, chunks, hashes) {
  const chunksFormatted = JSON.stringify(chunks.flat());
  const hashesFormatted = JSON.stringify(hashes);
  const params = new URLSearchParams();
  params.set("canvas", canvasId);
  params.set("chunks", chunksFormatted);
  params.set("hashes", hashesFormatted);
  const resp = await apiGet(`/chunks/check?${params.toString()}`);
  const respData = await resp.json();
  if (respData.errors) return null;
  if (!Array.isArray(respData) || respData.length !== chunks.length) {
    throw new Error("Unknown chunks format: " + respData);
  }
  return respData;
}
async function getChunk(canvasId, x2, y2) {
  const resp = await apiGet(`/chunks/get?canvas=${canvasId}&x=${x2}&y=${y2}`, {
    credentials: "omit"
  });
  return resp;
}
const api = {
  validateChunks: checkChunks,
  getChunk
};
class Chunk {
  constructor(x2, y2) {
    this.core = useGameCore$1();
    this.x = x2;
    this.y = y2;
    this.width = this.core.config.chunkSize;
    this.height = this.core.config.chunkSize;
    this.canvas = null;
    this.ctx = null;
    this.imgData = null;
    this.view = null;
    this.pCanvas = null;
    this.pCtx = null;
    this.pImgData = null;
    this.pView = null;
    this._needRedraw = false;
    this.loadedAt = 0;
  }
  init(buffer) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.imgData = this.ctx.createImageData(this.width, this.height);
    this.view = new Uint32Array(this.imgData.data.buffer);
    this.pCanvas = document.createElement("canvas");
    this.pCanvas.width = this.width;
    this.pCanvas.height = this.height;
    this.pCtx = this.canvas.getContext("2d", { alpha: true });
    this.pImgData = this.ctx.createImageData(this.width, this.height);
    this.pView = new Uint32Array(this.imgData.data.buffer);
    this.loadedAt = Date.now();
    this.loadFromBuffer(buffer);
    this.requestRedraw();
  }
  loadFromBuffer(buffer) {
    let col, isProtected;
    const bgrPalette = this.core.config.colorsBGR;
    for (let i = 0; i < buffer.byteLength; i++) {
      col = buffer[i];
      isProtected = col & 128;
      isProtected && (this.pView[i] = 4294901760);
      this.view[i] = bgrPalette[col & 127];
    }
  }
  set(x2, y2, col) {
    const bgrPalette = this.core.config.colorsBGR;
    const i = x2 + y2 * this.width;
    this.view[i] = bgrPalette[col];
  }
  requestRedraw() {
    this._needRedraw = true;
  }
  redraw() {
    if (!this._needRedraw) return;
    this._needRedraw = false;
    this.ctx.putImageData(this.imgData, 0, 0);
    if (this.core.ui.showProtection.v) {
      this.pCtx.putImageData(this.pImgData, 0, 0);
    }
  }
}
const LIMBO_INTERVAL_MS = 500;
const CHECK_DELAY = 1e3;
const CHUNK_LOADING_THREADS = 5;
const CHUNK_CACHE_NAME = "chunks-cache-v2";
const CACHE_SUPPORTED = "caches" in window;
function initChunkManager(core2) {
  purgeOldCaches();
  const chunkSize = core2.config.chunkSize;
  const chunks = /* @__PURE__ */ new Map();
  let limboQueue = [];
  let isValidating = false;
  let checkRic = null;
  let lastCheck = 0;
  const chunkHashes = persistentPerCanvas("chunkHashes", {});
  let loadingQueue = /* @__PURE__ */ new Set();
  let inFlight = /* @__PURE__ */ new Set();
  let loadingRic = null;
  let loadingCount = 0;
  function startLimboInterval() {
    setInterval(() => {
      let chunkList = getVisibleChunks();
      chunkList = chunkList.reduce((acc, _, i, src) => (
        // reshape flat chunk list into pairs of [cx, cy]
        i % 2 === 0 ? [...acc, src.slice(i, i + 2)] : acc
      ), []);
      const visibleChunkKeys = chunkList.map((coords) => getChunkKey(...coords));
      for (const key of loadingQueue.keys()) {
        if (!visibleChunkKeys.includes(key)) {
          loadingQueue.delete(key);
        }
      }
      chunkList = chunkList.filter(([cx, cy]) => {
        const ck = getChunkKey(cx, cy);
        if ([chunks, loadingQueue, inFlight].some((q) => q.has(ck))) return false;
        return true;
      });
      if (!chunkList.length) return;
      limboQueue = sortChunks(chunkList);
      pingCheckingInterval();
    }, LIMBO_INTERVAL_MS);
  }
  startLimboInterval();
  function pingCheckingInterval() {
    if (checkRic) return;
    checkRic = requestIdleCallback(checkChunks2, { timeout: 500 });
  }
  async function checkChunks2() {
    checkRic = null;
    if (isValidating) return;
    isValidating = true;
    try {
      if (!limboQueue.length || Date.now() - lastCheck < CHECK_DELAY) return;
      let validateQueueChunks = [];
      let validateQueueHashes = [];
      for (const [cx, cy] of limboQueue) {
        const key = getChunkKey(cx, cy);
        if (isChunkHashed(key)) {
          validateQueueChunks.push([cx, cy]);
          validateQueueChunks.push(chunkHashes[key]);
        } else {
          loadingQueue.add(key);
          pingLoadingInterval();
        }
      }
      if (!validateQueueChunks.length) return;
      let toLoadFromCache = [];
      try {
        const result = await api.validateChunks(core2.config.canvasId, validateQueueChunks, validateQueueHashes);
        for (let i = 0; i < validateQueueChunks.length; i++) {
          const isHashValid = !!result[i];
          const chunkKey = getChunkKey(...validateQueueChunks[i]);
          if (isHashValid) {
            toLoadFromCache.push(chunkKey);
          } else {
            validateQueue.add(chunkKey);
          }
        }
      } catch (e) {
        console.error(e);
      }
      for (const [cx, cy] of toLoadFromCache) {
        try {
          const isSuccess = await loadChunkFromCache(cx, cy);
          if (!isSuccess) {
            const key = getChunkKey(cx, cy);
            loadingQueue.add(key);
            pingLoadingInterval();
          }
        } catch (error) {
          console.error(`can not load chunk ${cx},${cy} from cache: ${error}`);
        }
      }
    } finally {
      limboQueue.length = 0;
      isValidating = false;
    }
  }
  function pingLoadingInterval() {
    if (loadingRic) return;
    loadingRic = requestAnimationFrame(loadChunks);
  }
  let _lastLoadSort = 0;
  async function loadChunks() {
    loadingRic = null;
    while (loadingQueue.size > 0 && loadingCount < CHUNK_LOADING_THREADS) {
      if (Date.now() - _lastLoadSort > 500) {
        _lastLoadSort = Date.now();
        loadingQueue = new Set(sortChunks([...loadingQueue].map(fromChunkKey)).map(([cx2, cy2]) => getChunkKey(cx2, cy2)));
      }
      loadingCount++;
      const chunkKey = loadingQueue.values().next().value;
      loadingQueue.delete(chunkKey);
      const [cx, cy] = fromChunkKey(chunkKey);
      if (!isChunkVisible(cx, cy) || inFlight.has(chunkKey)) {
        loadingCount--;
        continue;
      }
      inFlight.add(chunkKey);
      new Promise(async (res, rej) => {
        try {
          const resp = await api.getChunk(core2.config.canvasId, cx, cy);
          const newHash = resp.headers.get("X-Compressed-Hash");
          if (newHash && CACHE_SUPPORTED) {
          }
          res([cx, cy, resp]);
        } catch (error) {
          rej(error);
        }
      }).then((chunk) => {
        loadChunkFromResp(...chunk);
      }).catch((e) => {
        console.error(e);
      }).finally(() => {
        inFlight.delete(chunkKey);
        loadingCount--;
      });
    }
    if (loadingQueue.size > 0) {
      pingLoadingInterval();
    }
  }
  function distNoRoot(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
  }
  function sortChunks(chunkList) {
    let [centerX, centerY] = screenToBoardSpace(window.innerWidth / 2, window.innerHeight / 2);
    centerX /= core2.config.chunkSize;
    centerY /= core2.config.chunkSize;
    chunkList = chunkList.sort((chunkA, chunkB) => {
      return distNoRoot(centerX, centerY, ...chunkA) - distNoRoot(centerX, centerY, ...chunkB);
    });
    return chunkList;
  }
  function isChunkHashed(chunkKey) {
    return Object.hasOwn(chunkHashes.v, chunkKey);
  }
  function handleInputPixels(pixels, isProtect) {
  }
  function getChunkKey(x2, y2) {
    return x2 << 16 | y2;
  }
  function fromChunkKey(key) {
    return [
      key >> 16,
      key & 65535
    ];
  }
  function getChunk2(x2, y2) {
    return chunks.get(getChunkKey(x2, y2)) ?? null;
  }
  function purgeOldCaches() {
    if (!CACHE_SUPPORTED) return;
    const cachesToKeep = [CHUNK_CACHE_NAME];
    caches.keys().then(
      (keyList) => Promise.all(
        keyList.map((key) => {
          if (!cachesToKeep.includes(key)) {
            return caches.delete(key);
          }
          return void 0;
        })
      )
    );
  }
  async function loadChunkFromCache(cx, cy) {
    const chunkKey = getChunkKey(cx, cy);
    const cache = await caches.open(CHUNK_CACHE_NAME);
    const resp = await cache.match(`${core2.config.canvasId}-${chunkKey}`);
    if (!resp) {
      delete chunkHashes[chunkKey];
      return false;
    }
    await this.loadChunkFromResp(x, y, resp, true);
  }
  async function loadChunkFromResp(x2, y2, resp) {
    const cdata = await resp.arrayBuffer();
    const chunk = new Chunk(x2, y2);
    chunk.init(new Uint8Array(cdata));
    chunks.set(getChunkKey(x2, y2), chunk);
    core2.renderer.requestRender();
  }
  function setPixels(pixelsArr) {
    for (let i = 0; i < pixelsArr.length; i += 3) {
      const x2 = pixelsArr[i];
      const y2 = pixelsArr[i + 1];
      const colId = pixelsArr[i + 2];
      const cx = Math.floor(x2 / chunkSize);
      const cy = Math.floor(y2 / chunkSize);
      const offx = x2 % chunkSize;
      const offy = y2 % chunkSize;
      const chunk = getChunk2(cx, cy);
      if (!chunk) continue;
      chunk.set(offx, offy, colId);
      chunk.requestRedraw();
    }
    core2.renderer.requestRender();
  }
  return {
    handleInputPixels,
    getChunk: getChunk2,
    setPixels
  };
}
const FX_STATE = { IN_PROCESS: 0, FINISHED: 1, REMOVED: 2 };
const MAX_LAYER$1 = 4;
class OverlayRenderer {
  #ctx;
  #overlayCanvas;
  #core;
  #rafId = null;
  #isRunning = false;
  #layers = Array.from({ length: MAX_LAYER$1 + 1 }, () => []);
  #needRender = true;
  constructor(overlayCanvas, core2) {
    this.#overlayCanvas = overlayCanvas;
    this.#core = core2;
    this.#ctx = overlayCanvas.getContext("2d", { alpha: true, desynchronized: true });
    this.#setupCameraWatch();
  }
  #setupCameraWatch() {
    user_effect(() => {
      this.#core.camera.x;
      this.#core.camera.y;
      this.#core.camera.currentZoom;
      this.#needRender = true;
    });
  }
  #render = () => {
    this.#rafId = requestAnimationFrame(this.#render);
    if (!this.#isRunning || !this.#needRender) return;
    this.#needRender = false;
    this.#ctx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);
    for (const layer of this.#layers) {
      if (layer.length === 0) continue;
      for (const { id, render: renderFn } of layer) {
        try {
          const retCode = renderFn(this.#ctx);
          switch (retCode) {
            case FX_STATE.REMOVED:
              this.removeFx(id);
              break;
            case FX_STATE.IN_PROCESS:
              this.#needRender = true;
              break;
            case FX_STATE.FINISHED:
              break;
            default:
              console.warn(`fx should return a state! (${id})`);
          }
        } catch (error) {
          console.error("Error in fx callback: ", error);
          this.removeFx(id);
        }
      }
    }
  };
  start() {
    if (this.#isRunning) return;
    this.#isRunning = true;
    this.#render();
  }
  stop() {
    this.#isRunning = false;
    if (this.#rafId) {
      cancelAnimationFrame(this.#rafId);
      this.#rafId = null;
    }
  }
  resize(width, height) {
    this.#overlayCanvas.width = width;
    this.#overlayCanvas.height = height;
  }
  clear() {
    this.#ctx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);
  }
  addFx(id, layer, renderFn) {
    if (layer < 0 || layer > MAX_LAYER$1) {
      console.warn(`Layer ${layer} is < 0 or > ${MAX_LAYER$1}.`);
      return;
    }
    this.removeFx(id);
    this.#layers[layer].push({ id, render: renderFn });
    this.#needRender = true;
  }
  removeFx(id) {
    for (const layer of this.#layers) {
      const index2 = layer.findIndex((fx) => fx.id === id);
      if (index2 !== -1) {
        layer.splice(index2, 1);
        this.#needRender = true;
        return;
      }
    }
  }
  requestRender() {
    this.#needRender = true;
  }
}
function createOverlayRenderer(overlayCanvas, core2) {
  return new OverlayRenderer(overlayCanvas, core2);
}
const MAX_LAYER = 4;
const DEFAULT_VS = `#version 300 es
    in vec2 a_position;
    
    uniform vec4 u_rect;
    uniform vec2 u_resolution;
    
    out vec2 v_texCoord;
    
    void main() {
        v_texCoord = (a_position + 1.0) * 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y;

        if (u_rect.z == 0.0 || u_rect.w == 0.0) {
            gl_Position = vec4(a_position, 0.0, 1.0);
        } else {
            vec2 zeroToOne = (a_position + 1.0) * 0.5;
            zeroToOne.y = 1.0 - zeroToOne.y;

            vec2 pixelPos = zeroToOne * u_rect.zw;
            pixelPos += u_rect.xy;

            vec2 clipSpace = (pixelPos / u_resolution) * 2.0 - 1.0;
            clipSpace.y = -clipSpace.y; 

            gl_Position = vec4(clipSpace, 0.0, 1.0);
        }
    }
`;
class WebGLShaderEffect {
  id;
  program;
  gl;
  vao;
  #uniformsCache = /* @__PURE__ */ new Map();
  #params = state(proxy({}));
  get params() {
    return get(this.#params);
  }
  set params(value) {
    set$1(this.#params, value, true);
  }
  constructor(gl, id, fragmentSrc, quadBuffer, initialParams = {}) {
    this.gl = gl;
    this.id = id;
    this.params = initialParams;
    this.#compile(fragmentSrc, quadBuffer);
    this.#cacheUniforms();
  }
  #compile(fragmentSrc, quadBuffer) {
    const gl = this.gl;
    let finalFs = fragmentSrc;
    if (!fragmentSrc.includes("#version")) {
      console.error("You're using old (WebGL1) shader code! It will not compile correctly.");
      throw new Error("WebGLShaderEffect requires WebGL2 shader code with #version 300 es");
    }
    const vs = this.#compileShader(gl.VERTEX_SHADER, DEFAULT_VS);
    const fs = this.#compileShader(gl.FRAGMENT_SHADER, finalFs);
    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(`[WebGLFX] Link error (${this.id}): ${gl.getProgramInfoLog(this.program)}`);
    }
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const posLoc = gl.getAttribLocation(this.program, "a_position");
    if (posLoc !== -1) {
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    }
    gl.bindVertexArray(null);
  }
  #compileShader(type, src) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`[WebGLFX] Compile error (${this.id}): ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  }
  #cacheUniforms() {
    const gl = this.gl;
    const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(this.program, i);
      const loc = gl.getUniformLocation(this.program, info.name);
      this.#uniformsCache.set(info.name, { loc, type: info.type });
    }
  }
  applyUniforms() {
    const gl = this.gl;
    let textureUnit = 0;
    for (const [name, info] of this.#uniformsCache.entries()) {
      const value = this.params[name];
      if (value === void 0) continue;
      const loc = info.loc;
      if (info.type === gl.FLOAT) {
        gl.uniform1f(loc, value);
      } else if (info.type === gl.FLOAT_VEC2) {
        gl.uniform2f(loc, value[0], value[1]);
      } else if (info.type === gl.FLOAT_VEC3) {
        gl.uniform3f(loc, value[0], value[1], value[2]);
      } else if (info.type === gl.FLOAT_VEC4) {
        gl.uniform4f(loc, value[0], value[1], value[2], value[3]);
      } else if (info.type === gl.SAMPLER_2D) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, value);
        gl.uniform1i(loc, textureUnit);
        textureUnit++;
      }
    }
  }
}
class WebGLFxRenderer {
  #canvas;
  #gl;
  #core;
  #layers = state(proxy(Array.from({ length: MAX_LAYER + 1 }, () => [])));
  #quadBuffer;
  #rafId = null;
  #isRunning = false;
  #needRender = true;
  constructor(canvas2, core2) {
    this.#canvas = canvas2;
    this.#core = core2;
    this.#gl = canvas2.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true
    });
    if (!this.#gl) throw new Error("WebGL2 not supported");
    this.#initGL();
    this.#setupWatchers();
  }
  #initGL() {
    const gl = this.#gl;
    this.#quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  #setupWatchers() {
    user_effect(() => {
      if (this.#core?.camera) {
        this.#core.camera.x;
        this.#core.camera.y;
        this.#core.camera.currentZoom;
      }
      for (const layer of get(this.#layers)) {
        for (const fx of layer) {
          for (const key in fx.params) {
            fx.params[key];
          }
        }
      }
      this.#needRender = true;
    });
  }
  addEffect(id, layerIndex, fragmentSrc, initialParams = {}) {
    if (layerIndex < 0 || layerIndex > MAX_LAYER) return null;
    this.removeEffect(id);
    const fx = new WebGLShaderEffect(this.#gl, id, fragmentSrc, this.#quadBuffer, initialParams);
    get(this.#layers)[layerIndex].push(fx);
    this.#needRender = true;
    return fx;
  }
  removeEffect(id) {
    for (const layer of get(this.#layers)) {
      const index2 = layer.findIndex((fx) => fx.id === id);
      if (index2 !== -1) {
        layer.splice(index2, 1);
        this.#needRender = true;
        return;
      }
    }
  }
  #render = () => {
    this.#rafId = requestAnimationFrame(this.#render);
    if (!this.#isRunning || !this.#needRender) return;
    this.#needRender = false;
    const gl = this.#gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    for (const layer of get(this.#layers)) {
      for (const fx of layer) {
        gl.useProgram(fx.program);
        gl.bindVertexArray(fx.vao);
        fx.applyUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }
    gl.bindVertexArray(null);
  };
  createTexture(sourceElement = null, pixelated = true) {
    const gl = this.#gl;
    const filterMode = pixelated ? gl.NEAREST : gl.LINEAR;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
    if (sourceElement) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceElement);
    }
    return texture;
  }
  updateTexture(texture, sourceElement) {
    const gl = this.#gl;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const currentWidth = sourceElement.width || sourceElement.videoWidth || 0;
    const currentHeight = sourceElement.height || sourceElement.videoHeight || 0;
    if (texture.glWidth !== currentWidth || texture.glHeight !== currentHeight) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceElement);
      texture.glWidth = currentWidth;
      texture.glHeight = currentHeight;
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, sourceElement);
    }
    this.#needRender = true;
  }
  start() {
    if (this.#isRunning) return;
    this.#isRunning = true;
    this.#render();
  }
  stop() {
    this.#isRunning = false;
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
  }
  requestRender() {
    this.#needRender = true;
  }
}
function initGlobalCursor(core2) {
  const cursorShader = `#version 300 es
    precision mediump float;
    out vec4 fragColor;

    uniform sampler2D u_image;
    uniform vec2 u_texSize;  // brush imData size
    uniform int u_mode;      // 0 - Alpha, 1 - Color
    
    in vec2 v_texCoord;

    bool isSameColor(vec4 c1, vec4 c2) {
        const float epsilon = 0.005;
        if (c1.a < 0.1 && c2.a < 0.1) return true;
        if (abs(c1.a - c2.a) > epsilon) return false;
        return all(lessThan(abs(c1.rgb - c2.rgb), vec3(epsilon)));
    }

    vec4 sampleTexture(vec2 uv) {
        vec4 color = texture(u_image, uv);
        
        vec2 insideBottomLeft = step(vec2(0.0), uv);
        vec2 insideTopRight   = step(uv, vec2(1.0));
        float inside = insideBottomLeft.x * insideBottomLeft.y * insideTopRight.x * insideTopRight.y;
        
        return color * inside; 
    }

    void main() {
        vec4 currentQuad = texture(u_image, v_texCoord);
        
        vec2 offset = vec2(0.13) / u_texSize;

        vec4 left        = sampleTexture(v_texCoord + vec2(-offset.x, 0.0));
        vec4 right       = sampleTexture(v_texCoord + vec2(offset.x, 0.0));
        vec4 up          = sampleTexture(v_texCoord + vec2(0.0, -offset.y));
        vec4 down        = sampleTexture(v_texCoord + vec2(0.0, offset.y));
        vec4 lefttop     = sampleTexture(v_texCoord + vec2(-offset.x, -offset.y));
        vec4 righttop    = sampleTexture(v_texCoord + vec2(offset.x, -offset.y));
        vec4 leftbottom  = sampleTexture(v_texCoord + vec2(-offset.x, offset.y));
        vec4 rightbottom = sampleTexture(v_texCoord + vec2(offset.x, offset.y));

        if (currentQuad.a < 0.1 && left.a < 0.1 && right.a < 0.1 && up.a < 0.1 && down.a < 0.1 && 
            lefttop.a < 0.1 && righttop.a < 0.1 && leftbottom.a < 0.1 && rightbottom.a < 0.1) {
            discard; 
        }

        if (u_mode == 0) {
            // MODE 0: ALPHA
            bool isInside = currentQuad.a > 0.1;
            bool hasEmptyNeighbor = left.a < 0.1 || right.a < 0.1 || up.a < 0.1 || down.a < 0.1 || lefttop.a < 0.1 || righttop.a < 0.1 || leftbottom.a < 0.1 || rightbottom.a < 0.1;

            if (isInside && !hasEmptyNeighbor) {
                fragColor = vec4(0.0); 
            } else {
                fragColor = currentQuad;
            }
        } else {
            // MODE 1: COLOR
            bool matchLeft  = isSameColor(currentQuad, left);
            bool matchRight = isSameColor(currentQuad, right);
            bool matchUp    = isSameColor(currentQuad, up);
            bool matchDown  = isSameColor(currentQuad, down);

            if (currentQuad.a > 0.1 && matchLeft && matchRight && matchUp && matchDown) {
                fragColor = vec4(0.0);
            } else {
                fragColor = currentQuad;
            }
        }
    }
    `;
  const brushTex = core2.gl.createTexture();
  const brushRect = [0, 0, 1, 1];
  const canvasSizes = [window.innerWidth, window.innerHeight];
  const fx = core2.gl.addEffect("global-cursor", 2, cursorShader, {
    u_image: brushTex,
    u_texSize: [1, 1],
    u_mode: 0,
    u_rect: brushRect,
    u_resolution: canvasSizes
  });
  if (!fx) return;
  function updateBrushSize() {
    if (!core2.brush.imData || !core2.camera) return;
    brushRect[2] = core2.brush.imData.width * core2.camera.currentZoom;
    brushRect[3] = core2.brush.imData.height * core2.camera.currentZoom;
    fx.params.u_rect = [...brushRect];
  }
  user_effect(() => {
    if (core2.brush.changed) {
      core2.brush.changed = false;
      if (!core2.brush.imData) return;
      core2.gl.updateTexture(brushTex, core2.brush.imData);
      console.log(core2.brush.imData);
      fx.params.u_texSize = [core2.brush.imData.width, core2.brush.imData.height];
      updateBrushSize();
    }
  });
  user_effect(() => {
    fx.params.u_mode = core2.brush.renderMode === 1 ? 1 : 0;
  });
  user_effect(() => {
    if (!core2.camera) return;
    core2.camera.currentZoom;
    updateBrushSize();
  });
  user_effect(() => {
    if (!core2.brush.imData || !core2.camera) return;
    const [screenCenterX, screenCenterY] = boardToScreenSpace(Math.floor(core2.camera.pivotWorldX), Math.floor(core2.camera.pivotWorldY), true);
    const offsetX = (core2.brush.offsetX || 0) * core2.camera.currentZoom;
    const offsetY = (core2.brush.offsetY || 0) * core2.camera.currentZoom;
    brushRect[0] = screenCenterX - offsetX;
    brushRect[1] = screenCenterY - offsetY;
    fx.params.u_rect = [...brushRect];
  });
  window.addEventListener("resize", () => {
    tick().then(() => {
      const { fxCanvas } = core2;
      if (fxCanvas) {
        canvasSizes[0] = fxCanvas.width;
        canvasSizes[1] = fxCanvas.height;
        fx.params.u_resolution = [...canvasSizes];
      }
    });
  });
}
const screenshotIcon$1 = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g clip-path="url(#clip0_38_49)">\n<g clip-path="url(#clip1_38_49)">\n<path d="M12 12V14H10V16H8V14H6V16H4V12H12Z" fill="currentColor"/>\n<path d="M4 4V12H2V10H0V8H2V6H0V4H4Z" fill="currentColor"/>\n<path d="M10 6H6V10H10V6Z" fill="currentColor"/>\n<path d="M12 0V4H4V2H6V0H8V2H10V0H12Z" fill="currentColor"/>\n<path d="M14 8V10H16V12H12V4H14V6H16V8H14Z" fill="currentColor"/>\n</g>\n</g>\n</svg>\n';
class GridTool {
  core = null;
  name = "grid";
  icon = screenshotIcon$1;
  keybind = "KeyG";
  showOnPanel = false;
  isBackground = false;
  #activeStore = persistent("gridActive", false);
  get isActive() {
    return this.#activeStore.v;
  }
  set isActive(value) {
    this.#activeStore.v = value;
    console.log("set isActive", value);
  }
  toggledAt = 0;
  postInit() {
    if (this.isActive) {
      this.updateFx.bind(this);
    }
  }
  onUp(e = null) {
    this.isActive = !this.isActive;
    this.toggledAt = Date.now();
    this.updateFx();
  }
  updateFx() {
    if (this.isActive) {
      this.core.fx.addFx("grid", 1, this.render.bind(this));
    } else {
      this.core.fx.requestRender();
    }
  }
  render(ctx2) {
    console.log("render");
    const camera = this.core.camera;
    if (camera.currentZoom <= 2) {
      return FX_STATE.FINISHED;
    }
    let retCode = FX_STATE.FINISHED;
    const canvasW = ctx2.canvas.clientWidth;
    const canvasH = ctx2.canvas.clientHeight;
    const vlines = Math.ceil(canvasW / camera.currentZoom);
    const hlines = Math.ceil(canvasH / camera.currentZoom);
    let startX = (-camera.x * camera.currentZoom + canvasW / 2) % camera.currentZoom;
    let startY = (-camera.y * camera.currentZoom + canvasH / 2) % camera.currentZoom;
    let targetAlpha = remap(clamp(camera.currentZoom, 3, 20), 3, 20, 0, 0.8);
    let curAlpha = targetAlpha;
    const sinceToggledMs = Date.now() - this.toggledAt;
    if (sinceToggledMs < 300) {
      let mod = clamp(sinceToggledMs / 250, 0, 1);
      curAlpha *= this.isActive ? mod : 1 - mod;
      retCode = FX_STATE.IN_PROCESS;
    } else if (!this.isActive) {
      return FX_STATE.REMOVED;
    }
    ctx2.beginPath();
    ctx2.globalAlpha = curAlpha;
    ctx2.strokeStyle = "gray";
    ctx2.lineWidth = 1;
    let x2 = startX;
    for (let line = 0; line < vlines; line++) {
      x2 += camera.currentZoom;
      const _x = (x2 | 0) + 0.5;
      ctx2.moveTo(_x, 0);
      ctx2.lineTo(_x, window.innerHeight);
    }
    let y2 = startY;
    for (let line = 0; line < hlines; line++) {
      y2 += camera.currentZoom;
      const _y = (y2 | 0) + 0.5;
      ctx2.moveTo(0, _y);
      ctx2.lineTo(window.innerWidth, _y);
    }
    ctx2.stroke();
    return retCode;
  }
}
const grid = new GridTool();
const moveIcon$1 = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g clip-path="url(#clip0_mover)">\n<path d="M7 0V2H4V4H2V7H0V9H2V12H4V14H7V16H9V14H12V12H14V9H16V7H14V4H12V2H9V0H7Z" fill="currentColor"/>\n<path d="M12 4H9V2H7V4H4V7H2V9H4V12H7V14H9V12H12V9H14V7H12V4ZM10 8V10H6V6H10V8Z" fill="#C4C4C4"/>\n</g>\n</svg>\n';
const zoomLevels = [
  1 / 64,
  1 / 32,
  1 / 16,
  1 / 8,
  1 / 4,
  1 / 2,
  1,
  1.25,
  1.5,
  2,
  4,
  6,
  8,
  10,
  12,
  16,
  20,
  25,
  32,
  40,
  50,
  64
];
function getNearestZoomLevel(desiredZoom) {
  let closest = zoomLevels[0];
  let minDiff = Math.abs(desiredZoom - closest);
  for (let z of zoomLevels) {
    const diff = Math.abs(desiredZoom - z);
    if (diff < minDiff) {
      minDiff = diff;
      closest = z;
    }
  }
  return closest;
}
class MoverTool {
  core = null;
  name = "mover";
  icon = moveIcon$1;
  keybind = "LMB";
  showOnPanel = true;
  isBackground = true;
  backgroundToolProps = { nonIntrusiveListeners: ["pointerdrag"] };
  #isActive = state(false);
  get isActive() {
    return get(this.#isActive);
  }
  set isActive(value) {
    set$1(this.#isActive, value, true);
  }
  mousedown = false;
  downPos = [0, 0];
  lastPos = [0, 0];
  downTime = 0;
  onSelected() {
    this.mousedown = false;
    this.isActive = false;
  }
  onDeselected() {
    this.mousedown = false;
    this.isActive = false;
  }
  onDown(e = null, isConsumed) {
    if (isConsumed) return;
    this.mousedown = true;
    this.isActive = true;
    this.downTime = Date.now();
  }
  onUp(e = null, isConsumed) {
    if (isConsumed) return;
    this.mousedown = false;
    this.isActive = false;
  }
  onpointermove(e) {
    this.updateMousePos(e);
  }
  updateMousePos(e) {
    if (!this.core) return;
    const camera = this.core.camera;
    camera.updateMouse(e.clientX, e.clientY);
  }
  onpointerdrag(e, isConsumedMode = false) {
    if (!this.core || !isConsumedMode && !this.mousedown) return;
    const camera = this.core.camera;
    camera.x -= e.dx / camera.currentZoom;
    camera.y -= e.dy / camera.currentZoom;
    this.updateMousePos(e);
  }
  onpointerpinch(e) {
    if (!this.core) return;
    const camera = this.core.camera;
    const canvas2 = this.core.mainCanvas;
    camera.x -= e.dx / camera.currentZoom;
    camera.y -= e.dy / camera.currentZoom;
    const [centerWorldX, centerWorldY] = screenToBoardSpace(e.centerX, e.centerY);
    camera.currentZoom *= e.ds;
    camera.targetZoom = camera.currentZoom;
    camera.x = centerWorldX - (e.centerX - canvas2.clientWidth / 2) / camera.currentZoom;
    camera.y = centerWorldY - (e.centerY - canvas2.clientHeight / 2) / camera.currentZoom;
  }
  onwheel(e) {
    if (!this.core) return;
    const camera = this.core.camera;
    const closestZoom = getNearestZoomLevel(camera.targetZoom);
    const closestZoomIdx = zoomLevels.indexOf(closestZoom);
    const scrollingUp = e.deltaY < 0;
    const newZoomLevelIdx = clamp(closestZoomIdx + (scrollingUp ? 1 : -1), 0, zoomLevels.length - 1);
    this.updateMousePos(e);
    camera.targetZoom = zoomLevels[newZoomLevelIdx];
  }
  isLongTap() {
    return Date.now() - this.downTime > 600;
  }
}
const mover = new MoverTool();
class ScreenshotTool {
  core = null;
  name = "screenshot";
  icon = screenshotIcon$1;
  keybind = "KeyS";
  showOnPanel = false;
  isBackground = false;
  #isSelecting = state(false);
  get isSelecting() {
    return get(this.#isSelecting);
  }
  set isSelecting(value) {
    set$1(this.#isSelecting, value, true);
  }
  #boundsData = state(proxy([-1, -1, -1, -1]));
  bounds = null;
  cachedStrokeColor = "cyan";
  constructor() {
    this.bounds = new Proxy(this.#boundsData.v, {
      get(target, prop2) {
        return target[prop2];
      },
      set: (target, prop2, value) => {
        if (!isNaN(Number(prop2))) {
          let num = Number(value) || 0;
          if (this.core?.config) {
            const isX = prop2 === "0" || prop2 === "2";
            const max = isX ? this.core.config.boardWidth : this.core.config.boardHeight;
            num = Math.max(0, Math.min(num, max));
          }
          target[prop2] = num;
          this.core?.fx.requestRender();
          return true;
        }
        target[prop2] = value;
        return true;
      }
    });
  }
  updateBound(index2, value) {
    this.bounds[index2] = Number(value) || 0;
    this.core.fx.requestRender();
  }
  expandBoundsFullCanvas() {
    this.bounds[0] = 0;
    this.bounds[1] = 0;
    this.bounds[2] = this.core.config.boardWidth;
    this.bounds[3] = this.core.config.boardHeight;
    this.core.fx.requestRender();
  }
  expandBoundsFullScreen() {
    [this.bounds[0], this.bounds[1]] = screenToBoardSpace(0, 0, true);
    [this.bounds[2], this.bounds[3]] = screenToBoardSpace(window.innerWidth, window.innerHeight, true);
    this.core.fx.requestRender();
  }
  onSelected() {
    this.bounds.fill(-1);
    this.isSelecting = false;
    const color = getComputedStyle(document.documentElement).getPropertyValue("--bg-light").trim();
    this.cachedStrokeColor = color || "cyan";
    this.core.fx.addFx("screenshot", 0, this.renderFx.bind(this));
  }
  onDeselected() {
    console.log("removing fs");
    this.core.fx.removeFx("screenshot");
  }
  startSelection() {
    this.isSelecting = true;
    this.bounds.fill(-1);
    this.core.fx.requestRender();
  }
  onDown(e) {
    if (!this.isSelecting) return false;
    const [worldX, worldY] = screenToBoardSpace(e.clientX, e.clientY, true);
    this.bounds[0] = worldX;
    this.bounds[1] = worldY;
    this.bounds[2] = worldX;
    this.bounds[3] = worldY;
    return true;
  }
  onpointerdrag(e) {
    if (!this.isSelecting || this.bounds[0] === -1) return false;
    const [worldX, worldY] = screenToBoardSpace(e.clientX, e.clientY, true);
    this.bounds[2] = worldX;
    this.bounds[3] = worldY;
    if (this.bounds[2] > this.bounds[0]) this.bounds[2] += 1;
    if (this.bounds[3] > this.bounds[1]) this.bounds[3] += 1;
    this.core.fx.requestRender();
    return true;
  }
  onUp(e) {
    if (!this.isSelecting) return false;
    this.isSelecting = false;
    return true;
  }
  renderFx(ctx2) {
    ctx2.globalAlpha = 1;
    ctx2.fillStyle = "#000000cc";
    ctx2.fillRect(0, 0, ctx2.canvas.clientWidth, ctx2.canvas.clientHeight);
    if (this.bounds[0] === -1) return FX_STATE.FINISHED;
    this.core.camera.currentZoom;
    const [startX, startY] = boardToScreenSpace(this.bounds[0], this.bounds[1], true);
    const [endX, endY] = boardToScreenSpace(this.bounds[2], this.bounds[3], true);
    ctx2.clearRect(startX, startY, endX - startX, endY - startY);
    ctx2.strokeStyle = this.cachedStrokeColor;
    ctx2.lineWidth = 2;
    ctx2.setLineDash([8, 4]);
    ctx2.strokeRect(startX, startY, endX - startX, endY - startY);
    ctx2.setLineDash([]);
    return FX_STATE.FINISHED;
  }
  doScreenshot() {
    const minX = Math.min(this.bounds[0], this.bounds[2]);
    const minY = Math.min(this.bounds[1], this.bounds[3]);
    const maxX = Math.max(this.bounds[0], this.bounds[2]);
    const maxY = Math.max(this.bounds[1], this.bounds[3]);
    const destCanvas = document.createElement("canvas");
    destCanvas.width = maxX - minX;
    destCanvas.height = maxY - minY;
    const ctx2 = destCanvas.getContext("2d");
    const chunkSize = this.core.config.chunkSize;
    const minChunkX = minX / chunkSize | 0;
    const minChunkY = minY / chunkSize | 0;
    const maxChunkX = maxX / chunkSize | 0;
    const maxChunkY = maxY / chunkSize | 0;
    for (let cx = minChunkX; cx < maxChunkX + 1; cx++) {
      for (let cy = minChunkY; cy < maxChunkY + 1; cy++) {
        const chunk = this.core.chunkManager.getChunk(cx, cy);
        if (chunk === null || chunk.imgData === null) continue;
        const offsetX = cx * chunkSize - minX;
        const offsetY = cy * chunkSize - minY;
        ctx2.drawImage(chunk.canvas, offsetX, offsetY);
      }
    }
    let href = destCanvas.toDataURL();
    const link = document.createElement("a");
    link.download = `GX ${this.core.config.canvasName} ${getPathsafeDate()}.png`;
    link.href = href;
    link.click();
    link.remove();
  }
}
const screenshot = new ScreenshotTool();
const moveIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g clip-path="url(#clip0_clicker)">\n<path d="M12 2V4H10V6H8V8H6V10H4V12H2V14H0V16H2V14H4V12H6V10H8V8H10V6H12V4H14V2H16V0H14V2H12Z" fill="currentColor"/>\n</g>\n</svg>\n';
const circleCache = /* @__PURE__ */ new Map();
const shapes = {
  // uglified for speed
  line: function(x2, y2, x22, y22) {
    let pointArr = [];
    let steep = Math.abs(y22 - y2) > Math.abs(x22 - x2);
    if (steep) {
      let tmp;
      tmp = x2;
      x2 = y2;
      y2 = tmp;
      tmp = x22;
      x22 = y22;
      y22 = tmp;
    }
    let reverseFlag = false;
    if (x2 > x22) {
      let tmp;
      tmp = x2;
      x2 = x22;
      x22 = tmp;
      tmp = y2;
      y2 = y22;
      y22 = tmp;
      reverseFlag = true;
    }
    let dx = x22 - x2;
    let dy = Math.abs(y22 - y2);
    let err = dx >> 1;
    let stepY = y2 < y22 ? 1 : -1;
    for (; x2 <= x22; x2++) {
      if (steep) {
        pointArr.push(x2, y2);
      } else {
        pointArr.push(y2, x2);
      }
      err -= dy;
      if (err < 0) {
        y2 += stepY;
        err += dx;
      }
    }
    if (!reverseFlag) {
      let len = pointArr.length;
      for (let i = 0; i < len / 2; i += 2) {
        let j = len - 2 - i;
        let tmpX = pointArr[i];
        let tmpY = pointArr[i + 1];
        pointArr[i] = pointArr[j];
        pointArr[i + 1] = pointArr[j + 1];
        pointArr[j] = tmpX;
        pointArr[j + 1] = tmpY;
      }
    }
    return pointArr;
  },
  filledCircle: function(centerX, centerY, r) {
    if (centerX === 0 && centerY === 0 && circleCache.has(r)) {
      return circleCache.get(r);
    }
    let pixels = [];
    const squareR = r * r;
    for (let _x = -r + centerX; _x < r + centerX; _x++) {
      for (let _y = -r + centerY; _y < r + centerY; _y++) {
        if (isIn(_x, _y)) {
          pixels.push(_x, _y);
        }
      }
    }
    function isIn(_x, _y) {
      let dx = _x - centerX, dy = _y - centerY;
      if (dx * dx + dy * dy <= squareR * 0.8)
        return true;
      return false;
    }
    circleCache.set(r, pixels);
    return pixels;
  },
  square(x1, y1, x2, y2) {
    const minX = Math.min(x1, x2), minY = Math.min(y1, y2), maxX = Math.max(x1, x2), maxY = Math.max(y1, y2);
    let pixels = [];
    for (let y3 = minY; y3 < maxY + 1; y3++) {
      for (let x3 = minX; x3 < maxX + 1; x3++) {
        pixels.push(x3, y3);
      }
    }
    return pixels;
  },
  // NOTE: supports only 16bit coordinates
  advancedLine(x1, y1, x2, y2, shape) {
    const pixels = /* @__PURE__ */ new Set();
    const linePixels = this.line(x1, y1, x2, y2);
    const brushPixels = shape;
    const lineLen = linePixels.length;
    const brushLen = brushPixels.length;
    for (let i = 0; i < lineLen; i += 2) {
      const ox = linePixels[i];
      const oy = linePixels[i + 1];
      for (let j = 0; j < brushLen; j += 2) {
        const px = ox + brushPixels[j];
        const py = oy + brushPixels[j + 1];
        pixels.add(encodeCoord(px, py));
      }
    }
    const size = pixels.size;
    const result = new Int32Array(size * 2);
    let idx = 0;
    for (const encoded of pixels) {
      const decoded = decodeCoord(encoded);
      const y3 = decoded[0];
      const x3 = decoded[1];
      result[idx++] = x3;
      result[idx++] = y3;
    }
    return result;
  }
};
const fixedBrushes = {
  1: [0, 0],
  2: [0, 0, 1, 0, 0, 1, 1, 1],
  3: [-1, -1, 0, -1, 1, -1, -1, 0, 0, 0, 1, 0, -1, 1, 0, 1, 1, 1]
};
class BrushTool {
  core = null;
  name = "clicker";
  icon = moveIcon;
  keybind = "Space";
  showOnPanel = true;
  isBackground = false;
  #isActive = state(false);
  get isActive() {
    return get(this.#isActive);
  }
  set isActive(value) {
    set$1(this.#isActive, value, true);
  }
  mousedown = false;
  downPos = [0, 0];
  lastPos = [0, 0];
  downTime = 0;
  lastImData = null;
  brushShape = null;
  lastOffset = [0, 0];
  init() {
    user_effect(() => {
      if (!this.core?.camera) return;
      player.brushSize?.v;
      player.primaryCol?.v;
      player.seconaryCol?.v;
      this.preRenderBrush();
    });
    user_effect(() => {
      const tm = this.core?.toolManager;
      if (!tm) return;
      tm.currentTool;
      this.updateCoreBrush();
    });
  }
  postInit() {
  }
  destroy() {
  }
  updateCoreBrush() {
    if (["mover", "clicker"].some((allowedTool) => this.core.toolManager.currentTool.name === allowedTool)) {
      this.core.brush.imData = this.lastImData;
      if (this.imData) {
        this.core.brush.offsetX = Math.floor(this.lastImData.width / 2 - 0.5);
        this.core.brush.offsetY = Math.floor(this.lastImData.height / 2 - 0.5);
      }
      if (this.lastOffset) {
        this.core.brush.offsetX = this.lastOffset[0];
        this.core.brush.offsetY = this.lastOffset[1];
      }
      this.core.brush.changed = true;
    }
  }
  onSelected() {
    this.mousedown = false;
    this.isActive = false;
  }
  onDeselected() {
    this.mousedown = false;
    this.isActive = false;
  }
  // e may be null if the tool is used by keybinds
  onDown(e = null) {
    this.isActive = true;
    this.downTime = Date.now();
    if (e) {
      this.lastPos = screenToBoardSpace(e.clientX, e.clientY, true);
    } else {
      this.lastPos = [
        this.core.camera.pivotWorldX | 0,
        this.core.camera.pivotWorldY | 0
      ];
    }
    this.drawTick(e);
    return true;
  }
  onUp(e = null) {
    this.isActive = false;
    this.lastPos = null;
    return true;
  }
  onMove(e) {
    if (!this.isActive) return;
    this.drawTick(e);
  }
  onpointermove(e) {
    this.onMove(e);
  }
  onpointerdrag(e) {
    this.onMove(e);
    return true;
  }
  drawTick(e) {
    let pos;
    if (e) {
      pos = screenToBoardSpace(e.clientX, e.clientY, true);
    } else {
      pos = [
        this.core.camera.pivotWorldX | 0,
        this.core.camera.pivotWorldY | 0
      ];
    }
    const lastPos = this.lastPos || pos;
    this.lastPos = pos;
    const pixels = shapes.advancedLine(lastPos[0], lastPos[1], pos[0], pos[1], this.brushShape);
    const pixelsCount = pixels.length / 2;
    const pixelsWithColors = new Array(pixelsCount * 3).fill(0);
    for (let i = 0, j = 0; i < pixelsWithColors.length; i += 3, j += 2) {
      const x2 = pixels[j];
      const y2 = pixels[j + 1];
      const c = player.getColorByCoord(x2, y2);
      pixelsWithColors[i] = x2;
      pixelsWithColors[i + 1] = y2;
      pixelsWithColors[i + 2] = c;
    }
    this.core.chunkManager.setPixels(pixelsWithColors);
  }
  isLongTap() {
    return Date.now() - this.downTime > 600;
  }
  render(ctx2) {
  }
  preRenderBrush() {
    console.log("prerender");
    const size = player.brushSize?.v ?? 1;
    const oldImData = this.core.brush.imData;
    let imData = oldImData;
    if (oldImData?.width !== size || oldImData?.height !== size) {
      imData = new ImageData(size, size);
    }
    const data = imData.data;
    const u32view = new Uint32Array(data.buffer);
    const palette = this.core.config.colorsBGR;
    const generationalSize = size % 2 === 0 ? size - 1 : size;
    const circle = fixedBrushes[size] || shapes.filledCircle(0, 0, Math.floor(generationalSize / 2 + 1));
    const offset = Math.floor(size / 2 - 0.5);
    for (let i = 0; i < circle.length; i += 2) {
      const x2 = circle[i] + offset;
      const y2 = circle[i + 1] + offset;
      const idx = y2 * size + x2;
      const color = palette[player.getColorByCoord(x2, y2)];
      u32view[idx] = color;
      if (x2 < 0 || y2 < 0 || x2 >= size || y2 >= size) {
        console.warn("Brush generator produced out of bounds pixel:", x2, y2, { offset, size });
      }
    }
    this.lastImData = imData;
    this.lastOffset = [offset, offset];
    this.brushShape = circle;
    this.updateCoreBrush();
  }
}
const brush = new BrushTool();
const tools = {
  mover,
  grid,
  screenshot,
  brush
};
const defaultTool = mover;
function createToolManager() {
  const core2 = useGameCore$1();
  let currentTool = state(proxy(defaultTool));
  function selectTool(tool) {
    get(currentTool).onDeselected?.();
    console.log(`currentTool=`, tool);
    set$1(currentTool, tool, true);
    tool.onSelected?.();
  }
  function onInputEvent(eventName, e) {
    if (anyInputFocused()) return;
    const activeTool = get(currentTool);
    if (!activeTool) return;
    let isConsumed = false;
    if (eventName === "pointerdown") {
      isConsumed = activeTool.onDown?.(e) ?? false;
    } else if (eventName === "pointerup") {
      isConsumed = activeTool.onUp?.(e) ?? false;
    } else {
      isConsumed = activeTool[`on${eventName}`]?.(e) ?? false;
    }
    if (activeTool.isBackground) {
      for (const tool of Object.values(tools)) {
        if (tool.name === activeTool.name) continue;
        const isKeydown = eventName === "keydown";
        const isKeyup = eventName === "keyup";
        if (isKeydown || isKeyup) {
          const eventString = stringifyEvent(e);
          if (!tool.keybind || !compareEventsStrings(tool.keybind, eventString, isKeydown)) {
            continue;
          }
          if (eventName === "keydown") tool.onDown?.();
          else tool.onUp?.();
        } else {
          tool[`on${eventName}`]?.(e);
        }
      }
    } else {
      for (const tool of Object.values(tools)) {
        if (tool.isBackground) {
          if (!isConsumed) {
            if (eventName === "pointerdown") tool.onDown?.(e);
            else if (eventName === "pointerup") tool.onUp?.(e);
            else tool[`on${eventName}`]?.(e);
          } else if (tool?.backgroundToolProps?.nonIntrusiveListeners?.includes(eventName)) ;
        }
      }
    }
  }
  const trackedEvents = [
    "pointerdown",
    "pointermove",
    "pointerup",
    "wheel",
    "pointerdrag",
    "pointerpinch",
    "keydown",
    "keyup"
  ];
  trackedEvents.forEach((evName) => {
    emitter.on(evName, (e) => onInputEvent(evName, e));
  });
  for (const tool of Object.values(tools)) {
    tool.core = core2;
    tool.init?.();
  }
  tick().then(() => {
    Object.values(tools).forEach((tool) => tool.postInit?.());
  });
  function anyInputFocused() {
    return document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA";
  }
  function getEventKeyCode(ev) {
    let code;
    if (ev instanceof PointerEvent || ev instanceof MouseEvent) {
      const buttonNames = ["LMB", "MMB", "RMB", "4MB", "5MB"];
      code = buttonNames[ev.button];
    } else {
      code = ev.code;
    }
    return code;
  }
  function stringifyEvent(e) {
    let code = getEventKeyCode(e);
    let mods = "";
    if (e.ctrlKey) {
      mods += "CTRL+";
    }
    if (e.altKey) {
      mods += "ALT+";
    }
    return mods + code;
  }
  function compareEventsStrings(str1, str2, strict = true) {
    if (strict) return str1 === str2;
    const ev1 = parseEvent(str1);
    const ev2 = parseEvent(str2);
    return ev1.code === ev2.code;
  }
  function parseEvent(evStr) {
    const event2 = { alt: false, ctrl: false, code: null };
    evStr.split("+").forEach((param) => {
      if (param === "CTRL") {
        event2.ctrl = true;
      } else if (param === "ALT") {
        event2.alt = true;
      } else {
        event2.code = param;
      }
    });
    return event2;
  }
  function* getActiveTools() {
    for (const tool of Object.values(tools)) {
      if (tool.isActive) yield tool;
    }
  }
  function* getRenderingQueue() {
    for (const tool of Object.values(tools)) {
      if (tool.needRender) yield tool;
    }
  }
  return {
    tools,
    get currentTool() {
      return get(currentTool);
    },
    getActiveTools,
    getRenderingQueue,
    selectTool
  };
}
var root_2$7 = from_html(`<div class="topShadow svelte-1eftye3"></div>`);
var root_3$4 = from_html(`<div class="leftShadow svelte-1eftye3"></div>`);
var root_4$2 = from_html(`<div class="rightShadow svelte-1eftye3"></div>`);
var root_5$1 = from_html(`<div class="bottomShadow svelte-1eftye3"></div>`);
var root_1$i = from_html(`<!> <!> <!> <!>`, 1);
var root$j = from_html(`<div class="shadowContainer svelte-1eftye3"><!> <!></div>`);
function TiltShadow($$anchor, $$props) {
  push($$props, true);
  let sides = prop($$props, "sides", 27, () => proxy([])), radius = prop($$props, "radius", 3, "10px"), topColor = prop($$props, "topColor", 7, "var(--bg-light)"), bottomColor = prop($$props, "bottomColor", 7, "var(--bg-mid-dark)"), leftColor = prop($$props, "leftColor", 3, "var(--bg-mid-dark)"), rightColor = prop($$props, "rightColor", 3, "var(--bg-light)"), magnetSides = prop($$props, "magnetSides", 19, () => []), disable = prop($$props, "disable", 3, false), distance = prop($$props, "distance", 3, "2px"), style = prop($$props, "style", 3, "");
  user_effect(() => {
    if (sides() === "both") {
      untrack(() => {
        (($$value) => {
          var $$array = to_array($$value, 2);
          topColor($$array[0]);
          bottomColor($$array[1]);
        })([bottomColor(), topColor()]);
      });
    }
  });
  const isTopMagnet = user_derived(() => magnetSides().includes("top"));
  const isRightMagnet = user_derived(() => magnetSides().includes("right"));
  const isBottomMagnet = user_derived(() => magnetSides().includes("bottom"));
  const isLeftMagnet = user_derived(() => magnetSides().includes("left"));
  var div = root$j();
  let styles;
  var node = child(div);
  {
    var consequent_4 = ($$anchor2) => {
      var fragment = root_1$i();
      var node_1 = first_child(fragment);
      {
        var consequent = ($$anchor3) => {
          var div_1 = root_2$7();
          template_effect(() => set_style(div_1, `--top-color: ${topColor() ?? ""}`));
          append($$anchor3, div_1);
        };
        var d = user_derived(() => sides().includes("top"));
        if_block(node_1, ($$render) => {
          if (get(d)) $$render(consequent);
        });
      }
      var node_2 = sibling(node_1, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var div_2 = root_3$4();
          template_effect(() => set_style(div_2, `--left-color: ${leftColor() ?? ""}`));
          append($$anchor3, div_2);
        };
        var d_1 = user_derived(() => sides().includes("left"));
        if_block(node_2, ($$render) => {
          if (get(d_1)) $$render(consequent_1);
        });
      }
      var node_3 = sibling(node_2, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var div_3 = root_4$2();
          template_effect(() => set_style(div_3, `--right-color: ${rightColor() ?? ""}`));
          append($$anchor3, div_3);
        };
        var d_2 = user_derived(() => sides().includes("right"));
        if_block(node_3, ($$render) => {
          if (get(d_2)) $$render(consequent_2);
        });
      }
      var node_4 = sibling(node_3, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var div_4 = root_5$1();
          template_effect(() => set_style(div_4, `--bottom-color: ${bottomColor() ?? ""}`));
          append($$anchor3, div_4);
        };
        var d_3 = user_derived(() => sides().includes("bottom"));
        if_block(node_4, ($$render) => {
          if (get(d_3)) $$render(consequent_3);
        });
      }
      append($$anchor2, fragment);
    };
    if_block(node, ($$render) => {
      if (!disable()) $$render(consequent_4);
    });
  }
  var node_5 = sibling(node, 2);
  snippet(node_5, () => $$props.children);
  reset(div);
  template_effect(($0) => styles = set_style(div, style(), styles, $0), [
    () => ({
      "--topleft-radius": get(isLeftMagnet) || get(isTopMagnet) ? 0 : radius(),
      "--topright-radius": get(isRightMagnet) || get(isTopMagnet) ? 0 : radius(),
      "--bottomleft-radius": get(isLeftMagnet) || get(isBottomMagnet) ? 0 : radius(),
      "--bottomright-radius": get(isRightMagnet) || get(isBottomMagnet) ? 0 : radius(),
      "--left-padding": sides().includes("left") ? "4px" : "0px",
      "--distance": distance()
    })
  ]);
  append($$anchor, div);
  pop();
}
var root_2$6 = from_html(`<span class="btn-icon svelte-g9c1iq"></span>`);
var root_3$3 = from_html(`<span class="btn-text svelte-g9c1iq"><!></span>`);
var root_1$h = from_html(`<button><div class="btn-content svelte-g9c1iq"><!> <!></div></button>`);
function Button($$anchor, $$props) {
  push($$props, true);
  const icon2 = prop($$props, "icon", 3, null), isActive = prop($$props, "isActive", 11, false), theme = prop($$props, "theme", 3, "dark"), fullWidth = prop($$props, "fullWidth", 3, false), bg = prop($$props, "bg", 3, null), color = prop($$props, "color", 3, null), topShadowColor = prop($$props, "topShadowColor", 3, null), bottomShadowColor = prop($$props, "bottomShadowColor", 3, null), style = prop($$props, "style", 3, ""), iconStyle = prop($$props, "iconStyle", 3, ""), rest = rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "children",
    "icon",
    "isActive",
    "theme",
    "fullWidth",
    "bg",
    "color",
    "topShadowColor",
    "bottomShadowColor",
    "style",
    "iconStyle"
  ]);
  let isLight = user_derived(() => theme() === "light");
  let sides = user_derived(() => get(isLight) ? isActive() ? [] : ["bottom"] : isActive() ? ["bottom"] : ["top"]);
  let topColor = user_derived(() => topShadowColor() ?? (get(isLight) ? "transparent" : isActive() ? "var(--bg-verydark)" : "var(--bg-light)"));
  let bottomColor = user_derived(() => bottomShadowColor() ?? (get(isLight) ? "var(--bg-dark)" : isActive() ? "var(--bg-light)" : "var(--bg-verydark)"));
  let buttonStyle = user_derived(() => [
    fullWidth() ? "width: 100%" : "",
    bg() ? `background: ${bg()}` : "",
    color() ? `color: ${color()}` : "",
    style()
  ].filter(Boolean).join(";"));
  {
    let $0 = user_derived(() => fullWidth() ? "width: 100%" : "");
    TiltShadow($$anchor, {
      get sides() {
        return get(sides);
      },
      get topColor() {
        return get(topColor);
      },
      get bottomColor() {
        return get(bottomColor);
      },
      get style() {
        return get($0);
      },
      radius: "10px",
      children: ($$anchor2, $$slotProps) => {
        var button = root_1$h();
        attribute_effect(
          button,
          () => ({
            class: `btn ${isActive() ? "active" : ""} ${theme() ?? ""}`,
            style: get(buttonStyle),
            ...rest
          }),
          void 0,
          void 0,
          void 0,
          "svelte-g9c1iq"
        );
        var div = child(button);
        var node = child(div);
        {
          var consequent = ($$anchor3) => {
            var span = root_2$6();
            html(span, icon2, true);
            reset(span);
            template_effect(() => set_style(span, iconStyle()));
            append($$anchor3, span);
          };
          if_block(node, ($$render) => {
            if (icon2() !== null) $$render(consequent);
          });
        }
        var node_1 = sibling(node, 2);
        {
          var consequent_1 = ($$anchor3) => {
            var span_1 = root_3$3();
            var node_2 = child(span_1);
            snippet(node_2, () => $$props.children);
            reset(span_1);
            append($$anchor3, span_1);
          };
          if_block(node_1, ($$render) => {
            if ($$props.children) $$render(consequent_1);
          });
        }
        reset(div);
        reset(button);
        append($$anchor2, button);
      },
      $$slots: { default: true }
    });
  }
  pop();
}
var root_1$g = from_html(`<div class="header svelte-d13yz0"><!></div>`);
var root_3$2 = from_html(`<div class="scrollbarParent svelte-d13yz0"><div class="panelBody svelte-d13yz0"><div class="svelte-d13yz0"><!></div></div></div>`);
var root_4$1 = from_html(`<div class="footer"><!></div>`);
var root$i = from_html(`<div class="panelContainer svelte-d13yz0"><!> <!> <!></div>`);
function Panel($$anchor, $$props) {
  push($$props, true);
  let magnetSides = prop($$props, "magnetSides", 19, () => []), padding = prop($$props, "padding", 3, "20px"), innerPadding = prop($$props, "innerPadding", 3, "4px"), innerBodyPadding = prop($$props, "innerBodyPadding", 3, "4px"), radius = prop($$props, "radius", 3, "20px"), width = prop($$props, "width", 3, "auto"), height = prop($$props, "height", 3, "auto"), maxHeight = prop($$props, "maxHeight", 3, "auto"), noBody = prop($$props, "noBody", 3, false), panelBodyRef = prop($$props, "panelBodyRef", 15);
  const isTopMagnet = user_derived(() => magnetSides().includes("top"));
  const isRightMagnet = user_derived(() => magnetSides().includes("right"));
  const isBottomMagnet = user_derived(() => magnetSides().includes("bottom"));
  const isLeftMagnet = user_derived(() => magnetSides().includes("left"));
  const needScroll = user_derived(() => maxHeight() !== "auto" || height() !== "auto");
  var div = root$i();
  let styles;
  var node = child(div);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1$g();
      var node_1 = child(div_1);
      snippet(node_1, () => $$props.header);
      reset(div_1);
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if ($$props.header) $$render(consequent);
    });
  }
  var node_2 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      TiltShadow($$anchor2, {
        sides: ["top"],
        topColor: "var(--bg-mid-dark)",
        radius: "5px",
        get distance() {
          return $$props.shadowDistance;
        },
        style: "width: 100%",
        children: ($$anchor3, $$slotProps) => {
          var div_2 = root_3$2();
          var div_3 = child(div_2);
          var div_4 = child(div_3);
          var node_3 = child(div_4);
          snippet(node_3, () => $$props.children);
          reset(div_4);
          reset(div_3);
          bind_this(div_3, ($$value) => panelBodyRef($$value), () => panelBodyRef());
          reset(div_2);
          append($$anchor3, div_2);
        },
        $$slots: { default: true }
      });
    };
    if_block(node_2, ($$render) => {
      if ($$props.children && !noBody()) $$render(consequent_1);
    });
  }
  var node_4 = sibling(node_2, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var div_5 = root_4$1();
      var node_5 = child(div_5);
      snippet(node_5, () => $$props.footer);
      reset(div_5);
      append($$anchor2, div_5);
    };
    if_block(node_4, ($$render) => {
      if ($$props.footer) $$render(consequent_2);
    });
  }
  reset(div);
  template_effect(() => styles = set_style(div, "", styles, {
    "--topleft-radius": get(isLeftMagnet) || get(isTopMagnet) ? 0 : radius(),
    "--topright-radius": get(isRightMagnet) || get(isTopMagnet) ? 0 : radius(),
    "--bottomleft-radius": get(isLeftMagnet) || get(isBottomMagnet) ? 0 : radius(),
    "--bottomright-radius": get(isRightMagnet) || get(isBottomMagnet) ? 0 : radius(),
    "--panel-padding": padding(),
    "--inner-padding": innerPadding(),
    "--inner-body-padding": innerBodyPadding(),
    "--width": width(),
    "--height": height(),
    "--max-height": maxHeight(),
    "--shadow-distance": $$props.shadowDistance,
    "--scroll": get(needScroll) ? "auto" : "unset"
  }));
  append($$anchor, div);
  pop();
}
var root_2$5 = from_html(`<div class="toolsPanel svelte-l9pqtt"><!></div>`);
var root$h = from_html(`<div class="toolsContainer svelte-l9pqtt"><!></div>`);
function ToolsPanel($$anchor, $$props) {
  push($$props, true);
  function select(tool) {
    $$props.toolManager?.selectTool(tool);
  }
  var div = root$h();
  var node = child(div);
  TiltShadow(node, {
    sides: ["top", "bottom"],
    magnetSides: ["left"],
    radius: "10px",
    distance: "4px",
    children: ($$anchor2, $$slotProps) => {
      Panel($$anchor2, {
        magnetSides: ["left"],
        padding: "9px 5px 5px 5px",
        radius: "7px",
        shadowDistance: "4px",
        children: ($$anchor3, $$slotProps2) => {
          var div_1 = root_2$5();
          var node_1 = child(div_1);
          {
            var consequent_1 = ($$anchor4) => {
              var fragment_1 = comment();
              var node_2 = first_child(fragment_1);
              each(node_2, 17, () => Object.values($$props.toolManager.tools), index, ($$anchor5, tool) => {
                var fragment_2 = comment();
                var node_3 = first_child(fragment_2);
                {
                  var consequent = ($$anchor6) => {
                    {
                      let $0 = user_derived(() => $$props.toolManager.currentTool === get(tool));
                      Button($$anchor6, {
                        get icon() {
                          return get(tool).icon;
                        },
                        onclick: () => select(get(tool)),
                        get isActive() {
                          return get($0);
                        }
                      });
                    }
                  };
                  if_block(node_3, ($$render) => {
                    if (get(tool).showOnPanel !== false) $$render(consequent);
                  });
                }
                append($$anchor5, fragment_2);
              });
              append($$anchor4, fragment_1);
            };
            if_block(node_1, ($$render) => {
              if ($$props.toolManager) $$render(consequent_1);
            });
          }
          reset(div_1);
          append($$anchor3, div_1);
        },
        $$slots: { default: true }
      });
    },
    $$slots: { default: true }
  });
  reset(div);
  append($$anchor, div);
  pop();
}
var root$g = from_html(`<div class="logo svelte-3bcpqf">GOROXELS <span class="logoEmoji svelte-3bcpqf">☀️</span></div>`);
function Logo($$anchor) {
  var div = root$g();
  append($$anchor, div);
}
const emojiIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<circle cx="8" cy="8" r="7" fill="currentColor"/>\n<path d="M5 6V7H6V6H5Z" fill="currentColor"/>\n<path d="M10 6V7H11V6H10Z" fill="currentColor"/>\n<path d="M5 9V10H6V11H10V10H11V9H10V10H6V9H5Z" fill="currentColor"/>\n</svg>\n';
const logOutIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M4 2H8V4H6V12H8V14H4V2Z" fill="currentColor"/>\n<path d="M10 7H13V9H10V11H14V5H10V7Z" fill="currentColor"/>\n</svg>\n';
const ltIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M8 2H10V3H8ZM7 3H9V4H7ZM6 4H8V5H6ZM5 5H7V6H5ZM4 6H6V7H4ZM3 7H5V8H3ZM3 8H5V9H3ZM4 9H6V10H4ZM5 10H7V11H5ZM6 11H8V12H6ZM7 12H9V13H7ZM8 13H10V14H8Z" fill="currentColor"/>\n</svg>\n';
var root$f = from_html(`<div><!>  <div style=""><!></div></div>`);
function DrawerPanel($$anchor, $$props) {
  push($$props, true);
  let side = prop($$props, "side", 3, "left"), magnetSides = prop($$props, "magnetSides", 19, () => ["left"]), panelProps = prop($$props, "panelProps", 19, () => ({})), renderInBody = prop($$props, "renderInBody", 3, false), drawerState = prop($$props, "drawerState", 15, "closed");
  function onTabClick() {
    drawerState(drawerState() === "closed" ? "open" : "closed");
    console.log(drawerState());
  }
  const stateClass = user_derived(() => drawerState() === "closed" ? "closed" : "");
  const isBottom = user_derived(() => side() === "bottom");
  const dynamicSideClass = user_derived(() => get(isBottom) ? "bottom" : "left");
  const shadowsPanel = user_derived(() => get(isBottom) ? ["bottom", "top"] : ["left", "top"]);
  const childrenProps = user_derived(() => ({
    footer: renderInBody() ? void 0 : $$props.children,
    children: renderInBody() ? $$props.children : void 0
  }));
  let drawerWidth = state(0);
  let drawerHeight = state(0);
  var div = root$f();
  let styles;
  var node = child(div);
  TiltShadow(node, {
    get sides() {
      return get(shadowsPanel);
    },
    get magnetSides() {
      return magnetSides();
    },
    radius: "10px",
    distance: "4px",
    children: ($$anchor2, $$slotProps) => {
      Panel($$anchor2, spread_props(
        {
          get magnetSides() {
            return magnetSides();
          },
          radius: "10px",
          padding: "10px"
        },
        () => get(childrenProps),
        panelProps
      ));
    },
    $$slots: { default: true }
  });
  var div_1 = sibling(node, 2);
  var node_1 = child(div_1);
  {
    let $0 = user_derived(() => [get(dynamicSideClass)]);
    let $1 = user_derived(() => [get(dynamicSideClass)]);
    TiltShadow(node_1, {
      get sides() {
        return get($0);
      },
      get magnetSides() {
        return get($1);
      },
      radius: "10px",
      distance: "4px",
      children: ($$anchor2, $$slotProps) => {
        {
          const footer = ($$anchor3) => {
            var fragment_2 = comment();
            var node_2 = first_child(fragment_2);
            snippet(node_2, () => $$props.label);
            append($$anchor3, fragment_2);
          };
          let $02 = user_derived(() => [get(dynamicSideClass)]);
          Panel($$anchor2, {
            get magnetSides() {
              return get($02);
            },
            radius: "10px",
            padding: "5px",
            footer,
            $$slots: { footer: true }
          });
        }
      },
      $$slots: { default: true }
    });
  }
  reset(div_1);
  reset(div);
  template_effect(() => {
    set_class(div, 1, `drawer ${get(dynamicSideClass) ?? ""} ${get(stateClass) ?? ""}`, "svelte-m4jjlb");
    styles = set_style(div, "", styles, {
      "--observed-width": `${$$props.containerWidth ?? ""}px`,
      "--observed-height": `${$$props.containerHeight ?? ""}px`,
      "--my-width": `${get(drawerWidth) ?? ""}px`,
      "--my-height": `${get(drawerHeight) ?? ""}px`
    });
    set_class(div_1, 1, `drawerTabContainer ${get(dynamicSideClass) ?? ""}`, "svelte-m4jjlb");
  });
  delegated("click", div_1, onTabClick);
  bind_element_size(div, "clientWidth", ($$value) => set$1(drawerWidth, $$value));
  bind_element_size(div, "clientHeight", ($$value) => set$1(drawerHeight, $$value));
  append($$anchor, div);
  pop();
}
delegate(["click"]);
var root$e = from_html(`<div class="inputContainer svelte-1wwkhju"><input/> <div class="childrenContainer svelte-1wwkhju"><!></div></div>`);
function Input($$anchor, $$props) {
  push($$props, true);
  let inputRef = prop($$props, "inputRef", 15, null), draggable = prop($$props, "draggable", 3, false), type = prop($$props, "type", 3, "text"), placeholderColor = prop($$props, "placeholderColor", 3, "var(--bg-light)"), bindValue = prop($$props, "bindValue", 15, void 0), props = rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "inputRef",
    "draggable",
    "type",
    "children",
    "placeholderColor",
    "bindValue"
  ]);
  if (type() === "number" && bindValue() === void 0) {
    bindValue(0);
  }
  const dragStartDelayMs = 500;
  const dragStartMaxJitter = 5;
  const moveFactor = 2;
  user_effect(() => {
    if (type() === "number" && draggable()) {
      makeInputDraggable();
    }
    return () => {
    };
  });
  function makeInputDraggable() {
    let downTime = null;
    let downPos = { x: -1, y: -1 };
    let initialValue = null;
    let startedDrag = false;
    const onmousedown = (e) => {
      downTime = Date.now();
      downPos.x = e.clientX;
      downPos.y = e.clientY;
      document.addEventListener("pointermove", onmousemove);
      document.addEventListener("pointerup", onmouseup);
      document.addEventListener("pointercancel", onmouseup);
    };
    const onmousemove = (e) => {
      if (!downTime || Date.now() - downTime < dragStartDelayMs) return;
      e.preventDefault();
      if (!startedDrag) {
        const dx2 = Math.abs(e.clientX - downPos.x);
        const dy = Math.abs(e.clientY - downPos.y);
        if (Math.max(dx2, dy) > dragStartMaxJitter) {
          cleanupDrag();
          return;
        }
        startedDrag = true;
        document.body.style.cursor = "move";
        initialValue = Number(bindValue()) || 0;
        if (isNaN(initialValue)) initialValue = null;
      }
      if (initialValue === null) return;
      const dx = e.clientX - downPos.x;
      const newValue = Math.floor(initialValue + dx / moveFactor);
      bindValue(newValue);
    };
    const onmouseup = (e) => {
      if (startedDrag) {
        e.preventDefault();
      }
      cleanupDrag();
    };
    function cleanupDrag() {
      startedDrag = false;
      downTime = null;
      initialValue = null;
      downPos.x = -1;
      downPos.y = -1;
      document.body.style.cursor = "auto";
      document.removeEventListener("pointermove", onmousemove);
      document.removeEventListener("pointerup", onmouseup);
      document.removeEventListener("pointercancel", onmouseup);
    }
    inputRef().addEventListener("pointerdown", onmousedown);
    return () => {
      cleanupDrag();
    };
  }
  var div = root$e();
  var input = child(div);
  attribute_effect(
    input,
    () => ({
      type: type(),
      ...props,
      [STYLE]: { "--placeholder-color": placeholderColor() }
    }),
    void 0,
    void 0,
    void 0,
    "svelte-1wwkhju",
    true
  );
  bind_this(input, ($$value) => inputRef($$value), () => inputRef());
  var div_1 = sibling(input, 2);
  var node = child(div_1);
  snippet(node, () => $$props.children);
  reset(div_1);
  reset(div);
  bind_value(input, bindValue);
  append($$anchor, div);
  pop();
}
var root$d = from_html(`<div popover="manual"><!></div>`);
function Popover($$anchor, $$props) {
  push($$props, true);
  let side = prop($$props, "side", 3, "top"), offset = prop($$props, "offset", 3, 8), panelClass = prop($$props, "panelClass", 3, ""), panelStyle = prop($$props, "panelStyle", 3, ""), openDelay = prop($$props, "openDelay", 3, 0), closeDelay = prop($$props, "closeDelay", 3, 200), viewportPadding = prop($$props, "viewportPadding", 3, 8);
  let popoverEl;
  let pos = state(proxy({ top: 0, left: 0 }));
  let openTimer;
  let closeTimer;
  let isOpen = state(false);
  const FALLBACK_ORDER = {
    top: [
      "top",
      "top-right",
      "top-left",
      "right",
      "left",
      "bottom-right",
      "bottom-left",
      "bottom"
    ],
    "top-right": [
      "top-right",
      "top",
      "right",
      "top-left",
      "bottom-right",
      "left",
      "bottom",
      "bottom-left"
    ],
    right: [
      "right",
      "top-right",
      "bottom-right",
      "top",
      "bottom",
      "top-left",
      "bottom-left",
      "left"
    ],
    "bottom-right": [
      "bottom-right",
      "bottom",
      "right",
      "bottom-left",
      "top-right",
      "left",
      "top",
      "top-left"
    ],
    bottom: [
      "bottom",
      "bottom-right",
      "bottom-left",
      "right",
      "left",
      "top-right",
      "top-left",
      "top"
    ],
    "bottom-left": [
      "bottom-left",
      "bottom",
      "left",
      "bottom-right",
      "top-left",
      "right",
      "top",
      "top-right"
    ],
    left: [
      "left",
      "top-left",
      "bottom-left",
      "top",
      "bottom",
      "top-right",
      "bottom-right",
      "right"
    ],
    "top-left": [
      "top-left",
      "top",
      "top-right",
      "left",
      "bottom-left",
      "right",
      "bottom",
      "bottom-right"
    ]
  };
  function coordsFor(candidateSide, rect, pw, ph) {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    switch (candidateSide) {
      case "top":
        return { top: rect.top - offset() - ph, left: cx - pw / 2 };
      case "bottom":
        return { top: rect.bottom + offset(), left: cx - pw / 2 };
      case "left":
        return { top: cy - ph / 2, left: rect.left - offset() - pw };
      case "right":
        return { top: cy - ph / 2, left: rect.right + offset() };
      case "top-left":
        return {
          top: rect.top - offset() - ph,
          left: rect.left - offset() - pw
        };
      case "top-right":
        return { top: rect.top - offset() - ph, left: rect.right + offset() };
      case "bottom-left":
        return { top: rect.bottom + offset(), left: rect.left - offset() - pw };
      case "bottom-right":
        return { top: rect.bottom + offset(), left: rect.right + offset() };
    }
  }
  function fits(coords, pw, ph) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return coords.left >= viewportPadding() && coords.top >= viewportPadding() && coords.left + pw <= vw - viewportPadding() && coords.top + ph <= vh - viewportPadding();
  }
  function bestPosition() {
    const rect = $$props.trigger.getBoundingClientRect();
    const pw = popoverEl.offsetWidth;
    const ph = popoverEl.offsetHeight;
    const order = FALLBACK_ORDER[side()] ?? FALLBACK_ORDER.bottom;
    let chosen = null;
    for (const candidate of order) {
      const coords = coordsFor(candidate, rect, pw, ph);
      if (fits(coords, pw, ph)) {
        chosen = coords;
        break;
      }
    }
    if (!chosen) {
      chosen = coordsFor(side(), rect, pw, ph);
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    chosen.left = Math.min(Math.max(chosen.left, viewportPadding()), vw - pw - viewportPadding());
    chosen.top = Math.min(Math.max(chosen.top, viewportPadding()), vh - ph - viewportPadding());
    return chosen;
  }
  function reposition() {
    if (!get(isOpen) || !$$props.trigger || !popoverEl) return;
    set$1(pos, bestPosition(), true);
  }
  function open() {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    const doOpen = () => {
      if (!$$props.trigger || !popoverEl) return;
      popoverEl.showPopover();
      set$1(isOpen, true);
      set$1(pos, bestPosition(), true);
    };
    if (openDelay() > 0) {
      openTimer = setTimeout(doOpen, openDelay());
    } else {
      doOpen();
    }
  }
  function scheduleClose() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(
      () => {
        popoverEl?.hidePopover();
        set$1(isOpen, false);
      },
      closeDelay()
    );
  }
  function cancelClose() {
    clearTimeout(closeTimer);
  }
  user_effect(() => {
    if (!$$props.trigger) return;
    $$props.trigger.addEventListener("mouseenter", open);
    $$props.trigger.addEventListener("mouseleave", scheduleClose);
    $$props.trigger.addEventListener("focusin", open);
    $$props.trigger.addEventListener("focusout", scheduleClose);
    return () => {
      $$props.trigger.removeEventListener("mouseenter", open);
      $$props.trigger.removeEventListener("mouseleave", scheduleClose);
      $$props.trigger.removeEventListener("focusin", open);
      $$props.trigger.removeEventListener("focusout", scheduleClose);
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  });
  user_effect(() => {
    if (!get(isOpen)) return;
    const onScrollOrResize = () => reposition();
    window.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  });
  var div = root$d();
  var node = child(div);
  snippet(node, () => $$props.children);
  reset(div);
  bind_this(div, ($$value) => popoverEl = $$value, () => popoverEl);
  template_effect(() => {
    set_class(div, 1, `popover-panel ${panelClass() ?? ""}`, "svelte-7825oj");
    set_style(div, `top:${get(pos).top ?? ""}px; left:${get(pos).left ?? ""}px; ${panelStyle() ?? ""}`);
  });
  event("mouseenter", div, cancelClose);
  event("mouseleave", div, scheduleClose);
  append($$anchor, div);
  pop();
}
var root_1$f = from_html(`<div role="button" tabindex="0"> </div>`);
var root$c = from_html(`<div class="tabsBar svelte-1fwbyla"></div> <!>`, 1);
function Tabs($$anchor, $$props) {
  push($$props, true);
  let active = prop($$props, "active", 31, () => proxy($$props.tabs?.[0]?.id ?? null)), gap = prop($$props, "gap", 3, "6px"), panelProps = prop($$props, "panelProps", 19, () => ({})), content = rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "tabs",
    "active",
    "gap",
    "panelProps"
  ]);
  var fragment = root$c();
  var div = first_child(fragment);
  let styles;
  each(div, 21, () => $$props.tabs, (tab) => tab.id, ($$anchor2, tab) => {
    var div_1 = root_1$f();
    var text2 = child(div_1, true);
    reset(div_1);
    template_effect(() => {
      set_class(div_1, 1, `tabBtn ${active() === get(tab).id ? "active" : ""}`, "svelte-1fwbyla");
      set_text(text2, get(tab).label);
    });
    delegated("click", div_1, () => active(get(tab).id));
    delegated("keydown", div_1, (e) => (e.key === "Enter" || e.key === " ") && active(get(tab).id));
    append($$anchor2, div_1);
  });
  reset(div);
  var node = sibling(div, 2);
  Panel(node, spread_props(panelProps, {
    children: ($$anchor2, $$slotProps) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      snippet(node_1, () => content[active()] ?? noop);
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  template_effect(() => styles = set_style(div, "", styles, { gap: gap() }));
  append($$anchor, fragment);
  pop();
}
delegate(["click", "keydown"]);
const thirdEventArg = (() => {
  let result = false;
  try {
    const arg = Object.defineProperty({}, "passive", {
      get() {
        result = { passive: true };
        return true;
      }
    });
    window.addEventListener("testpassive", arg, arg);
    window.remove("testpassive", arg, arg);
  } catch (_e) {
  }
  return result;
})();
var root_1$e = from_html(`<table class="vtlist-inner"><!><tbody><!></tbody></table> <!>`, 1);
var root_6$1 = from_html(`<div class="vtlist-inner"><!> <!> <!></div>`);
var root$b = from_html(`<div><!></div>`);
function VirtualListNew($$anchor, $$props) {
  push($$props, true);
  var SCROLL_CHANGE_REASON;
  (function(SCROLL_CHANGE_REASON2) {
    SCROLL_CHANGE_REASON2[SCROLL_CHANGE_REASON2["OBSERVED"] = 0] = "OBSERVED";
    SCROLL_CHANGE_REASON2[SCROLL_CHANGE_REASON2["REQUESTED"] = 1] = "REQUESTED";
  })(SCROLL_CHANGE_REASON || (SCROLL_CHANGE_REASON = {}));
  const items = prop($$props, "items", 19, () => []), isDisabled = prop($$props, "isDisabled", 3, false), isHorizontal = prop($$props, "isHorizontal", 3, false), isTable = prop($$props, "isTable", 3, false), preRenderCount = prop($$props, "preRenderCount", 3, 6), scrollToAlignment = prop($$props, "scrollToAlignment", 19, () => ALIGNMENT.AUTO), scrollToBehaviour = prop($$props, "scrollToBehaviour", 19, () => SCROLL_BEHAVIOR.INSTANT), className = prop($$props, "class", 3, ""), style = prop($$props, "style", 3, "");
  const WINDOW_OVERSIZE_COUNT = 3;
  let mounted = false;
  let lastMeasuredIndex = -1;
  let listContainer;
  let listInner = state(void 0);
  let clientHeight = state(0);
  let clientWidth = state(0);
  let startIdx = state(0);
  let endIdx = state(preRenderCount() - 1);
  let avgSizeInPx = state(0);
  let curState = state(proxy({
    offset: $$props.scrollToOffset || 0,
    scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
  }));
  let prevState;
  const rawSizes = user_derived(() => new Array(items().length));
  const sizes = user_derived(() => {
    const r = items().map((item, index2) => {
      let s = $$props.sizingCalculator?.(index2, item);
      if (s !== void 0) return s;
      s = get(rawSizes)[index2];
      if (s !== void 0) return s;
      return get(avgSizeInPx);
    });
    return r;
  });
  const offsets = user_derived(() => {
    const p = [];
    get(sizes).reduce(
      (a, b) => {
        p.push(a);
        return a + b;
      },
      0
    );
    return p;
  });
  const visibleItemsInfo = user_derived(() => {
    if (!items() || isDisabled()) {
      return [];
    }
    const r = [];
    for (let index2 = get(startIdx); index2 <= get(endIdx); index2++) {
      const item = items()[index2];
      if (item) {
        r.push({ item, index: index2, size: get(sizes)[index2] });
      }
    }
    return r;
  });
  const totalViewportSize = () => get(offsets).length > 0 ? get(offsets)[get(offsets).length - 1] + get(sizes)[get(sizes).length - 1] : 0;
  const listStyle = user_derived(() => clsx$1(!isDisabled() && "overflow:auto;", style()));
  const listInnerStyle = user_derived(() => {
    const startOffset = get(offsets)[get(startIdx)] ? get(offsets)[get(startIdx)] : 0;
    const endOffset = get(endIdx) > 0 ? totalViewportSize() - (get(offsets)[Math.min(get(endIdx), get(offsets).length - 1)] + get(sizes)[Math.min(get(endIdx), get(sizes).length - 1)]) : 0;
    return clsx$1(!isTable() && "display:flex;", !isTable() && (!isHorizontal() && "flex-direction:column;" || "flex-direction:row;"), !isDisabled() && (!isHorizontal() && `margin-top:${startOffset}px;margin-bottom:${endOffset}px` || `margin-left:${startOffset}px;margin-right:${endOffset}px;width:${get(offsets)[Math.min(get(endIdx), get(offsets).length - 1)] + get(sizes)[Math.min(get(endIdx), get(sizes).length - 1)] - startOffset}px`));
  });
  onMount(() => {
    listContainer.addEventListener("scroll", onScroll, thirdEventArg);
    refreshOffsets();
    if ($$props.scrollToOffset !== void 0) {
      scrollTo($$props.scrollToOffset);
    } else if ($$props.scrollToIndex !== void 0) {
      scrollTo(getOffsetForIndex($$props.scrollToIndex));
    }
    mounted = true;
  });
  onDestroy(() => {
    if (mounted) listContainer.removeEventListener("scroll", onScroll);
  });
  user_effect(() => {
    $$props.scrollToIndex, scrollToAlignment(), $$props.scrollToOffset, items().length, $$props.sizingCalculator;
    propsUpdated();
  });
  user_effect(() => {
    get(startIdx), get(endIdx);
    propsUpdated();
  });
  user_effect(() => {
    if (get(curState).scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
      scrollTo(get(curState).offset);
    } else {
      refreshOffsets();
    }
  });
  let prevProps = {};
  async function propsUpdated() {
    if (!mounted) return;
    if ($$props.scrollToIndex && $$props.scrollToOffset) {
      console.error("VirtualList: scrollToIndex and scrollToOffset MUST NOT be used together.");
    }
    const scrollPropsHaveChanged = prevProps?.scrollToIndex !== $$props.scrollToIndex || prevProps?.scrollToAlignment !== scrollToAlignment();
    const itemPropsHaveChanged = prevProps?.modelCount !== items().length || prevProps?.sizingCalculator !== $$props.sizingCalculator || prevProps?.avgSizeInPx !== get(avgSizeInPx) || prevProps?.clientHeight !== get(clientHeight) || prevProps?.clientWidth !== get(clientWidth);
    if (itemPropsHaveChanged) {
      await recomputeSizes();
    }
    const scrollOffsetHaveChanged = prevProps?.scrollToOffset !== $$props.scrollToOffset;
    if (scrollOffsetHaveChanged) {
      set$1(
        curState,
        {
          offset: $$props.scrollToOffset || 0,
          scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
        },
        true
      );
    } else if (typeof $$props.scrollToIndex === "number" && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
      set$1(
        curState,
        {
          offset: getOffsetForIndex($$props.scrollToIndex),
          scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
        },
        true
      );
    }
    if ($$props.onVisibleRangeUpdate && (prevProps?.startIdx !== get(startIdx) || prevProps?.endIdx !== get(endIdx))) {
      const vr = getVisibleRange(isHorizontal() ? get(clientWidth) : get(clientHeight), get(curState).offset);
      $$props.onVisibleRangeUpdate(vr);
    }
    prevProps = {
      scrollToIndex: $$props.scrollToIndex,
      scrollToAlignment: scrollToAlignment(),
      scrollToOffset: $$props.scrollToOffset,
      modelCount: items().length,
      sizingCalculator: $$props.sizingCalculator,
      avgSizeInPx: get(avgSizeInPx),
      clientHeight: get(clientHeight),
      clientWidth: get(clientWidth),
      startIdx: get(startIdx),
      endIdx: get(endIdx)
    };
  }
  async function recomputeSizes(startIndex = 0) {
    lastMeasuredIndex = Math.min(lastMeasuredIndex, startIndex - 1);
    await refreshOffsets();
  }
  function onScroll(event2) {
    const offset = isHorizontal() ? listContainer.scrollLeft : listContainer.scrollTop;
    if (event2.target !== listContainer || offset < 0 || get(curState).offset === offset) return;
    if (prevState?.offset !== offset) {
      set$1(curState, { offset, scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED }, true);
      $$props.onAfterScroll?.({ offset, event: event2 });
    }
  }
  function getOffsetForIndex(index2, align = scrollToAlignment(), _modelCount = items().length) {
    if (index2 < 0) {
      index2 = 0;
    } else if (index2 >= _modelCount) {
      index2 = _modelCount - 1;
    }
    return getUpdatedOffsetForIndex(align, isHorizontal() ? get(clientWidth) : get(clientHeight), get(curState).offset, index2);
  }
  function getUpdatedOffsetForIndex(align = ALIGNMENT.START, containerSize, currentOffset, targetIndex) {
    if (containerSize <= 0) {
      return 0;
    }
    const size = get(sizes)[targetIndex];
    const maxOffset = get(offsets)[targetIndex];
    const minOffset = maxOffset - containerSize + size;
    let idealOffset;
    switch (align) {
      case ALIGNMENT.END:
        idealOffset = minOffset;
        break;
      case ALIGNMENT.CENTER:
        idealOffset = maxOffset - (containerSize - size) / 2;
        break;
      case ALIGNMENT.START:
        idealOffset = maxOffset;
        break;
      default:
        idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
    }
    return Math.max(0, Math.min(totalViewportSize() - containerSize, idealOffset));
  }
  function findNearestItem(offset) {
    if (isNaN(offset)) {
      throw Error(`Invalid offset ${offset} specified`);
    }
    offset = Math.max(0, offset);
    const lastMeasuredSizeAndPosition = getSizeAndPositionOfLastMeasuredItem();
    const i = Math.max(0, lastMeasuredIndex);
    if (lastMeasuredSizeAndPosition.offset >= offset) {
      return binarySearch(0, i, offset);
    } else {
      return exponentialSearch(i, offset);
    }
  }
  function getSizeAndPositionOfLastMeasuredItem() {
    return lastMeasuredIndex >= 0 ? {
      offset: get(offsets)[lastMeasuredIndex],
      size: get(sizes)[lastMeasuredIndex]
    } : { offset: 0, size: 0 };
  }
  function binarySearch(low, high, offset) {
    while (low <= high) {
      const middle = low + (high - low >>> 1);
      const currentOffset = get(offsets)[middle];
      if (currentOffset === offset) {
        return middle;
      } else if (currentOffset < offset) {
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }
    return Math.max(0, low - 1);
  }
  function exponentialSearch(index2, offset) {
    let interval = 1;
    while (index2 < items().length && get(offsets)[index2] < offset) {
      index2 += interval;
      interval *= 2;
    }
    return binarySearch(Math.floor(index2 / 2), Math.min(index2, items().length - 1), offset);
  }
  async function refreshOffsets() {
    if (!get(avgSizeInPx)) {
      set$1(avgSizeInPx, getAvgSize(), true);
    }
    const vr = getVisibleRange(isHorizontal() ? get(clientWidth) : get(clientHeight), get(curState).offset, WINDOW_OVERSIZE_COUNT);
    set$1(startIdx, vr.start, true);
    set$1(endIdx, vr.end, true);
    await tick();
    let vi0 = 0;
    const styleCache = /* @__PURE__ */ new Map();
    const getStyle = (el) => {
      if (!styleCache.has(el)) {
        styleCache.set(el, getComputedStyle(el));
      }
      return styleCache.get(el);
    };
    const itemOffsetsTemp = {};
    const children = getChildren();
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const stl = getStyle(el);
      const cssPosition = stl.position;
      if (cssPosition && ["absolute", "fixed"].includes(cssPosition)) {
        continue;
      }
      const size = stl.display !== "none" ? getOuterSize(el) : 0;
      const index2 = get(startIdx) + vi0;
      itemOffsetsTemp[index2] = (itemOffsetsTemp[index2] || 0) + size;
      vi0++;
    }
    for (const k of Object.keys(itemOffsetsTemp)) {
      const index2 = parseInt(k);
      if (get(rawSizes)[index2] !== itemOffsetsTemp[index2]) {
        get(rawSizes)[index2] = itemOffsetsTemp[index2];
      }
    }
  }
  function getAvgSize() {
    const maxSampleCount = 10;
    const sizeArr = [];
    const children = getChildren();
    for (let index2 = 0; index2 < children.length; index2++) {
      const el = children[index2];
      const style2 = getComputedStyle(el);
      if (["absolute", "fixed"].includes(style2.position)) {
        continue;
      }
      const outerSize = getOuterSize(el);
      sizeArr.push(outerSize);
      if (sizeArr.length >= maxSampleCount) {
        break;
      }
    }
    if (sizeArr.length === 0) {
      return 0;
    }
    return sizeArr.reduce((a, b) => a + b, 0) / sizeArr.length;
  }
  function getClientSize(el) {
    const style2 = getComputedStyle(el);
    let r = parseFloat(!isHorizontal() ? style2.height : style2.width);
    if (style2.boxSizing === "border-box") {
      if (!isHorizontal()) {
        r -= parseFloat(style2.borderTopWidth) - parseFloat(style2.borderBottomWidth);
      } else {
        r -= parseFloat(style2.borderLeftWidth) - parseFloat(style2.borderRightWidth);
      }
    }
    return r;
  }
  function getVisibleRange(containerSize = 0, scrollbarOffset, windowOverPaddingCount = 0) {
    if (totalViewportSize() === 0) return { start: 0, end: 0 };
    const maxOffset = scrollbarOffset + containerSize;
    let startIdx2 = findNearestItem(scrollbarOffset);
    if (startIdx2 === void 0) {
      throw Error(`Invalid offset ${scrollbarOffset} specified`);
    }
    let offset = get(offsets)[startIdx2] + get(sizes)[startIdx2];
    let endIdx2 = startIdx2;
    while (offset < maxOffset && endIdx2 < items().length - 1) {
      endIdx2++;
      offset += get(sizes)[endIdx2];
    }
    if (windowOverPaddingCount > 0) {
      startIdx2 = Math.max(0, startIdx2 - windowOverPaddingCount);
      endIdx2 = Math.min(endIdx2 + windowOverPaddingCount, items().length - 1);
    }
    return { start: startIdx2, end: endIdx2 };
  }
  function getOuterSize(el) {
    const style2 = getComputedStyle(el);
    let r = getClientSize(el);
    if (isHorizontal()) {
      r += parseFloat(style2.borderLeftWidth) + parseFloat(style2.borderRightWidth) + parseFloat(style2.marginLeft) + parseFloat(style2.marginRight);
    } else {
      r += parseFloat(style2.borderTopWidth) + parseFloat(style2.borderBottomWidth) + parseFloat(style2.marginTop) + parseFloat(style2.marginBottom);
    }
    return Number.isNaN(r) ? 0 : r;
  }
  function scrollTo(value) {
    if ("scroll" in listContainer) {
      const p = { behavior: scrollToBehaviour() };
      p[isHorizontal() ? "left" : "top"] = value;
      listContainer.scroll(p);
    } else {
      listContainer[isHorizontal() ? "scrollLeft" : "scrollTop"] = value;
    }
  }
  function getChildren() {
    return !isTable() ? get(listInner).children : get(listInner).querySelector("tbody").children;
  }
  var div = root$b();
  var node = child(div);
  {
    var consequent_1 = ($$anchor2) => {
      var fragment = root_1$e();
      var table = first_child(fragment);
      var node_1 = child(table);
      snippet(node_1, () => $$props.header ?? noop);
      var tbody = sibling(node_1);
      var node_2 = child(tbody);
      {
        var consequent = ($$anchor3) => {
          var fragment_1 = comment();
          var node_3 = first_child(fragment_1);
          each(node_3, 17, items, index, ($$anchor4, item, index2) => {
            var fragment_2 = comment();
            var node_4 = first_child(fragment_2);
            snippet(node_4, () => $$props.vl_slot, () => ({ index: index2, item: get(item) }));
            append($$anchor4, fragment_2);
          });
          append($$anchor3, fragment_1);
        };
        var alternate = ($$anchor3) => {
          var fragment_3 = comment();
          var node_5 = first_child(fragment_3);
          each(node_5, 17, () => get(visibleItemsInfo), (item) => item.index, ($$anchor4, item) => {
            var fragment_4 = comment();
            var node_6 = first_child(fragment_4);
            snippet(node_6, () => $$props.vl_slot, () => get(item));
            append($$anchor4, fragment_4);
          });
          append($$anchor3, fragment_3);
        };
        if_block(node_2, ($$render) => {
          if (isDisabled()) $$render(consequent);
          else $$render(alternate, -1);
        });
      }
      reset(tbody);
      reset(table);
      bind_this(table, ($$value) => set$1(listInner, $$value), () => get(listInner));
      var node_7 = sibling(table, 2);
      snippet(node_7, () => $$props.footer ?? noop);
      template_effect(() => set_style(table, get(listInnerStyle)));
      append($$anchor2, fragment);
    };
    var alternate_2 = ($$anchor2) => {
      var div_1 = root_6$1();
      var node_8 = child(div_1);
      snippet(node_8, () => $$props.header ?? noop);
      var node_9 = sibling(node_8, 2);
      {
        var consequent_2 = ($$anchor3) => {
          var fragment_5 = comment();
          var node_10 = first_child(fragment_5);
          each(node_10, 17, items, index, ($$anchor4, item, index2) => {
            var fragment_6 = comment();
            var node_11 = first_child(fragment_6);
            snippet(node_11, () => $$props.vl_slot, () => ({ index: index2, item: get(item) }));
            append($$anchor4, fragment_6);
          });
          append($$anchor3, fragment_5);
        };
        var alternate_1 = ($$anchor3) => {
          var fragment_7 = comment();
          var node_12 = first_child(fragment_7);
          each(node_12, 16, () => get(visibleItemsInfo), (item) => item, ($$anchor4, item) => {
            var fragment_8 = comment();
            var node_13 = first_child(fragment_8);
            snippet(node_13, () => $$props.vl_slot, () => item);
            append($$anchor4, fragment_8);
          });
          append($$anchor3, fragment_7);
        };
        if_block(node_9, ($$render) => {
          if (isDisabled()) $$render(consequent_2);
          else $$render(alternate_1, -1);
        });
      }
      var node_14 = sibling(node_9, 2);
      snippet(node_14, () => $$props.footer ?? noop);
      reset(div_1);
      bind_this(div_1, ($$value) => set$1(listInner, $$value), () => get(listInner));
      template_effect(() => set_style(div_1, get(listInnerStyle)));
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if (isTable()) $$render(consequent_1);
      else $$render(alternate_2, -1);
    });
  }
  reset(div);
  bind_this(div, ($$value) => listContainer = $$value, () => listContainer);
  template_effect(
    ($0) => {
      set_class(div, 1, $0);
      set_style(div, get(listStyle));
    },
    [() => clsx(clsx$1("vtlist", className()))]
  );
  bind_element_size(div, "clientHeight", ($$value) => set$1(clientHeight, $$value));
  bind_element_size(div, "clientWidth", ($$value) => set$1(clientWidth, $$value));
  append($$anchor, div);
  pop();
}
var SCROLL_BEHAVIOR;
(function(SCROLL_BEHAVIOR2) {
  SCROLL_BEHAVIOR2["AUTO"] = "auto";
  SCROLL_BEHAVIOR2["SMOOTH"] = "smooth";
  SCROLL_BEHAVIOR2["INSTANT"] = "instant";
})(SCROLL_BEHAVIOR || (SCROLL_BEHAVIOR = {}));
var ALIGNMENT;
(function(ALIGNMENT2) {
  ALIGNMENT2["AUTO"] = "auto";
  ALIGNMENT2["START"] = "start";
  ALIGNMENT2["CENTER"] = "center";
  ALIGNMENT2["END"] = "end";
})(ALIGNMENT || (ALIGNMENT = {}));
function VirtualList_1($$anchor, $$props) {
  push($$props, true);
  let style = prop($$props, "style", 3, "height:100%;"), className = prop($$props, "class", 3, ""), content = rest_props($$props, ["$$slots", "$$events", "$$legacy", "items", "style", "class"]);
  {
    const vl_slot = ($$anchor2, $$arg0) => {
      let item = () => $$arg0?.().item;
      var fragment_1 = comment();
      var node = first_child(fragment_1);
      snippet(node, () => content[item().type] ?? noop, item);
      append($$anchor2, fragment_1);
    };
    VirtualListNew($$anchor, {
      get items() {
        return $$props.items;
      },
      get style() {
        return style();
      },
      get class() {
        return className();
      },
      vl_slot,
      $$slots: { vl_slot: true }
    });
  }
  pop();
}
var root_1$d = from_html(`<div class="childrenContainer svelte-1qidjt8"><!></div>`);
var root$a = from_html(`<div class="textareaContainer svelte-1qidjt8"><textarea></textarea> <!></div>`);
function Textarea($$anchor, $$props) {
  const placeholderColor = prop($$props, "placeholderColor", 3, "var(--bg-light)"), props = rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "children",
    "placeholderColor"
  ]);
  var div = root$a();
  var textarea = child(div);
  remove_textarea_child(textarea);
  attribute_effect(
    textarea,
    () => ({
      ...props,
      [STYLE]: { "--placeholder-color": placeholderColor() }
    }),
    void 0,
    void 0,
    void 0,
    "svelte-1qidjt8"
  );
  var node = sibling(textarea, 2);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1$d();
      var node_1 = child(div_1);
      snippet(node_1, () => $$props.children);
      reset(div_1);
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if ($$props.children) $$render(consequent);
    });
  }
  reset(div);
  append($$anchor, div);
}
const closeIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M4 1H12V2H4ZM2 2H14V3H2ZM1 3H15V4H1ZM1 4H4V5H1ZM6 4H10V5H6ZM12 4H15V5H12ZM0 5H5V6H0ZM7 5H9V6H7ZM11 5H16V6H11ZM0 6H6V7H0ZM10 6H16V7H10ZM0 7H6V8H0ZM10 7H16V8H10ZM0 8H6V9H0ZM10 8H16V9H10ZM0 9H6V10H0ZM10 9H16V10H10ZM0 10H5V11H0ZM7 10H9V11H7ZM11 10H16V11H11ZM1 11H4V12H1ZM6 11H10V12H6ZM12 11H15V12H12ZM1 12H15V13H1ZM2 13H14V14H2ZM4 14H12V15H4Z" fill="currentColor"/>\n</svg>\n';
const activeIds = /* @__PURE__ */ new Set();
var root_2$4 = from_html(`<div class="windowHeader svelte-2yo17i" role="presentation"><span class="title svelte-2yo17i"> </span> <button class="close-btn svelte-2yo17i" aria-label="Close"></button></div> <!>`, 1);
var root_1$c = from_html(`<div><!></div>`);
function Window($$anchor, $$props) {
  push($$props, true);
  let title = prop($$props, "title", 3, "Window"), resizable = prop($$props, "resizable", 3, false), isOpen = prop($$props, "isOpen", 15, true), onClose = prop($$props, "onClose", 3, () => {
  }), noPanelBody = prop($$props, "noPanelBody", 3, false), maxHeight = prop($$props, "maxHeight", 3, "80vh");
  let container = state(void 0);
  let x2 = state(0);
  let y2 = state(0);
  let isDragging = state(false);
  if (activeIds.has($$props.id)) {
    isOpen(false);
    onClose()();
  } else {
    activeIds.add($$props.id);
    onDestroy(() => {
      activeIds.delete($$props.id);
    });
  }
  async function centerWindow() {
    if (!get(container)) return;
    await tick();
    const rect = get(container).getBoundingClientRect();
    set$1(x2, (window.innerWidth - rect.width) / 2);
    set$1(y2, (window.innerHeight - rect.height) / 2);
  }
  function handleMouseDown(e) {
    if (e.button !== 0) return;
    set$1(isDragging, true);
    const startX = e.clientX - get(x2);
    const startY = e.clientY - get(y2);
    function onMouseMove(e2) {
      if (!get(isDragging)) return;
      set$1(x2, e2.clientX - startX);
      set$1(y2, e2.clientY - startY);
    }
    function onMouseUp() {
      set$1(isDragging, false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }
  function close() {
    isOpen(false);
    onClose()();
  }
  onMount(() => {
    if (isOpen()) centerWindow();
  });
  let lastSelectionRemove = 0;
  user_effect(() => {
    get(x2);
    get(y2);
    if (Date.now() - lastSelectionRemove < 500) return;
    lastSelectionRemove = Date.now();
    window.getSelection().removeAllRanges();
  });
  var fragment = comment();
  var node = first_child(fragment);
  {
    var consequent_2 = ($$anchor2) => {
      var div = root_1$c();
      let classes;
      let styles;
      var node_1 = child(div);
      {
        const header = ($$anchor3) => {
          var fragment_1 = root_2$4();
          var div_1 = first_child(fragment_1);
          var span = child(div_1);
          var text2 = child(span, true);
          reset(span);
          var button = sibling(span, 2);
          html(button, () => closeIcon, true);
          reset(button);
          reset(div_1);
          var node_2 = sibling(div_1, 2);
          {
            var consequent = ($$anchor4) => {
              var fragment_2 = comment();
              var node_3 = first_child(fragment_2);
              snippet(node_3, () => $$props.children ?? noop);
              append($$anchor4, fragment_2);
            };
            if_block(node_2, ($$render) => {
              if (noPanelBody()) $$render(consequent);
            });
          }
          template_effect(() => set_text(text2, title()));
          delegated("mousedown", div_1, handleMouseDown);
          delegated("click", button, close);
          delegated("mousedown", button, (e) => e.stopPropagation());
          append($$anchor3, fragment_1);
        };
        Panel(node_1, {
          get noBody() {
            return noPanelBody();
          },
          get maxHeight() {
            return maxHeight();
          },
          header,
          children: ($$anchor3, $$slotProps) => {
            var fragment_3 = comment();
            var node_4 = first_child(fragment_3);
            {
              var consequent_1 = ($$anchor4) => {
                var fragment_4 = comment();
                var node_5 = first_child(fragment_4);
                snippet(node_5, () => $$props.children ?? noop);
                append($$anchor4, fragment_4);
              };
              if_block(node_4, ($$render) => {
                if (noPanelBody() === false) $$render(consequent_1);
              });
            }
            append($$anchor3, fragment_3);
          },
          $$slots: { header: true, default: true }
        });
      }
      reset(div);
      bind_this(div, ($$value) => set$1(container, $$value), () => get(container));
      template_effect(() => {
        classes = set_class(div, 1, "windowWrapper svelte-2yo17i", null, classes, { resizable: resizable() });
        styles = set_style(div, "", styles, {
          left: `${get(x2) ?? ""}px`,
          top: `${get(y2) ?? ""}px`,
          "max-height": maxHeight()
        });
      });
      append($$anchor2, div);
    };
    if_block(node, ($$render) => {
      if (isOpen()) $$render(consequent_2);
    });
  }
  append($$anchor, fragment);
  pop();
}
delegate(["mousedown", "click"]);
const vkIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 16 13" shape-rendering="crispEdges">\r\n  <rect x="1" y="2" width="1" height="1" fill="white" />\r\n  <rect x="2" y="2" width="1" height="1" fill="white" />\r\n  <rect x="5" y="2" width="1" height="1" fill="white" />\r\n  <rect x="6" y="2" width="1" height="1" fill="white" />\r\n  <rect x="7" y="2" width="1" height="1" fill="white" />\r\n  <rect x="8" y="2" width="1" height="1" fill="white" />\r\n  <rect x="12" y="2" width="1" height="1" fill="white" />\r\n  <rect x="13" y="2" width="1" height="1" fill="white" />\r\n  <rect x="14" y="2" width="1" height="1" fill="white" />\r\n  <rect x="1" y="3" width="1" height="1" fill="white" />\r\n  <rect x="2" y="3" width="1" height="1" fill="white" />\r\n  <rect x="3" y="3" width="1" height="1" fill="white" />\r\n  <rect x="6" y="3" width="1" height="1" fill="white" />\r\n  <rect x="7" y="3" width="1" height="1" fill="white" />\r\n  <rect x="8" y="3" width="1" height="1" fill="white" />\r\n  <rect x="11" y="3" width="1" height="1" fill="white" />\r\n  <rect x="12" y="3" width="1" height="1" fill="white" />\r\n  <rect x="13" y="3" width="1" height="1" fill="white" />\r\n  <rect x="1" y="4" width="1" height="1" fill="white" />\r\n  <rect x="2" y="4" width="1" height="1" fill="white" />\r\n  <rect x="3" y="4" width="1" height="1" fill="white" />\r\n  <rect x="6" y="4" width="1" height="1" fill="white" />\r\n  <rect x="7" y="4" width="1" height="1" fill="white" />\r\n  <rect x="8" y="4" width="1" height="1" fill="white" />\r\n  <rect x="11" y="4" width="1" height="1" fill="white" />\r\n  <rect x="12" y="4" width="1" height="1" fill="white" />\r\n  <rect x="13" y="4" width="1" height="1" fill="white" />\r\n  <rect x="2" y="5" width="1" height="1" fill="white" />\r\n  <rect x="3" y="5" width="1" height="1" fill="white" />\r\n  <rect x="4" y="5" width="1" height="1" fill="white" />\r\n  <rect x="6" y="5" width="1" height="1" fill="white" />\r\n  <rect x="7" y="5" width="1" height="1" fill="white" />\r\n  <rect x="8" y="5" width="1" height="1" fill="white" />\r\n  <rect x="10" y="5" width="1" height="1" fill="white" />\r\n  <rect x="11" y="5" width="1" height="1" fill="white" />\r\n  <rect x="12" y="5" width="1" height="1" fill="white" />\r\n  <rect x="2" y="6" width="1" height="1" fill="white" />\r\n  <rect x="3" y="6" width="1" height="1" fill="white" />\r\n  <rect x="4" y="6" width="1" height="1" fill="white" />\r\n  <rect x="5" y="6" width="1" height="1" fill="white" />\r\n  <rect x="6" y="6" width="1" height="1" fill="white" />\r\n  <rect x="7" y="6" width="1" height="1" fill="white" />\r\n  <rect x="8" y="6" width="1" height="1" fill="white" />\r\n  <rect x="9" y="6" width="1" height="1" fill="white" />\r\n  <rect x="10" y="6" width="1" height="1" fill="white" />\r\n  <rect x="11" y="6" width="1" height="1" fill="white" />\r\n  <rect x="3" y="7" width="1" height="1" fill="white" />\r\n  <rect x="4" y="7" width="1" height="1" fill="white" />\r\n  <rect x="5" y="7" width="1" height="1" fill="white" />\r\n  <rect x="6" y="7" width="1" height="1" fill="white" />\r\n  <rect x="7" y="7" width="1" height="1" fill="white" />\r\n  <rect x="8" y="7" width="1" height="1" fill="white" />\r\n  <rect x="9" y="7" width="1" height="1" fill="white" />\r\n  <rect x="10" y="7" width="1" height="1" fill="white" />\r\n  <rect x="11" y="7" width="1" height="1" fill="white" />\r\n  <rect x="12" y="7" width="1" height="1" fill="white" />\r\n  <rect x="4" y="8" width="1" height="1" fill="white" />\r\n  <rect x="5" y="8" width="1" height="1" fill="white" />\r\n  <rect x="6" y="8" width="1" height="1" fill="white" />\r\n  <rect x="7" y="8" width="1" height="1" fill="white" />\r\n  <rect x="8" y="8" width="1" height="1" fill="white" />\r\n  <rect x="10" y="8" width="1" height="1" fill="white" />\r\n  <rect x="11" y="8" width="1" height="1" fill="white" />\r\n  <rect x="12" y="8" width="1" height="1" fill="white" />\r\n  <rect x="13" y="8" width="1" height="1" fill="white" />\r\n  <rect x="5" y="9" width="1" height="1" fill="white" />\r\n  <rect x="6" y="9" width="1" height="1" fill="white" />\r\n  <rect x="7" y="9" width="1" height="1" fill="white" />\r\n  <rect x="8" y="9" width="1" height="1" fill="white" />\r\n  <rect x="11" y="9" width="1" height="1" fill="white" />\r\n  <rect x="12" y="9" width="1" height="1" fill="white" />\r\n  <rect x="13" y="9" width="1" height="1" fill="white" />\r\n  <rect x="14" y="9" width="1" height="1" fill="white" />\r\n</svg>';
const discordIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 15 13" shape-rendering="crispEdges">\r\n  <rect x="5" y="2" width="1" height="1" fill="white" />\r\n  <rect x="9" y="2" width="1" height="1" fill="white" />\r\n  <rect x="3" y="3" width="1" height="1" fill="white" />\r\n  <rect x="4" y="3" width="1" height="1" fill="white" />\r\n  <rect x="5" y="3" width="1" height="1" fill="white" />\r\n  <rect x="6" y="3" width="1" height="1" fill="white" />\r\n  <rect x="7" y="3" width="1" height="1" fill="white" />\r\n  <rect x="8" y="3" width="1" height="1" fill="white" />\r\n  <rect x="9" y="3" width="1" height="1" fill="white" />\r\n  <rect x="10" y="3" width="1" height="1" fill="white" />\r\n  <rect x="11" y="3" width="1" height="1" fill="white" />\r\n  <rect x="3" y="4" width="1" height="1" fill="white" />\r\n  <rect x="4" y="4" width="1" height="1" fill="white" />\r\n  <rect x="5" y="4" width="1" height="1" fill="white" />\r\n  <rect x="6" y="4" width="1" height="1" fill="white" />\r\n  <rect x="7" y="4" width="1" height="1" fill="white" />\r\n  <rect x="8" y="4" width="1" height="1" fill="white" />\r\n  <rect x="9" y="4" width="1" height="1" fill="white" />\r\n  <rect x="10" y="4" width="1" height="1" fill="white" />\r\n  <rect x="11" y="4" width="1" height="1" fill="white" />\r\n  <rect x="2" y="5" width="1" height="1" fill="white" />\r\n  <rect x="3" y="5" width="1" height="1" fill="white" />\r\n  <rect x="4" y="5" width="1" height="1" fill="white" />\r\n  <rect x="5" y="5" width="1" height="1" fill="white" />\r\n  <rect x="6" y="5" width="1" height="1" fill="white" />\r\n  <rect x="7" y="5" width="1" height="1" fill="white" />\r\n  <rect x="8" y="5" width="1" height="1" fill="white" />\r\n  <rect x="9" y="5" width="1" height="1" fill="white" />\r\n  <rect x="10" y="5" width="1" height="1" fill="white" />\r\n  <rect x="11" y="5" width="1" height="1" fill="white" />\r\n  <rect x="12" y="5" width="1" height="1" fill="white" />\r\n  <rect x="2" y="6" width="1" height="1" fill="white" />\r\n  <rect x="3" y="6" width="1" height="1" fill="white" />\r\n  <rect x="4" y="6" width="1" height="1" fill="white" />\r\n  <rect x="7" y="6" width="1" height="1" fill="white" />\r\n  <rect x="10" y="6" width="1" height="1" fill="white" />\r\n  <rect x="11" y="6" width="1" height="1" fill="white" />\r\n  <rect x="12" y="6" width="1" height="1" fill="white" />\r\n  <rect x="2" y="7" width="1" height="1" fill="white" />\r\n  <rect x="3" y="7" width="1" height="1" fill="white" />\r\n  <rect x="4" y="7" width="1" height="1" fill="white" />\r\n  <rect x="7" y="7" width="1" height="1" fill="white" />\r\n  <rect x="10" y="7" width="1" height="1" fill="white" />\r\n  <rect x="11" y="7" width="1" height="1" fill="white" />\r\n  <rect x="12" y="7" width="1" height="1" fill="white" />\r\n  <rect x="2" y="8" width="1" height="1" fill="white" />\r\n  <rect x="3" y="8" width="1" height="1" fill="white" />\r\n  <rect x="4" y="8" width="1" height="1" fill="white" />\r\n  <rect x="5" y="8" width="1" height="1" fill="white" />\r\n  <rect x="6" y="8" width="1" height="1" fill="white" />\r\n  <rect x="7" y="8" width="1" height="1" fill="white" />\r\n  <rect x="8" y="8" width="1" height="1" fill="white" />\r\n  <rect x="9" y="8" width="1" height="1" fill="white" />\r\n  <rect x="10" y="8" width="1" height="1" fill="white" />\r\n  <rect x="11" y="8" width="1" height="1" fill="white" />\r\n  <rect x="12" y="8" width="1" height="1" fill="white" />\r\n  <rect x="2" y="9" width="1" height="1" fill="white" />\r\n  <rect x="3" y="9" width="1" height="1" fill="white" />\r\n  <rect x="4" y="9" width="1" height="1" fill="white" />\r\n  <rect x="5" y="9" width="1" height="1" fill="white" />\r\n  <rect x="6" y="9" width="1" height="1" fill="white" />\r\n  <rect x="7" y="9" width="1" height="1" fill="white" />\r\n  <rect x="8" y="9" width="1" height="1" fill="white" />\r\n  <rect x="9" y="9" width="1" height="1" fill="white" />\r\n  <rect x="10" y="9" width="1" height="1" fill="white" />\r\n  <rect x="11" y="9" width="1" height="1" fill="white" />\r\n  <rect x="12" y="9" width="1" height="1" fill="white" />\r\n  <rect x="4" y="10" width="1" height="1" fill="white" />\r\n  <rect x="10" y="10" width="1" height="1" fill="white" />\r\n</svg>';
const googleIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 13 13" shape-rendering="crispEdges">\r\n  <rect x="5" y="2" width="1" height="1" fill="#ea4335" />\r\n  <rect x="6" y="2" width="1" height="1" fill="#ea4335" />\r\n  <rect x="7" y="2" width="1" height="1" fill="#ea4335" />\r\n  <rect x="4" y="3" width="1" height="1" fill="#ea4335" />\r\n  <rect x="5" y="3" width="1" height="1" fill="#ea4335" />\r\n  <rect x="6" y="3" width="1" height="1" fill="#ea4335" />\r\n  <rect x="7" y="3" width="1" height="1" fill="#ea4335" />\r\n  <rect x="8" y="3" width="1" height="1" fill="#ea4335" />\r\n  <rect x="3" y="4" width="1" height="1" fill="#ea4335" />\r\n  <rect x="4" y="4" width="1" height="1" fill="#ea4335" />\r\n  <rect x="2" y="5" width="1" height="1" fill="#fbbc05" />\r\n  <rect x="3" y="5" width="1" height="1" fill="#fbbc05" />\r\n  <rect x="2" y="6" width="1" height="1" fill="#fbbc05" />\r\n  <rect x="3" y="6" width="1" height="1" fill="#fbbc05" />\r\n  <rect x="6" y="6" width="1" height="1" fill="#4285f4" />\r\n  <rect x="7" y="6" width="1" height="1" fill="#4285f4" />\r\n  <rect x="8" y="6" width="1" height="1" fill="#4285f4" />\r\n  <rect x="9" y="6" width="1" height="1" fill="#4285f4" />\r\n  <rect x="2" y="7" width="1" height="1" fill="#fbbc05" />\r\n  <rect x="3" y="7" width="1" height="1" fill="#fbbc05" />\r\n  <rect x="9" y="7" width="1" height="1" fill="#4285f4" />\r\n  <rect x="10" y="7" width="1" height="1" fill="#4285f4" />\r\n  <rect x="3" y="8" width="1" height="1" fill="#34a853" />\r\n  <rect x="4" y="8" width="1" height="1" fill="#34a853" />\r\n  <rect x="8" y="8" width="1" height="1" fill="#4285f4" />\r\n  <rect x="9" y="8" width="1" height="1" fill="#4285f4" />\r\n  <rect x="4" y="9" width="1" height="1" fill="#34a853" />\r\n  <rect x="5" y="9" width="1" height="1" fill="#34a853" />\r\n  <rect x="6" y="9" width="1" height="1" fill="#34a853" />\r\n  <rect x="7" y="9" width="1" height="1" fill="#34a853" />\r\n  <rect x="8" y="9" width="1" height="1" fill="#34a853" />\r\n  <rect x="5" y="10" width="1" height="1" fill="#34a853" />\r\n  <rect x="6" y="10" width="1" height="1" fill="#34a853" />\r\n  <rect x="7" y="10" width="1" height="1" fill="#34a853" />\r\n</svg>';
var root_1$b = from_html(`<div class="body svelte-1w8c893"><a href="/api/auth/vk" class="svelte-1w8c893"><!></a> <a href="/api/auth/discord" class="svelte-1w8c893"><!></a> <a href="/api/auth/google" class="svelte-1w8c893"><!></a></div>`);
function Login($$anchor, $$props) {
  push($$props, true);
  let isOpen = prop($$props, "isOpen", 15, true), rprops = rest_props($$props, ["$$slots", "$$events", "$$legacy", "isOpen"]);
  {
    let $0 = user_derived(() => t("login_or_register"));
    Window($$anchor, spread_props(
      {
        get title() {
          return get($0);
        },
        id: "settings"
      },
      () => rprops,
      {
        get isOpen() {
          return isOpen();
        },
        set isOpen($$value) {
          isOpen($$value);
        },
        children: ($$anchor2, $$slotProps) => {
          var div = root_1$b();
          var a = child(div);
          var node = child(a);
          Button(node, {
            get icon() {
              return vkIcon;
            },
            bg: "#4C75A3",
            fullWidth: true,
            theme: "light",
            style: "font-size: var(--text-x2);",
            children: ($$anchor3, $$slotProps2) => {
              next();
              var text$1 = text("Войти через VK");
              append($$anchor3, text$1);
            },
            $$slots: { default: true }
          });
          reset(a);
          var a_1 = sibling(a, 2);
          var node_1 = child(a_1);
          Button(node_1, {
            get icon() {
              return discordIcon;
            },
            bg: "#5864de",
            fullWidth: true,
            theme: "light",
            style: "font-size: var(--text-x2);",
            children: ($$anchor3, $$slotProps2) => {
              next();
              var text_1 = text("Войти через Discord");
              append($$anchor3, text_1);
            },
            $$slots: { default: true }
          });
          reset(a_1);
          var a_2 = sibling(a_1, 2);
          var node_2 = child(a_2);
          Button(node_2, {
            get icon() {
              return googleIcon;
            },
            bg: "white",
            fullWidth: true,
            theme: "light",
            color: "#222222",
            style: "font-size: var(--text-x2);",
            children: ($$anchor3, $$slotProps2) => {
              next();
              var text_2 = text("Войти через Google");
              append($$anchor3, text_2);
            },
            $$slots: { default: true }
          });
          reset(a_2);
          reset(div);
          append($$anchor2, div);
        },
        $$slots: { default: true }
      }
    ));
  }
  pop();
}
const emojiOrdered = /* @__PURE__ */ JSON.parse('[{"name":"Smileys & Emotion","slug":"smileys_emotion","emojis":[{"emoji":"😀","skin_tone_support":false,"name":"grinning face","slug":"grinning_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😃","skin_tone_support":false,"name":"grinning face with big eyes","slug":"grinning_face_with_big_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😄","skin_tone_support":false,"name":"grinning face with smiling eyes","slug":"grinning_face_with_smiling_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😁","skin_tone_support":false,"name":"beaming face with smiling eyes","slug":"beaming_face_with_smiling_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😆","skin_tone_support":false,"name":"grinning squinting face","slug":"grinning_squinting_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😅","skin_tone_support":false,"name":"grinning face with sweat","slug":"grinning_face_with_sweat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤣","skin_tone_support":false,"name":"rolling on the floor laughing","slug":"rolling_on_the_floor_laughing","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"😂","skin_tone_support":false,"name":"face with tears of joy","slug":"face_with_tears_of_joy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙂","skin_tone_support":false,"name":"slightly smiling face","slug":"slightly_smiling_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🙃","skin_tone_support":false,"name":"upside-down face","slug":"upside_down_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫠","skin_tone_support":false,"name":"melting face","slug":"melting_face","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"😉","skin_tone_support":false,"name":"winking face","slug":"winking_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😊","skin_tone_support":false,"name":"smiling face with smiling eyes","slug":"smiling_face_with_smiling_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😇","skin_tone_support":false,"name":"smiling face with halo","slug":"smiling_face_with_halo","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🥰","skin_tone_support":false,"name":"smiling face with hearts","slug":"smiling_face_with_hearts","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"😍","skin_tone_support":false,"name":"smiling face with heart-eyes","slug":"smiling_face_with_heart_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤩","skin_tone_support":false,"name":"star-struck","slug":"star_struck","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"😘","skin_tone_support":false,"name":"face blowing a kiss","slug":"face_blowing_a_kiss","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😗","skin_tone_support":false,"name":"kissing face","slug":"kissing_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"☺️","skin_tone_support":false,"name":"smiling face","slug":"smiling_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😚","skin_tone_support":false,"name":"kissing face with closed eyes","slug":"kissing_face_with_closed_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😙","skin_tone_support":false,"name":"kissing face with smiling eyes","slug":"kissing_face_with_smiling_eyes","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🥲","skin_tone_support":false,"name":"smiling face with tear","slug":"smiling_face_with_tear","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"😋","skin_tone_support":false,"name":"face savoring food","slug":"face_savoring_food","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😛","skin_tone_support":false,"name":"face with tongue","slug":"face_with_tongue","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😜","skin_tone_support":false,"name":"winking face with tongue","slug":"winking_face_with_tongue","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤪","skin_tone_support":false,"name":"zany face","slug":"zany_face","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"😝","skin_tone_support":false,"name":"squinting face with tongue","slug":"squinting_face_with_tongue","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤑","skin_tone_support":false,"name":"money-mouth face","slug":"money_mouth_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🤗","skin_tone_support":false,"name":"smiling face with open hands","slug":"smiling_face_with_open_hands","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🤭","skin_tone_support":false,"name":"face with hand over mouth","slug":"face_with_hand_over_mouth","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🫢","skin_tone_support":false,"name":"face with open eyes and hand over mouth","slug":"face_with_open_eyes_and_hand_over_mouth","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🫣","skin_tone_support":false,"name":"face with peeking eye","slug":"face_with_peeking_eye","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🤫","skin_tone_support":false,"name":"shushing face","slug":"shushing_face","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🤔","skin_tone_support":false,"name":"thinking face","slug":"thinking_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫡","skin_tone_support":false,"name":"saluting face","slug":"saluting_face","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🤐","skin_tone_support":false,"name":"zipper-mouth face","slug":"zipper_mouth_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🤨","skin_tone_support":false,"name":"face with raised eyebrow","slug":"face_with_raised_eyebrow","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"😐","skin_tone_support":false,"name":"neutral face","slug":"neutral_face","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"😑","skin_tone_support":false,"name":"expressionless face","slug":"expressionless_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😶","skin_tone_support":false,"name":"face without mouth","slug":"face_without_mouth","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫥","skin_tone_support":false,"name":"dotted line face","slug":"dotted_line_face","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"😶‍🌫️","skin_tone_support":false,"name":"face in clouds","slug":"face_in_clouds","unicode_version":"13.1","emoji_version":"13.1"},{"emoji":"😏","skin_tone_support":false,"name":"smirking face","slug":"smirking_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😒","skin_tone_support":false,"name":"unamused face","slug":"unamused_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙄","skin_tone_support":false,"name":"face with rolling eyes","slug":"face_with_rolling_eyes","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😬","skin_tone_support":false,"name":"grimacing face","slug":"grimacing_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😮‍💨","skin_tone_support":false,"name":"face exhaling","slug":"face_exhaling","unicode_version":"13.1","emoji_version":"13.1"},{"emoji":"🤥","skin_tone_support":false,"name":"lying face","slug":"lying_face","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🫨","skin_tone_support":false,"name":"shaking face","slug":"shaking_face","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🙂‍↔️","skin_tone_support":false,"name":"head shaking horizontally","slug":"head_shaking_horizontally","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🙂‍↕️","skin_tone_support":false,"name":"head shaking vertically","slug":"head_shaking_vertically","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"😌","skin_tone_support":false,"name":"relieved face","slug":"relieved_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😔","skin_tone_support":false,"name":"pensive face","slug":"pensive_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😪","skin_tone_support":false,"name":"sleepy face","slug":"sleepy_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤤","skin_tone_support":false,"name":"drooling face","slug":"drooling_face","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"😴","skin_tone_support":false,"name":"sleeping face","slug":"sleeping_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫩","skin_tone_support":false,"name":"face with bags under eyes","slug":"face_with_bags_under_eyes","unicode_version":"16.0","emoji_version":"16.0"},{"emoji":"😷","skin_tone_support":false,"name":"face with medical mask","slug":"face_with_medical_mask","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤒","skin_tone_support":false,"name":"face with thermometer","slug":"face_with_thermometer","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🤕","skin_tone_support":false,"name":"face with head-bandage","slug":"face_with_head_bandage","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🤢","skin_tone_support":false,"name":"nauseated face","slug":"nauseated_face","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤮","skin_tone_support":false,"name":"face vomiting","slug":"face_vomiting","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🤧","skin_tone_support":false,"name":"sneezing face","slug":"sneezing_face","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥵","skin_tone_support":false,"name":"hot face","slug":"hot_face","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥶","skin_tone_support":false,"name":"cold face","slug":"cold_face","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥴","skin_tone_support":false,"name":"woozy face","slug":"woozy_face","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"😵","skin_tone_support":false,"name":"face with crossed-out eyes","slug":"face_with_crossed_out_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😵‍💫","skin_tone_support":false,"name":"face with spiral eyes","slug":"face_with_spiral_eyes","unicode_version":"13.1","emoji_version":"13.1"},{"emoji":"🤯","skin_tone_support":false,"name":"exploding head","slug":"exploding_head","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🤠","skin_tone_support":false,"name":"cowboy hat face","slug":"cowboy_hat_face","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥳","skin_tone_support":false,"name":"partying face","slug":"partying_face","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥸","skin_tone_support":false,"name":"disguised face","slug":"disguised_face","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"😎","skin_tone_support":false,"name":"smiling face with sunglasses","slug":"smiling_face_with_sunglasses","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🤓","skin_tone_support":false,"name":"nerd face","slug":"nerd_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🧐","skin_tone_support":false,"name":"face with monocle","slug":"face_with_monocle","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"😕","skin_tone_support":false,"name":"confused face","slug":"confused_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫤","skin_tone_support":false,"name":"face with diagonal mouth","slug":"face_with_diagonal_mouth","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"😟","skin_tone_support":false,"name":"worried face","slug":"worried_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🙁","skin_tone_support":false,"name":"slightly frowning face","slug":"slightly_frowning_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"☹️","skin_tone_support":false,"name":"frowning face","slug":"frowning_face","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"😮","skin_tone_support":false,"name":"face with open mouth","slug":"face_with_open_mouth","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😯","skin_tone_support":false,"name":"hushed face","slug":"hushed_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😲","skin_tone_support":false,"name":"astonished face","slug":"astonished_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😳","skin_tone_support":false,"name":"flushed face","slug":"flushed_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫪","skin_tone_support":false,"name":"distorted face","slug":"distorted_face","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"🥺","skin_tone_support":false,"name":"pleading face","slug":"pleading_face","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥹","skin_tone_support":false,"name":"face holding back tears","slug":"face_holding_back_tears","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"😦","skin_tone_support":false,"name":"frowning face with open mouth","slug":"frowning_face_with_open_mouth","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😧","skin_tone_support":false,"name":"anguished face","slug":"anguished_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😨","skin_tone_support":false,"name":"fearful face","slug":"fearful_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😰","skin_tone_support":false,"name":"anxious face with sweat","slug":"anxious_face_with_sweat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😥","skin_tone_support":false,"name":"sad but relieved face","slug":"sad_but_relieved_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😢","skin_tone_support":false,"name":"crying face","slug":"crying_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😭","skin_tone_support":false,"name":"loudly crying face","slug":"loudly_crying_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😱","skin_tone_support":false,"name":"face screaming in fear","slug":"face_screaming_in_fear","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😖","skin_tone_support":false,"name":"confounded face","slug":"confounded_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😣","skin_tone_support":false,"name":"persevering face","slug":"persevering_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😞","skin_tone_support":false,"name":"disappointed face","slug":"disappointed_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😓","skin_tone_support":false,"name":"downcast face with sweat","slug":"downcast_face_with_sweat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😩","skin_tone_support":false,"name":"weary face","slug":"weary_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😫","skin_tone_support":false,"name":"tired face","slug":"tired_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥱","skin_tone_support":false,"name":"yawning face","slug":"yawning_face","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"😤","skin_tone_support":false,"name":"face with steam from nose","slug":"face_with_steam_from_nose","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😡","skin_tone_support":false,"name":"enraged face","slug":"enraged_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😠","skin_tone_support":false,"name":"angry face","slug":"angry_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤬","skin_tone_support":false,"name":"face with symbols on mouth","slug":"face_with_symbols_on_mouth","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"😈","skin_tone_support":false,"name":"smiling face with horns","slug":"smiling_face_with_horns","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"👿","skin_tone_support":false,"name":"angry face with horns","slug":"angry_face_with_horns","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💀","skin_tone_support":false,"name":"skull","slug":"skull","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☠️","skin_tone_support":false,"name":"skull and crossbones","slug":"skull_and_crossbones","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💩","skin_tone_support":false,"name":"pile of poo","slug":"pile_of_poo","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤡","skin_tone_support":false,"name":"clown face","slug":"clown_face","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"👹","skin_tone_support":false,"name":"ogre","slug":"ogre","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👺","skin_tone_support":false,"name":"goblin","slug":"goblin","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👻","skin_tone_support":false,"name":"ghost","slug":"ghost","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👽","skin_tone_support":false,"name":"alien","slug":"alien","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👾","skin_tone_support":false,"name":"alien monster","slug":"alien_monster","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤖","skin_tone_support":false,"name":"robot","slug":"robot","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"😺","skin_tone_support":false,"name":"grinning cat","slug":"grinning_cat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😸","skin_tone_support":false,"name":"grinning cat with smiling eyes","slug":"grinning_cat_with_smiling_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😹","skin_tone_support":false,"name":"cat with tears of joy","slug":"cat_with_tears_of_joy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😻","skin_tone_support":false,"name":"smiling cat with heart-eyes","slug":"smiling_cat_with_heart_eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😼","skin_tone_support":false,"name":"cat with wry smile","slug":"cat_with_wry_smile","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😽","skin_tone_support":false,"name":"kissing cat","slug":"kissing_cat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙀","skin_tone_support":false,"name":"weary cat","slug":"weary_cat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😿","skin_tone_support":false,"name":"crying cat","slug":"crying_cat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"😾","skin_tone_support":false,"name":"pouting cat","slug":"pouting_cat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙈","skin_tone_support":false,"name":"see-no-evil monkey","slug":"see_no_evil_monkey","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙉","skin_tone_support":false,"name":"hear-no-evil monkey","slug":"hear_no_evil_monkey","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙊","skin_tone_support":false,"name":"speak-no-evil monkey","slug":"speak_no_evil_monkey","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💌","skin_tone_support":false,"name":"love letter","slug":"love_letter","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💘","skin_tone_support":false,"name":"heart with arrow","slug":"heart_with_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💝","skin_tone_support":false,"name":"heart with ribbon","slug":"heart_with_ribbon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💖","skin_tone_support":false,"name":"sparkling heart","slug":"sparkling_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💗","skin_tone_support":false,"name":"growing heart","slug":"growing_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💓","skin_tone_support":false,"name":"beating heart","slug":"beating_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💞","skin_tone_support":false,"name":"revolving hearts","slug":"revolving_hearts","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💕","skin_tone_support":false,"name":"two hearts","slug":"two_hearts","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💟","skin_tone_support":false,"name":"heart decoration","slug":"heart_decoration","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❣️","skin_tone_support":false,"name":"heart exclamation","slug":"heart_exclamation","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💔","skin_tone_support":false,"name":"broken heart","slug":"broken_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❤️‍🔥","skin_tone_support":false,"name":"heart on fire","slug":"heart_on_fire","unicode_version":"13.1","emoji_version":"13.1"},{"emoji":"❤️‍🩹","skin_tone_support":false,"name":"mending heart","slug":"mending_heart","unicode_version":"13.1","emoji_version":"13.1"},{"emoji":"❤️","skin_tone_support":false,"name":"red heart","slug":"red_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🩷","skin_tone_support":false,"name":"pink heart","slug":"pink_heart","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🧡","skin_tone_support":false,"name":"orange heart","slug":"orange_heart","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"💛","skin_tone_support":false,"name":"yellow heart","slug":"yellow_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💚","skin_tone_support":false,"name":"green heart","slug":"green_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💙","skin_tone_support":false,"name":"blue heart","slug":"blue_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🩵","skin_tone_support":false,"name":"light blue heart","slug":"light_blue_heart","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"💜","skin_tone_support":false,"name":"purple heart","slug":"purple_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤎","skin_tone_support":false,"name":"brown heart","slug":"brown_heart","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🖤","skin_tone_support":false,"name":"black heart","slug":"black_heart","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🩶","skin_tone_support":false,"name":"grey heart","slug":"grey_heart","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🤍","skin_tone_support":false,"name":"white heart","slug":"white_heart","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"💋","skin_tone_support":false,"name":"kiss mark","slug":"kiss_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💯","skin_tone_support":false,"name":"hundred points","slug":"hundred_points","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💢","skin_tone_support":false,"name":"anger symbol","slug":"anger_symbol","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫯","skin_tone_support":false,"name":"fight cloud","slug":"fight_cloud","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"💥","skin_tone_support":false,"name":"collision","slug":"collision","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💫","skin_tone_support":false,"name":"dizzy","slug":"dizzy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💦","skin_tone_support":false,"name":"sweat droplets","slug":"sweat_droplets","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💨","skin_tone_support":false,"name":"dashing away","slug":"dashing_away","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕳️","skin_tone_support":false,"name":"hole","slug":"hole","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"💬","skin_tone_support":false,"name":"speech balloon","slug":"speech_balloon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👁️‍🗨️","skin_tone_support":false,"name":"eye in speech bubble","slug":"eye_in_speech_bubble","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🗨️","skin_tone_support":false,"name":"left speech bubble","slug":"left_speech_bubble","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🗯️","skin_tone_support":false,"name":"right anger bubble","slug":"right_anger_bubble","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"💭","skin_tone_support":false,"name":"thought balloon","slug":"thought_balloon","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💤","skin_tone_support":false,"name":"ZZZ","slug":"zzz","unicode_version":"0.6","emoji_version":"0.6"}]},{"name":"People & Body","slug":"people_body","emojis":[{"emoji":"👋","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"waving hand","slug":"waving_hand","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤚","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"raised back of hand","slug":"raised_back_of_hand","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🖐️","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"hand with fingers splayed","slug":"hand_with_fingers_splayed","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"✋","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"raised hand","slug":"raised_hand","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🖖","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"vulcan salute","slug":"vulcan_salute","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫱","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"rightwards hand","slug":"rightwards_hand","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🫲","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"leftwards hand","slug":"leftwards_hand","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🫳","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"palm down hand","slug":"palm_down_hand","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🫴","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"palm up hand","slug":"palm_up_hand","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🫷","skin_tone_support":true,"skin_tone_support_unicode_version":"15.0","name":"leftwards pushing hand","slug":"leftwards_pushing_hand","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🫸","skin_tone_support":true,"skin_tone_support_unicode_version":"15.0","name":"rightwards pushing hand","slug":"rightwards_pushing_hand","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"👌","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"OK hand","slug":"ok_hand","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤌","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"pinched fingers","slug":"pinched_fingers","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🤏","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"pinching hand","slug":"pinching_hand","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"✌️","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"victory hand","slug":"victory_hand","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤞","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"crossed fingers","slug":"crossed_fingers","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🫰","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"hand with index finger and thumb crossed","slug":"hand_with_index_finger_and_thumb_crossed","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🤟","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"love-you gesture","slug":"love_you_gesture","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🤘","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"sign of the horns","slug":"sign_of_the_horns","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🤙","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"call me hand","slug":"call_me_hand","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"👈","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"backhand index pointing left","slug":"backhand_index_pointing_left","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👉","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"backhand index pointing right","slug":"backhand_index_pointing_right","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👆","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"backhand index pointing up","slug":"backhand_index_pointing_up","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🖕","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"middle finger","slug":"middle_finger","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"👇","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"backhand index pointing down","slug":"backhand_index_pointing_down","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☝️","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"index pointing up","slug":"index_pointing_up","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫵","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"index pointing at the viewer","slug":"index_pointing_at_the_viewer","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"👍","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"thumbs up","slug":"thumbs_up","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👎","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"thumbs down","slug":"thumbs_down","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✊","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"raised fist","slug":"raised_fist","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👊","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"oncoming fist","slug":"oncoming_fist","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤛","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"left-facing fist","slug":"left_facing_fist","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤜","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"right-facing fist","slug":"right_facing_fist","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"👏","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"clapping hands","slug":"clapping_hands","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙌","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"raising hands","slug":"raising_hands","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫶","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"heart hands","slug":"heart_hands","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"👐","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"open hands","slug":"open_hands","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤲","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"palms up together","slug":"palms_up_together","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🤝","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"handshake","slug":"handshake","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🙏","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"folded hands","slug":"folded_hands","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✍️","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"writing hand","slug":"writing_hand","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"💅","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"nail polish","slug":"nail_polish","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤳","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"selfie","slug":"selfie","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"💪","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"flexed biceps","slug":"flexed_biceps","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦾","skin_tone_support":false,"name":"mechanical arm","slug":"mechanical_arm","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🦿","skin_tone_support":false,"name":"mechanical leg","slug":"mechanical_leg","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🦵","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"leg","slug":"leg","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦶","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"foot","slug":"foot","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"👂","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"ear","slug":"ear","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦻","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"ear with hearing aid","slug":"ear_with_hearing_aid","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👃","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"nose","slug":"nose","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧠","skin_tone_support":false,"name":"brain","slug":"brain","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🫀","skin_tone_support":false,"name":"anatomical heart","slug":"anatomical_heart","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🫁","skin_tone_support":false,"name":"lungs","slug":"lungs","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🦷","skin_tone_support":false,"name":"tooth","slug":"tooth","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦴","skin_tone_support":false,"name":"bone","slug":"bone","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"👀","skin_tone_support":false,"name":"eyes","slug":"eyes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👁️","skin_tone_support":false,"name":"eye","slug":"eye","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"👅","skin_tone_support":false,"name":"tongue","slug":"tongue","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👄","skin_tone_support":false,"name":"mouth","slug":"mouth","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫦","skin_tone_support":false,"name":"biting lip","slug":"biting_lip","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"👶","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"baby","slug":"baby","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧒","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"child","slug":"child","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"👦","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"boy","slug":"boy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👧","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"girl","slug":"girl","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧑","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"person","slug":"person","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"👱","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person blond hair","slug":"person_blond_hair","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👨","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"man","slug":"man","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧔","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"person beard","slug":"person_beard","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧔‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"man beard","slug":"man_beard","unicode_version":"13.1","emoji_version":"13.1"},{"emoji":"🧔‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"woman beard","slug":"woman_beard","unicode_version":"13.1","emoji_version":"13.1"},{"emoji":"👨‍🦰","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"man red hair","slug":"man_red_hair","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"👨‍🦱","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"man curly hair","slug":"man_curly_hair","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"👨‍🦳","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"man white hair","slug":"man_white_hair","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"👨‍🦲","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"man bald","slug":"man_bald","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"👩","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"woman","slug":"woman","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👩‍🦰","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"woman red hair","slug":"woman_red_hair","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧑‍🦰","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"person red hair","slug":"person_red_hair","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👩‍🦱","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"woman curly hair","slug":"woman_curly_hair","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧑‍🦱","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"person curly hair","slug":"person_curly_hair","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👩‍🦳","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"woman white hair","slug":"woman_white_hair","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧑‍🦳","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"person white hair","slug":"person_white_hair","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👩‍🦲","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"woman bald","slug":"woman_bald","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧑‍🦲","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"person bald","slug":"person_bald","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👱‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman blond hair","slug":"woman_blond_hair","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👱‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man blond hair","slug":"man_blond_hair","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧓","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"older person","slug":"older_person","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"👴","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"old man","slug":"old_man","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👵","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"old woman","slug":"old_woman","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙍","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person frowning","slug":"person_frowning","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙍‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man frowning","slug":"man_frowning","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙍‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman frowning","slug":"woman_frowning","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙎","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person pouting","slug":"person_pouting","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙎‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man pouting","slug":"man_pouting","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙎‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman pouting","slug":"woman_pouting","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙅","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person gesturing NO","slug":"person_gesturing_no","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙅‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man gesturing NO","slug":"man_gesturing_no","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙅‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman gesturing NO","slug":"woman_gesturing_no","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙆","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person gesturing OK","slug":"person_gesturing_ok","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙆‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man gesturing OK","slug":"man_gesturing_ok","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙆‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman gesturing OK","slug":"woman_gesturing_ok","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"💁","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person tipping hand","slug":"person_tipping_hand","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💁‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man tipping hand","slug":"man_tipping_hand","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"💁‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman tipping hand","slug":"woman_tipping_hand","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙋","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person raising hand","slug":"person_raising_hand","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙋‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man raising hand","slug":"man_raising_hand","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙋‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman raising hand","slug":"woman_raising_hand","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧏","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"deaf person","slug":"deaf_person","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧏‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"deaf man","slug":"deaf_man","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧏‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"deaf woman","slug":"deaf_woman","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🙇","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person bowing","slug":"person_bowing","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🙇‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man bowing","slug":"man_bowing","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🙇‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman bowing","slug":"woman_bowing","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤦","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"person facepalming","slug":"person_facepalming","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤦‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man facepalming","slug":"man_facepalming","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤦‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman facepalming","slug":"woman_facepalming","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤷","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"person shrugging","slug":"person_shrugging","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤷‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man shrugging","slug":"man_shrugging","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤷‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman shrugging","slug":"woman_shrugging","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍⚕️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"health worker","slug":"health_worker","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍⚕️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man health worker","slug":"man_health_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍⚕️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman health worker","slug":"woman_health_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🎓","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"student","slug":"student","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🎓","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man student","slug":"man_student","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🎓","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman student","slug":"woman_student","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🏫","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"teacher","slug":"teacher","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🏫","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man teacher","slug":"man_teacher","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🏫","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman teacher","slug":"woman_teacher","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍⚖️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"judge","slug":"judge","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍⚖️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man judge","slug":"man_judge","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍⚖️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman judge","slug":"woman_judge","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🌾","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"farmer","slug":"farmer","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🌾","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man farmer","slug":"man_farmer","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🌾","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman farmer","slug":"woman_farmer","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🍳","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"cook","slug":"cook","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🍳","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man cook","slug":"man_cook","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🍳","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman cook","slug":"woman_cook","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🔧","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"mechanic","slug":"mechanic","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🔧","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man mechanic","slug":"man_mechanic","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🔧","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman mechanic","slug":"woman_mechanic","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🏭","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"factory worker","slug":"factory_worker","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🏭","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man factory worker","slug":"man_factory_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🏭","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman factory worker","slug":"woman_factory_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍💼","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"office worker","slug":"office_worker","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍💼","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man office worker","slug":"man_office_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍💼","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman office worker","slug":"woman_office_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🔬","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"scientist","slug":"scientist","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🔬","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man scientist","slug":"man_scientist","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🔬","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman scientist","slug":"woman_scientist","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍💻","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"technologist","slug":"technologist","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍💻","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man technologist","slug":"man_technologist","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍💻","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman technologist","slug":"woman_technologist","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🎤","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"singer","slug":"singer","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🎤","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man singer","slug":"man_singer","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🎤","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman singer","slug":"woman_singer","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🎨","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"artist","slug":"artist","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🎨","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man artist","slug":"man_artist","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🎨","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman artist","slug":"woman_artist","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍✈️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"pilot","slug":"pilot","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍✈️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man pilot","slug":"man_pilot","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍✈️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman pilot","slug":"woman_pilot","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🚀","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"astronaut","slug":"astronaut","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🚀","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man astronaut","slug":"man_astronaut","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🚀","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman astronaut","slug":"woman_astronaut","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧑‍🚒","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"firefighter","slug":"firefighter","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"👨‍🚒","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man firefighter","slug":"man_firefighter","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍🚒","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman firefighter","slug":"woman_firefighter","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👮","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"police officer","slug":"police_officer","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👮‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man police officer","slug":"man_police_officer","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👮‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman police officer","slug":"woman_police_officer","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🕵️","skin_tone_support":true,"skin_tone_support_unicode_version":"2.0","name":"detective","slug":"detective","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕵️‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man detective","slug":"man_detective","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🕵️‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman detective","slug":"woman_detective","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"💂","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"guard","slug":"guard","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💂‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man guard","slug":"man_guard","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"💂‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman guard","slug":"woman_guard","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🥷","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"ninja","slug":"ninja","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"👷","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"construction worker","slug":"construction_worker","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👷‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man construction worker","slug":"man_construction_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👷‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman construction worker","slug":"woman_construction_worker","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🫅","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"person with crown","slug":"person_with_crown","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🤴","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"prince","slug":"prince","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"👸","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"princess","slug":"princess","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👳","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person wearing turban","slug":"person_wearing_turban","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👳‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man wearing turban","slug":"man_wearing_turban","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👳‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman wearing turban","slug":"woman_wearing_turban","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👲","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person with skullcap","slug":"person_with_skullcap","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧕","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman with headscarf","slug":"woman_with_headscarf","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🤵","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"person in tuxedo","slug":"person_in_tuxedo","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤵‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"man in tuxedo","slug":"man_in_tuxedo","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🤵‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"woman in tuxedo","slug":"woman_in_tuxedo","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"👰","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person with veil","slug":"person_with_veil","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👰‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"man with veil","slug":"man_with_veil","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"👰‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"woman with veil","slug":"woman_with_veil","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🤰","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"pregnant woman","slug":"pregnant_woman","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🫃","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"pregnant man","slug":"pregnant_man","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🫄","skin_tone_support":true,"skin_tone_support_unicode_version":"14.0","name":"pregnant person","slug":"pregnant_person","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🤱","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"breast-feeding","slug":"breast_feeding","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"👩‍🍼","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"woman feeding baby","slug":"woman_feeding_baby","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"👨‍🍼","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"man feeding baby","slug":"man_feeding_baby","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🧑‍🍼","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"person feeding baby","slug":"person_feeding_baby","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"👼","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"baby angel","slug":"baby_angel","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎅","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"Santa Claus","slug":"santa_claus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤶","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"Mrs. Claus","slug":"mrs_claus","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🧑‍🎄","skin_tone_support":true,"skin_tone_support_unicode_version":"13.0","name":"Mx Claus","slug":"mx_claus","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🦸","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"superhero","slug":"superhero","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦸‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"man superhero","slug":"man_superhero","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦸‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"woman superhero","slug":"woman_superhero","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦹","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"supervillain","slug":"supervillain","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦹‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"man supervillain","slug":"man_supervillain","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦹‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"11.0","name":"woman supervillain","slug":"woman_supervillain","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧙","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"mage","slug":"mage","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧙‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"man mage","slug":"man_mage","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧙‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman mage","slug":"woman_mage","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧚","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"fairy","slug":"fairy","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧚‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"man fairy","slug":"man_fairy","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧚‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman fairy","slug":"woman_fairy","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧛","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"vampire","slug":"vampire","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧛‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"man vampire","slug":"man_vampire","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧛‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman vampire","slug":"woman_vampire","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧜","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"merperson","slug":"merperson","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧜‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"merman","slug":"merman","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧜‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"mermaid","slug":"mermaid","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧝","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"elf","slug":"elf","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧝‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"man elf","slug":"man_elf","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧝‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman elf","slug":"woman_elf","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧞","skin_tone_support":false,"name":"genie","slug":"genie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧞‍♂️","skin_tone_support":false,"name":"man genie","slug":"man_genie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧞‍♀️","skin_tone_support":false,"name":"woman genie","slug":"woman_genie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧟","skin_tone_support":false,"name":"zombie","slug":"zombie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧟‍♂️","skin_tone_support":false,"name":"man zombie","slug":"man_zombie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧟‍♀️","skin_tone_support":false,"name":"woman zombie","slug":"woman_zombie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧌","skin_tone_support":false,"name":"troll","slug":"troll","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🫈","skin_tone_support":false,"name":"hairy creature","slug":"hairy_creature","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"💆","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person getting massage","slug":"person_getting_massage","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💆‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man getting massage","slug":"man_getting_massage","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"💆‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman getting massage","slug":"woman_getting_massage","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"💇","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person getting haircut","slug":"person_getting_haircut","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💇‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man getting haircut","slug":"man_getting_haircut","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"💇‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman getting haircut","slug":"woman_getting_haircut","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚶","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person walking","slug":"person_walking","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚶‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man walking","slug":"man_walking","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚶‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman walking","slug":"woman_walking","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚶‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"person walking facing right","slug":"person_walking_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🚶‍♀️‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"woman walking facing right","slug":"woman_walking_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🚶‍♂️‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"man walking facing right","slug":"man_walking_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧍","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"person standing","slug":"person_standing","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧍‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"man standing","slug":"man_standing","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧍‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"woman standing","slug":"woman_standing","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧎","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"person kneeling","slug":"person_kneeling","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧎‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"man kneeling","slug":"man_kneeling","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧎‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"woman kneeling","slug":"woman_kneeling","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧎‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"person kneeling facing right","slug":"person_kneeling_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧎‍♀️‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"woman kneeling facing right","slug":"woman_kneeling_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧎‍♂️‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"man kneeling facing right","slug":"man_kneeling_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧑‍🦯","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"person with white cane","slug":"person_with_white_cane","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"🧑‍🦯‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"person with white cane facing right","slug":"person_with_white_cane_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"👨‍🦯","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"man with white cane","slug":"man_with_white_cane","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👨‍🦯‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"man with white cane facing right","slug":"man_with_white_cane_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"👩‍🦯","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"woman with white cane","slug":"woman_with_white_cane","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👩‍🦯‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"woman with white cane facing right","slug":"woman_with_white_cane_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧑‍🦼","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"person in motorized wheelchair","slug":"person_in_motorized_wheelchair","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"🧑‍🦼‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"person in motorized wheelchair facing right","slug":"person_in_motorized_wheelchair_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"👨‍🦼","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"man in motorized wheelchair","slug":"man_in_motorized_wheelchair","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👨‍🦼‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"man in motorized wheelchair facing right","slug":"man_in_motorized_wheelchair_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"👩‍🦼","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"woman in motorized wheelchair","slug":"woman_in_motorized_wheelchair","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👩‍🦼‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"woman in motorized wheelchair facing right","slug":"woman_in_motorized_wheelchair_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧑‍🦽","skin_tone_support":true,"skin_tone_support_unicode_version":"12.1","name":"person in manual wheelchair","slug":"person_in_manual_wheelchair","unicode_version":"12.1","emoji_version":"12.1"},{"emoji":"🧑‍🦽‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"person in manual wheelchair facing right","slug":"person_in_manual_wheelchair_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"👨‍🦽","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"man in manual wheelchair","slug":"man_in_manual_wheelchair","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👨‍🦽‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"man in manual wheelchair facing right","slug":"man_in_manual_wheelchair_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"👩‍🦽","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"woman in manual wheelchair","slug":"woman_in_manual_wheelchair","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👩‍🦽‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"woman in manual wheelchair facing right","slug":"woman_in_manual_wheelchair_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🏃","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person running","slug":"person_running","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏃‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man running","slug":"man_running","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏃‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman running","slug":"woman_running","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏃‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"person running facing right","slug":"person_running_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🏃‍♀️‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"woman running facing right","slug":"woman_running_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🏃‍♂️‍➡️","skin_tone_support":true,"skin_tone_support_unicode_version":"15.1","name":"man running facing right","slug":"man_running_facing_right","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧑‍🩰","skin_tone_support":true,"skin_tone_support_unicode_version":"17.0","name":"ballet dancer","slug":"ballet_dancer","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"💃","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"woman dancing","slug":"woman_dancing","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕺","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"man dancing","slug":"man_dancing","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🕴️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"person in suit levitating","slug":"person_in_suit_levitating","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"👯","skin_tone_support":true,"skin_tone_support_unicode_version":"17.0","name":"people with bunny ears","slug":"people_with_bunny_ears","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👯‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"17.0","name":"men with bunny ears","slug":"men_with_bunny_ears","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👯‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"17.0","name":"women with bunny ears","slug":"women_with_bunny_ears","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧖","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"person in steamy room","slug":"person_in_steamy_room","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧖‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"man in steamy room","slug":"man_in_steamy_room","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧖‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman in steamy room","slug":"woman_in_steamy_room","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧗","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"person climbing","slug":"person_climbing","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧗‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"man climbing","slug":"man_climbing","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧗‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman climbing","slug":"woman_climbing","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🤺","skin_tone_support":false,"name":"person fencing","slug":"person_fencing","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🏇","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"horse racing","slug":"horse_racing","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⛷️","skin_tone_support":false,"name":"skier","slug":"skier","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏂","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"snowboarder","slug":"snowboarder","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏌️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"person golfing","slug":"person_golfing","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏌️‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man golfing","slug":"man_golfing","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏌️‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman golfing","slug":"woman_golfing","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏄","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person surfing","slug":"person_surfing","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏄‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man surfing","slug":"man_surfing","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏄‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman surfing","slug":"woman_surfing","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚣","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person rowing boat","slug":"person_rowing_boat","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚣‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man rowing boat","slug":"man_rowing_boat","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚣‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman rowing boat","slug":"woman_rowing_boat","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏊","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person swimming","slug":"person_swimming","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏊‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man swimming","slug":"man_swimming","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏊‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman swimming","slug":"woman_swimming","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"⛹️","skin_tone_support":true,"skin_tone_support_unicode_version":"2.0","name":"person bouncing ball","slug":"person_bouncing_ball","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⛹️‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man bouncing ball","slug":"man_bouncing_ball","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"⛹️‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman bouncing ball","slug":"woman_bouncing_ball","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏋️","skin_tone_support":true,"skin_tone_support_unicode_version":"2.0","name":"person lifting weights","slug":"person_lifting_weights","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏋️‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man lifting weights","slug":"man_lifting_weights","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏋️‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman lifting weights","slug":"woman_lifting_weights","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚴","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person biking","slug":"person_biking","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚴‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man biking","slug":"man_biking","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚴‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman biking","slug":"woman_biking","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚵","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person mountain biking","slug":"person_mountain_biking","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚵‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man mountain biking","slug":"man_mountain_biking","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🚵‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman mountain biking","slug":"woman_mountain_biking","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤸","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"person cartwheeling","slug":"person_cartwheeling","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤸‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man cartwheeling","slug":"man_cartwheeling","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤸‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman cartwheeling","slug":"woman_cartwheeling","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤼","skin_tone_support":true,"skin_tone_support_unicode_version":"17.0","name":"people wrestling","slug":"people_wrestling","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤼‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"17.0","name":"men wrestling","slug":"men_wrestling","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤼‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"17.0","name":"women wrestling","slug":"women_wrestling","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤽","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"person playing water polo","slug":"person_playing_water_polo","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤽‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man playing water polo","slug":"man_playing_water_polo","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤽‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman playing water polo","slug":"woman_playing_water_polo","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤾","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"person playing handball","slug":"person_playing_handball","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤾‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man playing handball","slug":"man_playing_handball","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤾‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman playing handball","slug":"woman_playing_handball","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤹","skin_tone_support":true,"skin_tone_support_unicode_version":"3.0","name":"person juggling","slug":"person_juggling","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🤹‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"man juggling","slug":"man_juggling","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🤹‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"woman juggling","slug":"woman_juggling","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🧘","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"person in lotus position","slug":"person_in_lotus_position","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧘‍♂️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"man in lotus position","slug":"man_in_lotus_position","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧘‍♀️","skin_tone_support":true,"skin_tone_support_unicode_version":"5.0","name":"woman in lotus position","slug":"woman_in_lotus_position","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🛀","skin_tone_support":true,"skin_tone_support_unicode_version":"1.0","name":"person taking bath","slug":"person_taking_bath","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛌","skin_tone_support":true,"skin_tone_support_unicode_version":"4.0","name":"person in bed","slug":"person_in_bed","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🧑‍🤝‍🧑","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"people holding hands","slug":"people_holding_hands","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👭","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"women holding hands","slug":"women_holding_hands","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"👫","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"woman and man holding hands","slug":"woman_and_man_holding_hands","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👬","skin_tone_support":true,"skin_tone_support_unicode_version":"12.0","name":"men holding hands","slug":"men_holding_hands","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💏","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"kiss","slug":"kiss","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👩‍❤️‍💋‍👨","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"kiss woman, man","slug":"kiss_woman_man","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍❤️‍💋‍👨","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"kiss man, man","slug":"kiss_man_man","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👩‍❤️‍💋‍👩","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"kiss woman, woman","slug":"kiss_woman_woman","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"💑","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"couple with heart","slug":"couple_with_heart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👩‍❤️‍👨","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"couple with heart woman, man","slug":"couple_with_heart_woman_man","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍❤️‍👨","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"couple with heart man, man","slug":"couple_with_heart_man_man","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👩‍❤️‍👩","skin_tone_support":true,"skin_tone_support_unicode_version":"13.1","name":"couple with heart woman, woman","slug":"couple_with_heart_woman_woman","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👩‍👦","skin_tone_support":false,"name":"family man, woman, boy","slug":"family_man_woman_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👩‍👧","skin_tone_support":false,"name":"family man, woman, girl","slug":"family_man_woman_girl","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👩‍👧‍👦","skin_tone_support":false,"name":"family man, woman, girl, boy","slug":"family_man_woman_girl_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👩‍👦‍👦","skin_tone_support":false,"name":"family man, woman, boy, boy","slug":"family_man_woman_boy_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👩‍👧‍👧","skin_tone_support":false,"name":"family man, woman, girl, girl","slug":"family_man_woman_girl_girl","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👨‍👦","skin_tone_support":false,"name":"family man, man, boy","slug":"family_man_man_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👨‍👧","skin_tone_support":false,"name":"family man, man, girl","slug":"family_man_man_girl","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👨‍👧‍👦","skin_tone_support":false,"name":"family man, man, girl, boy","slug":"family_man_man_girl_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👨‍👦‍👦","skin_tone_support":false,"name":"family man, man, boy, boy","slug":"family_man_man_boy_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👨‍👧‍👧","skin_tone_support":false,"name":"family man, man, girl, girl","slug":"family_man_man_girl_girl","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👩‍👩‍👦","skin_tone_support":false,"name":"family woman, woman, boy","slug":"family_woman_woman_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👩‍👩‍👧","skin_tone_support":false,"name":"family woman, woman, girl","slug":"family_woman_woman_girl","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👩‍👩‍👧‍👦","skin_tone_support":false,"name":"family woman, woman, girl, boy","slug":"family_woman_woman_girl_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👩‍👩‍👦‍👦","skin_tone_support":false,"name":"family woman, woman, boy, boy","slug":"family_woman_woman_boy_boy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👩‍👩‍👧‍👧","skin_tone_support":false,"name":"family woman, woman, girl, girl","slug":"family_woman_woman_girl_girl","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"👨‍👦","skin_tone_support":false,"name":"family man, boy","slug":"family_man_boy","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👨‍👦‍👦","skin_tone_support":false,"name":"family man, boy, boy","slug":"family_man_boy_boy","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👨‍👧","skin_tone_support":false,"name":"family man, girl","slug":"family_man_girl","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👨‍👧‍👦","skin_tone_support":false,"name":"family man, girl, boy","slug":"family_man_girl_boy","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👨‍👧‍👧","skin_tone_support":false,"name":"family man, girl, girl","slug":"family_man_girl_girl","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍👦","skin_tone_support":false,"name":"family woman, boy","slug":"family_woman_boy","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍👦‍👦","skin_tone_support":false,"name":"family woman, boy, boy","slug":"family_woman_boy_boy","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍👧","skin_tone_support":false,"name":"family woman, girl","slug":"family_woman_girl","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍👧‍👦","skin_tone_support":false,"name":"family woman, girl, boy","slug":"family_woman_girl_boy","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"👩‍👧‍👧","skin_tone_support":false,"name":"family woman, girl, girl","slug":"family_woman_girl_girl","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🗣️","skin_tone_support":false,"name":"speaking head","slug":"speaking_head","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"👤","skin_tone_support":false,"name":"bust in silhouette","slug":"bust_in_silhouette","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👥","skin_tone_support":false,"name":"busts in silhouette","slug":"busts_in_silhouette","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫂","skin_tone_support":false,"name":"people hugging","slug":"people_hugging","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"👪","skin_tone_support":false,"name":"family","slug":"family","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧑‍🧑‍🧒","skin_tone_support":false,"name":"family adult, adult, child","slug":"family_adult_adult_child","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧑‍🧑‍🧒‍🧒","skin_tone_support":false,"name":"family adult, adult, child, child","slug":"family_adult_adult_child_child","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧑‍🧒","skin_tone_support":false,"name":"family adult, child","slug":"family_adult_child","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🧑‍🧒‍🧒","skin_tone_support":false,"name":"family adult, child, child","slug":"family_adult_child_child","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"👣","skin_tone_support":false,"name":"footprints","slug":"footprints","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫆","skin_tone_support":false,"name":"fingerprint","slug":"fingerprint","unicode_version":"16.0","emoji_version":"16.0"}]},{"name":"Animals & Nature","slug":"animals_nature","emojis":[{"emoji":"🐵","skin_tone_support":false,"name":"monkey face","slug":"monkey_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐒","skin_tone_support":false,"name":"monkey","slug":"monkey","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦍","skin_tone_support":false,"name":"gorilla","slug":"gorilla","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦧","skin_tone_support":false,"name":"orangutan","slug":"orangutan","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🐶","skin_tone_support":false,"name":"dog face","slug":"dog_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐕","skin_tone_support":false,"name":"dog","slug":"dog","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🦮","skin_tone_support":false,"name":"guide dog","slug":"guide_dog","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🐕‍🦺","skin_tone_support":false,"name":"service dog","slug":"service_dog","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🐩","skin_tone_support":false,"name":"poodle","slug":"poodle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐺","skin_tone_support":false,"name":"wolf","slug":"wolf","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦊","skin_tone_support":false,"name":"fox","slug":"fox","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦝","skin_tone_support":false,"name":"raccoon","slug":"raccoon","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🐱","skin_tone_support":false,"name":"cat face","slug":"cat_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐈","skin_tone_support":false,"name":"cat","slug":"cat","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🐈‍⬛","skin_tone_support":false,"name":"black cat","slug":"black_cat","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🦁","skin_tone_support":false,"name":"lion","slug":"lion","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐯","skin_tone_support":false,"name":"tiger face","slug":"tiger_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐅","skin_tone_support":false,"name":"tiger","slug":"tiger","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐆","skin_tone_support":false,"name":"leopard","slug":"leopard","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐴","skin_tone_support":false,"name":"horse face","slug":"horse_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫎","skin_tone_support":false,"name":"moose","slug":"moose","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🫏","skin_tone_support":false,"name":"donkey","slug":"donkey","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🐎","skin_tone_support":false,"name":"horse","slug":"horse","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦄","skin_tone_support":false,"name":"unicorn","slug":"unicorn","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🦓","skin_tone_support":false,"name":"zebra","slug":"zebra","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🦌","skin_tone_support":false,"name":"deer","slug":"deer","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦬","skin_tone_support":false,"name":"bison","slug":"bison","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🐮","skin_tone_support":false,"name":"cow face","slug":"cow_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐂","skin_tone_support":false,"name":"ox","slug":"ox","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐃","skin_tone_support":false,"name":"water buffalo","slug":"water_buffalo","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐄","skin_tone_support":false,"name":"cow","slug":"cow","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐷","skin_tone_support":false,"name":"pig face","slug":"pig_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐖","skin_tone_support":false,"name":"pig","slug":"pig","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐗","skin_tone_support":false,"name":"boar","slug":"boar","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐽","skin_tone_support":false,"name":"pig nose","slug":"pig_nose","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐏","skin_tone_support":false,"name":"ram","slug":"ram","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐑","skin_tone_support":false,"name":"ewe","slug":"ewe","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐐","skin_tone_support":false,"name":"goat","slug":"goat","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐪","skin_tone_support":false,"name":"camel","slug":"camel","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐫","skin_tone_support":false,"name":"two-hump camel","slug":"two_hump_camel","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦙","skin_tone_support":false,"name":"llama","slug":"llama","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦒","skin_tone_support":false,"name":"giraffe","slug":"giraffe","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🐘","skin_tone_support":false,"name":"elephant","slug":"elephant","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦣","skin_tone_support":false,"name":"mammoth","slug":"mammoth","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🦏","skin_tone_support":false,"name":"rhinoceros","slug":"rhinoceros","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦛","skin_tone_support":false,"name":"hippopotamus","slug":"hippopotamus","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🐭","skin_tone_support":false,"name":"mouse face","slug":"mouse_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐁","skin_tone_support":false,"name":"mouse","slug":"mouse","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐀","skin_tone_support":false,"name":"rat","slug":"rat","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐹","skin_tone_support":false,"name":"hamster","slug":"hamster","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐰","skin_tone_support":false,"name":"rabbit face","slug":"rabbit_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐇","skin_tone_support":false,"name":"rabbit","slug":"rabbit","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐿️","skin_tone_support":false,"name":"chipmunk","slug":"chipmunk","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🦫","skin_tone_support":false,"name":"beaver","slug":"beaver","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🦔","skin_tone_support":false,"name":"hedgehog","slug":"hedgehog","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🦇","skin_tone_support":false,"name":"bat","slug":"bat","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🐻","skin_tone_support":false,"name":"bear","slug":"bear","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐻‍❄️","skin_tone_support":false,"name":"polar bear","slug":"polar_bear","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🐨","skin_tone_support":false,"name":"koala","slug":"koala","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐼","skin_tone_support":false,"name":"panda","slug":"panda","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦥","skin_tone_support":false,"name":"sloth","slug":"sloth","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🦦","skin_tone_support":false,"name":"otter","slug":"otter","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🦨","skin_tone_support":false,"name":"skunk","slug":"skunk","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🦘","skin_tone_support":false,"name":"kangaroo","slug":"kangaroo","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦡","skin_tone_support":false,"name":"badger","slug":"badger","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🐾","skin_tone_support":false,"name":"paw prints","slug":"paw_prints","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦃","skin_tone_support":false,"name":"turkey","slug":"turkey","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐔","skin_tone_support":false,"name":"chicken","slug":"chicken","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐓","skin_tone_support":false,"name":"rooster","slug":"rooster","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐣","skin_tone_support":false,"name":"hatching chick","slug":"hatching_chick","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐤","skin_tone_support":false,"name":"baby chick","slug":"baby_chick","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐥","skin_tone_support":false,"name":"front-facing baby chick","slug":"front_facing_baby_chick","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐦","skin_tone_support":false,"name":"bird","slug":"bird","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐧","skin_tone_support":false,"name":"penguin","slug":"penguin","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕊️","skin_tone_support":false,"name":"dove","slug":"dove","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🦅","skin_tone_support":false,"name":"eagle","slug":"eagle","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦆","skin_tone_support":false,"name":"duck","slug":"duck","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦢","skin_tone_support":false,"name":"swan","slug":"swan","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦉","skin_tone_support":false,"name":"owl","slug":"owl","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦤","skin_tone_support":false,"name":"dodo","slug":"dodo","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪶","skin_tone_support":false,"name":"feather","slug":"feather","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🦩","skin_tone_support":false,"name":"flamingo","slug":"flamingo","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🦚","skin_tone_support":false,"name":"peacock","slug":"peacock","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦜","skin_tone_support":false,"name":"parrot","slug":"parrot","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪽","skin_tone_support":false,"name":"wing","slug":"wing","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🐦‍⬛","skin_tone_support":false,"name":"black bird","slug":"black_bird","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🪿","skin_tone_support":false,"name":"goose","slug":"goose","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🐦‍🔥","skin_tone_support":false,"name":"phoenix","slug":"phoenix","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🐸","skin_tone_support":false,"name":"frog","slug":"frog","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐊","skin_tone_support":false,"name":"crocodile","slug":"crocodile","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐢","skin_tone_support":false,"name":"turtle","slug":"turtle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦎","skin_tone_support":false,"name":"lizard","slug":"lizard","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🐍","skin_tone_support":false,"name":"snake","slug":"snake","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐲","skin_tone_support":false,"name":"dragon face","slug":"dragon_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐉","skin_tone_support":false,"name":"dragon","slug":"dragon","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🦕","skin_tone_support":false,"name":"sauropod","slug":"sauropod","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🦖","skin_tone_support":false,"name":"T-Rex","slug":"t_rex","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🐳","skin_tone_support":false,"name":"spouting whale","slug":"spouting_whale","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐋","skin_tone_support":false,"name":"whale","slug":"whale","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🐬","skin_tone_support":false,"name":"dolphin","slug":"dolphin","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫍","skin_tone_support":false,"name":"orca","slug":"orca","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"🦭","skin_tone_support":false,"name":"seal","slug":"seal","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🐟","skin_tone_support":false,"name":"fish","slug":"fish","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐠","skin_tone_support":false,"name":"tropical fish","slug":"tropical_fish","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐡","skin_tone_support":false,"name":"blowfish","slug":"blowfish","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦈","skin_tone_support":false,"name":"shark","slug":"shark","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🐙","skin_tone_support":false,"name":"octopus","slug":"octopus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐚","skin_tone_support":false,"name":"spiral shell","slug":"spiral_shell","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪸","skin_tone_support":false,"name":"coral","slug":"coral","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🪼","skin_tone_support":false,"name":"jellyfish","slug":"jellyfish","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🦀","skin_tone_support":false,"name":"crab","slug":"crab","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🦞","skin_tone_support":false,"name":"lobster","slug":"lobster","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦐","skin_tone_support":false,"name":"shrimp","slug":"shrimp","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦑","skin_tone_support":false,"name":"squid","slug":"squid","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦪","skin_tone_support":false,"name":"oyster","slug":"oyster","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🐌","skin_tone_support":false,"name":"snail","slug":"snail","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦋","skin_tone_support":false,"name":"butterfly","slug":"butterfly","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🐛","skin_tone_support":false,"name":"bug","slug":"bug","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐜","skin_tone_support":false,"name":"ant","slug":"ant","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🐝","skin_tone_support":false,"name":"honeybee","slug":"honeybee","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪲","skin_tone_support":false,"name":"beetle","slug":"beetle","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🐞","skin_tone_support":false,"name":"lady beetle","slug":"lady_beetle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🦗","skin_tone_support":false,"name":"cricket","slug":"cricket","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🪳","skin_tone_support":false,"name":"cockroach","slug":"cockroach","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🕷️","skin_tone_support":false,"name":"spider","slug":"spider","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕸️","skin_tone_support":false,"name":"spider web","slug":"spider_web","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🦂","skin_tone_support":false,"name":"scorpion","slug":"scorpion","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🦟","skin_tone_support":false,"name":"mosquito","slug":"mosquito","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪰","skin_tone_support":false,"name":"fly","slug":"fly","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪱","skin_tone_support":false,"name":"worm","slug":"worm","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🦠","skin_tone_support":false,"name":"microbe","slug":"microbe","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"💐","skin_tone_support":false,"name":"bouquet","slug":"bouquet","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌸","skin_tone_support":false,"name":"cherry blossom","slug":"cherry_blossom","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💮","skin_tone_support":false,"name":"white flower","slug":"white_flower","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪷","skin_tone_support":false,"name":"lotus","slug":"lotus","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🏵️","skin_tone_support":false,"name":"rosette","slug":"rosette","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌹","skin_tone_support":false,"name":"rose","slug":"rose","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥀","skin_tone_support":false,"name":"wilted flower","slug":"wilted_flower","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🌺","skin_tone_support":false,"name":"hibiscus","slug":"hibiscus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌻","skin_tone_support":false,"name":"sunflower","slug":"sunflower","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌼","skin_tone_support":false,"name":"blossom","slug":"blossom","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌷","skin_tone_support":false,"name":"tulip","slug":"tulip","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪻","skin_tone_support":false,"name":"hyacinth","slug":"hyacinth","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🌱","skin_tone_support":false,"name":"seedling","slug":"seedling","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪴","skin_tone_support":false,"name":"potted plant","slug":"potted_plant","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🌲","skin_tone_support":false,"name":"evergreen tree","slug":"evergreen_tree","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌳","skin_tone_support":false,"name":"deciduous tree","slug":"deciduous_tree","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌴","skin_tone_support":false,"name":"palm tree","slug":"palm_tree","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌵","skin_tone_support":false,"name":"cactus","slug":"cactus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌾","skin_tone_support":false,"name":"sheaf of rice","slug":"sheaf_of_rice","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌿","skin_tone_support":false,"name":"herb","slug":"herb","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☘️","skin_tone_support":false,"name":"shamrock","slug":"shamrock","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🍀","skin_tone_support":false,"name":"four leaf clover","slug":"four_leaf_clover","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍁","skin_tone_support":false,"name":"maple leaf","slug":"maple_leaf","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍂","skin_tone_support":false,"name":"fallen leaf","slug":"fallen_leaf","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍃","skin_tone_support":false,"name":"leaf fluttering in wind","slug":"leaf_fluttering_in_wind","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪹","skin_tone_support":false,"name":"empty nest","slug":"empty_nest","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🪺","skin_tone_support":false,"name":"nest with eggs","slug":"nest_with_eggs","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🍄","skin_tone_support":false,"name":"mushroom","slug":"mushroom","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪾","skin_tone_support":false,"name":"leafless tree","slug":"leafless_tree","unicode_version":"16.0","emoji_version":"16.0"}]},{"name":"Food & Drink","slug":"food_drink","emojis":[{"emoji":"🍇","skin_tone_support":false,"name":"grapes","slug":"grapes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍈","skin_tone_support":false,"name":"melon","slug":"melon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍉","skin_tone_support":false,"name":"watermelon","slug":"watermelon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍊","skin_tone_support":false,"name":"tangerine","slug":"tangerine","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍋","skin_tone_support":false,"name":"lemon","slug":"lemon","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🍋‍🟩","skin_tone_support":false,"name":"lime","slug":"lime","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🍌","skin_tone_support":false,"name":"banana","slug":"banana","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍍","skin_tone_support":false,"name":"pineapple","slug":"pineapple","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥭","skin_tone_support":false,"name":"mango","slug":"mango","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🍎","skin_tone_support":false,"name":"red apple","slug":"red_apple","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍏","skin_tone_support":false,"name":"green apple","slug":"green_apple","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍐","skin_tone_support":false,"name":"pear","slug":"pear","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🍑","skin_tone_support":false,"name":"peach","slug":"peach","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍒","skin_tone_support":false,"name":"cherries","slug":"cherries","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍓","skin_tone_support":false,"name":"strawberry","slug":"strawberry","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫐","skin_tone_support":false,"name":"blueberries","slug":"blueberries","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🥝","skin_tone_support":false,"name":"kiwi fruit","slug":"kiwi_fruit","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🍅","skin_tone_support":false,"name":"tomato","slug":"tomato","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫒","skin_tone_support":false,"name":"olive","slug":"olive","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🥥","skin_tone_support":false,"name":"coconut","slug":"coconut","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🥑","skin_tone_support":false,"name":"avocado","slug":"avocado","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🍆","skin_tone_support":false,"name":"eggplant","slug":"eggplant","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥔","skin_tone_support":false,"name":"potato","slug":"potato","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥕","skin_tone_support":false,"name":"carrot","slug":"carrot","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🌽","skin_tone_support":false,"name":"ear of corn","slug":"ear_of_corn","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌶️","skin_tone_support":false,"name":"hot pepper","slug":"hot_pepper","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🫑","skin_tone_support":false,"name":"bell pepper","slug":"bell_pepper","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🥒","skin_tone_support":false,"name":"cucumber","slug":"cucumber","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥬","skin_tone_support":false,"name":"leafy green","slug":"leafy_green","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥦","skin_tone_support":false,"name":"broccoli","slug":"broccoli","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧄","skin_tone_support":false,"name":"garlic","slug":"garlic","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧅","skin_tone_support":false,"name":"onion","slug":"onion","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🥜","skin_tone_support":false,"name":"peanuts","slug":"peanuts","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🫘","skin_tone_support":false,"name":"beans","slug":"beans","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🌰","skin_tone_support":false,"name":"chestnut","slug":"chestnut","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫚","skin_tone_support":false,"name":"ginger root","slug":"ginger_root","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🫛","skin_tone_support":false,"name":"pea pod","slug":"pea_pod","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🍄‍🟫","skin_tone_support":false,"name":"brown mushroom","slug":"brown_mushroom","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"🫜","skin_tone_support":false,"name":"root vegetable","slug":"root_vegetable","unicode_version":"16.0","emoji_version":"16.0"},{"emoji":"🍞","skin_tone_support":false,"name":"bread","slug":"bread","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥐","skin_tone_support":false,"name":"croissant","slug":"croissant","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥖","skin_tone_support":false,"name":"baguette bread","slug":"baguette_bread","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🫓","skin_tone_support":false,"name":"flatbread","slug":"flatbread","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🥨","skin_tone_support":false,"name":"pretzel","slug":"pretzel","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🥯","skin_tone_support":false,"name":"bagel","slug":"bagel","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥞","skin_tone_support":false,"name":"pancakes","slug":"pancakes","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🧇","skin_tone_support":false,"name":"waffle","slug":"waffle","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧀","skin_tone_support":false,"name":"cheese wedge","slug":"cheese_wedge","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🍖","skin_tone_support":false,"name":"meat on bone","slug":"meat_on_bone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍗","skin_tone_support":false,"name":"poultry leg","slug":"poultry_leg","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥩","skin_tone_support":false,"name":"cut of meat","slug":"cut_of_meat","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🥓","skin_tone_support":false,"name":"bacon","slug":"bacon","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🍔","skin_tone_support":false,"name":"hamburger","slug":"hamburger","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍟","skin_tone_support":false,"name":"french fries","slug":"french_fries","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍕","skin_tone_support":false,"name":"pizza","slug":"pizza","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌭","skin_tone_support":false,"name":"hot dog","slug":"hot_dog","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🥪","skin_tone_support":false,"name":"sandwich","slug":"sandwich","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🌮","skin_tone_support":false,"name":"taco","slug":"taco","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌯","skin_tone_support":false,"name":"burrito","slug":"burrito","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🫔","skin_tone_support":false,"name":"tamale","slug":"tamale","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🥙","skin_tone_support":false,"name":"stuffed flatbread","slug":"stuffed_flatbread","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🧆","skin_tone_support":false,"name":"falafel","slug":"falafel","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🥚","skin_tone_support":false,"name":"egg","slug":"egg","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🍳","skin_tone_support":false,"name":"cooking","slug":"cooking","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥘","skin_tone_support":false,"name":"shallow pan of food","slug":"shallow_pan_of_food","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🍲","skin_tone_support":false,"name":"pot of food","slug":"pot_of_food","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫕","skin_tone_support":false,"name":"fondue","slug":"fondue","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🥣","skin_tone_support":false,"name":"bowl with spoon","slug":"bowl_with_spoon","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🥗","skin_tone_support":false,"name":"green salad","slug":"green_salad","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🍿","skin_tone_support":false,"name":"popcorn","slug":"popcorn","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🧈","skin_tone_support":false,"name":"butter","slug":"butter","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧂","skin_tone_support":false,"name":"salt","slug":"salt","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥫","skin_tone_support":false,"name":"canned food","slug":"canned_food","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🍱","skin_tone_support":false,"name":"bento box","slug":"bento_box","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍘","skin_tone_support":false,"name":"rice cracker","slug":"rice_cracker","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍙","skin_tone_support":false,"name":"rice ball","slug":"rice_ball","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍚","skin_tone_support":false,"name":"cooked rice","slug":"cooked_rice","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍛","skin_tone_support":false,"name":"curry rice","slug":"curry_rice","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍜","skin_tone_support":false,"name":"steaming bowl","slug":"steaming_bowl","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍝","skin_tone_support":false,"name":"spaghetti","slug":"spaghetti","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍠","skin_tone_support":false,"name":"roasted sweet potato","slug":"roasted_sweet_potato","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍢","skin_tone_support":false,"name":"oden","slug":"oden","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍣","skin_tone_support":false,"name":"sushi","slug":"sushi","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍤","skin_tone_support":false,"name":"fried shrimp","slug":"fried_shrimp","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍥","skin_tone_support":false,"name":"fish cake with swirl","slug":"fish_cake_with_swirl","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥮","skin_tone_support":false,"name":"moon cake","slug":"moon_cake","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🍡","skin_tone_support":false,"name":"dango","slug":"dango","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥟","skin_tone_support":false,"name":"dumpling","slug":"dumpling","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🥠","skin_tone_support":false,"name":"fortune cookie","slug":"fortune_cookie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🥡","skin_tone_support":false,"name":"takeout box","slug":"takeout_box","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🍦","skin_tone_support":false,"name":"soft ice cream","slug":"soft_ice_cream","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍧","skin_tone_support":false,"name":"shaved ice","slug":"shaved_ice","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍨","skin_tone_support":false,"name":"ice cream","slug":"ice_cream","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍩","skin_tone_support":false,"name":"doughnut","slug":"doughnut","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍪","skin_tone_support":false,"name":"cookie","slug":"cookie","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎂","skin_tone_support":false,"name":"birthday cake","slug":"birthday_cake","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍰","skin_tone_support":false,"name":"shortcake","slug":"shortcake","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧁","skin_tone_support":false,"name":"cupcake","slug":"cupcake","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥧","skin_tone_support":false,"name":"pie","slug":"pie","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🍫","skin_tone_support":false,"name":"chocolate bar","slug":"chocolate_bar","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍬","skin_tone_support":false,"name":"candy","slug":"candy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍭","skin_tone_support":false,"name":"lollipop","slug":"lollipop","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍮","skin_tone_support":false,"name":"custard","slug":"custard","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍯","skin_tone_support":false,"name":"honey pot","slug":"honey_pot","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍼","skin_tone_support":false,"name":"baby bottle","slug":"baby_bottle","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🥛","skin_tone_support":false,"name":"glass of milk","slug":"glass_of_milk","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"☕","skin_tone_support":false,"name":"hot beverage","slug":"hot_beverage","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫖","skin_tone_support":false,"name":"teapot","slug":"teapot","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🍵","skin_tone_support":false,"name":"teacup without handle","slug":"teacup_without_handle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍶","skin_tone_support":false,"name":"sake","slug":"sake","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍾","skin_tone_support":false,"name":"bottle with popping cork","slug":"bottle_with_popping_cork","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🍷","skin_tone_support":false,"name":"wine glass","slug":"wine_glass","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍸","skin_tone_support":false,"name":"cocktail glass","slug":"cocktail_glass","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍹","skin_tone_support":false,"name":"tropical drink","slug":"tropical_drink","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍺","skin_tone_support":false,"name":"beer mug","slug":"beer_mug","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🍻","skin_tone_support":false,"name":"clinking beer mugs","slug":"clinking_beer_mugs","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥂","skin_tone_support":false,"name":"clinking glasses","slug":"clinking_glasses","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥃","skin_tone_support":false,"name":"tumbler glass","slug":"tumbler_glass","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🫗","skin_tone_support":false,"name":"pouring liquid","slug":"pouring_liquid","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🥤","skin_tone_support":false,"name":"cup with straw","slug":"cup_with_straw","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧋","skin_tone_support":false,"name":"bubble tea","slug":"bubble_tea","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🧃","skin_tone_support":false,"name":"beverage box","slug":"beverage_box","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧉","skin_tone_support":false,"name":"mate","slug":"mate","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧊","skin_tone_support":false,"name":"ice","slug":"ice","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🥢","skin_tone_support":false,"name":"chopsticks","slug":"chopsticks","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🍽️","skin_tone_support":false,"name":"fork and knife with plate","slug":"fork_and_knife_with_plate","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🍴","skin_tone_support":false,"name":"fork and knife","slug":"fork_and_knife","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥄","skin_tone_support":false,"name":"spoon","slug":"spoon","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🔪","skin_tone_support":false,"name":"kitchen knife","slug":"kitchen_knife","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫙","skin_tone_support":false,"name":"jar","slug":"jar","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🏺","skin_tone_support":false,"name":"amphora","slug":"amphora","unicode_version":"1.0","emoji_version":"1.0"}]},{"name":"Travel & Places","slug":"travel_places","emojis":[{"emoji":"🌍","skin_tone_support":false,"name":"globe showing Europe-Africa","slug":"globe_showing_europe_africa","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌎","skin_tone_support":false,"name":"globe showing Americas","slug":"globe_showing_americas","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌏","skin_tone_support":false,"name":"globe showing Asia-Australia","slug":"globe_showing_asia_australia","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌐","skin_tone_support":false,"name":"globe with meridians","slug":"globe_with_meridians","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🗺️","skin_tone_support":false,"name":"world map","slug":"world_map","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🗾","skin_tone_support":false,"name":"map of Japan","slug":"map_of_japan","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧭","skin_tone_support":false,"name":"compass","slug":"compass","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🏔️","skin_tone_support":false,"name":"snow-capped mountain","slug":"snow_capped_mountain","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⛰️","skin_tone_support":false,"name":"mountain","slug":"mountain","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🛘","skin_tone_support":false,"name":"landslide","slug":"landslide","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"🌋","skin_tone_support":false,"name":"volcano","slug":"volcano","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗻","skin_tone_support":false,"name":"mount fuji","slug":"mount_fuji","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏕️","skin_tone_support":false,"name":"camping","slug":"camping","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏖️","skin_tone_support":false,"name":"beach with umbrella","slug":"beach_with_umbrella","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏜️","skin_tone_support":false,"name":"desert","slug":"desert","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏝️","skin_tone_support":false,"name":"desert island","slug":"desert_island","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏞️","skin_tone_support":false,"name":"national park","slug":"national_park","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏟️","skin_tone_support":false,"name":"stadium","slug":"stadium","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏛️","skin_tone_support":false,"name":"classical building","slug":"classical_building","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏗️","skin_tone_support":false,"name":"building construction","slug":"building_construction","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🧱","skin_tone_support":false,"name":"brick","slug":"brick","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪨","skin_tone_support":false,"name":"rock","slug":"rock","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪵","skin_tone_support":false,"name":"wood","slug":"wood","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🛖","skin_tone_support":false,"name":"hut","slug":"hut","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🏘️","skin_tone_support":false,"name":"houses","slug":"houses","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏚️","skin_tone_support":false,"name":"derelict house","slug":"derelict_house","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏠","skin_tone_support":false,"name":"house","slug":"house","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏡","skin_tone_support":false,"name":"house with garden","slug":"house_with_garden","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏢","skin_tone_support":false,"name":"office building","slug":"office_building","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏣","skin_tone_support":false,"name":"Japanese post office","slug":"japanese_post_office","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏤","skin_tone_support":false,"name":"post office","slug":"post_office","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🏥","skin_tone_support":false,"name":"hospital","slug":"hospital","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏦","skin_tone_support":false,"name":"bank","slug":"bank","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏨","skin_tone_support":false,"name":"hotel","slug":"hotel","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏩","skin_tone_support":false,"name":"love hotel","slug":"love_hotel","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏪","skin_tone_support":false,"name":"convenience store","slug":"convenience_store","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏫","skin_tone_support":false,"name":"school","slug":"school","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏬","skin_tone_support":false,"name":"department store","slug":"department_store","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏭","skin_tone_support":false,"name":"factory","slug":"factory","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏯","skin_tone_support":false,"name":"Japanese castle","slug":"japanese_castle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏰","skin_tone_support":false,"name":"castle","slug":"castle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💒","skin_tone_support":false,"name":"wedding","slug":"wedding","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗼","skin_tone_support":false,"name":"Tokyo tower","slug":"tokyo_tower","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗽","skin_tone_support":false,"name":"Statue of Liberty","slug":"statue_of_liberty","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛪","skin_tone_support":false,"name":"church","slug":"church","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕌","skin_tone_support":false,"name":"mosque","slug":"mosque","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛕","skin_tone_support":false,"name":"hindu temple","slug":"hindu_temple","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🕍","skin_tone_support":false,"name":"synagogue","slug":"synagogue","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⛩️","skin_tone_support":false,"name":"shinto shrine","slug":"shinto_shrine","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕋","skin_tone_support":false,"name":"kaaba","slug":"kaaba","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⛲","skin_tone_support":false,"name":"fountain","slug":"fountain","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛺","skin_tone_support":false,"name":"tent","slug":"tent","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌁","skin_tone_support":false,"name":"foggy","slug":"foggy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌃","skin_tone_support":false,"name":"night with stars","slug":"night_with_stars","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏙️","skin_tone_support":false,"name":"cityscape","slug":"cityscape","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌄","skin_tone_support":false,"name":"sunrise over mountains","slug":"sunrise_over_mountains","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌅","skin_tone_support":false,"name":"sunrise","slug":"sunrise","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌆","skin_tone_support":false,"name":"cityscape at dusk","slug":"cityscape_at_dusk","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌇","skin_tone_support":false,"name":"sunset","slug":"sunset","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌉","skin_tone_support":false,"name":"bridge at night","slug":"bridge_at_night","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♨️","skin_tone_support":false,"name":"hot springs","slug":"hot_springs","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎠","skin_tone_support":false,"name":"carousel horse","slug":"carousel_horse","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛝","skin_tone_support":false,"name":"playground slide","slug":"playground_slide","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🎡","skin_tone_support":false,"name":"ferris wheel","slug":"ferris_wheel","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎢","skin_tone_support":false,"name":"roller coaster","slug":"roller_coaster","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💈","skin_tone_support":false,"name":"barber pole","slug":"barber_pole","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎪","skin_tone_support":false,"name":"circus tent","slug":"circus_tent","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚂","skin_tone_support":false,"name":"locomotive","slug":"locomotive","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚃","skin_tone_support":false,"name":"railway car","slug":"railway_car","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚄","skin_tone_support":false,"name":"high-speed train","slug":"high_speed_train","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚅","skin_tone_support":false,"name":"bullet train","slug":"bullet_train","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚆","skin_tone_support":false,"name":"train","slug":"train","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚇","skin_tone_support":false,"name":"metro","slug":"metro","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚈","skin_tone_support":false,"name":"light rail","slug":"light_rail","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚉","skin_tone_support":false,"name":"station","slug":"station","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚊","skin_tone_support":false,"name":"tram","slug":"tram","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚝","skin_tone_support":false,"name":"monorail","slug":"monorail","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚞","skin_tone_support":false,"name":"mountain railway","slug":"mountain_railway","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚋","skin_tone_support":false,"name":"tram car","slug":"tram_car","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚌","skin_tone_support":false,"name":"bus","slug":"bus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚍","skin_tone_support":false,"name":"oncoming bus","slug":"oncoming_bus","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🚎","skin_tone_support":false,"name":"trolleybus","slug":"trolleybus","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚐","skin_tone_support":false,"name":"minibus","slug":"minibus","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚑","skin_tone_support":false,"name":"ambulance","slug":"ambulance","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚒","skin_tone_support":false,"name":"fire engine","slug":"fire_engine","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚓","skin_tone_support":false,"name":"police car","slug":"police_car","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚔","skin_tone_support":false,"name":"oncoming police car","slug":"oncoming_police_car","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🚕","skin_tone_support":false,"name":"taxi","slug":"taxi","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚖","skin_tone_support":false,"name":"oncoming taxi","slug":"oncoming_taxi","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚗","skin_tone_support":false,"name":"automobile","slug":"automobile","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚘","skin_tone_support":false,"name":"oncoming automobile","slug":"oncoming_automobile","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🚙","skin_tone_support":false,"name":"sport utility vehicle","slug":"sport_utility_vehicle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛻","skin_tone_support":false,"name":"pickup truck","slug":"pickup_truck","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🚚","skin_tone_support":false,"name":"delivery truck","slug":"delivery_truck","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚛","skin_tone_support":false,"name":"articulated lorry","slug":"articulated_lorry","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚜","skin_tone_support":false,"name":"tractor","slug":"tractor","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🏎️","skin_tone_support":false,"name":"racing car","slug":"racing_car","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏍️","skin_tone_support":false,"name":"motorcycle","slug":"motorcycle","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🛵","skin_tone_support":false,"name":"motor scooter","slug":"motor_scooter","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🦽","skin_tone_support":false,"name":"manual wheelchair","slug":"manual_wheelchair","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🦼","skin_tone_support":false,"name":"motorized wheelchair","slug":"motorized_wheelchair","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🛺","skin_tone_support":false,"name":"auto rickshaw","slug":"auto_rickshaw","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🚲","skin_tone_support":false,"name":"bicycle","slug":"bicycle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛴","skin_tone_support":false,"name":"kick scooter","slug":"kick_scooter","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🛹","skin_tone_support":false,"name":"skateboard","slug":"skateboard","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🛼","skin_tone_support":false,"name":"roller skate","slug":"roller_skate","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🚏","skin_tone_support":false,"name":"bus stop","slug":"bus_stop","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛣️","skin_tone_support":false,"name":"motorway","slug":"motorway","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🛤️","skin_tone_support":false,"name":"railway track","slug":"railway_track","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🛢️","skin_tone_support":false,"name":"oil drum","slug":"oil_drum","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⛽","skin_tone_support":false,"name":"fuel pump","slug":"fuel_pump","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛞","skin_tone_support":false,"name":"wheel","slug":"wheel","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🚨","skin_tone_support":false,"name":"police car light","slug":"police_car_light","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚥","skin_tone_support":false,"name":"horizontal traffic light","slug":"horizontal_traffic_light","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚦","skin_tone_support":false,"name":"vertical traffic light","slug":"vertical_traffic_light","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛑","skin_tone_support":false,"name":"stop sign","slug":"stop_sign","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🚧","skin_tone_support":false,"name":"construction","slug":"construction","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⚓","skin_tone_support":false,"name":"anchor","slug":"anchor","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛟","skin_tone_support":false,"name":"ring buoy","slug":"ring_buoy","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"⛵","skin_tone_support":false,"name":"sailboat","slug":"sailboat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛶","skin_tone_support":false,"name":"canoe","slug":"canoe","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🚤","skin_tone_support":false,"name":"speedboat","slug":"speedboat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛳️","skin_tone_support":false,"name":"passenger ship","slug":"passenger_ship","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⛴️","skin_tone_support":false,"name":"ferry","slug":"ferry","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🛥️","skin_tone_support":false,"name":"motor boat","slug":"motor_boat","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🚢","skin_tone_support":false,"name":"ship","slug":"ship","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✈️","skin_tone_support":false,"name":"airplane","slug":"airplane","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛩️","skin_tone_support":false,"name":"small airplane","slug":"small_airplane","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🛫","skin_tone_support":false,"name":"airplane departure","slug":"airplane_departure","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛬","skin_tone_support":false,"name":"airplane arrival","slug":"airplane_arrival","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🪂","skin_tone_support":false,"name":"parachute","slug":"parachute","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"💺","skin_tone_support":false,"name":"seat","slug":"seat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚁","skin_tone_support":false,"name":"helicopter","slug":"helicopter","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚟","skin_tone_support":false,"name":"suspension railway","slug":"suspension_railway","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚠","skin_tone_support":false,"name":"mountain cableway","slug":"mountain_cableway","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚡","skin_tone_support":false,"name":"aerial tramway","slug":"aerial_tramway","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛰️","skin_tone_support":false,"name":"satellite","slug":"satellite","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🚀","skin_tone_support":false,"name":"rocket","slug":"rocket","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛸","skin_tone_support":false,"name":"flying saucer","slug":"flying_saucer","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🛎️","skin_tone_support":false,"name":"bellhop bell","slug":"bellhop_bell","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🧳","skin_tone_support":false,"name":"luggage","slug":"luggage","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"⌛","skin_tone_support":false,"name":"hourglass done","slug":"hourglass_done","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏳","skin_tone_support":false,"name":"hourglass not done","slug":"hourglass_not_done","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⌚","skin_tone_support":false,"name":"watch","slug":"watch","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏰","skin_tone_support":false,"name":"alarm clock","slug":"alarm_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏱️","skin_tone_support":false,"name":"stopwatch","slug":"stopwatch","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⏲️","skin_tone_support":false,"name":"timer clock","slug":"timer_clock","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🕰️","skin_tone_support":false,"name":"mantelpiece clock","slug":"mantelpiece_clock","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕛","skin_tone_support":false,"name":"twelve o’clock","slug":"twelve_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕧","skin_tone_support":false,"name":"twelve-thirty","slug":"twelve_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕐","skin_tone_support":false,"name":"one o’clock","slug":"one_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕜","skin_tone_support":false,"name":"one-thirty","slug":"one_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕑","skin_tone_support":false,"name":"two o’clock","slug":"two_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕝","skin_tone_support":false,"name":"two-thirty","slug":"two_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕒","skin_tone_support":false,"name":"three o’clock","slug":"three_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕞","skin_tone_support":false,"name":"three-thirty","slug":"three_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕓","skin_tone_support":false,"name":"four o’clock","slug":"four_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕟","skin_tone_support":false,"name":"four-thirty","slug":"four_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕔","skin_tone_support":false,"name":"five o’clock","slug":"five_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕠","skin_tone_support":false,"name":"five-thirty","slug":"five_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕕","skin_tone_support":false,"name":"six o’clock","slug":"six_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕡","skin_tone_support":false,"name":"six-thirty","slug":"six_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕖","skin_tone_support":false,"name":"seven o’clock","slug":"seven_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕢","skin_tone_support":false,"name":"seven-thirty","slug":"seven_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕗","skin_tone_support":false,"name":"eight o’clock","slug":"eight_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕣","skin_tone_support":false,"name":"eight-thirty","slug":"eight_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕘","skin_tone_support":false,"name":"nine o’clock","slug":"nine_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕤","skin_tone_support":false,"name":"nine-thirty","slug":"nine_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕙","skin_tone_support":false,"name":"ten o’clock","slug":"ten_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕥","skin_tone_support":false,"name":"ten-thirty","slug":"ten_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🕚","skin_tone_support":false,"name":"eleven o’clock","slug":"eleven_o_clock","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕦","skin_tone_support":false,"name":"eleven-thirty","slug":"eleven_thirty","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌑","skin_tone_support":false,"name":"new moon","slug":"new_moon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌒","skin_tone_support":false,"name":"waxing crescent moon","slug":"waxing_crescent_moon","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌓","skin_tone_support":false,"name":"first quarter moon","slug":"first_quarter_moon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌔","skin_tone_support":false,"name":"waxing gibbous moon","slug":"waxing_gibbous_moon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌕","skin_tone_support":false,"name":"full moon","slug":"full_moon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌖","skin_tone_support":false,"name":"waning gibbous moon","slug":"waning_gibbous_moon","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌗","skin_tone_support":false,"name":"last quarter moon","slug":"last_quarter_moon","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌘","skin_tone_support":false,"name":"waning crescent moon","slug":"waning_crescent_moon","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌙","skin_tone_support":false,"name":"crescent moon","slug":"crescent_moon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌚","skin_tone_support":false,"name":"new moon face","slug":"new_moon_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌛","skin_tone_support":false,"name":"first quarter moon face","slug":"first_quarter_moon_face","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌜","skin_tone_support":false,"name":"last quarter moon face","slug":"last_quarter_moon_face","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌡️","skin_tone_support":false,"name":"thermometer","slug":"thermometer","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"☀️","skin_tone_support":false,"name":"sun","slug":"sun","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌝","skin_tone_support":false,"name":"full moon face","slug":"full_moon_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🌞","skin_tone_support":false,"name":"sun with face","slug":"sun_with_face","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🪐","skin_tone_support":false,"name":"ringed planet","slug":"ringed_planet","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"⭐","skin_tone_support":false,"name":"star","slug":"star","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌟","skin_tone_support":false,"name":"glowing star","slug":"glowing_star","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌠","skin_tone_support":false,"name":"shooting star","slug":"shooting_star","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌌","skin_tone_support":false,"name":"milky way","slug":"milky_way","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☁️","skin_tone_support":false,"name":"cloud","slug":"cloud","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛅","skin_tone_support":false,"name":"sun behind cloud","slug":"sun_behind_cloud","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛈️","skin_tone_support":false,"name":"cloud with lightning and rain","slug":"cloud_with_lightning_and_rain","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌤️","skin_tone_support":false,"name":"sun behind small cloud","slug":"sun_behind_small_cloud","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌥️","skin_tone_support":false,"name":"sun behind large cloud","slug":"sun_behind_large_cloud","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌦️","skin_tone_support":false,"name":"sun behind rain cloud","slug":"sun_behind_rain_cloud","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌧️","skin_tone_support":false,"name":"cloud with rain","slug":"cloud_with_rain","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌨️","skin_tone_support":false,"name":"cloud with snow","slug":"cloud_with_snow","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌩️","skin_tone_support":false,"name":"cloud with lightning","slug":"cloud_with_lightning","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌪️","skin_tone_support":false,"name":"tornado","slug":"tornado","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌫️","skin_tone_support":false,"name":"fog","slug":"fog","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌬️","skin_tone_support":false,"name":"wind face","slug":"wind_face","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🌀","skin_tone_support":false,"name":"cyclone","slug":"cyclone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌈","skin_tone_support":false,"name":"rainbow","slug":"rainbow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌂","skin_tone_support":false,"name":"closed umbrella","slug":"closed_umbrella","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☂️","skin_tone_support":false,"name":"umbrella","slug":"umbrella","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"☔","skin_tone_support":false,"name":"umbrella with rain drops","slug":"umbrella_with_rain_drops","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛱️","skin_tone_support":false,"name":"umbrella on ground","slug":"umbrella_on_ground","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⚡","skin_tone_support":false,"name":"high voltage","slug":"high_voltage","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❄️","skin_tone_support":false,"name":"snowflake","slug":"snowflake","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☃️","skin_tone_support":false,"name":"snowman","slug":"snowman","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⛄","skin_tone_support":false,"name":"snowman without snow","slug":"snowman_without_snow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☄️","skin_tone_support":false,"name":"comet","slug":"comet","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔥","skin_tone_support":false,"name":"fire","slug":"fire","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💧","skin_tone_support":false,"name":"droplet","slug":"droplet","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🌊","skin_tone_support":false,"name":"water wave","slug":"water_wave","unicode_version":"0.6","emoji_version":"0.6"}]},{"name":"Activities","slug":"activities","emojis":[{"emoji":"🎃","skin_tone_support":false,"name":"jack-o-lantern","slug":"jack_o_lantern","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎄","skin_tone_support":false,"name":"Christmas tree","slug":"christmas_tree","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎆","skin_tone_support":false,"name":"fireworks","slug":"fireworks","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎇","skin_tone_support":false,"name":"sparkler","slug":"sparkler","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧨","skin_tone_support":false,"name":"firecracker","slug":"firecracker","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"✨","skin_tone_support":false,"name":"sparkles","slug":"sparkles","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎈","skin_tone_support":false,"name":"balloon","slug":"balloon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎉","skin_tone_support":false,"name":"party popper","slug":"party_popper","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎊","skin_tone_support":false,"name":"confetti ball","slug":"confetti_ball","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎋","skin_tone_support":false,"name":"tanabata tree","slug":"tanabata_tree","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎍","skin_tone_support":false,"name":"pine decoration","slug":"pine_decoration","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎎","skin_tone_support":false,"name":"Japanese dolls","slug":"japanese_dolls","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎏","skin_tone_support":false,"name":"carp streamer","slug":"carp_streamer","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎐","skin_tone_support":false,"name":"wind chime","slug":"wind_chime","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎑","skin_tone_support":false,"name":"moon viewing ceremony","slug":"moon_viewing_ceremony","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧧","skin_tone_support":false,"name":"red envelope","slug":"red_envelope","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🎀","skin_tone_support":false,"name":"ribbon","slug":"ribbon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎁","skin_tone_support":false,"name":"wrapped gift","slug":"wrapped_gift","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎗️","skin_tone_support":false,"name":"reminder ribbon","slug":"reminder_ribbon","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎟️","skin_tone_support":false,"name":"admission tickets","slug":"admission_tickets","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎫","skin_tone_support":false,"name":"ticket","slug":"ticket","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎖️","skin_tone_support":false,"name":"military medal","slug":"military_medal","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏆","skin_tone_support":false,"name":"trophy","slug":"trophy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏅","skin_tone_support":false,"name":"sports medal","slug":"sports_medal","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🥇","skin_tone_support":false,"name":"1st place medal","slug":"1st_place_medal","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥈","skin_tone_support":false,"name":"2nd place medal","slug":"2nd_place_medal","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥉","skin_tone_support":false,"name":"3rd place medal","slug":"3rd_place_medal","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"⚽","skin_tone_support":false,"name":"soccer ball","slug":"soccer_ball","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⚾","skin_tone_support":false,"name":"baseball","slug":"baseball","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥎","skin_tone_support":false,"name":"softball","slug":"softball","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🏀","skin_tone_support":false,"name":"basketball","slug":"basketball","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏐","skin_tone_support":false,"name":"volleyball","slug":"volleyball","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🏈","skin_tone_support":false,"name":"american football","slug":"american_football","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏉","skin_tone_support":false,"name":"rugby football","slug":"rugby_football","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🎾","skin_tone_support":false,"name":"tennis","slug":"tennis","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥏","skin_tone_support":false,"name":"flying disc","slug":"flying_disc","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🎳","skin_tone_support":false,"name":"bowling","slug":"bowling","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏏","skin_tone_support":false,"name":"cricket game","slug":"cricket_game","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🏑","skin_tone_support":false,"name":"field hockey","slug":"field_hockey","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🏒","skin_tone_support":false,"name":"ice hockey","slug":"ice_hockey","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🥍","skin_tone_support":false,"name":"lacrosse","slug":"lacrosse","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🏓","skin_tone_support":false,"name":"ping pong","slug":"ping_pong","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🏸","skin_tone_support":false,"name":"badminton","slug":"badminton","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🥊","skin_tone_support":false,"name":"boxing glove","slug":"boxing_glove","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥋","skin_tone_support":false,"name":"martial arts uniform","slug":"martial_arts_uniform","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🥅","skin_tone_support":false,"name":"goal net","slug":"goal_net","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"⛳","skin_tone_support":false,"name":"flag in hole","slug":"flag_in_hole","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛸️","skin_tone_support":false,"name":"ice skate","slug":"ice_skate","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎣","skin_tone_support":false,"name":"fishing pole","slug":"fishing_pole","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🤿","skin_tone_support":false,"name":"diving mask","slug":"diving_mask","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🎽","skin_tone_support":false,"name":"running shirt","slug":"running_shirt","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎿","skin_tone_support":false,"name":"skis","slug":"skis","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛷","skin_tone_support":false,"name":"sled","slug":"sled","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🥌","skin_tone_support":false,"name":"curling stone","slug":"curling_stone","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🎯","skin_tone_support":false,"name":"bullseye","slug":"bullseye","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪀","skin_tone_support":false,"name":"yo-yo","slug":"yo_yo","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🪁","skin_tone_support":false,"name":"kite","slug":"kite","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🔫","skin_tone_support":false,"name":"water pistol","slug":"water_pistol","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎱","skin_tone_support":false,"name":"pool 8 ball","slug":"pool_8_ball","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔮","skin_tone_support":false,"name":"crystal ball","slug":"crystal_ball","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪄","skin_tone_support":false,"name":"magic wand","slug":"magic_wand","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🎮","skin_tone_support":false,"name":"video game","slug":"video_game","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕹️","skin_tone_support":false,"name":"joystick","slug":"joystick","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎰","skin_tone_support":false,"name":"slot machine","slug":"slot_machine","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎲","skin_tone_support":false,"name":"game die","slug":"game_die","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧩","skin_tone_support":false,"name":"puzzle piece","slug":"puzzle_piece","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧸","skin_tone_support":false,"name":"teddy bear","slug":"teddy_bear","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪅","skin_tone_support":false,"name":"piñata","slug":"pinata","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪩","skin_tone_support":false,"name":"mirror ball","slug":"mirror_ball","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🪆","skin_tone_support":false,"name":"nesting dolls","slug":"nesting_dolls","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"♠️","skin_tone_support":false,"name":"spade suit","slug":"spade_suit","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♥️","skin_tone_support":false,"name":"heart suit","slug":"heart_suit","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♦️","skin_tone_support":false,"name":"diamond suit","slug":"diamond_suit","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♣️","skin_tone_support":false,"name":"club suit","slug":"club_suit","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♟️","skin_tone_support":false,"name":"chess pawn","slug":"chess_pawn","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🃏","skin_tone_support":false,"name":"joker","slug":"joker","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🀄","skin_tone_support":false,"name":"mahjong red dragon","slug":"mahjong_red_dragon","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎴","skin_tone_support":false,"name":"flower playing cards","slug":"flower_playing_cards","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎭","skin_tone_support":false,"name":"performing arts","slug":"performing_arts","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🖼️","skin_tone_support":false,"name":"framed picture","slug":"framed_picture","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎨","skin_tone_support":false,"name":"artist palette","slug":"artist_palette","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧵","skin_tone_support":false,"name":"thread","slug":"thread","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪡","skin_tone_support":false,"name":"sewing needle","slug":"sewing_needle","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🧶","skin_tone_support":false,"name":"yarn","slug":"yarn","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪢","skin_tone_support":false,"name":"knot","slug":"knot","unicode_version":"13.0","emoji_version":"13.0"}]},{"name":"Objects","slug":"objects","emojis":[{"emoji":"👓","skin_tone_support":false,"name":"glasses","slug":"glasses","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕶️","skin_tone_support":false,"name":"sunglasses","slug":"sunglasses","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🥽","skin_tone_support":false,"name":"goggles","slug":"goggles","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥼","skin_tone_support":false,"name":"lab coat","slug":"lab_coat","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🦺","skin_tone_support":false,"name":"safety vest","slug":"safety_vest","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👔","skin_tone_support":false,"name":"necktie","slug":"necktie","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👕","skin_tone_support":false,"name":"t-shirt","slug":"t_shirt","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👖","skin_tone_support":false,"name":"jeans","slug":"jeans","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧣","skin_tone_support":false,"name":"scarf","slug":"scarf","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧤","skin_tone_support":false,"name":"gloves","slug":"gloves","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧥","skin_tone_support":false,"name":"coat","slug":"coat","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🧦","skin_tone_support":false,"name":"socks","slug":"socks","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"👗","skin_tone_support":false,"name":"dress","slug":"dress","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👘","skin_tone_support":false,"name":"kimono","slug":"kimono","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥻","skin_tone_support":false,"name":"sari","slug":"sari","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🩱","skin_tone_support":false,"name":"one-piece swimsuit","slug":"one_piece_swimsuit","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🩲","skin_tone_support":false,"name":"briefs","slug":"briefs","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🩳","skin_tone_support":false,"name":"shorts","slug":"shorts","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👙","skin_tone_support":false,"name":"bikini","slug":"bikini","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👚","skin_tone_support":false,"name":"woman’s clothes","slug":"woman_s_clothes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪭","skin_tone_support":false,"name":"folding hand fan","slug":"folding_hand_fan","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"👛","skin_tone_support":false,"name":"purse","slug":"purse","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👜","skin_tone_support":false,"name":"handbag","slug":"handbag","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👝","skin_tone_support":false,"name":"clutch bag","slug":"clutch_bag","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛍️","skin_tone_support":false,"name":"shopping bags","slug":"shopping_bags","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎒","skin_tone_support":false,"name":"backpack","slug":"backpack","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🩴","skin_tone_support":false,"name":"thong sandal","slug":"thong_sandal","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"👞","skin_tone_support":false,"name":"man’s shoe","slug":"man_s_shoe","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👟","skin_tone_support":false,"name":"running shoe","slug":"running_shoe","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🥾","skin_tone_support":false,"name":"hiking boot","slug":"hiking_boot","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🥿","skin_tone_support":false,"name":"flat shoe","slug":"flat_shoe","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"👠","skin_tone_support":false,"name":"high-heeled shoe","slug":"high_heeled_shoe","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👡","skin_tone_support":false,"name":"woman’s sandal","slug":"woman_s_sandal","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🩰","skin_tone_support":false,"name":"ballet shoes","slug":"ballet_shoes","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"👢","skin_tone_support":false,"name":"woman’s boot","slug":"woman_s_boot","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪮","skin_tone_support":false,"name":"hair pick","slug":"hair_pick","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"👑","skin_tone_support":false,"name":"crown","slug":"crown","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"👒","skin_tone_support":false,"name":"woman’s hat","slug":"woman_s_hat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎩","skin_tone_support":false,"name":"top hat","slug":"top_hat","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎓","skin_tone_support":false,"name":"graduation cap","slug":"graduation_cap","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧢","skin_tone_support":false,"name":"billed cap","slug":"billed_cap","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🪖","skin_tone_support":false,"name":"military helmet","slug":"military_helmet","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"⛑️","skin_tone_support":false,"name":"rescue worker’s helmet","slug":"rescue_worker_s_helmet","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📿","skin_tone_support":false,"name":"prayer beads","slug":"prayer_beads","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💄","skin_tone_support":false,"name":"lipstick","slug":"lipstick","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💍","skin_tone_support":false,"name":"ring","slug":"ring","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💎","skin_tone_support":false,"name":"gem stone","slug":"gem_stone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔇","skin_tone_support":false,"name":"muted speaker","slug":"muted_speaker","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔈","skin_tone_support":false,"name":"speaker low volume","slug":"speaker_low_volume","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🔉","skin_tone_support":false,"name":"speaker medium volume","slug":"speaker_medium_volume","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔊","skin_tone_support":false,"name":"speaker high volume","slug":"speaker_high_volume","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📢","skin_tone_support":false,"name":"loudspeaker","slug":"loudspeaker","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📣","skin_tone_support":false,"name":"megaphone","slug":"megaphone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📯","skin_tone_support":false,"name":"postal horn","slug":"postal_horn","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔔","skin_tone_support":false,"name":"bell","slug":"bell","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔕","skin_tone_support":false,"name":"bell with slash","slug":"bell_with_slash","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🎼","skin_tone_support":false,"name":"musical score","slug":"musical_score","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎵","skin_tone_support":false,"name":"musical note","slug":"musical_note","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎶","skin_tone_support":false,"name":"musical notes","slug":"musical_notes","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎙️","skin_tone_support":false,"name":"studio microphone","slug":"studio_microphone","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎚️","skin_tone_support":false,"name":"level slider","slug":"level_slider","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎛️","skin_tone_support":false,"name":"control knobs","slug":"control_knobs","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎤","skin_tone_support":false,"name":"microphone","slug":"microphone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎧","skin_tone_support":false,"name":"headphone","slug":"headphone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📻","skin_tone_support":false,"name":"radio","slug":"radio","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎷","skin_tone_support":false,"name":"saxophone","slug":"saxophone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎺","skin_tone_support":false,"name":"trumpet","slug":"trumpet","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪊","skin_tone_support":false,"name":"trombone","slug":"trombone","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"🪗","skin_tone_support":false,"name":"accordion","slug":"accordion","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🎸","skin_tone_support":false,"name":"guitar","slug":"guitar","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎹","skin_tone_support":false,"name":"musical keyboard","slug":"musical_keyboard","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎻","skin_tone_support":false,"name":"violin","slug":"violin","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪕","skin_tone_support":false,"name":"banjo","slug":"banjo","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🥁","skin_tone_support":false,"name":"drum","slug":"drum","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🪘","skin_tone_support":false,"name":"long drum","slug":"long_drum","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪇","skin_tone_support":false,"name":"maracas","slug":"maracas","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🪈","skin_tone_support":false,"name":"flute","slug":"flute","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"🪉","skin_tone_support":false,"name":"harp","slug":"harp","unicode_version":"16.0","emoji_version":"16.0"},{"emoji":"📱","skin_tone_support":false,"name":"mobile phone","slug":"mobile_phone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📲","skin_tone_support":false,"name":"mobile phone with arrow","slug":"mobile_phone_with_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☎️","skin_tone_support":false,"name":"telephone","slug":"telephone","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📞","skin_tone_support":false,"name":"telephone receiver","slug":"telephone_receiver","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📟","skin_tone_support":false,"name":"pager","slug":"pager","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📠","skin_tone_support":false,"name":"fax machine","slug":"fax_machine","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔋","skin_tone_support":false,"name":"battery","slug":"battery","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪫","skin_tone_support":false,"name":"low battery","slug":"low_battery","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🔌","skin_tone_support":false,"name":"electric plug","slug":"electric_plug","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💻","skin_tone_support":false,"name":"laptop","slug":"laptop","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🖥️","skin_tone_support":false,"name":"desktop computer","slug":"desktop_computer","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🖨️","skin_tone_support":false,"name":"printer","slug":"printer","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⌨️","skin_tone_support":false,"name":"keyboard","slug":"keyboard","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🖱️","skin_tone_support":false,"name":"computer mouse","slug":"computer_mouse","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🖲️","skin_tone_support":false,"name":"trackball","slug":"trackball","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"💽","skin_tone_support":false,"name":"computer disk","slug":"computer_disk","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💾","skin_tone_support":false,"name":"floppy disk","slug":"floppy_disk","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💿","skin_tone_support":false,"name":"optical disk","slug":"optical_disk","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📀","skin_tone_support":false,"name":"dvd","slug":"dvd","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧮","skin_tone_support":false,"name":"abacus","slug":"abacus","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🎥","skin_tone_support":false,"name":"movie camera","slug":"movie_camera","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎞️","skin_tone_support":false,"name":"film frames","slug":"film_frames","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📽️","skin_tone_support":false,"name":"film projector","slug":"film_projector","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🎬","skin_tone_support":false,"name":"clapper board","slug":"clapper_board","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📺","skin_tone_support":false,"name":"television","slug":"television","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📷","skin_tone_support":false,"name":"camera","slug":"camera","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📸","skin_tone_support":false,"name":"camera with flash","slug":"camera_with_flash","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"📹","skin_tone_support":false,"name":"video camera","slug":"video_camera","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📼","skin_tone_support":false,"name":"videocassette","slug":"videocassette","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔍","skin_tone_support":false,"name":"magnifying glass tilted left","slug":"magnifying_glass_tilted_left","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔎","skin_tone_support":false,"name":"magnifying glass tilted right","slug":"magnifying_glass_tilted_right","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🕯️","skin_tone_support":false,"name":"candle","slug":"candle","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"💡","skin_tone_support":false,"name":"light bulb","slug":"light_bulb","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔦","skin_tone_support":false,"name":"flashlight","slug":"flashlight","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏮","skin_tone_support":false,"name":"red paper lantern","slug":"red_paper_lantern","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪔","skin_tone_support":false,"name":"diya lamp","slug":"diya_lamp","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"📔","skin_tone_support":false,"name":"notebook with decorative cover","slug":"notebook_with_decorative_cover","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📕","skin_tone_support":false,"name":"closed book","slug":"closed_book","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📖","skin_tone_support":false,"name":"open book","slug":"open_book","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📗","skin_tone_support":false,"name":"green book","slug":"green_book","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📘","skin_tone_support":false,"name":"blue book","slug":"blue_book","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📙","skin_tone_support":false,"name":"orange book","slug":"orange_book","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📚","skin_tone_support":false,"name":"books","slug":"books","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📓","skin_tone_support":false,"name":"notebook","slug":"notebook","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📒","skin_tone_support":false,"name":"ledger","slug":"ledger","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📃","skin_tone_support":false,"name":"page with curl","slug":"page_with_curl","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📜","skin_tone_support":false,"name":"scroll","slug":"scroll","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📄","skin_tone_support":false,"name":"page facing up","slug":"page_facing_up","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📰","skin_tone_support":false,"name":"newspaper","slug":"newspaper","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗞️","skin_tone_support":false,"name":"rolled-up newspaper","slug":"rolled_up_newspaper","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📑","skin_tone_support":false,"name":"bookmark tabs","slug":"bookmark_tabs","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔖","skin_tone_support":false,"name":"bookmark","slug":"bookmark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏷️","skin_tone_support":false,"name":"label","slug":"label","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🪙","skin_tone_support":false,"name":"coin","slug":"coin","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"💰","skin_tone_support":false,"name":"money bag","slug":"money_bag","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪎","skin_tone_support":false,"name":"treasure chest","slug":"treasure_chest","unicode_version":"17.0","emoji_version":"17.0"},{"emoji":"💴","skin_tone_support":false,"name":"yen banknote","slug":"yen_banknote","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💵","skin_tone_support":false,"name":"dollar banknote","slug":"dollar_banknote","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💶","skin_tone_support":false,"name":"euro banknote","slug":"euro_banknote","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💷","skin_tone_support":false,"name":"pound banknote","slug":"pound_banknote","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💸","skin_tone_support":false,"name":"money with wings","slug":"money_with_wings","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💳","skin_tone_support":false,"name":"credit card","slug":"credit_card","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🧾","skin_tone_support":false,"name":"receipt","slug":"receipt","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"💹","skin_tone_support":false,"name":"chart increasing with yen","slug":"chart_increasing_with_yen","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✉️","skin_tone_support":false,"name":"envelope","slug":"envelope","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📧","skin_tone_support":false,"name":"e-mail","slug":"e_mail","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📨","skin_tone_support":false,"name":"incoming envelope","slug":"incoming_envelope","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📩","skin_tone_support":false,"name":"envelope with arrow","slug":"envelope_with_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📤","skin_tone_support":false,"name":"outbox tray","slug":"outbox_tray","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📥","skin_tone_support":false,"name":"inbox tray","slug":"inbox_tray","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📦","skin_tone_support":false,"name":"package","slug":"package","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📫","skin_tone_support":false,"name":"closed mailbox with raised flag","slug":"closed_mailbox_with_raised_flag","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📪","skin_tone_support":false,"name":"closed mailbox with lowered flag","slug":"closed_mailbox_with_lowered_flag","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📬","skin_tone_support":false,"name":"open mailbox with raised flag","slug":"open_mailbox_with_raised_flag","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📭","skin_tone_support":false,"name":"open mailbox with lowered flag","slug":"open_mailbox_with_lowered_flag","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📮","skin_tone_support":false,"name":"postbox","slug":"postbox","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗳️","skin_tone_support":false,"name":"ballot box with ballot","slug":"ballot_box_with_ballot","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"✏️","skin_tone_support":false,"name":"pencil","slug":"pencil","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✒️","skin_tone_support":false,"name":"black nib","slug":"black_nib","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🖋️","skin_tone_support":false,"name":"fountain pen","slug":"fountain_pen","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🖊️","skin_tone_support":false,"name":"pen","slug":"pen","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🖌️","skin_tone_support":false,"name":"paintbrush","slug":"paintbrush","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🖍️","skin_tone_support":false,"name":"crayon","slug":"crayon","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📝","skin_tone_support":false,"name":"memo","slug":"memo","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💼","skin_tone_support":false,"name":"briefcase","slug":"briefcase","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📁","skin_tone_support":false,"name":"file folder","slug":"file_folder","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📂","skin_tone_support":false,"name":"open file folder","slug":"open_file_folder","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗂️","skin_tone_support":false,"name":"card index dividers","slug":"card_index_dividers","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📅","skin_tone_support":false,"name":"calendar","slug":"calendar","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📆","skin_tone_support":false,"name":"tear-off calendar","slug":"tear_off_calendar","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗒️","skin_tone_support":false,"name":"spiral notepad","slug":"spiral_notepad","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🗓️","skin_tone_support":false,"name":"spiral calendar","slug":"spiral_calendar","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📇","skin_tone_support":false,"name":"card index","slug":"card_index","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📈","skin_tone_support":false,"name":"chart increasing","slug":"chart_increasing","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📉","skin_tone_support":false,"name":"chart decreasing","slug":"chart_decreasing","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📊","skin_tone_support":false,"name":"bar chart","slug":"bar_chart","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📋","skin_tone_support":false,"name":"clipboard","slug":"clipboard","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📌","skin_tone_support":false,"name":"pushpin","slug":"pushpin","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📍","skin_tone_support":false,"name":"round pushpin","slug":"round_pushpin","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📎","skin_tone_support":false,"name":"paperclip","slug":"paperclip","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🖇️","skin_tone_support":false,"name":"linked paperclips","slug":"linked_paperclips","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"📏","skin_tone_support":false,"name":"straight ruler","slug":"straight_ruler","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📐","skin_tone_support":false,"name":"triangular ruler","slug":"triangular_ruler","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✂️","skin_tone_support":false,"name":"scissors","slug":"scissors","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗃️","skin_tone_support":false,"name":"card file box","slug":"card_file_box","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🗄️","skin_tone_support":false,"name":"file cabinet","slug":"file_cabinet","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🗑️","skin_tone_support":false,"name":"wastebasket","slug":"wastebasket","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🔒","skin_tone_support":false,"name":"locked","slug":"locked","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔓","skin_tone_support":false,"name":"unlocked","slug":"unlocked","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔏","skin_tone_support":false,"name":"locked with pen","slug":"locked_with_pen","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔐","skin_tone_support":false,"name":"locked with key","slug":"locked_with_key","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔑","skin_tone_support":false,"name":"key","slug":"key","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🗝️","skin_tone_support":false,"name":"old key","slug":"old_key","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🔨","skin_tone_support":false,"name":"hammer","slug":"hammer","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪓","skin_tone_support":false,"name":"axe","slug":"axe","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"⛏️","skin_tone_support":false,"name":"pick","slug":"pick","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⚒️","skin_tone_support":false,"name":"hammer and pick","slug":"hammer_and_pick","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛠️","skin_tone_support":false,"name":"hammer and wrench","slug":"hammer_and_wrench","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🗡️","skin_tone_support":false,"name":"dagger","slug":"dagger","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⚔️","skin_tone_support":false,"name":"crossed swords","slug":"crossed_swords","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"💣","skin_tone_support":false,"name":"bomb","slug":"bomb","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪃","skin_tone_support":false,"name":"boomerang","slug":"boomerang","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🏹","skin_tone_support":false,"name":"bow and arrow","slug":"bow_and_arrow","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛡️","skin_tone_support":false,"name":"shield","slug":"shield","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🪚","skin_tone_support":false,"name":"carpentry saw","slug":"carpentry_saw","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🔧","skin_tone_support":false,"name":"wrench","slug":"wrench","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪛","skin_tone_support":false,"name":"screwdriver","slug":"screwdriver","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🔩","skin_tone_support":false,"name":"nut and bolt","slug":"nut_and_bolt","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⚙️","skin_tone_support":false,"name":"gear","slug":"gear","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🗜️","skin_tone_support":false,"name":"clamp","slug":"clamp","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⚖️","skin_tone_support":false,"name":"balance scale","slug":"balance_scale","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🦯","skin_tone_support":false,"name":"white cane","slug":"white_cane","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🔗","skin_tone_support":false,"name":"link","slug":"link","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛓️‍💥","skin_tone_support":false,"name":"broken chain","slug":"broken_chain","unicode_version":"15.1","emoji_version":"15.1"},{"emoji":"⛓️","skin_tone_support":false,"name":"chains","slug":"chains","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🪝","skin_tone_support":false,"name":"hook","slug":"hook","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🧰","skin_tone_support":false,"name":"toolbox","slug":"toolbox","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧲","skin_tone_support":false,"name":"magnet","slug":"magnet","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪜","skin_tone_support":false,"name":"ladder","slug":"ladder","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪏","skin_tone_support":false,"name":"shovel","slug":"shovel","unicode_version":"16.0","emoji_version":"16.0"},{"emoji":"⚗️","skin_tone_support":false,"name":"alembic","slug":"alembic","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🧪","skin_tone_support":false,"name":"test tube","slug":"test_tube","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧫","skin_tone_support":false,"name":"petri dish","slug":"petri_dish","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧬","skin_tone_support":false,"name":"dna","slug":"dna","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🔬","skin_tone_support":false,"name":"microscope","slug":"microscope","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔭","skin_tone_support":false,"name":"telescope","slug":"telescope","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"📡","skin_tone_support":false,"name":"satellite antenna","slug":"satellite_antenna","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💉","skin_tone_support":false,"name":"syringe","slug":"syringe","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🩸","skin_tone_support":false,"name":"drop of blood","slug":"drop_of_blood","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"💊","skin_tone_support":false,"name":"pill","slug":"pill","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🩹","skin_tone_support":false,"name":"adhesive bandage","slug":"adhesive_bandage","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🩼","skin_tone_support":false,"name":"crutch","slug":"crutch","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🩺","skin_tone_support":false,"name":"stethoscope","slug":"stethoscope","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🩻","skin_tone_support":false,"name":"x-ray","slug":"x_ray","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🚪","skin_tone_support":false,"name":"door","slug":"door","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛗","skin_tone_support":false,"name":"elevator","slug":"elevator","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪞","skin_tone_support":false,"name":"mirror","slug":"mirror","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪟","skin_tone_support":false,"name":"window","slug":"window","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🛏️","skin_tone_support":false,"name":"bed","slug":"bed","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🛋️","skin_tone_support":false,"name":"couch and lamp","slug":"couch_and_lamp","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🪑","skin_tone_support":false,"name":"chair","slug":"chair","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🚽","skin_tone_support":false,"name":"toilet","slug":"toilet","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪠","skin_tone_support":false,"name":"plunger","slug":"plunger","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🚿","skin_tone_support":false,"name":"shower","slug":"shower","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛁","skin_tone_support":false,"name":"bathtub","slug":"bathtub","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🪤","skin_tone_support":false,"name":"mouse trap","slug":"mouse_trap","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪒","skin_tone_support":false,"name":"razor","slug":"razor","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🧴","skin_tone_support":false,"name":"lotion bottle","slug":"lotion_bottle","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧷","skin_tone_support":false,"name":"safety pin","slug":"safety_pin","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧹","skin_tone_support":false,"name":"broom","slug":"broom","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧺","skin_tone_support":false,"name":"basket","slug":"basket","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧻","skin_tone_support":false,"name":"roll of paper","slug":"roll_of_paper","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪣","skin_tone_support":false,"name":"bucket","slug":"bucket","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🧼","skin_tone_support":false,"name":"soap","slug":"soap","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🫧","skin_tone_support":false,"name":"bubbles","slug":"bubbles","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🪥","skin_tone_support":false,"name":"toothbrush","slug":"toothbrush","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🧽","skin_tone_support":false,"name":"sponge","slug":"sponge","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🧯","skin_tone_support":false,"name":"fire extinguisher","slug":"fire_extinguisher","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🛒","skin_tone_support":false,"name":"shopping cart","slug":"shopping_cart","unicode_version":"3.0","emoji_version":"3.0"},{"emoji":"🚬","skin_tone_support":false,"name":"cigarette","slug":"cigarette","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⚰️","skin_tone_support":false,"name":"coffin","slug":"coffin","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🪦","skin_tone_support":false,"name":"headstone","slug":"headstone","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"⚱️","skin_tone_support":false,"name":"funeral urn","slug":"funeral_urn","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🧿","skin_tone_support":false,"name":"nazar amulet","slug":"nazar_amulet","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🪬","skin_tone_support":false,"name":"hamsa","slug":"hamsa","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"🗿","skin_tone_support":false,"name":"moai","slug":"moai","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪧","skin_tone_support":false,"name":"placard","slug":"placard","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🪪","skin_tone_support":false,"name":"identification card","slug":"identification_card","unicode_version":"14.0","emoji_version":"14.0"}]},{"name":"Symbols","slug":"symbols","emojis":[{"emoji":"🏧","skin_tone_support":false,"name":"ATM sign","slug":"atm_sign","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚮","skin_tone_support":false,"name":"litter in bin sign","slug":"litter_in_bin_sign","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚰","skin_tone_support":false,"name":"potable water","slug":"potable_water","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"♿","skin_tone_support":false,"name":"wheelchair symbol","slug":"wheelchair_symbol","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚹","skin_tone_support":false,"name":"men’s room","slug":"men_s_room","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚺","skin_tone_support":false,"name":"women’s room","slug":"women_s_room","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚻","skin_tone_support":false,"name":"restroom","slug":"restroom","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚼","skin_tone_support":false,"name":"baby symbol","slug":"baby_symbol","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚾","skin_tone_support":false,"name":"water closet","slug":"water_closet","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛂","skin_tone_support":false,"name":"passport control","slug":"passport_control","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛃","skin_tone_support":false,"name":"customs","slug":"customs","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛄","skin_tone_support":false,"name":"baggage claim","slug":"baggage_claim","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🛅","skin_tone_support":false,"name":"left luggage","slug":"left_luggage","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⚠️","skin_tone_support":false,"name":"warning","slug":"warning","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚸","skin_tone_support":false,"name":"children crossing","slug":"children_crossing","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⛔","skin_tone_support":false,"name":"no entry","slug":"no_entry","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚫","skin_tone_support":false,"name":"prohibited","slug":"prohibited","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚳","skin_tone_support":false,"name":"no bicycles","slug":"no_bicycles","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚭","skin_tone_support":false,"name":"no smoking","slug":"no_smoking","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚯","skin_tone_support":false,"name":"no littering","slug":"no_littering","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚱","skin_tone_support":false,"name":"non-potable water","slug":"non_potable_water","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🚷","skin_tone_support":false,"name":"no pedestrians","slug":"no_pedestrians","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"📵","skin_tone_support":false,"name":"no mobile phones","slug":"no_mobile_phones","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔞","skin_tone_support":false,"name":"no one under eighteen","slug":"no_one_under_eighteen","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☢️","skin_tone_support":false,"name":"radioactive","slug":"radioactive","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"☣️","skin_tone_support":false,"name":"biohazard","slug":"biohazard","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⬆️","skin_tone_support":false,"name":"up arrow","slug":"up_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↗️","skin_tone_support":false,"name":"up-right arrow","slug":"up_right_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"➡️","skin_tone_support":false,"name":"right arrow","slug":"right_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↘️","skin_tone_support":false,"name":"down-right arrow","slug":"down_right_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⬇️","skin_tone_support":false,"name":"down arrow","slug":"down_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↙️","skin_tone_support":false,"name":"down-left arrow","slug":"down_left_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⬅️","skin_tone_support":false,"name":"left arrow","slug":"left_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↖️","skin_tone_support":false,"name":"up-left arrow","slug":"up_left_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↕️","skin_tone_support":false,"name":"up-down arrow","slug":"up_down_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↔️","skin_tone_support":false,"name":"left-right arrow","slug":"left_right_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↩️","skin_tone_support":false,"name":"right arrow curving left","slug":"right_arrow_curving_left","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"↪️","skin_tone_support":false,"name":"left arrow curving right","slug":"left_arrow_curving_right","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⤴️","skin_tone_support":false,"name":"right arrow curving up","slug":"right_arrow_curving_up","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⤵️","skin_tone_support":false,"name":"right arrow curving down","slug":"right_arrow_curving_down","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔃","skin_tone_support":false,"name":"clockwise vertical arrows","slug":"clockwise_vertical_arrows","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔄","skin_tone_support":false,"name":"counterclockwise arrows button","slug":"counterclockwise_arrows_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔙","skin_tone_support":false,"name":"BACK arrow","slug":"back_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔚","skin_tone_support":false,"name":"END arrow","slug":"end_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔛","skin_tone_support":false,"name":"ON! arrow","slug":"on_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔜","skin_tone_support":false,"name":"SOON arrow","slug":"soon_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔝","skin_tone_support":false,"name":"TOP arrow","slug":"top_arrow","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛐","skin_tone_support":false,"name":"place of worship","slug":"place_of_worship","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"⚛️","skin_tone_support":false,"name":"atom symbol","slug":"atom_symbol","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🕉️","skin_tone_support":false,"name":"om","slug":"om","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"✡️","skin_tone_support":false,"name":"star of David","slug":"star_of_david","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"☸️","skin_tone_support":false,"name":"wheel of dharma","slug":"wheel_of_dharma","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"☯️","skin_tone_support":false,"name":"yin yang","slug":"yin_yang","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"✝️","skin_tone_support":false,"name":"latin cross","slug":"latin_cross","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"☦️","skin_tone_support":false,"name":"orthodox cross","slug":"orthodox_cross","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"☪️","skin_tone_support":false,"name":"star and crescent","slug":"star_and_crescent","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"☮️","skin_tone_support":false,"name":"peace symbol","slug":"peace_symbol","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🕎","skin_tone_support":false,"name":"menorah","slug":"menorah","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔯","skin_tone_support":false,"name":"dotted six-pointed star","slug":"dotted_six_pointed_star","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🪯","skin_tone_support":false,"name":"khanda","slug":"khanda","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"♈","skin_tone_support":false,"name":"Aries","slug":"aries","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♉","skin_tone_support":false,"name":"Taurus","slug":"taurus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♊","skin_tone_support":false,"name":"Gemini","slug":"gemini","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♋","skin_tone_support":false,"name":"Cancer","slug":"cancer","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♌","skin_tone_support":false,"name":"Leo","slug":"leo","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♍","skin_tone_support":false,"name":"Virgo","slug":"virgo","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♎","skin_tone_support":false,"name":"Libra","slug":"libra","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♏","skin_tone_support":false,"name":"Scorpio","slug":"scorpio","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♐","skin_tone_support":false,"name":"Sagittarius","slug":"sagittarius","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♑","skin_tone_support":false,"name":"Capricorn","slug":"capricorn","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♒","skin_tone_support":false,"name":"Aquarius","slug":"aquarius","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♓","skin_tone_support":false,"name":"Pisces","slug":"pisces","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⛎","skin_tone_support":false,"name":"Ophiuchus","slug":"ophiuchus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔀","skin_tone_support":false,"name":"shuffle tracks button","slug":"shuffle_tracks_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔁","skin_tone_support":false,"name":"repeat button","slug":"repeat_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔂","skin_tone_support":false,"name":"repeat single button","slug":"repeat_single_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"▶️","skin_tone_support":false,"name":"play button","slug":"play_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏩","skin_tone_support":false,"name":"fast-forward button","slug":"fast_forward_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏭️","skin_tone_support":false,"name":"next track button","slug":"next_track_button","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⏯️","skin_tone_support":false,"name":"play or pause button","slug":"play_or_pause_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"◀️","skin_tone_support":false,"name":"reverse button","slug":"reverse_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏪","skin_tone_support":false,"name":"fast reverse button","slug":"fast_reverse_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏮️","skin_tone_support":false,"name":"last track button","slug":"last_track_button","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🔼","skin_tone_support":false,"name":"upwards button","slug":"upwards_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏫","skin_tone_support":false,"name":"fast up button","slug":"fast_up_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔽","skin_tone_support":false,"name":"downwards button","slug":"downwards_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏬","skin_tone_support":false,"name":"fast down button","slug":"fast_down_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⏸️","skin_tone_support":false,"name":"pause button","slug":"pause_button","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⏹️","skin_tone_support":false,"name":"stop button","slug":"stop_button","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⏺️","skin_tone_support":false,"name":"record button","slug":"record_button","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"⏏️","skin_tone_support":false,"name":"eject button","slug":"eject_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🎦","skin_tone_support":false,"name":"cinema","slug":"cinema","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔅","skin_tone_support":false,"name":"dim button","slug":"dim_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔆","skin_tone_support":false,"name":"bright button","slug":"bright_button","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"📶","skin_tone_support":false,"name":"antenna bars","slug":"antenna_bars","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🛜","skin_tone_support":false,"name":"wireless","slug":"wireless","unicode_version":"15.0","emoji_version":"15.0"},{"emoji":"📳","skin_tone_support":false,"name":"vibration mode","slug":"vibration_mode","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📴","skin_tone_support":false,"name":"mobile phone off","slug":"mobile_phone_off","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"♀️","skin_tone_support":false,"name":"female sign","slug":"female_sign","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"♂️","skin_tone_support":false,"name":"male sign","slug":"male_sign","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"⚧️","skin_tone_support":false,"name":"transgender symbol","slug":"transgender_symbol","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"✖️","skin_tone_support":false,"name":"multiply","slug":"multiply","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"➕","skin_tone_support":false,"name":"plus","slug":"plus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"➖","skin_tone_support":false,"name":"minus","slug":"minus","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"➗","skin_tone_support":false,"name":"divide","slug":"divide","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🟰","skin_tone_support":false,"name":"heavy equals sign","slug":"heavy_equals_sign","unicode_version":"14.0","emoji_version":"14.0"},{"emoji":"♾️","skin_tone_support":false,"name":"infinity","slug":"infinity","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"‼️","skin_tone_support":false,"name":"double exclamation mark","slug":"double_exclamation_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⁉️","skin_tone_support":false,"name":"exclamation question mark","slug":"exclamation_question_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❓","skin_tone_support":false,"name":"red question mark","slug":"red_question_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❔","skin_tone_support":false,"name":"white question mark","slug":"white_question_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❕","skin_tone_support":false,"name":"white exclamation mark","slug":"white_exclamation_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❗","skin_tone_support":false,"name":"red exclamation mark","slug":"red_exclamation_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"〰️","skin_tone_support":false,"name":"wavy dash","slug":"wavy_dash","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💱","skin_tone_support":false,"name":"currency exchange","slug":"currency_exchange","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💲","skin_tone_support":false,"name":"heavy dollar sign","slug":"heavy_dollar_sign","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⚕️","skin_tone_support":false,"name":"medical symbol","slug":"medical_symbol","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"♻️","skin_tone_support":false,"name":"recycling symbol","slug":"recycling_symbol","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⚜️","skin_tone_support":false,"name":"fleur-de-lis","slug":"fleur_de_lis","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🔱","skin_tone_support":false,"name":"trident emblem","slug":"trident_emblem","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"📛","skin_tone_support":false,"name":"name badge","slug":"name_badge","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔰","skin_tone_support":false,"name":"Japanese symbol for beginner","slug":"japanese_symbol_for_beginner","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⭕","skin_tone_support":false,"name":"hollow red circle","slug":"hollow_red_circle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✅","skin_tone_support":false,"name":"check mark button","slug":"check_mark_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"☑️","skin_tone_support":false,"name":"check box with check","slug":"check_box_with_check","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✔️","skin_tone_support":false,"name":"check mark","slug":"check_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❌","skin_tone_support":false,"name":"cross mark","slug":"cross_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❎","skin_tone_support":false,"name":"cross mark button","slug":"cross_mark_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"➰","skin_tone_support":false,"name":"curly loop","slug":"curly_loop","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"➿","skin_tone_support":false,"name":"double curly loop","slug":"double_curly_loop","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"〽️","skin_tone_support":false,"name":"part alternation mark","slug":"part_alternation_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✳️","skin_tone_support":false,"name":"eight-spoked asterisk","slug":"eight_spoked_asterisk","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"✴️","skin_tone_support":false,"name":"eight-pointed star","slug":"eight_pointed_star","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"❇️","skin_tone_support":false,"name":"sparkle","slug":"sparkle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"©️","skin_tone_support":false,"name":"copyright","slug":"copyright","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"®️","skin_tone_support":false,"name":"registered","slug":"registered","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"™️","skin_tone_support":false,"name":"trade mark","slug":"trade_mark","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🫟","skin_tone_support":false,"name":"splatter","slug":"splatter","unicode_version":"16.0","emoji_version":"16.0"},{"emoji":"#️⃣","skin_tone_support":false,"name":"keycap #","slug":"keycap_number_sign","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"*️⃣","skin_tone_support":false,"name":"keycap *","slug":"keycap_asterisk","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"0️⃣","skin_tone_support":false,"name":"keycap 0","slug":"keycap_0","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"1️⃣","skin_tone_support":false,"name":"keycap 1","slug":"keycap_1","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"2️⃣","skin_tone_support":false,"name":"keycap 2","slug":"keycap_2","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"3️⃣","skin_tone_support":false,"name":"keycap 3","slug":"keycap_3","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"4️⃣","skin_tone_support":false,"name":"keycap 4","slug":"keycap_4","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"5️⃣","skin_tone_support":false,"name":"keycap 5","slug":"keycap_5","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"6️⃣","skin_tone_support":false,"name":"keycap 6","slug":"keycap_6","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"7️⃣","skin_tone_support":false,"name":"keycap 7","slug":"keycap_7","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"8️⃣","skin_tone_support":false,"name":"keycap 8","slug":"keycap_8","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"9️⃣","skin_tone_support":false,"name":"keycap 9","slug":"keycap_9","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔟","skin_tone_support":false,"name":"keycap 10","slug":"keycap_10","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔠","skin_tone_support":false,"name":"input latin uppercase","slug":"input_latin_uppercase","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔡","skin_tone_support":false,"name":"input latin lowercase","slug":"input_latin_lowercase","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔢","skin_tone_support":false,"name":"input numbers","slug":"input_numbers","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔣","skin_tone_support":false,"name":"input symbols","slug":"input_symbols","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔤","skin_tone_support":false,"name":"input latin letters","slug":"input_latin_letters","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🅰️","skin_tone_support":false,"name":"A button (blood type)","slug":"a_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆎","skin_tone_support":false,"name":"AB button (blood type)","slug":"ab_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🅱️","skin_tone_support":false,"name":"B button (blood type)","slug":"b_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆑","skin_tone_support":false,"name":"CL button","slug":"cl_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆒","skin_tone_support":false,"name":"COOL button","slug":"cool_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆓","skin_tone_support":false,"name":"FREE button","slug":"free_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"ℹ️","skin_tone_support":false,"name":"information","slug":"information","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆔","skin_tone_support":false,"name":"ID button","slug":"id_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"Ⓜ️","skin_tone_support":false,"name":"circled M","slug":"circled_m","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆕","skin_tone_support":false,"name":"NEW button","slug":"new_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆖","skin_tone_support":false,"name":"NG button","slug":"ng_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🅾️","skin_tone_support":false,"name":"O button (blood type)","slug":"o_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆗","skin_tone_support":false,"name":"OK button","slug":"ok_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🅿️","skin_tone_support":false,"name":"P button","slug":"p_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆘","skin_tone_support":false,"name":"SOS button","slug":"sos_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆙","skin_tone_support":false,"name":"UP! button","slug":"up_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🆚","skin_tone_support":false,"name":"VS button","slug":"vs_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈁","skin_tone_support":false,"name":"Japanese “here” button","slug":"japanese_here_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈂️","skin_tone_support":false,"name":"Japanese “service charge” button","slug":"japanese_service_charge_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈷️","skin_tone_support":false,"name":"Japanese “monthly amount” button","slug":"japanese_monthly_amount_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈶","skin_tone_support":false,"name":"Japanese “not free of charge” button","slug":"japanese_not_free_of_charge_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈯","skin_tone_support":false,"name":"Japanese “reserved” button","slug":"japanese_reserved_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🉐","skin_tone_support":false,"name":"Japanese “bargain” button","slug":"japanese_bargain_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈹","skin_tone_support":false,"name":"Japanese “discount” button","slug":"japanese_discount_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈚","skin_tone_support":false,"name":"Japanese “free of charge” button","slug":"japanese_free_of_charge_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈲","skin_tone_support":false,"name":"Japanese “prohibited” button","slug":"japanese_prohibited_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🉑","skin_tone_support":false,"name":"Japanese “acceptable” button","slug":"japanese_acceptable_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈸","skin_tone_support":false,"name":"Japanese “application” button","slug":"japanese_application_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈴","skin_tone_support":false,"name":"Japanese “passing grade” button","slug":"japanese_passing_grade_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈳","skin_tone_support":false,"name":"Japanese “vacancy” button","slug":"japanese_vacancy_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"㊗️","skin_tone_support":false,"name":"Japanese “congratulations” button","slug":"japanese_congratulations_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"㊙️","skin_tone_support":false,"name":"Japanese “secret” button","slug":"japanese_secret_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈺","skin_tone_support":false,"name":"Japanese “open for business” button","slug":"japanese_open_for_business_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🈵","skin_tone_support":false,"name":"Japanese “no vacancy” button","slug":"japanese_no_vacancy_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔴","skin_tone_support":false,"name":"red circle","slug":"red_circle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🟠","skin_tone_support":false,"name":"orange circle","slug":"orange_circle","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟡","skin_tone_support":false,"name":"yellow circle","slug":"yellow_circle","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟢","skin_tone_support":false,"name":"green circle","slug":"green_circle","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🔵","skin_tone_support":false,"name":"blue circle","slug":"blue_circle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🟣","skin_tone_support":false,"name":"purple circle","slug":"purple_circle","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟤","skin_tone_support":false,"name":"brown circle","slug":"brown_circle","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"⚫","skin_tone_support":false,"name":"black circle","slug":"black_circle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⚪","skin_tone_support":false,"name":"white circle","slug":"white_circle","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🟥","skin_tone_support":false,"name":"red square","slug":"red_square","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟧","skin_tone_support":false,"name":"orange square","slug":"orange_square","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟨","skin_tone_support":false,"name":"yellow square","slug":"yellow_square","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟩","skin_tone_support":false,"name":"green square","slug":"green_square","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟦","skin_tone_support":false,"name":"blue square","slug":"blue_square","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟪","skin_tone_support":false,"name":"purple square","slug":"purple_square","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"🟫","skin_tone_support":false,"name":"brown square","slug":"brown_square","unicode_version":"12.0","emoji_version":"12.0"},{"emoji":"⬛","skin_tone_support":false,"name":"black large square","slug":"black_large_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"⬜","skin_tone_support":false,"name":"white large square","slug":"white_large_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"◼️","skin_tone_support":false,"name":"black medium square","slug":"black_medium_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"◻️","skin_tone_support":false,"name":"white medium square","slug":"white_medium_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"◾","skin_tone_support":false,"name":"black medium-small square","slug":"black_medium_small_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"◽","skin_tone_support":false,"name":"white medium-small square","slug":"white_medium_small_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"▪️","skin_tone_support":false,"name":"black small square","slug":"black_small_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"▫️","skin_tone_support":false,"name":"white small square","slug":"white_small_square","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔶","skin_tone_support":false,"name":"large orange diamond","slug":"large_orange_diamond","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔷","skin_tone_support":false,"name":"large blue diamond","slug":"large_blue_diamond","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔸","skin_tone_support":false,"name":"small orange diamond","slug":"small_orange_diamond","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔹","skin_tone_support":false,"name":"small blue diamond","slug":"small_blue_diamond","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔺","skin_tone_support":false,"name":"red triangle pointed up","slug":"red_triangle_pointed_up","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔻","skin_tone_support":false,"name":"red triangle pointed down","slug":"red_triangle_pointed_down","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"💠","skin_tone_support":false,"name":"diamond with a dot","slug":"diamond_with_a_dot","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔘","skin_tone_support":false,"name":"radio button","slug":"radio_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔳","skin_tone_support":false,"name":"white square button","slug":"white_square_button","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🔲","skin_tone_support":false,"name":"black square button","slug":"black_square_button","unicode_version":"0.6","emoji_version":"0.6"}]},{"name":"Flags","slug":"flags","emojis":[{"emoji":"🏁","skin_tone_support":false,"name":"chequered flag","slug":"chequered_flag","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🚩","skin_tone_support":false,"name":"triangular flag","slug":"triangular_flag","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🎌","skin_tone_support":false,"name":"crossed flags","slug":"crossed_flags","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🏴","skin_tone_support":false,"name":"black flag","slug":"black_flag","unicode_version":"1.0","emoji_version":"1.0"},{"emoji":"🏳️","skin_tone_support":false,"name":"white flag","slug":"white_flag","unicode_version":"0.7","emoji_version":"0.7"},{"emoji":"🏳️‍🌈","skin_tone_support":false,"name":"rainbow flag","slug":"rainbow_flag","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🏳️‍⚧️","skin_tone_support":false,"name":"transgender flag","slug":"transgender_flag","unicode_version":"13.0","emoji_version":"13.0"},{"emoji":"🏴‍☠️","skin_tone_support":false,"name":"pirate flag","slug":"pirate_flag","unicode_version":"11.0","emoji_version":"11.0"},{"emoji":"🇦🇨","skin_tone_support":false,"name":"flag Ascension Island","slug":"flag_ascension_island","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇩","skin_tone_support":false,"name":"flag Andorra","slug":"flag_andorra","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇪","skin_tone_support":false,"name":"flag United Arab Emirates","slug":"flag_united_arab_emirates","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇫","skin_tone_support":false,"name":"flag Afghanistan","slug":"flag_afghanistan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇬","skin_tone_support":false,"name":"flag Antigua & Barbuda","slug":"flag_antigua_barbuda","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇮","skin_tone_support":false,"name":"flag Anguilla","slug":"flag_anguilla","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇱","skin_tone_support":false,"name":"flag Albania","slug":"flag_albania","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇲","skin_tone_support":false,"name":"flag Armenia","slug":"flag_armenia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇴","skin_tone_support":false,"name":"flag Angola","slug":"flag_angola","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇶","skin_tone_support":false,"name":"flag Antarctica","slug":"flag_antarctica","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇷","skin_tone_support":false,"name":"flag Argentina","slug":"flag_argentina","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇸","skin_tone_support":false,"name":"flag American Samoa","slug":"flag_american_samoa","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇹","skin_tone_support":false,"name":"flag Austria","slug":"flag_austria","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇺","skin_tone_support":false,"name":"flag Australia","slug":"flag_australia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇼","skin_tone_support":false,"name":"flag Aruba","slug":"flag_aruba","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇽","skin_tone_support":false,"name":"flag Åland Islands","slug":"flag_aland_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇦🇿","skin_tone_support":false,"name":"flag Azerbaijan","slug":"flag_azerbaijan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇦","skin_tone_support":false,"name":"flag Bosnia & Herzegovina","slug":"flag_bosnia_herzegovina","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇧","skin_tone_support":false,"name":"flag Barbados","slug":"flag_barbados","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇩","skin_tone_support":false,"name":"flag Bangladesh","slug":"flag_bangladesh","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇪","skin_tone_support":false,"name":"flag Belgium","slug":"flag_belgium","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇫","skin_tone_support":false,"name":"flag Burkina Faso","slug":"flag_burkina_faso","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇬","skin_tone_support":false,"name":"flag Bulgaria","slug":"flag_bulgaria","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇭","skin_tone_support":false,"name":"flag Bahrain","slug":"flag_bahrain","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇮","skin_tone_support":false,"name":"flag Burundi","slug":"flag_burundi","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇯","skin_tone_support":false,"name":"flag Benin","slug":"flag_benin","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇱","skin_tone_support":false,"name":"flag St. Barthélemy","slug":"flag_st_barthelemy","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇲","skin_tone_support":false,"name":"flag Bermuda","slug":"flag_bermuda","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇳","skin_tone_support":false,"name":"flag Brunei","slug":"flag_brunei","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇴","skin_tone_support":false,"name":"flag Bolivia","slug":"flag_bolivia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇶","skin_tone_support":false,"name":"flag Caribbean Netherlands","slug":"flag_caribbean_netherlands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇷","skin_tone_support":false,"name":"flag Brazil","slug":"flag_brazil","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇸","skin_tone_support":false,"name":"flag Bahamas","slug":"flag_bahamas","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇹","skin_tone_support":false,"name":"flag Bhutan","slug":"flag_bhutan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇻","skin_tone_support":false,"name":"flag Bouvet Island","slug":"flag_bouvet_island","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇼","skin_tone_support":false,"name":"flag Botswana","slug":"flag_botswana","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇾","skin_tone_support":false,"name":"flag Belarus","slug":"flag_belarus","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇧🇿","skin_tone_support":false,"name":"flag Belize","slug":"flag_belize","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇦","skin_tone_support":false,"name":"flag Canada","slug":"flag_canada","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇨","skin_tone_support":false,"name":"flag Cocos (Keeling) Islands","slug":"flag_cocos_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇩","skin_tone_support":false,"name":"flag Congo - Kinshasa","slug":"flag_congo_kinshasa","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇫","skin_tone_support":false,"name":"flag Central African Republic","slug":"flag_central_african_republic","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇬","skin_tone_support":false,"name":"flag Congo - Brazzaville","slug":"flag_congo_brazzaville","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇭","skin_tone_support":false,"name":"flag Switzerland","slug":"flag_switzerland","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇮","skin_tone_support":false,"name":"flag Côte d’Ivoire","slug":"flag_cote_d_ivoire","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇰","skin_tone_support":false,"name":"flag Cook Islands","slug":"flag_cook_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇱","skin_tone_support":false,"name":"flag Chile","slug":"flag_chile","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇲","skin_tone_support":false,"name":"flag Cameroon","slug":"flag_cameroon","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇳","skin_tone_support":false,"name":"flag China","slug":"flag_china","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇨🇴","skin_tone_support":false,"name":"flag Colombia","slug":"flag_colombia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇵","skin_tone_support":false,"name":"flag Clipperton Island","slug":"flag_clipperton_island","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇶","skin_tone_support":false,"name":"flag Sark","slug":"flag_sark","unicode_version":"16.0","emoji_version":"16.0"},{"emoji":"🇨🇷","skin_tone_support":false,"name":"flag Costa Rica","slug":"flag_costa_rica","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇺","skin_tone_support":false,"name":"flag Cuba","slug":"flag_cuba","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇻","skin_tone_support":false,"name":"flag Cape Verde","slug":"flag_cape_verde","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇼","skin_tone_support":false,"name":"flag Curaçao","slug":"flag_curacao","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇽","skin_tone_support":false,"name":"flag Christmas Island","slug":"flag_christmas_island","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇾","skin_tone_support":false,"name":"flag Cyprus","slug":"flag_cyprus","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇨🇿","skin_tone_support":false,"name":"flag Czechia","slug":"flag_czechia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇩🇪","skin_tone_support":false,"name":"flag Germany","slug":"flag_germany","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇩🇬","skin_tone_support":false,"name":"flag Diego Garcia","slug":"flag_diego_garcia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇩🇯","skin_tone_support":false,"name":"flag Djibouti","slug":"flag_djibouti","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇩🇰","skin_tone_support":false,"name":"flag Denmark","slug":"flag_denmark","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇩🇲","skin_tone_support":false,"name":"flag Dominica","slug":"flag_dominica","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇩🇴","skin_tone_support":false,"name":"flag Dominican Republic","slug":"flag_dominican_republic","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇩🇿","skin_tone_support":false,"name":"flag Algeria","slug":"flag_algeria","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇦","skin_tone_support":false,"name":"flag Ceuta & Melilla","slug":"flag_ceuta_melilla","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇨","skin_tone_support":false,"name":"flag Ecuador","slug":"flag_ecuador","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇪","skin_tone_support":false,"name":"flag Estonia","slug":"flag_estonia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇬","skin_tone_support":false,"name":"flag Egypt","slug":"flag_egypt","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇭","skin_tone_support":false,"name":"flag Western Sahara","slug":"flag_western_sahara","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇷","skin_tone_support":false,"name":"flag Eritrea","slug":"flag_eritrea","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇸","skin_tone_support":false,"name":"flag Spain","slug":"flag_spain","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇪🇹","skin_tone_support":false,"name":"flag Ethiopia","slug":"flag_ethiopia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇪🇺","skin_tone_support":false,"name":"flag European Union","slug":"flag_european_union","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇫🇮","skin_tone_support":false,"name":"flag Finland","slug":"flag_finland","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇫🇯","skin_tone_support":false,"name":"flag Fiji","slug":"flag_fiji","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇫🇰","skin_tone_support":false,"name":"flag Falkland Islands","slug":"flag_falkland_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇫🇲","skin_tone_support":false,"name":"flag Micronesia","slug":"flag_micronesia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇫🇴","skin_tone_support":false,"name":"flag Faroe Islands","slug":"flag_faroe_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇫🇷","skin_tone_support":false,"name":"flag France","slug":"flag_france","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇬🇦","skin_tone_support":false,"name":"flag Gabon","slug":"flag_gabon","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇧","skin_tone_support":false,"name":"flag United Kingdom","slug":"flag_united_kingdom","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇬🇩","skin_tone_support":false,"name":"flag Grenada","slug":"flag_grenada","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇪","skin_tone_support":false,"name":"flag Georgia","slug":"flag_georgia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇫","skin_tone_support":false,"name":"flag French Guiana","slug":"flag_french_guiana","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇬","skin_tone_support":false,"name":"flag Guernsey","slug":"flag_guernsey","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇭","skin_tone_support":false,"name":"flag Ghana","slug":"flag_ghana","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇮","skin_tone_support":false,"name":"flag Gibraltar","slug":"flag_gibraltar","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇱","skin_tone_support":false,"name":"flag Greenland","slug":"flag_greenland","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇲","skin_tone_support":false,"name":"flag Gambia","slug":"flag_gambia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇳","skin_tone_support":false,"name":"flag Guinea","slug":"flag_guinea","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇵","skin_tone_support":false,"name":"flag Guadeloupe","slug":"flag_guadeloupe","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇶","skin_tone_support":false,"name":"flag Equatorial Guinea","slug":"flag_equatorial_guinea","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇷","skin_tone_support":false,"name":"flag Greece","slug":"flag_greece","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇸","skin_tone_support":false,"name":"flag South Georgia & South Sandwich Islands","slug":"flag_south_georgia_south_sandwich_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇹","skin_tone_support":false,"name":"flag Guatemala","slug":"flag_guatemala","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇺","skin_tone_support":false,"name":"flag Guam","slug":"flag_guam","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇼","skin_tone_support":false,"name":"flag Guinea-Bissau","slug":"flag_guinea_bissau","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇬🇾","skin_tone_support":false,"name":"flag Guyana","slug":"flag_guyana","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇭🇰","skin_tone_support":false,"name":"flag Hong Kong SAR China","slug":"flag_hong_kong_sar_china","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇭🇲","skin_tone_support":false,"name":"flag Heard & McDonald Islands","slug":"flag_heard_mcdonald_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇭🇳","skin_tone_support":false,"name":"flag Honduras","slug":"flag_honduras","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇭🇷","skin_tone_support":false,"name":"flag Croatia","slug":"flag_croatia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇭🇹","skin_tone_support":false,"name":"flag Haiti","slug":"flag_haiti","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇭🇺","skin_tone_support":false,"name":"flag Hungary","slug":"flag_hungary","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇨","skin_tone_support":false,"name":"flag Canary Islands","slug":"flag_canary_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇩","skin_tone_support":false,"name":"flag Indonesia","slug":"flag_indonesia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇪","skin_tone_support":false,"name":"flag Ireland","slug":"flag_ireland","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇱","skin_tone_support":false,"name":"flag Israel","slug":"flag_israel","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇲","skin_tone_support":false,"name":"flag Isle of Man","slug":"flag_isle_of_man","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇳","skin_tone_support":false,"name":"flag India","slug":"flag_india","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇴","skin_tone_support":false,"name":"flag British Indian Ocean Territory","slug":"flag_british_indian_ocean_territory","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇶","skin_tone_support":false,"name":"flag Iraq","slug":"flag_iraq","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇷","skin_tone_support":false,"name":"flag Iran","slug":"flag_iran","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇸","skin_tone_support":false,"name":"flag Iceland","slug":"flag_iceland","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇮🇹","skin_tone_support":false,"name":"flag Italy","slug":"flag_italy","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇯🇪","skin_tone_support":false,"name":"flag Jersey","slug":"flag_jersey","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇯🇲","skin_tone_support":false,"name":"flag Jamaica","slug":"flag_jamaica","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇯🇴","skin_tone_support":false,"name":"flag Jordan","slug":"flag_jordan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇯🇵","skin_tone_support":false,"name":"flag Japan","slug":"flag_japan","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇰🇪","skin_tone_support":false,"name":"flag Kenya","slug":"flag_kenya","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇬","skin_tone_support":false,"name":"flag Kyrgyzstan","slug":"flag_kyrgyzstan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇭","skin_tone_support":false,"name":"flag Cambodia","slug":"flag_cambodia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇮","skin_tone_support":false,"name":"flag Kiribati","slug":"flag_kiribati","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇲","skin_tone_support":false,"name":"flag Comoros","slug":"flag_comoros","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇳","skin_tone_support":false,"name":"flag St. Kitts & Nevis","slug":"flag_st_kitts_nevis","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇵","skin_tone_support":false,"name":"flag North Korea","slug":"flag_north_korea","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇷","skin_tone_support":false,"name":"flag South Korea","slug":"flag_south_korea","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇰🇼","skin_tone_support":false,"name":"flag Kuwait","slug":"flag_kuwait","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇾","skin_tone_support":false,"name":"flag Cayman Islands","slug":"flag_cayman_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇰🇿","skin_tone_support":false,"name":"flag Kazakhstan","slug":"flag_kazakhstan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇦","skin_tone_support":false,"name":"flag Laos","slug":"flag_laos","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇧","skin_tone_support":false,"name":"flag Lebanon","slug":"flag_lebanon","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇨","skin_tone_support":false,"name":"flag St. Lucia","slug":"flag_st_lucia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇮","skin_tone_support":false,"name":"flag Liechtenstein","slug":"flag_liechtenstein","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇰","skin_tone_support":false,"name":"flag Sri Lanka","slug":"flag_sri_lanka","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇷","skin_tone_support":false,"name":"flag Liberia","slug":"flag_liberia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇸","skin_tone_support":false,"name":"flag Lesotho","slug":"flag_lesotho","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇹","skin_tone_support":false,"name":"flag Lithuania","slug":"flag_lithuania","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇺","skin_tone_support":false,"name":"flag Luxembourg","slug":"flag_luxembourg","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇻","skin_tone_support":false,"name":"flag Latvia","slug":"flag_latvia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇱🇾","skin_tone_support":false,"name":"flag Libya","slug":"flag_libya","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇦","skin_tone_support":false,"name":"flag Morocco","slug":"flag_morocco","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇨","skin_tone_support":false,"name":"flag Monaco","slug":"flag_monaco","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇩","skin_tone_support":false,"name":"flag Moldova","slug":"flag_moldova","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇪","skin_tone_support":false,"name":"flag Montenegro","slug":"flag_montenegro","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇫","skin_tone_support":false,"name":"flag St. Martin","slug":"flag_st_martin","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇬","skin_tone_support":false,"name":"flag Madagascar","slug":"flag_madagascar","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇭","skin_tone_support":false,"name":"flag Marshall Islands","slug":"flag_marshall_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇰","skin_tone_support":false,"name":"flag North Macedonia","slug":"flag_north_macedonia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇱","skin_tone_support":false,"name":"flag Mali","slug":"flag_mali","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇲","skin_tone_support":false,"name":"flag Myanmar (Burma)","slug":"flag_myanmar","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇳","skin_tone_support":false,"name":"flag Mongolia","slug":"flag_mongolia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇴","skin_tone_support":false,"name":"flag Macao SAR China","slug":"flag_macao_sar_china","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇵","skin_tone_support":false,"name":"flag Northern Mariana Islands","slug":"flag_northern_mariana_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇶","skin_tone_support":false,"name":"flag Martinique","slug":"flag_martinique","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇷","skin_tone_support":false,"name":"flag Mauritania","slug":"flag_mauritania","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇸","skin_tone_support":false,"name":"flag Montserrat","slug":"flag_montserrat","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇹","skin_tone_support":false,"name":"flag Malta","slug":"flag_malta","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇺","skin_tone_support":false,"name":"flag Mauritius","slug":"flag_mauritius","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇻","skin_tone_support":false,"name":"flag Maldives","slug":"flag_maldives","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇼","skin_tone_support":false,"name":"flag Malawi","slug":"flag_malawi","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇽","skin_tone_support":false,"name":"flag Mexico","slug":"flag_mexico","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇾","skin_tone_support":false,"name":"flag Malaysia","slug":"flag_malaysia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇲🇿","skin_tone_support":false,"name":"flag Mozambique","slug":"flag_mozambique","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇦","skin_tone_support":false,"name":"flag Namibia","slug":"flag_namibia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇨","skin_tone_support":false,"name":"flag New Caledonia","slug":"flag_new_caledonia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇪","skin_tone_support":false,"name":"flag Niger","slug":"flag_niger","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇫","skin_tone_support":false,"name":"flag Norfolk Island","slug":"flag_norfolk_island","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇬","skin_tone_support":false,"name":"flag Nigeria","slug":"flag_nigeria","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇮","skin_tone_support":false,"name":"flag Nicaragua","slug":"flag_nicaragua","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇱","skin_tone_support":false,"name":"flag Netherlands","slug":"flag_netherlands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇴","skin_tone_support":false,"name":"flag Norway","slug":"flag_norway","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇵","skin_tone_support":false,"name":"flag Nepal","slug":"flag_nepal","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇷","skin_tone_support":false,"name":"flag Nauru","slug":"flag_nauru","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇺","skin_tone_support":false,"name":"flag Niue","slug":"flag_niue","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇳🇿","skin_tone_support":false,"name":"flag New Zealand","slug":"flag_new_zealand","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇴🇲","skin_tone_support":false,"name":"flag Oman","slug":"flag_oman","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇦","skin_tone_support":false,"name":"flag Panama","slug":"flag_panama","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇪","skin_tone_support":false,"name":"flag Peru","slug":"flag_peru","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇫","skin_tone_support":false,"name":"flag French Polynesia","slug":"flag_french_polynesia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇬","skin_tone_support":false,"name":"flag Papua New Guinea","slug":"flag_papua_new_guinea","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇭","skin_tone_support":false,"name":"flag Philippines","slug":"flag_philippines","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇰","skin_tone_support":false,"name":"flag Pakistan","slug":"flag_pakistan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇱","skin_tone_support":false,"name":"flag Poland","slug":"flag_poland","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇲","skin_tone_support":false,"name":"flag St. Pierre & Miquelon","slug":"flag_st_pierre_miquelon","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇳","skin_tone_support":false,"name":"flag Pitcairn Islands","slug":"flag_pitcairn_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇷","skin_tone_support":false,"name":"flag Puerto Rico","slug":"flag_puerto_rico","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇸","skin_tone_support":false,"name":"flag Palestinian Territories","slug":"flag_palestinian_territories","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇹","skin_tone_support":false,"name":"flag Portugal","slug":"flag_portugal","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇼","skin_tone_support":false,"name":"flag Palau","slug":"flag_palau","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇵🇾","skin_tone_support":false,"name":"flag Paraguay","slug":"flag_paraguay","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇶🇦","skin_tone_support":false,"name":"flag Qatar","slug":"flag_qatar","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇷🇪","skin_tone_support":false,"name":"flag Réunion","slug":"flag_reunion","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇷🇴","skin_tone_support":false,"name":"flag Romania","slug":"flag_romania","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇷🇸","skin_tone_support":false,"name":"flag Serbia","slug":"flag_serbia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇷🇺","skin_tone_support":false,"name":"flag Russia","slug":"flag_russia","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇷🇼","skin_tone_support":false,"name":"flag Rwanda","slug":"flag_rwanda","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇦","skin_tone_support":false,"name":"flag Saudi Arabia","slug":"flag_saudi_arabia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇧","skin_tone_support":false,"name":"flag Solomon Islands","slug":"flag_solomon_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇨","skin_tone_support":false,"name":"flag Seychelles","slug":"flag_seychelles","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇩","skin_tone_support":false,"name":"flag Sudan","slug":"flag_sudan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇪","skin_tone_support":false,"name":"flag Sweden","slug":"flag_sweden","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇬","skin_tone_support":false,"name":"flag Singapore","slug":"flag_singapore","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇭","skin_tone_support":false,"name":"flag St. Helena","slug":"flag_st_helena","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇮","skin_tone_support":false,"name":"flag Slovenia","slug":"flag_slovenia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇯","skin_tone_support":false,"name":"flag Svalbard & Jan Mayen","slug":"flag_svalbard_jan_mayen","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇰","skin_tone_support":false,"name":"flag Slovakia","slug":"flag_slovakia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇱","skin_tone_support":false,"name":"flag Sierra Leone","slug":"flag_sierra_leone","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇲","skin_tone_support":false,"name":"flag San Marino","slug":"flag_san_marino","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇳","skin_tone_support":false,"name":"flag Senegal","slug":"flag_senegal","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇴","skin_tone_support":false,"name":"flag Somalia","slug":"flag_somalia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇷","skin_tone_support":false,"name":"flag Suriname","slug":"flag_suriname","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇸","skin_tone_support":false,"name":"flag South Sudan","slug":"flag_south_sudan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇹","skin_tone_support":false,"name":"flag São Tomé & Príncipe","slug":"flag_sao_tome_principe","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇻","skin_tone_support":false,"name":"flag El Salvador","slug":"flag_el_salvador","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇽","skin_tone_support":false,"name":"flag Sint Maarten","slug":"flag_sint_maarten","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇾","skin_tone_support":false,"name":"flag Syria","slug":"flag_syria","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇸🇿","skin_tone_support":false,"name":"flag Eswatini","slug":"flag_eswatini","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇦","skin_tone_support":false,"name":"flag Tristan da Cunha","slug":"flag_tristan_da_cunha","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇨","skin_tone_support":false,"name":"flag Turks & Caicos Islands","slug":"flag_turks_caicos_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇩","skin_tone_support":false,"name":"flag Chad","slug":"flag_chad","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇫","skin_tone_support":false,"name":"flag French Southern Territories","slug":"flag_french_southern_territories","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇬","skin_tone_support":false,"name":"flag Togo","slug":"flag_togo","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇭","skin_tone_support":false,"name":"flag Thailand","slug":"flag_thailand","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇯","skin_tone_support":false,"name":"flag Tajikistan","slug":"flag_tajikistan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇰","skin_tone_support":false,"name":"flag Tokelau","slug":"flag_tokelau","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇱","skin_tone_support":false,"name":"flag Timor-Leste","slug":"flag_timor_leste","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇲","skin_tone_support":false,"name":"flag Turkmenistan","slug":"flag_turkmenistan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇳","skin_tone_support":false,"name":"flag Tunisia","slug":"flag_tunisia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇴","skin_tone_support":false,"name":"flag Tonga","slug":"flag_tonga","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇷","skin_tone_support":false,"name":"flag Türkiye","slug":"flag_turkiye","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇹","skin_tone_support":false,"name":"flag Trinidad & Tobago","slug":"flag_trinidad_tobago","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇻","skin_tone_support":false,"name":"flag Tuvalu","slug":"flag_tuvalu","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇼","skin_tone_support":false,"name":"flag Taiwan","slug":"flag_taiwan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇹🇿","skin_tone_support":false,"name":"flag Tanzania","slug":"flag_tanzania","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇺🇦","skin_tone_support":false,"name":"flag Ukraine","slug":"flag_ukraine","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇺🇬","skin_tone_support":false,"name":"flag Uganda","slug":"flag_uganda","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇺🇲","skin_tone_support":false,"name":"flag U.S. Outlying Islands","slug":"flag_u_s_outlying_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇺🇳","skin_tone_support":false,"name":"flag United Nations","slug":"flag_united_nations","unicode_version":"4.0","emoji_version":"4.0"},{"emoji":"🇺🇸","skin_tone_support":false,"name":"flag United States","slug":"flag_united_states","unicode_version":"0.6","emoji_version":"0.6"},{"emoji":"🇺🇾","skin_tone_support":false,"name":"flag Uruguay","slug":"flag_uruguay","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇺🇿","skin_tone_support":false,"name":"flag Uzbekistan","slug":"flag_uzbekistan","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇻🇦","skin_tone_support":false,"name":"flag Vatican City","slug":"flag_vatican_city","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇻🇨","skin_tone_support":false,"name":"flag St. Vincent & Grenadines","slug":"flag_st_vincent_grenadines","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇻🇪","skin_tone_support":false,"name":"flag Venezuela","slug":"flag_venezuela","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇻🇬","skin_tone_support":false,"name":"flag British Virgin Islands","slug":"flag_british_virgin_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇻🇮","skin_tone_support":false,"name":"flag U.S. Virgin Islands","slug":"flag_u_s_virgin_islands","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇻🇳","skin_tone_support":false,"name":"flag Vietnam","slug":"flag_vietnam","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇻🇺","skin_tone_support":false,"name":"flag Vanuatu","slug":"flag_vanuatu","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇼🇫","skin_tone_support":false,"name":"flag Wallis & Futuna","slug":"flag_wallis_futuna","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇼🇸","skin_tone_support":false,"name":"flag Samoa","slug":"flag_samoa","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇽🇰","skin_tone_support":false,"name":"flag Kosovo","slug":"flag_kosovo","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇾🇪","skin_tone_support":false,"name":"flag Yemen","slug":"flag_yemen","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇾🇹","skin_tone_support":false,"name":"flag Mayotte","slug":"flag_mayotte","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇿🇦","skin_tone_support":false,"name":"flag South Africa","slug":"flag_south_africa","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇿🇲","skin_tone_support":false,"name":"flag Zambia","slug":"flag_zambia","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🇿🇼","skin_tone_support":false,"name":"flag Zimbabwe","slug":"flag_zimbabwe","unicode_version":"2.0","emoji_version":"2.0"},{"emoji":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","skin_tone_support":false,"name":"flag England","slug":"flag_england","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","skin_tone_support":false,"name":"flag Scotland","slug":"flag_scotland","unicode_version":"5.0","emoji_version":"5.0"},{"emoji":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","skin_tone_support":false,"name":"flag Wales","slug":"flag_wales","unicode_version":"5.0","emoji_version":"5.0"}]}]');
let canvas;
let ctx;
let refEmojiWidth;
let refBrokenWidth;
function isEmojiSupported(emoji) {
  if (!canvas) {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    ctx.font = '32px sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"';
    refEmojiWidth = ctx.measureText("😀").width;
    refBrokenWidth = ctx.measureText("￿").width;
  }
  const emojiWidth = ctx.measureText(emoji).width;
  return emojiWidth !== refBrokenWidth && emojiWidth / refEmojiWidth < 1.5;
}
function animateEmoji(emojiContainer, timeSeconds = 1, withCross = false) {
  const floatingBlock = document.createElement("div");
  floatingBlock.style = "position: absolute; pointer-events: none; z-index: 999999999999; margin: 0; padding: 0; background: none; border: none";
  floatingBlock.innerText = emojiContainer.innerText;
  floatingBlock.popover = "manual";
  if (withCross) {
    floatingBlock.style.background = `
            linear-gradient(to top right, transparent calc(50% - 1px), red 50%, transparent calc(50% + 1px)),
            linear-gradient(to bottom right, transparent calc(50% - 1px), red 50%, transparent calc(50% + 1px))
        `;
  }
  floatingBlock.style.fontSize = window.getComputedStyle(emojiContainer).fontSize;
  document.body.appendChild(floatingBlock);
  floatingBlock.showPopover();
  const bb = emojiContainer.getBoundingClientRect();
  let progress = 0;
  const progressFactor = 1 / (timeSeconds * 1e3);
  const movingFactor = 0.1;
  let x2 = bb.x;
  let y2 = bb.y;
  let ts = Date.now();
  function render() {
    const now2 = Date.now();
    const ela = now2 - ts;
    ts = now2;
    progress += ela * progressFactor;
    floatingBlock.style.opacity = 1 - progress;
    y2 -= ela * movingFactor;
    console.log({ x: x2, y: y2, progress });
    floatingBlock.style.top = y2 + "px";
    floatingBlock.style.left = x2 + "px";
    if (progress < 1) {
      requestAnimationFrame(render);
    } else {
      floatingBlock.hidePopover();
      floatingBlock.remove();
    }
  }
  render();
}
let emojiLoaded = null;
function getEmoji() {
  if (!emojiLoaded) loadEmoji();
  return emojiLoaded;
}
function loadEmoji() {
  emojiLoaded = emojiOrdered.map((group) => filterEmoji(group.emojis.map((e) => e.emoji)));
}
function filterEmoji(list) {
  return list.filter((e) => isEmojiSupported(e));
}
function clicker(node, options2 = {}) {
  let timer = null;
  let isLong = false;
  let isPressed = false;
  let { onclick, onlongclick, delay = 500 } = options2;
  function handleDown(e) {
    isPressed = true;
    isLong = false;
    if (e.pointerId !== void 0 && node.setPointerCapture) {
      try {
        node.setPointerCapture(e.pointerId);
      } catch (_) {
      }
    }
    if (onlongclick) {
      timer = setTimeout(() => {
        isLong = true;
        onlongclick(e);
      }, delay);
    }
  }
  function handleUp(e) {
    if (!isPressed) return;
    isPressed = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (isLong) {
      isLong = false;
      return;
    }
    if (onclick) {
      onclick(e);
    }
  }
  function handleCancel() {
    isPressed = false;
    isLong = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  node.addEventListener("pointerdown", handleDown);
  node.addEventListener("pointerup", handleUp);
  node.addEventListener("pointerleave", handleCancel);
  node.addEventListener("pointercancel", handleCancel);
  return {
    update(newOptions) {
      onclick = newOptions.onclick;
      onlongclick = newOptions.onlongclick;
      delay = newOptions.delay ?? 500;
    },
    destroy() {
      handleCancel();
      node.removeEventListener("pointerdown", handleDown);
      node.removeEventListener("pointerup", handleUp);
      node.removeEventListener("pointerleave", handleCancel);
      node.removeEventListener("pointercancel", handleCancel);
    }
  };
}
var root_2$3 = from_html(`<div class="options svelte-191yngm"><div class="leftOptions svelte-191yngm"><div class="myusersUsername svelte-191yngm"> </div> <div class="channel svelte-191yngm"> </div></div> <div class="rightOptions svelte-191yngm"><!> <!></div></div>`);
var root_7 = from_html(`<div class="emojiIcon svelte-191yngm"></div>`);
var root_10$1 = from_html(`<hr/>`);
var root_9 = from_html(`<!> <div class="message"><div class="messageHead svelte-191yngm"><div class="chatUsername svelte-191yngm"> </div> <div class="msgTime svelte-191yngm"> </div></div> <div class="messageText svelte-191yngm"> </div></div>`, 1);
var root_8$1 = from_html(`<div class="messages svelte-191yngm"></div>`);
var root_11 = from_html(`<div class="channelsDrawerTab svelte-191yngm"> </div>`);
var root_13 = from_html(`<button> </button>`);
var root_12 = from_html(`<div class="channelsList svelte-191yngm"></div>`);
var root_14$1 = from_html(`<div class="usersTab svelte-191yngm"><div> </div> <span class="usersLabel svelte-191yngm"> </span></div>`);
var root_18 = from_html(`<hr/>`);
var root_17$1 = from_html(`<!> <div class="userBlock svelte-191yngm"><div class="badge svelte-191yngm"></div> <div class="usersUsername svelte-191yngm"></div> <div><div> </div> <div> </div></div></div>`, 1);
var root_15 = from_html(`<div style="width: 190px;"><!></div>`);
var root_20 = from_html(`<button></button>`);
var root_26 = from_html(`<span class="svelte-191yngm"> </span>`);
var root_25 = from_html(`<span class="emojiRow svelte-191yngm"></span>`);
var root_27 = from_html(`<div> </div>`);
var root_28 = from_html(`<div></div>`);
var root_29 = from_html(`<div>todo стикеры</div>`);
var root$9 = from_html(`<div class="chatContainer svelte-191yngm"><!> <div class="submenus svelte-191yngm"><!> <div class="channelsDrawer svelte-191yngm"><!></div> <!> <div class="toggleChatTab svelte-191yngm"><!></div></div></div> <!> <!>`, 1);
function Chat($$anchor, $$props) {
  push($$props, true);
  const $_ = () => store_get($format, "$_", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  const core2 = useGameCore$1();
  let messagesByChannel = proxy({ global: [] });
  function formatTime2(timestamp) {
    const d = new Date(timestamp);
    d.getDate();
    d.getMonth() + 1;
    d.getFullYear();
    const h = d.getHours();
    const m = d.getMinutes();
    d.getSeconds();
    const fullTime = d.toISOString().replace("T", " ").replace("Z", "");
    const time = `[${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}]`;
    return { fullTime, time };
  }
  let currentReplyTarget = null;
  let currentChannel = persistentPerCanvas("chatChannel", "global");
  let availableChannels = user_derived(() => {
    const set2 = /* @__PURE__ */ new Set(["global"]);
    if (core2.config?.canvasName) {
      set2.add(core2.config.canvasName);
    }
    Object.keys(messagesByChannel).forEach((ch) => set2.add(ch));
    return Array.from(set2);
  });
  let currentMessages = user_derived(() => {
    const ch = currentChannel.v;
    const list = messagesByChannel[ch] || [];
    const limit = core2.gameConfig.chatLimit ?? 100;
    return list.slice(-limit);
  });
  let chatHeight = state(0);
  let chatWidth = state(0);
  let tabWidth = state(0);
  let channelsTabHeight = state(0);
  let channelsTabWidth = state(0);
  let channelsBodyHeight = user_derived(() => `${get(channelsTabHeight) + 11}px`);
  let chatCollapsed = state(false);
  let offsetLeft = user_derived(() => {
    if (get(chatCollapsed)) {
      return -get(chatWidth) + "px";
    }
    return 0;
  });
  let channelsDrawerOffset = user_derived(() => get(chatCollapsed) ? (get(channelsTabWidth) + 4 + 10) * -1 : 0);
  const palette = core2.config.colorsHex;
  let channelsDrawerState = state("closed");
  let usersDrawerState = state("closed");
  user_effect(() => {
    if (get(chatCollapsed)) {
      set$1(usersDrawerState, "closed");
      set$1(channelsDrawerState, "closed");
    }
  });
  function getUsername(user) {
    if (!user.registered) {
      return `GUEST ${user.connections[0]}`;
    }
    return user.username;
  }
  function formatNicknameWbr(username) {
    return username?.replace(/([#._@/])/g, "$1<wbr>");
  }
  function needOutline(color) {
    if (!color) return false;
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-dark").trim() ?? "#000000";
    const dist = checkCssContrast(bgColor, color);
    return dist < 3.9;
  }
  let chatInputRef = state(null);
  function processEnter() {
    const chatFocused = document.activeElement === get(chatInputRef);
    if (chatFocused) {
      sendCurrentMessage();
    } else {
      get(chatInputRef).focus();
    }
  }
  function sendCurrentMessage() {
    const inputText = get(chatInputRef).value.trim();
    if (!inputText) return;
    const msgObj = { text: inputText, replyTo: currentReplyTarget };
    const channel = currentChannel.v;
    const sent = socket.sendChatMessage(msgObj, channel);
    if (sent) {
      get(chatInputRef).value = "";
    }
  }
  let isLoginOpen = state(false);
  let panelBodyRef = state(null);
  let emojiButtonRef = state(null);
  const emoji = getEmoji();
  let favEmojiList = persistent("favEmoji", ["🙁", "🤔", "😀", "😄", "💚", "😡", "👋", "👍", "😐"]);
  let emojiMegaList = user_derived(() => [
    ...chunkArray(favEmojiList.v, 6).map((row) => ({ type: "emojiRow", data: row })),
    { type: "spacer", height: 14 },
    ...chunkArray(emoji.flat(), 6).map((row) => ({ type: "emojiRow", data: row }))
  ]);
  function chunkArray(arr, size = 6) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => padEnd(arr.slice(i * size, i * size + size), size, "	"));
  }
  function padEnd(arr, targetLength, padValue = void 0) {
    const needToPad = Math.max(0, targetLength - arr.length);
    return [...arr, ...Array(needToPad).fill(padValue)];
  }
  function emojiClicked(clickEv) {
    console.trace("click", Date.now());
    get(chatInputRef).value += clickEv.target.innerText;
    get(chatInputRef).focus();
  }
  function emojiLongClicked(clickEv) {
    console.trace("click", Date.now());
    const emoji2 = clickEv.target.innerText;
    const favEm = favEmojiList.v;
    let isRemoved = false;
    if (favEm.includes(emoji2)) {
      favEm.splice(favEm.indexOf(emoji2), 1);
      isRemoved = true;
    } else {
      favEm.push(emoji2);
    }
    animateEmoji(clickEv.target, 0.7, isRemoved);
    favEmojiList.v = [...favEm];
  }
  emitter.on("sock.chatMessage", (msg) => {
    const ch = msg.ch || "global";
    if (!messagesByChannel[ch]) {
      messagesByChannel[ch] = [];
    }
    messagesByChannel[ch].push(msg);
    const limit = core2.gameConfig.chatLimit;
    if (messagesByChannel[ch].length > limit * 1.5) {
      messagesByChannel[ch] = messagesByChannel[ch].slice(-limit);
    }
    let scolledDown = Math.abs(get(panelBodyRef).scrollHeight - get(panelBodyRef).offsetHeight - get(panelBodyRef).scrollTop) < 30;
    if (scolledDown) {
      tick().then(() => {
        scrollDownMessages();
      });
    }
  });
  function scrollDownMessages() {
    get(panelBodyRef).scrollBy(0, 999);
  }
  onMount(() => {
    emitter.on("keydown", (e) => {
      if (e.code === "Enter" && !e.altKey) {
        processEnter();
      }
    });
  });
  var fragment = root$9();
  var div = first_child(fragment);
  let styles;
  var node = child(div);
  TiltShadow(node, {
    sides: ["top", "bottom"],
    magnetSides: ["left"],
    radius: "10px",
    distance: "4px",
    children: ($$anchor2, $$slotProps) => {
      {
        const header = ($$anchor3) => {
          var div_1 = root_2$3();
          var div_2 = child(div_1);
          var div_3 = child(div_2);
          var text2 = child(div_3, true);
          reset(div_3);
          var div_4 = sibling(div_3, 2);
          var text_1 = child(div_4);
          reset(div_4);
          reset(div_2);
          var div_5 = sibling(div_2, 2);
          var node_1 = child(div_5);
          html(node_1, () => screenshotIcon$1);
          var node_2 = sibling(node_1, 2);
          html(node_2, () => logOutIcon);
          reset(div_5);
          reset(div_1);
          template_effect(() => {
            set_text(text2, player.nickname);
            set_text(text_1, `@${currentChannel.v ?? ""}`);
          });
          append($$anchor3, div_1);
        };
        const footer = ($$anchor3) => {
          var fragment_2 = comment();
          var node_3 = first_child(fragment_2);
          {
            var consequent = ($$anchor4) => {
              Button($$anchor4, {
                theme: "light",
                fullWidth: true,
                onclick: () => set$1(isLoginOpen, true),
                children: ($$anchor5, $$slotProps2) => {
                  next();
                  var text_2 = text();
                  template_effect(($0) => set_text(text_2, $0), [() => $_()("login_or_register")]);
                  append($$anchor5, text_2);
                },
                $$slots: { default: true }
              });
            };
            var alternate = ($$anchor4) => {
              {
                let $0 = user_derived(() => $_()("chat.placeholder"));
                Input($$anchor4, {
                  type: "text",
                  get placeholder() {
                    return get($0);
                  },
                  style: "width: 100%; background-color: var(--bg-dark); padding: 8px; padding-right: 24px;",
                  get inputRef() {
                    return get(chatInputRef);
                  },
                  set inputRef($$value) {
                    set$1(chatInputRef, $$value, true);
                  },
                  children: ($$anchor5, $$slotProps2) => {
                    var div_6 = root_7();
                    html(div_6, () => emojiIcon, true);
                    reset(div_6);
                    bind_this(div_6, ($$value) => set$1(emojiButtonRef, $$value), () => get(emojiButtonRef));
                    append($$anchor5, div_6);
                  },
                  $$slots: { default: true }
                });
              }
            };
            if_block(node_3, ($$render) => {
              if (player.isGuest) $$render(consequent);
              else $$render(alternate, -1);
            });
          }
          append($$anchor3, fragment_2);
        };
        Panel($$anchor2, {
          magnetSides: ["left"],
          padding: "5px",
          innerPadding: "0 8px",
          radius: "7px",
          shadowDistance: "4px",
          width: "220px",
          height: "275px",
          get panelBodyRef() {
            return get(panelBodyRef);
          },
          set panelBodyRef($$value) {
            set$1(panelBodyRef, $$value, true);
          },
          header,
          footer,
          children: ($$anchor3, $$slotProps2) => {
            var div_7 = root_8$1();
            each(div_7, 23, () => get(currentMessages), (message) => message.id, ($$anchor4, message, index2) => {
              const formattedTime = user_derived(() => formatTime2(get(message).time));
              var fragment_6 = root_9();
              var node_4 = first_child(fragment_6);
              {
                var consequent_1 = ($$anchor5) => {
                  var hr = root_10$1();
                  append($$anchor5, hr);
                };
                if_block(node_4, ($$render) => {
                  if (get(index2) > 0) $$render(consequent_1);
                });
              }
              var div_8 = sibling(node_4, 2);
              var div_9 = child(div_8);
              var div_10 = child(div_9);
              var text_3 = child(div_10, true);
              reset(div_10);
              var div_11 = sibling(div_10, 2);
              var text_4 = child(div_11, true);
              reset(div_11);
              reset(div_9);
              var div_12 = sibling(div_9, 2);
              var text_5 = child(div_12, true);
              reset(div_12);
              reset(div_8);
              template_effect(() => {
                set_text(text_3, get(message).nick);
                set_attribute(div_11, "title", get(formattedTime).fullTime);
                set_text(text_4, get(formattedTime).time);
                set_text(text_5, get(message).msg);
              });
              append($$anchor4, fragment_6);
            });
            reset(div_7);
            append($$anchor3, div_7);
          },
          $$slots: { header: true, footer: true, default: true }
        });
      }
    },
    $$slots: { default: true }
  });
  var div_13 = sibling(node, 2);
  var node_5 = child(div_13);
  snippet(node_5, () => $$props.children);
  var div_14 = sibling(node_5, 2);
  let styles_1;
  var node_6 = child(div_14);
  {
    const label = ($$anchor2) => {
      var div_15 = root_11();
      var text_6 = child(div_15, true);
      reset(div_15);
      template_effect(($0) => set_text(text_6, $0), [() => $_()("chat.channels")]);
      bind_element_size(div_15, "clientHeight", ($$value) => set$1(channelsTabHeight, $$value));
      bind_element_size(div_15, "clientWidth", ($$value) => set$1(channelsTabWidth, $$value));
      append($$anchor2, div_15);
    };
    DrawerPanel(node_6, {
      side: "left",
      magnetSides: ["left"],
      get containerWidth() {
        return get(chatWidth);
      },
      get containerHeight() {
        return get(chatHeight);
      },
      get drawerState() {
        return get(channelsDrawerState);
      },
      set drawerState($$value) {
        set$1(channelsDrawerState, $$value, true);
      },
      label,
      children: ($$anchor2, $$slotProps) => {
        var div_16 = root_12();
        each(div_16, 21, () => get(availableChannels), index, ($$anchor3, channel) => {
          var button = root_13();
          var text_7 = child(button);
          reset(button);
          template_effect(() => {
            set_class(button, 1, `channelItem ${currentChannel.v === get(channel) ? "active" : ""}`, "svelte-191yngm");
            set_text(text_7, `@${get(channel) ?? ""}`);
          });
          delegated("click", button, () => currentChannel.v = get(channel));
          append($$anchor3, button);
        });
        reset(div_16);
        template_effect(() => set_style(div_16, `min-height: ${get(channelsBodyHeight) ?? ""};`));
        append($$anchor2, div_16);
      },
      $$slots: { label: true, default: true }
    });
  }
  reset(div_14);
  var node_7 = sibling(div_14, 2);
  {
    const label = ($$anchor2) => {
      var div_17 = root_14$1();
      var div_18 = child(div_17);
      var text_8 = child(div_18, true);
      reset(div_18);
      var span = sibling(div_18, 2);
      var text_9 = child(span, true);
      reset(span);
      reset(div_17);
      template_effect(
        ($0) => {
          set_text(text_8, $0);
          set_text(text_9, core2.online?.users?.length ?? 0);
        },
        [() => $_()("chat.players")]
      );
      append($$anchor2, div_17);
    };
    DrawerPanel(node_7, {
      side: "bottom",
      magnetSides: ["left", "bottom"],
      get containerWidth() {
        return get(chatWidth);
      },
      get containerHeight() {
        return get(chatHeight);
      },
      renderInBody: true,
      panelProps: {
        height: "270px",
        maxHeight: "270px",
        padding: "8px 4px 4px 4px",
        shadowDistance: "4px"
      },
      get drawerState() {
        return get(usersDrawerState);
      },
      set drawerState($$value) {
        set$1(usersDrawerState, $$value, true);
      },
      label,
      children: ($$anchor2, $$slotProps) => {
        var div_19 = root_15();
        var node_8 = child(div_19);
        {
          var consequent_3 = ($$anchor3) => {
            var fragment_7 = comment();
            var node_9 = first_child(fragment_7);
            each(node_9, 19, () => core2.online.users, (user) => user.userId ?? -user.connections[0], ($$anchor4, user, i) => {
              const computed_const = user_derived(() => {
                const { lastCoords, lastColor } = get(user);
                return { lastCoords, lastColor };
              });
              var fragment_8 = root_17$1();
              var node_10 = first_child(fragment_8);
              {
                var consequent_2 = ($$anchor5) => {
                  var hr_1 = root_18();
                  append($$anchor5, hr_1);
                };
                if_block(node_10, ($$render) => {
                  if (get(i) > 0) $$render(consequent_2);
                });
              }
              var div_20 = sibling(node_10, 2);
              var div_21 = child(div_20);
              html(div_21, () => screenshotIcon$1, true);
              reset(div_21);
              var div_22 = sibling(div_21, 2);
              html(div_22, () => formatNicknameWbr(getUsername(get(user))), true);
              reset(div_22);
              var div_23 = sibling(div_22, 2);
              var div_24 = child(div_23);
              var text_10 = child(div_24, true);
              reset(div_24);
              var div_25 = sibling(div_24, 2);
              var text_11 = child(div_25, true);
              reset(div_25);
              reset(div_23);
              reset(div_20);
              template_effect(
                ($0) => {
                  set_class(div_23, 1, `coords ${$0 ?? ""}`, "svelte-191yngm");
                  set_style(div_23, `color: ${palette[get(computed_const).lastColor] ?? ""}`);
                  set_text(text_10, get(computed_const).lastCoords?.[0] ?? "");
                  set_text(text_11, get(computed_const).lastCoords?.[1] ?? "");
                },
                [
                  () => needOutline(palette[get(computed_const).lastColor]) ? "outline" : ""
                ]
              );
              delegated("click", div_23, () => get(computed_const).lastCoords && setTimeout(() => core2?.camera.centerOn(get(computed_const).lastCoords[0], get(computed_const).lastCoords[1])));
              append($$anchor4, fragment_8);
            });
            append($$anchor3, fragment_7);
          };
          if_block(node_8, ($$render) => {
            if (core2.online?.users?.length) $$render(consequent_3);
          });
        }
        reset(div_19);
        append($$anchor2, div_19);
      },
      $$slots: { label: true, default: true }
    });
  }
  var div_26 = sibling(node_7, 2);
  let styles_2;
  var node_11 = child(div_26);
  TiltShadow(node_11, {
    sides: ["left"],
    magnetSides: ["left"],
    radius: "10px",
    distance: "4px",
    children: ($$anchor2, $$slotProps) => {
      {
        const footer = ($$anchor3) => {
          var button_1 = root_20();
          set_style(button_1, "", {}, { padding: "7px" });
          html(button_1, () => ltIcon, true);
          reset(button_1);
          template_effect(() => set_class(button_1, 1, `lt ${get(chatCollapsed) ? "collapsed" : ""}`, "svelte-191yngm"));
          delegated("click", button_1, () => set$1(chatCollapsed, !get(chatCollapsed)));
          append($$anchor3, button_1);
        };
        Panel($$anchor2, {
          magnetSides: ["left"],
          radius: "5px",
          padding: "0px",
          footer,
          $$slots: { footer: true }
        });
      }
    },
    $$slots: { default: true }
  });
  reset(div_26);
  reset(div_13);
  reset(div);
  var node_12 = sibling(div, 2);
  {
    var consequent_4 = ($$anchor2) => {
      Login($$anchor2, {
        get isOpen() {
          return get(isLoginOpen);
        },
        set isOpen($$value) {
          set$1(isLoginOpen, $$value, true);
        }
      });
    };
    if_block(node_12, ($$render) => {
      if (get(isLoginOpen)) $$render(consequent_4);
    });
  }
  var node_13 = sibling(node_12, 2);
  {
    var consequent_5 = ($$anchor2) => {
      Popover($$anchor2, {
        get trigger() {
          return get(emojiButtonRef);
        },
        closeDelay: 9999999,
        panelStyle: "width: 240px; height: 270px; user-select: none;",
        children: ($$anchor3, $$slotProps) => {
          {
            const emoji2 = ($$anchor4) => {
              {
                const emojiRow = ($$anchor5, item = noop) => {
                  var span_1 = root_25();
                  each(span_1, 21, () => item().data, index, ($$anchor6, emoji3, $$index_3, $$array) => {
                    var span_2 = root_26();
                    var text_12 = child(span_2, true);
                    reset(span_2);
                    action(span_2, ($$node, $$action_arg) => clicker?.($$node, $$action_arg), () => ({ onclick: emojiClicked, onlongclick: emojiLongClicked }));
                    template_effect(() => set_text(text_12, get(emoji3)));
                    append($$anchor6, span_2);
                  });
                  reset(span_1);
                  append($$anchor5, span_1);
                };
                const emojisAll = ($$anchor5, entry = noop) => {
                  var div_27 = root_27();
                  var text_13 = child(div_27, true);
                  reset(div_27);
                  template_effect(() => set_text(text_13, entry().data));
                  append($$anchor5, div_27);
                };
                const spacer = ($$anchor5, entry = noop) => {
                  var div_28 = root_28();
                  template_effect(() => set_style(div_28, `height:${entry().height ?? ""}px`));
                  append($$anchor5, div_28);
                };
                VirtualList_1($$anchor4, {
                  get items() {
                    return get(emojiMegaList);
                  },
                  emojiRow,
                  emojisAll,
                  spacer,
                  $$slots: { emojiRow: true, emojisAll: true, spacer: true }
                });
              }
            };
            const stickers = ($$anchor4) => {
              var div_29 = root_29();
              append($$anchor4, div_29);
            };
            let $0 = user_derived(() => [
              { id: "emoji", label: $_()("emoji") },
              { id: "stickers", label: $_()("stickers") }
            ]);
            Tabs($$anchor3, {
              get tabs() {
                return get($0);
              },
              panelProps: { padding: "0", innerPadding: "0 8px 0 0" },
              emoji: emoji2,
              stickers,
              $$slots: { emoji: true, stickers: true }
            });
          }
        },
        $$slots: { default: true }
      });
    };
    if_block(node_13, ($$render) => {
      if (get(emojiButtonRef)) $$render(consequent_5);
    });
  }
  template_effect(() => {
    styles = set_style(div, "", styles, { "--offset-left": get(offsetLeft) });
    styles_1 = set_style(div_14, "", styles_1, { "--offset-x": get(channelsDrawerOffset) + "px" });
    styles_2 = set_style(div_26, "", styles_2, { "--tab-width": get(tabWidth) + "px" });
  });
  bind_element_size(div_26, "clientWidth", ($$value) => set$1(tabWidth, $$value));
  bind_element_size(div, "clientWidth", ($$value) => set$1(chatWidth, $$value));
  bind_element_size(div, "clientHeight", ($$value) => set$1(chatHeight, $$value));
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
delegate(["click"]);
const reportBugIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M5 3V13H11V3H5Z" fill="currentColor"/>\n<path d="M4 5H2V7H4V5Z" fill="currentColor"/>\n<path d="M4 8H2V10H4V8Z" fill="currentColor"/>\n<path d="M4 11H2V13H4V11Z" fill="currentColor"/>\n<path d="M12 5H14V7H12V5Z" fill="currentColor"/>\n<path d="M12 8H14V10H12V8Z" fill="currentColor"/>\n<path d="M12 11H14V13H12V11Z" fill="currentColor"/>\n<path d="M6 1V3H10V1H6Z" fill="currentColor"/>\n</svg>\n';
const infoIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M6 2H10V4H12V7H10V9H8V7H10V5H8V4H6V2Z" fill="currentColor"/>\n<path d="M8 11H10V13H8V11Z" fill="currentColor"/>\n</svg>\n';
async function getJson(resp) {
  const json = await resp.json();
  if (json.errors) return null;
  return json;
}
async function getStickerpacks() {
  const resp = await apiGet("/stickers/list");
  return await getJson(resp);
}
async function addStickerpack(name, iconFile) {
  const resp = await apiPost("/stickers/pack/add", {
    title: name,
    icon: iconFile
  });
  return await getJson(resp);
}
async function addSticker(name, file, packId) {
  console.log({ name, file, packId });
  const resp = await apiPost("/stickers/add", {
    code: name,
    file,
    packId
  });
  return await getJson(resp);
}
async function changeName(newName) {
  const resp = await apiPost(`/changename`, {
    name: newName
  });
  const respData = await resp.json();
  if (respData.errors) return false;
  return true;
}
var root$8 = from_html(`<div class="container svelte-1dvj737"><div class="legend svelte-1dvj737"> </div> <div class="content"><!></div></div>`);
function Legendary($$anchor, $$props) {
  var div = root$8();
  var div_1 = child(div);
  var text2 = child(div_1, true);
  reset(div_1);
  var div_2 = sibling(div_1, 2);
  var node = child(div_2);
  snippet(node, () => $$props.children);
  reset(div_2);
  reset(div);
  template_effect(() => set_text(text2, $$props.legend));
  append($$anchor, div);
}
var root_2$2 = from_svg(`<svg viewBox="0 0 16 10" aria-hidden="true" class="svelte-1f20tz6"><path d="M1 9L8 2L15 9"></path></svg>`);
var root_3$1 = from_svg(`<svg viewBox="0 0 16 10" aria-hidden="true" class="svelte-1f20tz6"><path d="M1 1L8 8L15 1"></path></svg>`);
var root_5 = from_html(`<button type="button" role="option"><span class="icon svelte-1f20tz6"><svg viewBox="0 0 16 16" aria-hidden="true" class="svelte-1f20tz6"><path d="M4 1H12V4H15V12H12V15H4V12H1V4H4V1Z"></path></svg></span> <span> </span></button>`);
var root_4 = from_html(`<div class="dropdown svelte-1f20tz6" role="listbox"></div>`);
var root_1$a = from_html(`<div tabindex="0" role="combobox" aria-haspopup="listbox"><button class="trigger svelte-1f20tz6" type="button"><span class="svelte-1f20tz6"> </span> <span class="arrow svelte-1f20tz6"><!></span></button> <!></div>`);
function Select($$anchor, $$props) {
  push($$props, true);
  let options2 = prop($$props, "options", 19, () => []), value = prop($$props, "value", 15, ""), placeholder = prop($$props, "placeholder", 3, "ВЫБЕРИТЕ ОПЦИЮ");
  let open = state(false);
  let root2;
  let focusedIndex = state(-1);
  const normalizedOptions = user_derived(() => options2().map((option) => typeof option === "string" ? { value: option, label: option } : option));
  const selectedLabel = user_derived(() => get(normalizedOptions).find((option) => option.value === value())?.label ?? placeholder());
  function select(option) {
    value(option.value);
    set$1(open, false);
    set$1(focusedIndex, -1);
  }
  function toggle() {
    set$1(open, !get(open));
    if (get(open)) {
      set$1(focusedIndex, get(normalizedOptions).findIndex((option) => option.value === value()), true);
    }
  }
  function handleKeydown(event2) {
    if (event2.key === "Enter" || event2.key === " ") {
      event2.preventDefault();
      if (!get(open)) {
        toggle();
      } else if (get(focusedIndex) >= 0) {
        select(get(normalizedOptions)[get(focusedIndex)]);
      }
    }
    if (event2.key === "ArrowDown") {
      event2.preventDefault();
      if (!get(open)) {
        set$1(open, true);
        set$1(focusedIndex, 0);
      } else {
        set$1(focusedIndex, Math.min(get(focusedIndex) + 1, get(normalizedOptions).length - 1), true);
      }
    }
    if (event2.key === "ArrowUp") {
      event2.preventDefault();
      if (get(open)) {
        set$1(focusedIndex, Math.max(get(focusedIndex) - 1, 0), true);
      }
    }
    if (event2.key === "Escape") {
      set$1(open, false);
      set$1(focusedIndex, -1);
    }
  }
  function handleDocumentClick(event2) {
    if (root2 && !root2.contains(event2.target)) {
      set$1(open, false);
      set$1(focusedIndex, -1);
    }
  }
  onMount(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });
  var div = root_1$a();
  let classes;
  var button = child(div);
  var span = child(button);
  var text2 = child(span, true);
  reset(span);
  var span_1 = sibling(span, 2);
  var node = child(span_1);
  {
    var consequent = ($$anchor2) => {
      var svg = root_2$2();
      append($$anchor2, svg);
    };
    var alternate = ($$anchor2) => {
      var svg_1 = root_3$1();
      append($$anchor2, svg_1);
    };
    if_block(node, ($$render) => {
      if (get(open)) $$render(consequent);
      else $$render(alternate, -1);
    });
  }
  reset(span_1);
  reset(button);
  var node_1 = sibling(button, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_1 = root_4();
      each(div_1, 21, () => get(normalizedOptions), index, ($$anchor3, option, index2) => {
        var button_1 = root_5();
        let classes_1;
        var span_2 = sibling(child(button_1), 2);
        var text_1 = child(span_2, true);
        reset(span_2);
        reset(button_1);
        template_effect(() => {
          classes_1 = set_class(button_1, 1, "option svelte-1f20tz6", null, classes_1, {
            focused: index2 === get(focusedIndex),
            selected: get(option).value === value()
          });
          set_attribute(button_1, "aria-selected", get(option).value === value());
          set_text(text_1, get(option).label);
        });
        event("mouseenter", button_1, () => set$1(focusedIndex, index2, true));
        delegated("click", button_1, () => select(get(option)));
        append($$anchor3, button_1);
      });
      reset(div_1);
      append($$anchor2, div_1);
    };
    if_block(node_1, ($$render) => {
      if (get(open)) $$render(consequent_1);
    });
  }
  reset(div);
  bind_this(div, ($$value) => root2 = $$value, () => root2);
  template_effect(() => {
    classes = set_class(div, 1, "select svelte-1f20tz6", null, classes, { open: get(open) });
    set_attribute(div, "aria-expanded", get(open));
    set_attribute(button, "aria-expanded", get(open));
    set_text(text2, get(selectedLabel));
  });
  delegated("keydown", div, handleKeydown);
  delegated("click", button, toggle);
  append($$anchor, div);
  pop();
}
delegate(["keydown", "click"]);
const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" shape-rendering="crispEdges">\r\n  <rect x="1" y="0" width="11" height="1" fill="currentColor" />\r\n  <rect x="0" y="1" width="2" height="1" fill="currentColor" />\r\n  <rect x="11" y="1" width="2" height="1" fill="currentColor" />\r\n  <rect x="0" y="2" width="1" height="1" fill="currentColor" />\r\n  <rect x="12" y="2" width="1" height="1" fill="currentColor" />\r\n  <rect x="0" y="3" width="1" height="1" fill="currentColor" />\r\n  <rect x="8" y="3" width="2" height="1" fill="currentColor" />\r\n  <rect x="12" y="3" width="1" height="1" fill="currentColor" />\r\n  <rect x="0" y="4" width="1" height="1" fill="currentColor" />\r\n  <rect x="8" y="4" width="2" height="1" fill="currentColor" />\r\n  <rect x="12" y="4" width="1" height="1" fill="currentColor" />\r\n  <rect x="0" y="5" width="1" height="1" fill="currentColor" />\r\n  <rect x="12" y="5" width="1" height="1" fill="currentColor" />\r\n  <rect x="0" y="6" width="1" height="1" fill="currentColor" />\r\n  <rect x="4" y="6" width="1" height="1" fill="currentColor" />\r\n  <rect x="12" y="6" width="1" height="1" fill="currentColor" />\r\n  <rect x="0" y="7" width="1" height="1" fill="currentColor" />\r\n  <rect x="3" y="7" width="3" height="1" fill="currentColor" />\r\n  <rect x="12" y="7" width="1" height="1" fill="currentColor" />\r\n  <rect x="0" y="8" width="1" height="1" fill="currentColor" />\r\n  <rect x="2" y="8" width="5" height="1" fill="currentColor" />\r\n  <rect x="8" y="8" width="2" height="1" fill="currentColor" />\r\n  <rect x="12" y="8" width="1" height="1" fill="currentColor" />\r\n  <rect x="0" y="9" width="13" height="1" fill="currentColor" />\r\n  <rect x="0" y="10" width="13" height="1" fill="currentColor" />\r\n  <rect x="0" y="11" width="13" height="1" fill="currentColor" />\r\n  <rect x="1" y="12" width="11" height="1" fill="currentColor" />\r\n</svg>';
var root_1$9 = from_html(`<button class="removeBtn svelte-1hretyp" type="button">✕</button>`);
var root$7 = from_html(`<input type="file" style="display: none;"/> <div role="button" tabindex="0"><div class="iconContainer svelte-1hretyp"></div> <span class="svelte-1hretyp"> </span> <!></div>`, 1);
function UploadHandler($$anchor, $$props) {
  push($$props, true);
  const $_ = () => store_get($format, "$_", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let accept = prop($$props, "accept", 3, "image/*"), maxSizeMb = prop($$props, "maxSizeMb", 3, null), minWidth = prop($$props, "minWidth", 3, null), maxWidth = prop($$props, "maxWidth", 3, null), minHeight = prop($$props, "minHeight", 3, null), maxHeight = prop($$props, "maxHeight", 3, null), aspectRatio = prop($$props, "aspectRatio", 3, null), aspectRatioTolerance = prop($$props, "aspectRatioTolerance", 3, 0.03);
  let isDragging = state(false);
  let fileInput = state(null);
  let selectedFile = state(null);
  function validateAndProcessFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify.error("Выберите файл изображения");
      return;
    }
    if (maxSizeMb() && file.size > maxSizeMb() * 1024 * 1024) {
      notify.error(`Файл слишком большой (макс. ${maxSizeMb()} MB)`);
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      URL.revokeObjectURL(objectUrl);
      if (minWidth() && width < minWidth()) {
        notify.error(`Ширина изображения меньше ${minWidth()}px (текущая: ${width}px)`);
        return;
      }
      if (maxWidth() && width > maxWidth()) {
        notify.error(`Ширина изображения больше ${maxWidth()}px (текущая: ${width}px)`);
        return;
      }
      if (minHeight() && height < minHeight()) {
        notify.error(`Высота изображения меньше ${minHeight()}px (текущая: ${height}px)`);
        return;
      }
      if (maxHeight() && height > maxHeight()) {
        notify.error(`Высота изображения больше ${maxHeight()}px (текущая: ${height}px)`);
        return;
      }
      if (aspectRatio() !== null) {
        const currentRatio = width / height;
        if (Math.abs(currentRatio - aspectRatio()) > aspectRatioTolerance()) {
          notify.error(`Неверное соотношение сторон (ожидается ~${aspectRatio().toFixed(2)})`);
          return;
        }
      }
      set$1(selectedFile, file, true);
      $$props.onFileSelect?.(file);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      notify.error("Не удалось загрузить файл изображения");
    };
    img.src = objectUrl;
  }
  function handleDrop(e) {
    e.preventDefault();
    set$1(isDragging, false);
    const file = e.dataTransfer?.files?.[0];
    if (file) validateAndProcessFile(file);
  }
  function handleDragOver(e) {
    e.preventDefault();
    set$1(isDragging, true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    set$1(isDragging, false);
  }
  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (file) validateAndProcessFile(file);
    e.target.value = "";
  }
  function triggerSelect() {
    get(fileInput)?.click();
  }
  function handleClear(e) {
    e.stopPropagation();
    set$1(selectedFile, null);
    $$props.onClear?.();
  }
  var fragment = root$7();
  var input = first_child(fragment);
  bind_this(input, ($$value) => set$1(fileInput, $$value), () => get(fileInput));
  var div = sibling(input, 2);
  let classes;
  var div_1 = child(div);
  html(div_1, () => icon, true);
  reset(div_1);
  var span = sibling(div_1, 2);
  var text2 = child(span, true);
  reset(span);
  var node = sibling(span, 2);
  {
    var consequent = ($$anchor2) => {
      var button = root_1$9();
      delegated("click", button, handleClear);
      append($$anchor2, button);
    };
    if_block(node, ($$render) => {
      if (get(selectedFile) && $$props.onClear) $$render(consequent);
    });
  }
  reset(div);
  template_effect(
    ($0) => {
      set_attribute(input, "accept", accept());
      classes = set_class(div, 1, "uploadContainer svelte-1hretyp", null, classes, { dragging: get(isDragging) });
      set_text(text2, $0);
    },
    [
      () => get(selectedFile) ? get(selectedFile).name : $_()("uploadContainerText")
    ]
  );
  delegated("change", input, handleInputChange);
  delegated("click", div, triggerSelect);
  event("dragover", div, handleDragOver);
  event("dragleave", div, handleDragLeave);
  event("drop", div, handleDrop);
  delegated("keydown", div, (e) => (e.key === "Enter" || e.key === " ") && triggerSelect());
  append($$anchor, fragment);
  pop();
  $$cleanup();
}
delegate(["change", "click", "keydown"]);
function cubic_out(t2) {
  const f = t2 - 1;
  return f * f * f + 1;
}
function slide(node, { delay = 0, duration = 400, easing = cubic_out, axis = "y" } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = parseFloat(style[primary_property]);
  const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map(
    (e) => (
      /** @type {'Left' | 'Right' | 'Top' | 'Bottom'} */
      `${e[0].toUpperCase()}${e.slice(1)}`
    )
  );
  const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
  const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
  const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
  const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
  const border_width_start_value = parseFloat(
    style[`border${capitalized_secondary_properties[0]}Width`]
  );
  const border_width_end_value = parseFloat(
    style[`border${capitalized_secondary_properties[1]}Width`]
  );
  return {
    delay,
    duration,
    easing,
    css: (t2) => `overflow: hidden;opacity: ${Math.min(t2 * 20, 1) * opacity};${primary_property}: ${t2 * primary_property_value}px;padding-${secondary_properties[0]}: ${t2 * padding_start_value}px;padding-${secondary_properties[1]}: ${t2 * padding_end_value}px;margin-${secondary_properties[0]}: ${t2 * margin_start_value}px;margin-${secondary_properties[1]}: ${t2 * margin_end_value}px;border-${secondary_properties[0]}-width: ${t2 * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t2 * border_width_end_value}px;min-${primary_property}: 0`
  };
}
var root_1$8 = from_html(`<div><!></div>`);
var root_2$1 = from_html(`<div><!></div>`);
var root$6 = from_html(`<div class="row svelte-xztxk3"><!> <!> <!></div>`);
function Row($$anchor, $$props) {
  let alignLeft = prop($$props, "alignLeft", 3, "left"), alignRight = prop($$props, "alignRight", 3, "left");
  let isRightPinned = user_derived(() => alignRight() === "right");
  let isLeftPinned = user_derived(() => alignLeft() === "left");
  function getFlexAlign(align) {
    if (align === "right") return "flex-end";
    if (align === "center") return "center";
    return "flex-start";
  }
  var div = root$6();
  var node = child(div);
  {
    var consequent = ($$anchor2) => {
      var div_1 = root_1$8();
      let classes;
      let styles;
      var node_1 = child(div_1);
      snippet(node_1, () => $$props.left);
      reset(div_1);
      template_effect(
        ($0) => {
          classes = set_class(div_1, 1, "slot-wrapper left svelte-xztxk3", null, classes, { "allow-shrink": get(isLeftPinned) });
          styles = set_style(div_1, "", styles, $0);
        },
        [() => ({ "--align": getFlexAlign(alignLeft()) })]
      );
      append($$anchor2, div_1);
    };
    if_block(node, ($$render) => {
      if ($$props.left) $$render(consequent);
    });
  }
  var node_2 = sibling(node, 2);
  {
    var consequent_1 = ($$anchor2) => {
      var div_2 = root_2$1();
      let classes_1;
      let styles_1;
      var node_3 = child(div_2);
      snippet(node_3, () => $$props.right);
      reset(div_2);
      template_effect(
        ($0) => {
          classes_1 = set_class(div_2, 1, "slot-wrapper right svelte-xztxk3", null, classes_1, { "allow-shrink": get(isRightPinned) });
          styles_1 = set_style(div_2, "", styles_1, $0);
        },
        [() => ({ "--align": getFlexAlign(alignRight()) })]
      );
      append($$anchor2, div_2);
    };
    if_block(node_2, ($$render) => {
      if ($$props.right) $$render(consequent_1);
    });
  }
  var node_4 = sibling(node_2, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var fragment = comment();
      var node_5 = first_child(fragment);
      snippet(node_5, () => $$props.children);
      append($$anchor2, fragment);
    };
    if_block(node_4, ($$render) => {
      if (!$$props.left && !$$props.right && $$props.children) $$render(consequent_2);
    });
  }
  reset(div);
  append($$anchor, div);
}
var root_3 = from_html(`<div class="collapsiblePart"><!></div>`);
var root$5 = from_html(`<!> <!>`, 1);
function CollapsibleBlock($$anchor, $$props) {
  const btnIconStyle = user_derived(() => `transform: rotate(${get(isOpen) ? "90" : "270"}deg);
transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);`);
  let isOpen = state(false);
  var fragment = root$5();
  var node = first_child(fragment);
  {
    const left = ($$anchor2) => {
      next();
      var text$1 = text();
      template_effect(() => set_text(text$1, $$props.blockName));
      append($$anchor2, text$1);
    };
    const right = ($$anchor2) => {
      Button($$anchor2, {
        get icon() {
          return ltIcon;
        },
        onclick: () => set$1(isOpen, !get(isOpen)),
        get iconStyle() {
          return get(btnIconStyle);
        }
      });
    };
    Row(node, {
      alignRight: "right",
      left,
      right,
      $$slots: { left: true, right: true }
    });
  }
  var node_1 = sibling(node, 2);
  {
    var consequent = ($$anchor2) => {
      var div = root_3();
      var node_2 = child(div);
      snippet(node_2, () => $$props.children);
      reset(div);
      transition(3, div, () => slide, () => ({ duration: 250 }));
      append($$anchor2, div);
    };
    if_block(node_1, ($$render) => {
      if (get(isOpen)) $$render(consequent);
    });
  }
  append($$anchor, fragment);
}
var root_2 = from_html(`<div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div> <div>emoji</div>`, 1);
var root_6 = from_html(`<div>todo 3</div>`);
var root_10 = from_html(`<!> <!>`, 1);
var root_14 = from_html(`<!> <!> <!>`, 1);
var root_17 = from_html(`<div class="stickerTile"><img/> <div class="closeBtn"></div></div>`);
var root_8 = from_html(`<div class="createStickerpackPanel">Create sticker pack <!></div> <div class="stickersPanel">Add sticker <!> <div class="stickers"></div></div>`, 1);
var root_1$7 = from_html(`<div class="body svelte-3qzl15"><!></div>`);
function Settings($$anchor, $$props) {
  push($$props, true);
  const $_ = () => store_get($format, "$_", $$stores);
  const [$$stores, $$cleanup] = setup_stores();
  let isOpen = prop($$props, "isOpen", 15, true), rprops = rest_props($$props, ["$$slots", "$$events", "$$legacy", "isOpen"]);
  const core2 = useGameCore$1();
  let nameInputBlocked = state(false);
  async function nameHandleKeyDown(event2) {
    if (get(nameInputBlocked)) return;
    if (event2.key === "Enter") {
      event2.stopPropagation();
      set$1(nameInputBlocked, true);
      const newNickname = event2.target.value;
      try {
        const success = await changeName(newNickname);
        if (success) notify.info(t("w.settings.nicknameChanged", { values: { name: newNickname } }));
      } finally {
        setTimeout(
          () => {
            set$1(nameInputBlocked, false);
          },
          1e3
        );
      }
    }
  }
  let stickerpackUploadingIcon = state(null);
  let stickerpackUploadName = state(null);
  let stickerUploadFile = state(null);
  let stickerUploadCode = state(null);
  async function createStickerPack() {
    const pack = await addStickerpack(get(stickerpackUploadName), get(stickerpackUploadingIcon));
    if (!pack) return;
    if (core2.stickersCache) {
      core2.stickersCache.push(pack);
    }
  }
  async function addSticker$1() {
    const currentStickerpack = core2.stickersCache?.find((p) => p.title);
    if (!currentStickerpack) return;
    const sticker = await addSticker(get(stickerUploadCode), get(stickerUploadFile), currentStickerpack.id);
    if (!sticker) return;
    currentStickerpack.stickers.push(sticker);
  }
  let packsList = user_derived(() => core2.stickersCache?.map((x2) => x2.title));
  let currentPackName = state("General");
  let currentStickers = user_derived(() => {
    let pack = core2.stickersCache?.find((p) => p.title);
    return pack?.stickers ?? [];
  });
  {
    let $0 = user_derived(() => $_()("w.settings.title"));
    Window($$anchor, spread_props(
      {
        get title() {
          return get($0);
        },
        id: "settings",
        noPanelBody: true
      },
      () => rprops,
      {
        get isOpen() {
          return isOpen();
        },
        set isOpen($$value) {
          isOpen($$value);
        },
        children: ($$anchor2, $$slotProps) => {
          var div = root_1$7();
          var node = child(div);
          {
            const general = ($$anchor3) => {
              var fragment_1 = root_2();
              next(92);
              append($$anchor3, fragment_1);
            };
            const user = ($$anchor3) => {
              {
                const left = ($$anchor4) => {
                  next();
                  var text$1 = text();
                  template_effect(($03) => set_text(text$1, $03), [() => $_()("username")]);
                  append($$anchor4, text$1);
                };
                const right = ($$anchor4) => {
                  Input($$anchor4, {
                    type: "text",
                    get value() {
                      return player.nickname;
                    },
                    onkeydown: nameHandleKeyDown,
                    get disabled() {
                      return get(nameInputBlocked);
                    }
                  });
                };
                Row($$anchor3, { left, right, $$slots: { left: true, right: true } });
              }
            };
            const hotkeys = ($$anchor3) => {
              var div_1 = root_6();
              append($$anchor3, div_1);
            };
            const admin = ($$anchor3) => {
              {
                let $03 = user_derived(() => $_()("stickers").toUpperCase());
                CollapsibleBlock($$anchor3, {
                  get blockName() {
                    return get($03);
                  },
                  children: ($$anchor4, $$slotProps2) => {
                    var fragment_6 = root_8();
                    var div_2 = first_child(fragment_6);
                    var node_1 = sibling(child(div_2));
                    {
                      const left = ($$anchor5) => {
                        UploadHandler($$anchor5, {
                          onFileSelect: (file) => set$1(stickerpackUploadingIcon, file, true),
                          onClear: () => set$1(stickerpackUploadingIcon, null),
                          aspectRatio: 1
                        });
                      };
                      const right = ($$anchor5) => {
                        var fragment_8 = root_10();
                        var node_2 = first_child(fragment_8);
                        {
                          let $04 = user_derived(() => $_()("sticker_pack_name"));
                          Legendary(node_2, {
                            get legend() {
                              return get($04);
                            },
                            children: ($$anchor6, $$slotProps3) => {
                              Input($$anchor6, {
                                type: "text",
                                get bindValue() {
                                  return get(stickerpackUploadName);
                                },
                                set bindValue($$value) {
                                  set$1(stickerpackUploadName, $$value, true);
                                }
                              });
                            }
                          });
                        }
                        var node_3 = sibling(node_2, 2);
                        Button(node_3, {
                          onclick: createStickerPack,
                          children: ($$anchor6, $$slotProps3) => {
                            next();
                            var text_1 = text("Create sticker pack");
                            append($$anchor6, text_1);
                          },
                          $$slots: { default: true }
                        });
                        append($$anchor5, fragment_8);
                      };
                      Row(node_1, {
                        alignRight: "center",
                        left,
                        right,
                        $$slots: { left: true, right: true }
                      });
                    }
                    reset(div_2);
                    var div_3 = sibling(div_2, 2);
                    var node_4 = sibling(child(div_3));
                    {
                      const left = ($$anchor5) => {
                        UploadHandler($$anchor5, {
                          onFileSelect: (file) => set$1(stickerUploadFile, file, true),
                          onClear: () => set$1(stickerUploadFile, null),
                          aspectRatio: 1,
                          aspectRatioTolerance: 0.5
                        });
                      };
                      const right = ($$anchor5) => {
                        var fragment_11 = root_14();
                        var node_5 = first_child(fragment_11);
                        Select(node_5, {
                          get options() {
                            return get(packsList);
                          },
                          get value() {
                            return get(currentPackName);
                          },
                          set value($$value) {
                            set$1(currentPackName, $$value, true);
                          }
                        });
                        var node_6 = sibling(node_5, 2);
                        {
                          let $04 = user_derived(() => $_()("sticker_code"));
                          Legendary(node_6, {
                            get legend() {
                              return get($04);
                            },
                            children: ($$anchor6, $$slotProps3) => {
                              Input($$anchor6, {
                                type: "text",
                                get bindValue() {
                                  return get(stickerUploadCode);
                                },
                                set bindValue($$value) {
                                  set$1(stickerUploadCode, $$value, true);
                                }
                              });
                            }
                          });
                        }
                        var node_7 = sibling(node_6, 2);
                        Button(node_7, {
                          onclick: addSticker$1,
                          children: ($$anchor6, $$slotProps3) => {
                            next();
                            var text_2 = text("Add sticker");
                            append($$anchor6, text_2);
                          },
                          $$slots: { default: true }
                        });
                        append($$anchor5, fragment_11);
                      };
                      Row(node_4, {
                        alignRight: "center",
                        left,
                        right,
                        $$slots: { left: true, right: true }
                      });
                    }
                    var div_4 = sibling(node_4, 2);
                    each(div_4, 21, () => get(currentStickers), (sticker) => sticker.id, ($$anchor5, sticker) => {
                      var div_5 = root_17();
                      var img = child(div_5);
                      next(2);
                      reset(div_5);
                      template_effect(() => {
                        set_attribute(img, "src", get(sticker).thumbUrl);
                        set_attribute(img, "alt", get(sticker).code);
                      });
                      append($$anchor5, div_5);
                    });
                    reset(div_4);
                    reset(div_3);
                    append($$anchor4, fragment_6);
                  }
                });
              }
            };
            let $02 = user_derived(() => [
              { id: "general", label: $_()("w.settings.general") },
              { id: "user", label: $_()("w.settings.user") },
              { id: "hotkeys", label: $_()("w.settings.hotkeys") },
              { id: "admin", label: $_()("w.settings.admin") }
            ]);
            Tabs(node, {
              get tabs() {
                return get($02);
              },
              panelProps: { padding: "4px", maxHeight: "400px" },
              general,
              user,
              hotkeys,
              admin,
              $$slots: { general: true, user: true, hotkeys: true, admin: true }
            });
          }
          reset(div);
          append($$anchor2, div);
        },
        $$slots: { default: true }
      }
    ));
  }
  pop();
  $$cleanup();
}
var root_1$6 = from_html(`<div class="body svelte-moiobf">todo</div>`);
function Help($$anchor, $$props) {
  push($$props, true);
  let isOpen = prop($$props, "isOpen", 15, true), rprops = rest_props($$props, ["$$slots", "$$events", "$$legacy", "isOpen"]);
  {
    let $0 = user_derived(() => t("title.help"));
    Window($$anchor, spread_props(
      {
        get title() {
          return get($0);
        },
        id: "help"
      },
      () => rprops,
      {
        get isOpen() {
          return isOpen();
        },
        set isOpen($$value) {
          isOpen($$value);
        },
        children: ($$anchor2, $$slotProps) => {
          var div = root_1$6();
          append($$anchor2, div);
        },
        $$slots: { default: true }
      }
    ));
  }
  pop();
}
var root_1$5 = from_html(`<div class="body svelte-124e44a"><!> <!></div>`);
function ReportBug($$anchor, $$props) {
  push($$props, true);
  let isOpen = prop($$props, "isOpen", 15, true), rprops = rest_props($$props, ["$$slots", "$$events", "$$legacy", "isOpen"]);
  {
    let $0 = user_derived(() => t("w.bugreport.title"));
    Window($$anchor, spread_props(
      {
        get title() {
          return get($0);
        },
        id: "bugreport"
      },
      () => rprops,
      {
        get isOpen() {
          return isOpen();
        },
        set isOpen($$value) {
          isOpen($$value);
        },
        children: ($$anchor2, $$slotProps) => {
          var div = root_1$5();
          var node = child(div);
          Textarea(node, {});
          var node_1 = sibling(node, 2);
          Button(node_1, {
            children: ($$anchor3, $$slotProps2) => {
              next();
              var text$1 = text("Submit");
              append($$anchor3, text$1);
            },
            $$slots: { default: true }
          });
          reset(div);
          append($$anchor2, div);
        },
        $$slots: { default: true }
      }
    ));
  }
  pop();
}
var root$4 = from_html(`<button></button>`);
function IconButton($$anchor, $$props) {
  let active = prop($$props, "active", 3, false), restProps = rest_props($$props, ["$$slots", "$$events", "$$legacy", "active", "icon"]);
  var button = root$4();
  attribute_effect(
    button,
    () => ({
      class: "icon-btn",
      ...restProps,
      [CLASS]: { active: active() }
    }),
    void 0,
    void 0,
    void 0,
    "svelte-13o797d"
  );
  html(button, () => $$props.icon, true);
  reset(button);
  append($$anchor, button);
}
var root_1$4 = from_html(`<div class="buttons svelte-18q86r7"><!> <!> <!></div>`);
var root$3 = from_html(`<div class="utilityMenu svelte-18q86r7"><!></div> <!> <!> <!>`, 1);
function UtilityMenu($$anchor) {
  let isSettingsOpen = state(false);
  let isBugOpen = state(false);
  let isInfoOpen = state(false);
  var fragment = root$3();
  var div = first_child(fragment);
  var node = child(div);
  {
    const footer = ($$anchor2) => {
      var div_1 = root_1$4();
      var node_1 = child(div_1);
      IconButton(node_1, {
        get active() {
          return get(isSettingsOpen);
        },
        onclick: () => set$1(isSettingsOpen, true),
        get icon() {
          return screenshotIcon$1;
        }
      });
      var node_2 = sibling(node_1, 2);
      IconButton(node_2, {
        get active() {
          return get(isBugOpen);
        },
        onclick: () => set$1(isBugOpen, true),
        get icon() {
          return reportBugIcon;
        }
      });
      var node_3 = sibling(node_2, 2);
      IconButton(node_3, {
        get active() {
          return get(isInfoOpen);
        },
        onclick: () => set$1(isInfoOpen, true),
        get icon() {
          return infoIcon;
        }
      });
      reset(div_1);
      append($$anchor2, div_1);
    };
    Panel(node, {
      magnetSides: ["right"],
      padding: "10px",
      footer,
      $$slots: { footer: true }
    });
  }
  reset(div);
  var node_4 = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      Settings($$anchor2, {
        get isOpen() {
          return get(isSettingsOpen);
        },
        set isOpen($$value) {
          set$1(isSettingsOpen, $$value, true);
        }
      });
    };
    if_block(node_4, ($$render) => {
      if (get(isSettingsOpen)) $$render(consequent);
    });
  }
  var node_5 = sibling(node_4, 2);
  {
    var consequent_1 = ($$anchor2) => {
      ReportBug($$anchor2, {
        get isOpen() {
          return get(isBugOpen);
        },
        set isOpen($$value) {
          set$1(isBugOpen, $$value, true);
        }
      });
    };
    if_block(node_5, ($$render) => {
      if (get(isBugOpen)) $$render(consequent_1);
    });
  }
  var node_6 = sibling(node_5, 2);
  {
    var consequent_2 = ($$anchor2) => {
      Help($$anchor2, {
        get isOpen() {
          return get(isInfoOpen);
        },
        set isOpen($$value) {
          set$1(isInfoOpen, $$value, true);
        }
      });
    };
    if_block(node_6, ($$render) => {
      if (get(isInfoOpen)) $$render(consequent_2);
    });
  }
  append($$anchor, fragment);
}
const screenshotIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M3 1H5V3H3ZM6 2H10V3H6ZM2 3H14V4H2ZM1 4H15V5H1ZM1 5H5V6H1ZM11 5H15V6H11ZM1 6H4V7H1ZM6 6H10V7H6ZM12 6H15V7H12ZM1 7H4V9H1ZM5 7H7V9H5ZM9 7H11V9H9ZM12 7H15V9H12ZM1 9H4V10H1ZM6 9H10V10H6ZM12 9H15V10H12ZM1 10H5V11H1ZM11 10H15V11H11ZM1 11H15V13H1ZM2 13H14V14H2Z" fill="currentColor"/>\n</svg>\n';
const gridIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M0 0H16V1H0ZM0 5H16V6H0ZM0 10H16V11H0ZM0 15H16V16H0ZM0 0H1V16H0ZM5 0H6V16H5ZM10 0H11V16H10ZM15 0H16V16H15Z" fill="currentColor"/>\n</svg>\n';
var root_1$3 = from_html(`<div class="panelRow"></div> <hr/> <div class="panelRow" style="justify-content: space-between;"><div class="panelRow"><!> <!> <!></div> <div class="panelRow"><!></div></div>`, 1);
function Screenshot($$anchor, $$props) {
  push($$props, true);
  let isOpen = prop($$props, "isOpen", 15, true), rprops = rest_props($$props, ["$$slots", "$$events", "$$legacy", "isOpen"]);
  const core2 = useGameCore$1();
  const tool = core2.toolManager.tools["screenshot"];
  const boundsAlias = ["startX", "startY", "endX", "endY"];
  core2.toolManager.selectTool(tool);
  onDestroy(() => {
    tool.onDeselected();
    if (core2.toolManager.currentTool === tool) {
      core2.toolManager.selectTool(defaultTool);
    }
  });
  function onSelectClick() {
    tool.startSelection();
  }
  function handleTakeScreenshot() {
    tool.doScreenshot();
  }
  const pref = "w.screenshot";
  {
    let $0 = user_derived(() => t(`${pref}.title`));
    Window($$anchor, spread_props(
      {
        get title() {
          return get($0);
        },
        id: "screenshot"
      },
      () => rprops,
      {
        get isOpen() {
          return isOpen();
        },
        set isOpen($$value) {
          isOpen($$value);
        },
        children: ($$anchor2, $$slotProps) => {
          var fragment_1 = root_1$3();
          var div = first_child(fragment_1);
          each(div, 21, () => tool.bounds, index, ($$anchor3, coordinate, i) => {
            {
              let $02 = user_derived(() => t(`${pref}.${boundsAlias[i]}`));
              Legendary($$anchor3, {
                get legend() {
                  return get($02);
                },
                children: ($$anchor4, $$slotProps2) => {
                  Input($$anchor4, {
                    type: "number",
                    draggable: true,
                    get bindValue() {
                      return tool.bounds[i];
                    },
                    set bindValue($$value) {
                      tool.bounds[i] = $$value;
                    }
                  });
                }
              });
            }
          });
          reset(div);
          var div_1 = sibling(div, 4);
          var div_2 = child(div_1);
          var node = child(div_2);
          Button(node, {
            get icon() {
              return screenshotIcon$1;
            },
            get isActive() {
              return tool.isSelecting;
            },
            onclick: onSelectClick
          });
          var node_1 = sibling(node, 2);
          Button(node_1, {
            onclick: () => tool.expandBoundsFullCanvas(),
            children: ($$anchor3, $$slotProps2) => {
              next();
              var text$1 = text();
              template_effect(($02) => set_text(text$1, $02), [() => t(`${pref}.wholeCanvas`)]);
              append($$anchor3, text$1);
            },
            $$slots: { default: true }
          });
          var node_2 = sibling(node_1, 2);
          Button(node_2, {
            onclick: () => tool.expandBoundsFullScreen(),
            children: ($$anchor3, $$slotProps2) => {
              next();
              var text_1 = text();
              template_effect(($02) => set_text(text_1, $02), [() => t(`${pref}.visibleArea`)]);
              append($$anchor3, text_1);
            },
            $$slots: { default: true }
          });
          reset(div_2);
          var div_3 = sibling(div_2, 2);
          var node_3 = child(div_3);
          {
            let $02 = user_derived(() => tool.bounds[0] === -1 || tool.isSelecting);
            Button(node_3, {
              onclick: handleTakeScreenshot,
              get disabled() {
                return get($02);
              },
              children: ($$anchor3, $$slotProps2) => {
                next();
                var text_2 = text();
                template_effect(($03) => set_text(text_2, $03), [() => t(`${pref}.doScreenshot`)]);
                append($$anchor3, text_2);
              },
              $$slots: { default: true }
            });
          }
          reset(div_3);
          reset(div_1);
          append($$anchor2, fragment_1);
        },
        $$slots: { default: true }
      }
    ));
  }
  pop();
}
var root_1$2 = from_html(`<div class="buttons svelte-1t0jym7"><!> <div class="vr"></div> <!> <div class="vr"></div> <div class="vr"></div> </div>`);
var root$2 = from_html(`<div class="utilityMenu svelte-1t0jym7"><!></div> <!>`, 1);
function CoordsMenu($$anchor, $$props) {
  push($$props, true);
  const core2 = useGameCore$1();
  let isScreenshotOpen = state(false);
  function formatX(x2) {
    return clamp(Math.floor(x2), 0, core2.config?.boardWidth).toString().padStart(4, "0");
  }
  function formatY(y2) {
    return clamp(Math.floor(y2), 0, core2.config?.boardHeight).toString().padStart(4, "0");
  }
  var fragment = root$2();
  var div = first_child(fragment);
  var node = child(div);
  {
    const footer = ($$anchor2) => {
      var div_1 = root_1$2();
      var node_1 = child(div_1);
      IconButton(node_1, {
        get active() {
          return get(isScreenshotOpen);
        },
        onclick: () => set$1(isScreenshotOpen, true),
        get icon() {
          return screenshotIcon;
        }
      });
      var node_2 = sibling(node_1, 4);
      {
        let $0 = user_derived(() => core2.toolManager?.tools.grid.isActive);
        IconButton(node_2, {
          get active() {
            return get($0);
          },
          onclick: () => core2.toolManager?.tools.grid.onUp(),
          get icon() {
            return gridIcon;
          }
        });
      }
      var text2 = sibling(node_2, 3);
      var text_1 = sibling(text2, 2);
      reset(div_1);
      template_effect(
        ($0, $1) => {
          set_text(text2, ` X: ${$0 ?? ""} `);
          set_text(text_1, ` Y: ${$1 ?? ""}`);
        },
        [
          () => formatX(core2.camera?.pivotWorldX),
          () => formatY(core2.camera?.pivotWorldY)
        ]
      );
      append($$anchor2, div_1);
    };
    Panel(node, {
      magnetSides: ["right"],
      padding: "6px",
      footer,
      $$slots: { footer: true }
    });
  }
  reset(div);
  var node_3 = sibling(div, 2);
  {
    var consequent = ($$anchor2) => {
      Screenshot($$anchor2, {
        get isOpen() {
          return get(isScreenshotOpen);
        },
        set isOpen($$value) {
          set$1(isScreenshotOpen, $$value, true);
        }
      });
    };
    if_block(node_3, ($$render) => {
      if (get(isScreenshotOpen)) $$render(consequent);
    });
  }
  append($$anchor, fragment);
  pop();
}
var root_1$1 = from_html(`<div class="metric svelte-195kgjw"><span class="label svelte-195kgjw">RAM:</span> <span class="value"> </span></div>`);
var root$1 = from_html(`<div class="metrics-panel svelte-195kgjw"><div class="metric svelte-195kgjw"><span class="label svelte-195kgjw">FPS:</span> <span> </span></div> <div class="metric svelte-195kgjw"><span class="label svelte-195kgjw">Frame:</span> <span class="value"> </span></div> <!></div>`);
function DebugMetrics($$anchor, $$props) {
  push($$props, true);
  let fps = state(0);
  let frameTime = state(0);
  let memory = state(proxy({ used: 0, total: 0 }));
  let lastTime = performance.now();
  let frames = 0;
  function updateMetrics() {
    const now2 = performance.now();
    frames++;
    if (now2 >= lastTime + 1e3) {
      set$1(fps, Math.round(frames * 1e3 / (now2 - lastTime)), true);
      set$1(frameTime, (1e3 / get(fps)).toFixed(2), true);
      frames = 0;
      lastTime = now2;
      if (performance.memory) {
        set$1(
          memory,
          {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576),
            total: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
          },
          true
        );
      }
    }
    requestAnimationFrame(updateMetrics);
  }
  onMount(() => {
    const handle = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(handle);
  });
  var div = root$1();
  var div_1 = child(div);
  var span = sibling(child(div_1), 2);
  let classes;
  var text2 = child(span, true);
  reset(span);
  reset(div_1);
  var div_2 = sibling(div_1, 2);
  var span_1 = sibling(child(div_2), 2);
  var text_1 = child(span_1);
  reset(span_1);
  reset(div_2);
  var node = sibling(div_2, 2);
  {
    var consequent = ($$anchor2) => {
      var div_3 = root_1$1();
      var span_2 = sibling(child(div_3), 2);
      var text_2 = child(span_2);
      reset(span_2);
      reset(div_3);
      template_effect(() => set_text(text_2, `${get(memory).used ?? ""} / ${get(memory).total ?? ""} MB`));
      append($$anchor2, div_3);
    };
    if_block(node, ($$render) => {
      if (get(memory).total > 0) $$render(consequent);
    });
  }
  reset(div);
  template_effect(() => {
    classes = set_class(span, 1, "value svelte-195kgjw", null, classes, {
      low: get(fps) < 30,
      mid: get(fps) >= 30 && get(fps) < 55
    });
    set_text(text2, get(fps));
    set_text(text_1, `${get(frameTime) ?? ""}ms`);
  });
  append($$anchor, div);
  pop();
}
const PRESETS = {
  dark: {
    colors: {
      "--bg-verydark": "#142C3E",
      "--bg-mid-dark": "#18364B",
      "--bg-dark": "#1b3c53",
      "--bg-mid": "#234c6a",
      "--bg-light": "#456882",
      "--accent": "#d2c1b6",
      "--text": "#ffffff"
    }
  }
};
const currentPaletteName = persistent("rootPaletteName", "dark");
function applyPaletteToDOM(colors) {
  const root2 = document.documentElement;
  Object.entries(colors).forEach(([varName, value]) => {
    root2.style.setProperty(varName, value);
  });
}
function initRootPalette() {
  const saved = currentPaletteName.v;
  applyPaletteToDOM((PRESETS[saved] || PRESETS.dark).colors);
}
let initialized = false;
let chatLimitStore;
const config = proxy({
  get chatLimit() {
    return chatLimitStore?.v ?? 100;
  }
});
function initGameConfig() {
  if (initialized) return;
  initialized = true;
  chatLimitStore = persistent("chatLimit", 100);
  return config;
}
var root = from_html(`<div class="game-core svelte-17vlg75" style="width: 100vw; height: 100vh; overflow: hidden; background: #111;"><canvas class="game-canvas svelte-17vlg75"></canvas> <canvas class="fx-canvas svelte-17vlg75"></canvas> <canvas class="fx-canvas svelte-17vlg75"></canvas></div> <div id="ui" class="svelte-17vlg75"><!> <!> <!> <!> <!> <!></div> <!>`, 1);
function GameCore($$anchor, $$props) {
  push($$props, true);
  let cfg = core.config = initConfig();
  core.gameConfig = initGameConfig();
  let canvasRef;
  let fxCanvasRef;
  let glCanvasRef;
  let camera;
  let toolManager = state(null);
  let saveInterval;
  const CAMERA_KEYS = {
    zoom: `canvas-${cfg.canvasId}-zoom`,
    offsetX: `canvas-${cfg.canvasId}-offsetX`,
    offsetY: `canvas-${cfg.canvasId}-offsetY`
  };
  function loadCameraFromStorage() {
    const z = localStorage.getItem(CAMERA_KEYS.zoom);
    if (z !== null) camera.targetZoom = parseFloat(z);
    else camera.targetZoom = 1;
    const ox = localStorage.getItem(CAMERA_KEYS.offsetX);
    if (ox !== null) camera.x = parseFloat(ox);
    else camera.x = cfg.boardWidth / 2;
    const oy = localStorage.getItem(CAMERA_KEYS.offsetY);
    if (oy !== null) camera.y = parseFloat(oy);
    else camera.y = cfg.boardHeight / 2;
    camera.currentZoom = 0.1;
    camera.pivotWorldX = camera.x;
    camera.pivotWorldY = camera.y;
    camera.mouseScreenX = Math.floor(window.innerWidth / 2);
    camera.mouseScreenY = Math.floor(window.innerHeight / 2);
  }
  function startCameraSaveInterval() {
    saveInterval = setInterval(
      () => {
        localStorage.setItem(CAMERA_KEYS.zoom, camera.targetZoom.toString());
        localStorage.setItem(CAMERA_KEYS.offsetX, camera.x.toString());
        localStorage.setItem(CAMERA_KEYS.offsetY, camera.y.toString());
      },
      600
    );
  }
  onMount(() => {
    core.mainCanvas = canvasRef;
    online.init();
    core.online = online;
    camera = core.camera = createCamera(canvasRef, cfg);
    loadCameraFromStorage();
    startCameraSaveInterval();
    core.toolManager = set$1(toolManager, createToolManager(), true);
    const renderer = createRenderer(canvasRef, core);
    core.renderer = renderer;
    core.requestRender = () => renderer.requestRender();
    renderer.init();
    core.fx = createOverlayRenderer(fxCanvasRef, core);
    core.fx.start();
    core.gl = new WebGLFxRenderer(glCanvasRef, core);
    core.gl.start();
    socket.init(core);
    const input = createInputHandler(canvasRef);
    core.input = input;
    player.init();
    core.player = player;
    const resize = () => {
      const dpr = 1;
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;
      updateSize(canvasRef);
      updateSize(fxCanvasRef);
      updateSize(glCanvasRef);
      renderer.requestRender();
      function updateSize(canvas2) {
        canvas2.width = w;
        canvas2.height = h;
      }
    };
    window.addEventListener("resize", resize);
    resize();
    core.ui = { showProtection: persistent("showProtection", false, 500) };
    core.chunkManager = initChunkManager(core);
    function renderLoop() {
      renderer.render();
      camera.updateLerp();
      requestAnimationFrame(renderLoop);
    }
    renderLoop();
    try {
      initGlobalCursor(core);
    } catch (error) {
      console.error("unexpected shader error:", error);
    }
    initRootPalette();
    queueMicrotask(async () => {
      try {
        core.stickersCache = await getStickerpacks();
      } catch (error) {
        console.error("failed to load stickers");
      }
    });
    window.core = core;
    return () => {
      clearInterval(saveInterval);
      window.removeEventListener("resize", resize);
      socket.terminate();
      renderer.destroy?.();
    };
  });
  var fragment = root();
  var div = first_child(fragment);
  var canvas_1 = child(div);
  bind_this(canvas_1, ($$value) => canvasRef = $$value, () => canvasRef);
  var canvas_2 = sibling(canvas_1, 2);
  bind_this(canvas_2, ($$value) => fxCanvasRef = $$value, () => fxCanvasRef);
  var canvas_3 = sibling(canvas_2, 2);
  bind_this(canvas_3, ($$value) => glCanvasRef = $$value, () => glCanvasRef);
  reset(div);
  var div_1 = sibling(div, 2);
  var node = child(div_1);
  Logo(node);
  var node_1 = sibling(node, 2);
  ToolsPanel(node_1, {
    get toolManager() {
      return get(toolManager);
    }
  });
  var node_2 = sibling(node_1, 2);
  Chat(node_2, {});
  var node_3 = sibling(node_2, 2);
  UtilityMenu(node_3);
  var node_4 = sibling(node_3, 2);
  CoordsMenu(node_4, {});
  var node_5 = sibling(node_4, 2);
  DebugMetrics(node_5, {});
  reset(div_1);
  var node_6 = sibling(div_1, 2);
  Toast(node_6);
  append($$anchor, fragment);
  pop();
}
var root_1 = from_html(`<div class="ui-overlay"></div>`);
function _page($$anchor) {
  GameCore($$anchor, {
    children: ($$anchor2, $$slotProps) => {
      var div = root_1();
      append($$anchor2, div);
    },
    $$slots: { default: true }
  });
}
export {
  _page as component
};
//# sourceMappingURL=2.LzaLEX2N.js.map
