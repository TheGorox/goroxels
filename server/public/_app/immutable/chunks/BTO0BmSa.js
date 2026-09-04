import { i as is_capture_event, d as delegated, b as delegate, e as create_event, n as normalize_attribute, g as can_delegate_event, a as append, f as from_html, j as createSubscriber, o as on, k as event, c as comment, t as text, s as set_text, l as from_svg } from "./CfJiiG60.js";
import { h as hydrating, W as hydrate_next, b as block, o as get, Y as read_hydration_instruction, am as HYDRATION_START_ELSE, Z as skip_nodes, a as set_hydrate_node, s as set_hydrating, d as hydrate_node, C as COMMENT_NODE, aO as HYDRATION_END, av as internal_set, T as current_batch, S as branch, aQ as each_key_duplicate, V as should_defer_append, ae as derived_safe_equal, aR as is_array, aN as array_from, aS as EACH_INDEX_REACTIVE, ai as source, aT as EACH_ITEM_REACTIVE, aU as EACH_ITEM_IMMUTABLE, D as mutable_source, f as get_first_child, c as create_text, aV as EFFECT_OFFSCREEN, aW as EACH_IS_CONTROLLED, a9 as DESTROYED, P as resume_effect, R as pause_effect, aX as INERT, ak as queue_micro_task, aY as BRANCH_EFFECT, aZ as EACH_IS_ANIMATED, aL as clear_text_content, U as move_effect, Q as destroy_effect, g as get_next_sibling, X as EFFECT_TRANSPARENT, a_ as managed, $ as effect, a$ as has_own_property, b0 as select_multiple_invalid_value, b1 as is, K as teardown, b2 as NAMESPACE_HTML, b3 as get_prototype_of, b4 as flatten, b5 as ATTACHMENT_KEY, b6 as IS_XHTML, b7 as autofocus, b8 as UNINITIALIZED, b9 as add_form_reset_listener, ba as LOADING_ATTR_SYMBOL, bb as get_descriptors, v as push, x as child, y as reset, t as template_effect, w as pop, bc as hasContext, bd as getContext, be as setContext, I as state, a7 as proxy, z as set, m as untrack, J as user_derived, l as user_effect, F as onMount, j as sibling, M as noop, i as first_child } from "./BpheISZ8.js";
import { B as BranchManager, p as prop, i as if_block, b as bind_this, c as component, s as spread_props, r as rest_props } from "./BlNctscH.js";
import "./CXZm87Nm.js";
function index(_, i) {
  return i;
}
function pause_effects(state2, to_destroy, controlled_anchor) {
  var transitions = [];
  var length = to_destroy.length;
  var group;
  var remaining = to_destroy.length;
  for (var i = 0; i < length; i++) {
    let effect2 = to_destroy[i];
    pause_effect(
      effect2,
      () => {
        if (group) {
          group.pending.delete(effect2);
          group.done.add(effect2);
          if (group.pending.size === 0) {
            var groups = (
              /** @type {Set<EachOutroGroup>} */
              state2.outrogroups
            );
            destroy_effects(state2, array_from(group.done));
            groups.delete(group);
            if (groups.size === 0) {
              state2.outrogroups = null;
            }
          }
        } else {
          remaining -= 1;
        }
      },
      false
    );
  }
  if (remaining === 0) {
    var fast_path = transitions.length === 0 && controlled_anchor !== null;
    if (fast_path) {
      var anchor = (
        /** @type {Element} */
        controlled_anchor
      );
      var parent_node = (
        /** @type {Element} */
        anchor.parentNode
      );
      clear_text_content(parent_node);
      parent_node.append(anchor);
      state2.items.clear();
    }
    destroy_effects(state2, to_destroy, !fast_path);
  } else {
    group = {
      pending: new Set(to_destroy),
      done: /* @__PURE__ */ new Set()
    };
    (state2.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
  }
}
function destroy_effects(state2, to_destroy, remove_dom = true) {
  var preserved_effects;
  if (state2.pending.size > 0) {
    preserved_effects = /* @__PURE__ */ new Set();
    for (const keys of state2.pending.values()) {
      for (const key of keys) {
        preserved_effects.add(
          /** @type {EachItem} */
          state2.items.get(key).e
        );
      }
    }
  }
  for (var i = 0; i < to_destroy.length; i++) {
    var e = to_destroy[i];
    if (preserved_effects?.has(e)) {
      e.f |= EFFECT_OFFSCREEN;
      const fragment = document.createDocumentFragment();
      move_effect(e, fragment);
    } else {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
}
var offscreen_anchor;
function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
  var anchor = node;
  var items = /* @__PURE__ */ new Map();
  var is_controlled = (flags & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = (
      /** @type {Element} */
      node
    );
    anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
  }
  if (hydrating) {
    hydrate_next();
  }
  var fallback = null;
  var each_array = derived_safe_equal(() => {
    var collection = get_collection();
    return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
  });
  var array;
  var pending = /* @__PURE__ */ new Map();
  var first_run = true;
  function commit(batch) {
    if ((state2.effect.f & DESTROYED) !== 0) {
      return;
    }
    state2.pending.delete(batch);
    state2.fallback = fallback;
    reconcile(state2, array, anchor, flags, get_key);
    if (fallback !== null) {
      if (array.length === 0) {
        if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
          resume_effect(fallback);
        } else {
          fallback.f ^= EFFECT_OFFSCREEN;
          move(fallback, null, anchor);
        }
      } else {
        pause_effect(fallback, () => {
          fallback = null;
        });
      }
    }
  }
  function discard(batch) {
    state2.pending.delete(batch);
  }
  var effect2 = block(() => {
    array = /** @type {V[]} */
    get(each_array);
    var length = array.length;
    let mismatch = false;
    if (hydrating) {
      var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
      if (is_else !== (length === 0)) {
        anchor = skip_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
      }
    }
    var keys = /* @__PURE__ */ new Set();
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var defer = should_defer_append();
    for (var index2 = 0; index2 < length; index2 += 1) {
      if (hydrating && hydrate_node.nodeType === COMMENT_NODE && /** @type {Comment} */
      hydrate_node.data === HYDRATION_END) {
        anchor = /** @type {Comment} */
        hydrate_node;
        mismatch = true;
        set_hydrating(false);
      }
      var value = array[index2];
      var key = get_key(value, index2);
      var item = first_run ? null : items.get(key);
      if (item) {
        if (item.v) internal_set(item.v, value);
        if (item.i) internal_set(item.i, index2);
        if (defer) {
          batch.unskip_effect(item.e);
        }
      } else {
        item = create_item(
          items,
          first_run ? anchor : offscreen_anchor ??= create_text(),
          value,
          key,
          index2,
          render_fn,
          flags,
          get_collection
        );
        if (!first_run) {
          item.e.f |= EFFECT_OFFSCREEN;
        }
        items.set(key, item);
      }
      keys.add(key);
    }
    if (length === 0 && fallback_fn && !fallback) {
      if (first_run) {
        fallback = branch(() => fallback_fn(anchor));
      } else {
        fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
        fallback.f |= EFFECT_OFFSCREEN;
      }
    }
    if (length > keys.size) {
      {
        each_key_duplicate();
      }
    }
    if (hydrating && length > 0) {
      set_hydrate_node(skip_nodes());
    }
    if (!first_run) {
      pending.set(batch, keys);
      if (defer) {
        for (const [key2, item2] of items) {
          if (!keys.has(key2)) {
            batch.skip_effect(item2.e);
          }
        }
        batch.oncommit(commit);
        batch.ondiscard(discard);
      } else {
        commit(batch);
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
    get(each_array);
  });
  var state2 = { effect: effect2, items, pending, outrogroups: null, fallback };
  first_run = false;
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function skip_to_branch(effect2) {
  while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
    effect2 = effect2.next;
  }
  return effect2;
}
function reconcile(state2, array, anchor, flags, get_key) {
  var is_animated = (flags & EACH_IS_ANIMATED) !== 0;
  var length = array.length;
  var items = state2.items;
  var current = skip_to_branch(state2.effect.first);
  var seen;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key;
  var effect2;
  var i;
  if (is_animated) {
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key).e;
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        effect2.nodes?.a?.measure();
        (to_animate ??= /* @__PURE__ */ new Set()).add(effect2);
      }
    }
  }
  for (i = 0; i < length; i += 1) {
    value = array[i];
    key = get_key(value, i);
    effect2 = /** @type {EachItem} */
    items.get(key).e;
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        group.pending.delete(effect2);
        group.done.delete(effect2);
      }
    }
    if ((effect2.f & INERT) !== 0) {
      resume_effect(effect2);
      if (is_animated) {
        effect2.nodes?.a?.unfix();
        (to_animate ??= /* @__PURE__ */ new Set()).delete(effect2);
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
      effect2.f ^= EFFECT_OFFSCREEN;
      if (effect2 === current) {
        move(effect2, null, anchor);
      } else {
        var next = prev ? prev.next : current;
        if (effect2 === state2.effect.last) {
          state2.effect.last = effect2.prev;
        }
        if (effect2.prev) effect2.prev.next = effect2.next;
        if (effect2.next) effect2.next.prev = effect2.prev;
        link(state2, prev, effect2);
        link(state2, effect2, next);
        move(effect2, next, anchor);
        prev = effect2;
        matched = [];
        stashed = [];
        current = skip_to_branch(prev.next);
        continue;
      }
    }
    if (effect2 !== current) {
      if (seen !== void 0 && seen.has(effect2)) {
        if (matched.length < stashed.length) {
          var start = stashed[0];
          var j;
          prev = start.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j = 0; j < matched.length; j += 1) {
            move(matched[j], start, anchor);
          }
          for (j = 0; j < stashed.length; j += 1) {
            seen.delete(stashed[j]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start);
          current = start;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen.delete(effect2);
          move(effect2, current, anchor);
          link(state2, effect2.prev, effect2.next);
          link(state2, effect2, prev === null ? state2.effect.first : prev.next);
          link(state2, prev, effect2);
          prev = effect2;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current !== null && current !== effect2) {
        (seen ??= /* @__PURE__ */ new Set()).add(current);
        stashed.push(current);
        current = skip_to_branch(current.next);
      }
      if (current === null) {
        continue;
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
      matched.push(effect2);
    }
    prev = effect2;
    current = skip_to_branch(effect2.next);
  }
  if (state2.outrogroups !== null) {
    for (const group of state2.outrogroups) {
      if (group.pending.size === 0) {
        destroy_effects(state2, array_from(group.done));
        state2.outrogroups?.delete(group);
      }
    }
    if (state2.outrogroups.size === 0) {
      state2.outrogroups = null;
    }
  }
  if (current !== null || seen !== void 0) {
    var to_destroy = [];
    if (seen !== void 0) {
      for (effect2 of seen) {
        if ((effect2.f & INERT) === 0) {
          to_destroy.push(effect2);
        }
      }
    }
    while (current !== null) {
      if ((current.f & INERT) === 0 && current !== state2.fallback) {
        to_destroy.push(current);
      }
      current = skip_to_branch(current.next);
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0; i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.measure();
        }
        for (i = 0; i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      if (to_animate === void 0) return;
      for (effect2 of to_animate) {
        effect2.nodes?.a?.apply();
      }
    });
  }
}
function create_item(items, anchor, value, key, index2, render_fn, flags, get_collection) {
  var v = (flags & EACH_ITEM_REACTIVE) !== 0 ? (flags & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
  var i = (flags & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
  return {
    v,
    i,
    e: branch(() => {
      render_fn(anchor, v ?? value, i ?? index2, get_collection);
      return () => {
        items.delete(key);
      };
    })
  };
}
function move(effect2, next, anchor) {
  if (!effect2.nodes) return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  var dest = next && (next.f & EFFECT_OFFSCREEN) === 0 ? (
    /** @type {EffectNodes} */
    next.nodes.start
  ) : anchor;
  while (node !== null) {
    var next_node = (
      /** @type {TemplateNode} */
      get_next_sibling(node)
    );
    dest.before(node);
    if (node === end) {
      return;
    }
    node = next_node;
  }
}
function link(state2, prev, next) {
  if (prev === null) {
    state2.effect.first = next;
  } else {
    prev.next = next;
  }
  if (next === null) {
    state2.effect.last = prev;
  } else {
    next.prev = prev;
  }
}
function snippet(node, get_snippet, ...args) {
  var branches = new BranchManager(node);
  block(() => {
    const snippet2 = get_snippet() ?? null;
    branches.ensure(snippet2, snippet2 && ((anchor) => snippet2(anchor, ...args)));
  }, EFFECT_TRANSPARENT);
}
function attach(node, get_fn) {
  var fn = void 0;
  var e;
  managed(() => {
    if (fn !== (fn = get_fn())) {
      if (e) {
        destroy_effect(e);
        e = null;
      }
      if (fn) {
        e = branch(() => {
          effect(() => (
            /** @type {(node: Element) => void} */
            fn(node)
          ));
        });
      }
    }
  });
}
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx$1() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (name === "hidden" && value !== "until-found") {
    is_boolean = true;
  }
  if (value == null || !value && is_boolean) return "";
  const normalized = has_own_property.call(replacements, name) && replacements[name].get(value) || value;
  const assignment = is_boolean ? `=""` : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function clsx(value) {
  if (typeof value === "object") {
    return clsx$1(value);
  } else {
    return value ?? "";
  }
}
const whitespace = [..." 	\n\r\f \v\uFEFF"];
function to_class(value, hash, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash) {
    classname = classname ? classname + " " + hash : hash;
  }
  if (directives) {
    for (var key of Object.keys(directives)) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key of Object.keys(styles)) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0; i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}
function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
  var prev = dom.__className;
  if (hydrating || prev !== value || prev === void 0) {
    var next_class_name = to_class(value, hash, next_classes);
    if (!hydrating || next_class_name !== dom.getAttribute("class")) {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom.__className = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key in next_classes) {
      var is_present = !!next_classes[key];
      if (prev_classes == null || is_present !== !!prev_classes[key]) {
        dom.classList.toggle(key, is_present);
      }
    }
  }
  return next_classes;
}
function update_styles(dom, prev = {}, next, priority) {
  for (var key in next) {
    var value = next[key];
    if (prev[key] !== value) {
      if (next[key] == null) {
        dom.style.removeProperty(key);
      } else {
        dom.style.setProperty(key, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom.__style;
  if (hydrating || prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom.__style = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles?.[0], next_styles[0]);
      update_styles(dom, prev_styles?.[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == void 0) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    select_option(select, select.__value);
  });
  observer.observe(select, {
    // Listen to option element changes
    childList: true,
    subtree: true,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}
const CLASS = /* @__PURE__ */ Symbol("class");
const STYLE = /* @__PURE__ */ Symbol("style");
const IS_CUSTOM_ELEMENT = /* @__PURE__ */ Symbol("is custom element");
const IS_HTML = /* @__PURE__ */ Symbol("is html");
const LINK_TAG = IS_XHTML ? "link" : "LINK";
const INPUT_TAG = IS_XHTML ? "input" : "INPUT";
const OPTION_TAG = IS_XHTML ? "option" : "OPTION";
const SELECT_TAG = IS_XHTML ? "select" : "SELECT";
function remove_input_defaults(input) {
  if (!hydrating) return;
  var already_removed = false;
  var remove_defaults = () => {
    if (already_removed) return;
    already_removed = true;
    if (input.hasAttribute("value")) {
      var value = input.value;
      set_attribute(input, "value", null);
      input.value = value;
    }
    if (input.hasAttribute("checked")) {
      var checked = input.checked;
      set_attribute(input, "checked", null);
      input.checked = checked;
    }
  };
  input.__on_r = remove_defaults;
  queue_micro_task(remove_defaults);
  add_form_reset_listener();
}
function set_selected(element, selected) {
  if (selected) {
    if (!element.hasAttribute("selected")) {
      element.setAttribute("selected", "");
    }
  } else {
    element.removeAttribute("selected");
  }
}
function set_attribute(element, attribute, value, skip_warning) {
  var attributes = get_attributes(element);
  if (hydrating) {
    attributes[attribute] = element.getAttribute(attribute);
    if (attribute === "src" || attribute === "srcset" || attribute === "href" && element.nodeName === LINK_TAG) {
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value)) return;
  if (attribute === "loading") {
    element[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element).includes(attribute)) {
    element[attribute] = value;
  } else {
    element.setAttribute(attribute, value);
  }
}
function set_attributes(element, prev, next, css_hash, should_remove_defaults = false, skip_warning = false) {
  if (hydrating && should_remove_defaults && element.nodeName === INPUT_TAG) {
    var input = (
      /** @type {HTMLInputElement} */
      element
    );
    var attribute = input.type === "checkbox" ? "defaultChecked" : "defaultValue";
    if (!(attribute in next)) {
      remove_input_defaults(input);
    }
  }
  var attributes = get_attributes(element);
  var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
  var preserve_attribute_case = !attributes[IS_HTML];
  let is_hydrating_custom_element = hydrating && is_custom_element;
  if (is_hydrating_custom_element) {
    set_hydrating(false);
  }
  var current = prev || {};
  var is_option_element = element.nodeName === OPTION_TAG;
  for (var key in prev) {
    if (!(key in next)) {
      next[key] = null;
    }
  }
  if (next.class) {
    next.class = clsx(next.class);
  } else if (css_hash || next[CLASS]) {
    next.class = null;
  }
  if (next[STYLE]) {
    next.style ??= null;
  }
  var setters = get_setters(element);
  for (const key2 in next) {
    let value = next[key2];
    if (is_option_element && key2 === "value" && value == null) {
      element.value = element.__value = "";
      current[key2] = value;
      continue;
    }
    if (key2 === "class") {
      var is_html = element.namespaceURI === "http://www.w3.org/1999/xhtml";
      set_class(element, is_html, value, css_hash, prev?.[CLASS], next[CLASS]);
      current[key2] = value;
      current[CLASS] = next[CLASS];
      continue;
    }
    if (key2 === "style") {
      set_style(element, value, prev?.[STYLE], next[STYLE]);
      current[key2] = value;
      current[STYLE] = next[STYLE];
      continue;
    }
    var prev_value = current[key2];
    if (value === prev_value && !(value === void 0 && element.hasAttribute(key2))) {
      continue;
    }
    current[key2] = value;
    var prefix = key2[0] + key2[1];
    if (prefix === "$$") continue;
    if (prefix === "on") {
      const opts = {};
      const event_handle_key = "$$" + key2;
      let event_name = key2.slice(2);
      var is_delegated = can_delegate_event(event_name);
      if (is_capture_event(event_name)) {
        event_name = event_name.slice(0, -7);
        opts.capture = true;
      }
      if (!is_delegated && prev_value) {
        if (value != null) continue;
        element.removeEventListener(event_name, current[event_handle_key], opts);
        current[event_handle_key] = null;
      }
      if (is_delegated) {
        delegated(event_name, element, value);
        delegate([event_name]);
      } else if (value != null) {
        let handle = function(evt) {
          current[key2].call(this, evt);
        };
        current[event_handle_key] = create_event(event_name, element, handle, opts);
      }
    } else if (key2 === "style") {
      set_attribute(element, key2, value);
    } else if (key2 === "autofocus") {
      autofocus(
        /** @type {HTMLElement} */
        element,
        Boolean(value)
      );
    } else if (!is_custom_element && (key2 === "__value" || key2 === "value" && value != null)) {
      element.value = element.__value = value;
    } else if (key2 === "selected" && is_option_element) {
      set_selected(
        /** @type {HTMLOptionElement} */
        element,
        value
      );
    } else {
      var name = key2;
      if (!preserve_attribute_case) {
        name = normalize_attribute(name);
      }
      var is_default = name === "defaultValue" || name === "defaultChecked";
      if (value == null && !is_custom_element && !is_default) {
        attributes[key2] = null;
        if (name === "value" || name === "checked") {
          let input2 = (
            /** @type {HTMLInputElement} */
            element
          );
          const use_default = prev === void 0;
          if (name === "value") {
            let previous = input2.defaultValue;
            input2.removeAttribute(name);
            input2.defaultValue = previous;
            input2.value = input2.__value = use_default ? previous : null;
          } else {
            let previous = input2.defaultChecked;
            input2.removeAttribute(name);
            input2.defaultChecked = previous;
            input2.checked = use_default ? previous : false;
          }
        } else {
          element.removeAttribute(key2);
        }
      } else if (is_default || setters.includes(name) && (is_custom_element || typeof value !== "string")) {
        element[name] = value;
        if (name in attributes) attributes[name] = UNINITIALIZED;
      } else if (typeof value !== "function") {
        set_attribute(element, name, value);
      }
    }
  }
  if (is_hydrating_custom_element) {
    set_hydrating(true);
  }
  return current;
}
function attribute_effect(element, fn, sync = [], async = [], blockers = [], css_hash, should_remove_defaults = false, skip_warning = false) {
  flatten(blockers, sync, async, (values) => {
    var prev = void 0;
    var effects = {};
    var is_select = element.nodeName === SELECT_TAG;
    var inited = false;
    managed(() => {
      var next = fn(...values.map(get));
      var current = set_attributes(
        element,
        prev,
        next,
        css_hash,
        should_remove_defaults,
        skip_warning
      );
      if (inited && is_select && "value" in next) {
        select_option(
          /** @type {HTMLSelectElement} */
          element,
          next.value
        );
      }
      for (let symbol of Object.getOwnPropertySymbols(effects)) {
        if (!next[symbol]) destroy_effect(effects[symbol]);
      }
      for (let symbol of Object.getOwnPropertySymbols(next)) {
        var n = next[symbol];
        if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
          if (effects[symbol]) destroy_effect(effects[symbol]);
          effects[symbol] = branch(() => attach(element, () => n));
        }
        current[symbol] = n;
      }
      prev = current;
    });
    if (is_select) {
      var select = (
        /** @type {HTMLSelectElement} */
        element
      );
      effect(() => {
        select_option(
          select,
          /** @type {Record<string | symbol, any>} */
          prev.value,
          true
        );
        init_select(select);
      });
    }
    inited = true;
  });
}
function get_attributes(element) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    // @ts-expect-error
    element.__attributes ??= {
      [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
      [IS_HTML]: element.namespaceURI === NAMESPACE_HTML
    }
  );
}
var setters_cache = /* @__PURE__ */ new Map();
function get_setters(element) {
  var cache_key = element.getAttribute("is") || element.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters) return setters;
  setters_cache.set(cache_key, setters = []);
  var descriptors;
  var proto = element;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key in descriptors) {
      if (descriptors[key].set) {
        setters.push(key);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
const bars = Array(12).fill(0);
var root_1 = from_html(`<div class="sonner-loading-bar"></div>`);
var root$7 = from_html(`<div><div class="sonner-spinner"></div></div>`);
function Loader($$anchor, $$props) {
  push($$props, true);
  var div = root$7();
  var div_1 = child(div);
  each(div_1, 23, () => bars, (_, i) => `spinner-bar-${i}`, ($$anchor2, _) => {
    var div_2 = root_1();
    append($$anchor2, div_2);
  });
  reset(div_1);
  reset(div);
  template_effect(
    ($0) => {
      set_class(div, 1, $0);
      set_attribute(div, "data-visible", $$props.visible);
    },
    [
      () => clsx(["sonner-loading-wrapper", $$props.class].filter(Boolean).join(" "))
    ]
  );
  append($$anchor, div);
  pop();
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
const isBrowser = typeof document !== "undefined";
const defaultWindow = typeof window !== "undefined" ? window : void 0;
function getActiveElement(document2) {
  let activeElement = document2.activeElement;
  while (activeElement?.shadowRoot) {
    const node = activeElement.shadowRoot.activeElement;
    if (node === activeElement)
      break;
    else
      activeElement = node;
  }
  return activeElement;
}
class ActiveElement {
  #document;
  #subscribe;
  constructor(options = {}) {
    const { window: window2 = defaultWindow, document: document2 = window2?.document } = options;
    if (window2 === void 0) return;
    this.#document = document2;
    this.#subscribe = createSubscriber((update) => {
      const cleanupFocusIn = on(window2, "focusin", update);
      const cleanupFocusOut = on(window2, "focusout", update);
      return () => {
        cleanupFocusIn();
        cleanupFocusOut();
      };
    });
  }
  get current() {
    this.#subscribe?.();
    if (!this.#document) return null;
    return getActiveElement(this.#document);
  }
}
new ActiveElement();
class Context {
  #name;
  #key;
  /**
   * @param name The name of the context.
   * This is used for generating the context key and error messages.
   */
  constructor(name) {
    this.#name = name;
    this.#key = Symbol(name);
  }
  /**
   * The key used to get and set the context.
   *
   * It is not recommended to use this value directly.
   * Instead, use the methods provided by this class.
   */
  get key() {
    return this.#key;
  }
  /**
   * Checks whether this has been set in the context of a parent component.
   *
   * Must be called during component initialisation.
   */
  exists() {
    return hasContext(this.#key);
  }
  /**
   * Retrieves the context that belongs to the closest parent component.
   *
   * Must be called during component initialisation.
   *
   * @throws An error if the context does not exist.
   */
  get() {
    const context = getContext(this.#key);
    if (context === void 0) {
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component,
   * or the given fallback value if the context does not exist.
   *
   * Must be called during component initialisation.
   */
  getOr(fallback) {
    const context = getContext(this.#key);
    if (context === void 0) {
      return fallback;
    }
    return context;
  }
  /**
   * Associates the given value with the current component and returns it.
   *
   * Must be called during component initialisation.
   */
  set(context) {
    return setContext(this.#key, context);
  }
}
const sonnerContext = new Context("<Toaster/>");
let toastsCounter = 0;
class ToastState {
  #toasts = state(proxy([]));
  get toasts() {
    return get(this.#toasts);
  }
  set toasts(value) {
    set(this.#toasts, value, true);
  }
  #heights = state(proxy([]));
  get heights() {
    return get(this.#heights);
  }
  set heights(value) {
    set(this.#heights, value, true);
  }
  #findToastIdx = (id) => {
    const idx = this.toasts.findIndex((toast2) => toast2.id === id);
    if (idx === -1) return null;
    return idx;
  };
  addToast = (data) => {
    if (!isBrowser) return;
    this.toasts.unshift(data);
  };
  updateToast = ({ id, data, type, message }) => {
    const toastIdx = this.toasts.findIndex((toast2) => toast2.id === id);
    const toastToUpdate = this.toasts[toastIdx];
    this.toasts[toastIdx] = {
      ...toastToUpdate,
      ...data,
      id,
      title: message,
      type,
      updated: true
    };
  };
  create = (data) => {
    const { message, ...rest } = data;
    const id = typeof data?.id === "number" || data.id && data.id?.length > 0 ? data.id : toastsCounter++;
    const dismissible = data.dismissible !== void 0 ? data.dismissible : data.dismissable !== void 0 ? data.dismissable : true;
    const type = data.type === void 0 ? "default" : data.type;
    untrack(() => {
      const alreadyExists = this.toasts.find((toast2) => toast2.id === id);
      if (alreadyExists) {
        this.updateToast({ id, data, type, message, dismissible });
      } else {
        this.addToast({ ...rest, id, title: message, dismissible, type });
      }
    });
    return id;
  };
  dismiss = (id) => {
    untrack(() => {
      if (id === void 0) {
        this.toasts = this.toasts.map((toast2) => ({ ...toast2, dismiss: true }));
        return;
      }
      const toastIdx = this.toasts.findIndex((toast2) => toast2.id === id);
      if (this.toasts[toastIdx]) {
        this.toasts[toastIdx] = { ...this.toasts[toastIdx], dismiss: true };
      }
    });
    return id;
  };
  remove = (id) => {
    if (id === void 0) {
      this.toasts = [];
      return;
    }
    const toastIdx = this.#findToastIdx(id);
    if (toastIdx === null) return;
    this.toasts.splice(toastIdx, 1);
    return id;
  };
  message = (message, data) => {
    return this.create({ ...data, type: "default", message });
  };
  error = (message, data) => {
    return this.create({ ...data, type: "error", message });
  };
  success = (message, data) => {
    return this.create({ ...data, type: "success", message });
  };
  info = (message, data) => {
    return this.create({ ...data, type: "info", message });
  };
  warning = (message, data) => {
    return this.create({ ...data, type: "warning", message });
  };
  loading = (message, data) => {
    return this.create({ ...data, type: "loading", message });
  };
  promise = (promise, data) => {
    if (!data) {
      return;
    }
    let id = void 0;
    if (data.loading !== void 0) {
      id = this.create({
        ...data,
        promise,
        type: "loading",
        message: typeof data.loading === "string" ? data.loading : data.loading()
      });
    }
    const p = promise instanceof Promise ? promise : promise();
    let shouldDismiss = id !== void 0;
    p.then((response) => {
      if (typeof response === "object" && response && "ok" in response && typeof response.ok === "boolean" && !response.ok) {
        shouldDismiss = false;
        const message = constructPromiseErrorMessage(response);
        this.create({ id, type: "error", message });
      } else if (data.success !== void 0) {
        shouldDismiss = false;
        const message = typeof data.success === "function" ? data.success(response) : data.success;
        this.create({ id, type: "success", message });
      }
    }).catch((error) => {
      if (data.error !== void 0) {
        shouldDismiss = false;
        const message = typeof data.error === "function" ? data.error(error) : data.error;
        this.create({ id, type: "error", message });
      }
    }).finally(() => {
      if (shouldDismiss) {
        this.dismiss(id);
        id = void 0;
      }
      data.finally?.();
    });
    return id;
  };
  custom = (component2, data) => {
    const id = data?.id || toastsCounter++;
    this.create({ component: component2, id, ...data });
    return id;
  };
  removeHeight = (id) => {
    this.heights = this.heights.filter((height) => height.toastId !== id);
  };
  setHeight = (data) => {
    const toastIdx = this.#findToastIdx(data.toastId);
    if (toastIdx === null) {
      this.heights.push(data);
      return;
    }
    this.heights[toastIdx] = data;
  };
  reset = () => {
    this.toasts = [];
    this.heights = [];
  };
}
function constructPromiseErrorMessage(response) {
  if (response && typeof response === "object" && "status" in response) {
    return `HTTP error! Status: ${response.status}`;
  }
  return `Error! ${response}`;
}
const toastState = new ToastState();
function toastFunction(message, data) {
  return toastState.create({ message, ...data });
}
class SonnerState {
  /**
   * A derived state of the toasts that are not dismissed.
   */
  #activeToasts = user_derived(() => toastState.toasts.filter((toast2) => !toast2.dismiss));
  get toasts() {
    return get(this.#activeToasts);
  }
}
const basicToast = toastFunction;
const toast = Object.assign(basicToast, {
  success: toastState.success,
  info: toastState.info,
  warning: toastState.warning,
  error: toastState.error,
  custom: toastState.custom,
  message: toastState.message,
  promise: toastState.promise,
  dismiss: toastState.dismiss,
  loading: toastState.loading,
  getActiveToasts: () => {
    return toastState.toasts.filter((toast2) => !toast2.dismiss);
  }
});
function isAction(action) {
  return action.label !== void 0;
}
function useDocumentHidden() {
  let current = state(proxy(typeof document !== "undefined" ? document.hidden : false));
  user_effect(() => {
    return on(document, "visibilitychange", () => {
      set(current, document.hidden, true);
    });
  });
  return {
    get current() {
      return get(current);
    }
  };
}
const TOAST_LIFETIME$1 = 4e3;
const GAP$1 = 14;
const SWIPE_THRESHOLD = 45;
const TIME_BEFORE_UNMOUNT = 200;
const SCALE_MULTIPLIER = 0.05;
const DEFAULT_TOAST_CLASSES = {
  toast: "",
  title: "",
  description: "",
  loader: "",
  closeButton: "",
  cancelButton: "",
  actionButton: "",
  action: "",
  warning: "",
  error: "",
  success: "",
  default: "",
  info: "",
  loading: ""
};
function getDefaultSwipeDirections(position) {
  const [y, x] = position.split("-");
  const directions = [];
  if (y) {
    directions.push(y);
  }
  if (x) {
    directions.push(x);
  }
  return directions;
}
function getDampening(delta) {
  const factor = Math.abs(delta) / 20;
  return 1 / (1.5 + factor);
}
var root_2$1 = from_html(`<div><!></div>`);
var root_4 = from_html(`<button data-close-button=""><!></button>`);
var root_7 = from_html(`<div data-icon=""><!> <!></div>`);
var root_20 = from_html(`<div data-description=""><!></div>`);
var root_25 = from_html(`<button data-button="" data-cancel=""> </button>`);
var root_28 = from_html(`<button data-button=""> </button>`);
var root_6 = from_html(`<!> <div data-content=""><div data-title=""><!></div> <!></div> <!> <!>`, 1);
var root$6 = from_html(`<li aria-atomic="true" data-sonner-toast=""><!> <!></li>`);
function Toast$1($$anchor, $$props) {
  push($$props, true);
  const LoadingIcon = ($$anchor2) => {
    var fragment = comment();
    var node = first_child(fragment);
    {
      var consequent = ($$anchor3) => {
        var div = root_2$1();
        var node_1 = child(div);
        snippet(node_1, () => $$props.loadingIcon);
        reset(div);
        template_effect(
          ($0) => {
            set_class(div, 1, $0);
            set_attribute(div, "data-visible", get(toastType) === "loading");
          },
          [
            () => clsx(cn(get(classes)?.loader, $$props.toast?.classes?.loader, "sonner-loader"))
          ]
        );
        append($$anchor3, div);
      };
      var alternate = ($$anchor3) => {
        {
          let $0 = user_derived(() => cn(get(classes)?.loader, $$props.toast.classes?.loader));
          let $1 = user_derived(() => get(toastType) === "loading");
          Loader($$anchor3, {
            get class() {
              return get($0);
            },
            get visible() {
              return get($1);
            }
          });
        }
      };
      if_block(node, ($$render) => {
        if ($$props.loadingIcon) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    append($$anchor2, fragment);
  };
  let cancelButtonStyle = prop($$props, "cancelButtonStyle", 3, ""), actionButtonStyle = prop($$props, "actionButtonStyle", 3, ""), descriptionClass = prop($$props, "descriptionClass", 3, ""), unstyled = prop($$props, "unstyled", 3, false), defaultRichColors = prop($$props, "defaultRichColors", 3, false);
  const defaultClasses = { ...DEFAULT_TOAST_CLASSES };
  let mounted = state(false);
  let removed = state(false);
  let swiping = state(false);
  let swipeOut = state(false);
  let isSwiped = state(false);
  let offsetBeforeRemove = state(0);
  let initialHeight = state(0);
  let remainingTime = $$props.toast.duration || $$props.duration || TOAST_LIFETIME$1;
  let toastRef = state(void 0);
  let swipeDirection = state(null);
  let swipeOutDirection = state(null);
  const isFront = user_derived(() => $$props.index === 0);
  const isVisible = user_derived(() => $$props.index + 1 <= $$props.visibleToasts);
  const toastType = user_derived(() => $$props.toast.type);
  const dismissible = user_derived(() => $$props.toast.dismissible !== void 0 ? $$props.toast.dismissible !== false : $$props.toast.dismissable !== false);
  const toastClass = user_derived(() => $$props.toast.class || "");
  const toastDescriptionClass = user_derived(() => $$props.toast.descriptionClass || "");
  const heightIndex = user_derived(() => toastState.heights.findIndex((height) => height.toastId === $$props.toast.id) || 0);
  const closeButton = user_derived(() => $$props.toast.closeButton ?? $$props.closeButton);
  const duration = user_derived(() => $$props.toast.duration ?? $$props.duration ?? TOAST_LIFETIME$1);
  let pointerStart = null;
  const coords = user_derived(() => $$props.position.split("-"));
  const toastsHeightBefore = user_derived(() => toastState.heights.reduce(
    (prev, curr, reducerIndex) => {
      if (reducerIndex >= get(heightIndex)) return prev;
      return prev + curr.height;
    },
    0
  ));
  const isDocumentHidden = useDocumentHidden();
  const invert = user_derived(() => $$props.toast.invert || $$props.invert);
  const disabled = user_derived(() => get(toastType) === "loading");
  const classes = user_derived(() => ({ ...defaultClasses, ...$$props.classes }));
  const toastTitle = user_derived(() => $$props.toast.title);
  const toastDescription = user_derived(() => $$props.toast.description);
  let closeTimerStartTime = state(0);
  let lastCloseTimerStartTime = state(0);
  const offset = user_derived(() => Math.round(get(heightIndex) * GAP$1 + get(toastsHeightBefore)));
  user_effect(() => {
    get(toastTitle);
    get(toastDescription);
    let scale;
    if ($$props.expanded || $$props.expandByDefault) {
      scale = 1;
    } else {
      scale = 1 - $$props.index * SCALE_MULTIPLIER;
    }
    const toastEl = untrack(() => get(toastRef));
    if (toastEl === void 0) return;
    toastEl.style.setProperty("height", "auto");
    const offsetHeight = toastEl.offsetHeight;
    const rectHeight = toastEl.getBoundingClientRect().height;
    const scaledRectHeight = Math.round(rectHeight / scale + Number.EPSILON & 100) / 100;
    toastEl.style.removeProperty("height");
    let finalHeight;
    if (Math.abs(scaledRectHeight - offsetHeight) < 1) {
      finalHeight = scaledRectHeight;
    } else {
      finalHeight = offsetHeight;
    }
    set(initialHeight, finalHeight, true);
    toastState.setHeight({ toastId: $$props.toast.id, height: finalHeight });
  });
  function deleteToast() {
    set(removed, true);
    set(offsetBeforeRemove, get(offset), true);
    toastState.removeHeight($$props.toast.id);
    setTimeout(
      () => {
        toastState.remove($$props.toast.id);
      },
      TIME_BEFORE_UNMOUNT
    );
  }
  let timeoutId;
  const isPromiseLoadingOrInfiniteDuration = user_derived(() => $$props.toast.promise && get(toastType) === "loading" || $$props.toast.duration === Number.POSITIVE_INFINITY);
  function startTimer() {
    set(closeTimerStartTime, (/* @__PURE__ */ new Date()).getTime(), true);
    timeoutId = setTimeout(
      () => {
        $$props.toast.onAutoClose?.($$props.toast);
        deleteToast();
      },
      remainingTime
    );
  }
  function pauseTimer() {
    if (get(lastCloseTimerStartTime) < get(closeTimerStartTime)) {
      const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - get(closeTimerStartTime);
      remainingTime = remainingTime - elapsedTime;
    }
    set(lastCloseTimerStartTime, (/* @__PURE__ */ new Date()).getTime(), true);
  }
  user_effect(() => {
    if ($$props.toast.updated) {
      clearTimeout(timeoutId);
      remainingTime = get(duration);
      startTimer();
    }
  });
  user_effect(() => {
    if (!get(isPromiseLoadingOrInfiniteDuration)) {
      if ($$props.expanded || $$props.interacting || $$props.pauseWhenPageIsHidden && isDocumentHidden.current) {
        pauseTimer();
      } else {
        startTimer();
      }
    }
    return () => clearTimeout(timeoutId);
  });
  onMount(() => {
    set(mounted, true);
    const height = get(toastRef)?.getBoundingClientRect().height;
    set(initialHeight, height, true);
    toastState.setHeight({ toastId: $$props.toast.id, height });
    return () => {
      toastState.removeHeight($$props.toast.id);
    };
  });
  user_effect(() => {
    if ($$props.toast.delete) {
      untrack(() => {
        deleteToast();
        $$props.toast.onDismiss?.($$props.toast);
      });
    }
  });
  const handlePointerDown = (event2) => {
    if (get(disabled)) return;
    set(offsetBeforeRemove, get(offset), true);
    const target = event2.target;
    target.setPointerCapture(event2.pointerId);
    if (target.tagName === "BUTTON") return;
    set(swiping, true);
    pointerStart = { x: event2.clientX, y: event2.clientY };
  };
  const handlePointerUp = () => {
    if (get(swipeOut) || !get(dismissible)) return;
    pointerStart = null;
    const swipeAmountX = Number(get(toastRef)?.style.getPropertyValue("--swipe-amount-x").replace("px", "") || 0);
    const swipeAmountY = Number(get(toastRef)?.style.getPropertyValue("--swipe-amount-y").replace("px", "") || 0);
    const timeTaken = (/* @__PURE__ */ new Date()).getTime() - 0;
    const swipeAmount = get(swipeDirection) === "x" ? swipeAmountX : swipeAmountY;
    const velocity = Math.abs(swipeAmount) / timeTaken;
    if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
      set(offsetBeforeRemove, get(offset), true);
      $$props.toast.onDismiss?.($$props.toast);
      if (get(swipeDirection) === "x") {
        set(swipeOutDirection, swipeAmountX > 0 ? "right" : "left", true);
      } else {
        set(swipeOutDirection, swipeAmountY > 0 ? "down" : "up", true);
      }
      deleteToast();
      set(swipeOut, true);
      return;
    } else {
      get(toastRef)?.style.setProperty("--swipe-amount-x", "0px");
      get(toastRef)?.style.setProperty("--swipe-amount-y", "0px");
    }
    set(isSwiped, false);
    set(swiping, false);
    set(swipeDirection, null);
  };
  const handlePointerMove = (event2) => {
    if (!pointerStart || !get(dismissible)) return;
    const isHighlighted = (window.getSelection()?.toString().length ?? -1) > 0;
    if (isHighlighted) return;
    const yDelta = event2.clientY - pointerStart.y;
    const xDelta = event2.clientX - pointerStart.x;
    const swipeDirections = $$props.swipeDirections ?? getDefaultSwipeDirections($$props.position);
    if (!get(swipeDirection) && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
      set(swipeDirection, Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y", true);
    }
    let swipeAmount = { x: 0, y: 0 };
    if (get(swipeDirection) === "y") {
      if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
        if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) {
          swipeAmount.y = yDelta;
        } else {
          const dampenedDelta = yDelta * getDampening(yDelta);
          swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
        }
      }
    } else if (get(swipeDirection) === "x") {
      if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
        if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) {
          swipeAmount.x = xDelta;
        } else {
          const dampenedDelta = xDelta * getDampening(xDelta);
          swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
        }
      }
    }
    if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
      set(isSwiped, true);
    }
    get(toastRef)?.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
    get(toastRef)?.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
  };
  const handleDragEnd = () => {
    set(swiping, false);
    set(swipeDirection, null);
    pointerStart = null;
  };
  const icon = user_derived(() => {
    if ($$props.toast.icon) return $$props.toast.icon;
    if (get(toastType) === "success") return $$props.successIcon;
    if (get(toastType) === "error") return $$props.errorIcon;
    if (get(toastType) === "warning") return $$props.warningIcon;
    if (get(toastType) === "info") return $$props.infoIcon;
    if (get(toastType) === "loading") return $$props.loadingIcon;
    return null;
  });
  var li = root$6();
  set_attribute(li, "tabindex", 0);
  let styles;
  var node_2 = child(li);
  {
    var consequent_1 = ($$anchor2) => {
      var button = root_4();
      var node_3 = child(button);
      snippet(node_3, () => $$props.closeIcon ?? noop);
      reset(button);
      template_effect(
        ($0) => {
          set_attribute(button, "aria-label", $$props.closeButtonAriaLabel);
          set_attribute(button, "data-disabled", get(disabled));
          set_class(button, 1, $0);
        },
        [
          () => clsx(cn(get(classes)?.closeButton, $$props.toast?.classes?.closeButton))
        ]
      );
      delegated("click", button, () => {
        if (get(disabled) || !get(dismissible)) return;
        deleteToast();
        $$props.toast.onDismiss?.($$props.toast);
      });
      append($$anchor2, button);
    };
    if_block(node_2, ($$render) => {
      if (get(closeButton) && !$$props.toast.component && get(toastType) !== "loading" && $$props.closeIcon !== null) $$render(consequent_1);
    });
  }
  var node_4 = sibling(node_2, 2);
  {
    var consequent_2 = ($$anchor2) => {
      const Component = user_derived(() => $$props.toast.component);
      var fragment_2 = comment();
      var node_5 = first_child(fragment_2);
      component(node_5, () => get(Component), ($$anchor3, Component_1) => {
        Component_1($$anchor3, spread_props(() => $$props.toast.componentProps, { closeToast: deleteToast }));
      });
      append($$anchor2, fragment_2);
    };
    var alternate_4 = ($$anchor2) => {
      var fragment_3 = root_6();
      var node_6 = first_child(fragment_3);
      {
        var consequent_11 = ($$anchor3) => {
          var div_1 = root_7();
          var node_7 = child(div_1);
          {
            var consequent_4 = ($$anchor4) => {
              var fragment_4 = comment();
              var node_8 = first_child(fragment_4);
              {
                var consequent_3 = ($$anchor5) => {
                  var fragment_5 = comment();
                  var node_9 = first_child(fragment_5);
                  component(node_9, () => $$props.toast.icon, ($$anchor6, toast_icon) => {
                    toast_icon($$anchor6, {});
                  });
                  append($$anchor5, fragment_5);
                };
                var alternate_1 = ($$anchor5) => {
                  LoadingIcon($$anchor5);
                };
                if_block(node_8, ($$render) => {
                  if ($$props.toast.icon) $$render(consequent_3);
                  else $$render(alternate_1, -1);
                });
              }
              append($$anchor4, fragment_4);
            };
            if_block(node_7, ($$render) => {
              if ($$props.toast.promise || get(toastType) === "loading") $$render(consequent_4);
            });
          }
          var node_10 = sibling(node_7, 2);
          {
            var consequent_10 = ($$anchor4) => {
              var fragment_7 = comment();
              var node_11 = first_child(fragment_7);
              {
                var consequent_5 = ($$anchor5) => {
                  var fragment_8 = comment();
                  var node_12 = first_child(fragment_8);
                  component(node_12, () => $$props.toast.icon, ($$anchor6, toast_icon_1) => {
                    toast_icon_1($$anchor6, {});
                  });
                  append($$anchor5, fragment_8);
                };
                var consequent_6 = ($$anchor5) => {
                  var fragment_9 = comment();
                  var node_13 = first_child(fragment_9);
                  snippet(node_13, () => $$props.successIcon ?? noop);
                  append($$anchor5, fragment_9);
                };
                var consequent_7 = ($$anchor5) => {
                  var fragment_10 = comment();
                  var node_14 = first_child(fragment_10);
                  snippet(node_14, () => $$props.errorIcon ?? noop);
                  append($$anchor5, fragment_10);
                };
                var consequent_8 = ($$anchor5) => {
                  var fragment_11 = comment();
                  var node_15 = first_child(fragment_11);
                  snippet(node_15, () => $$props.warningIcon ?? noop);
                  append($$anchor5, fragment_11);
                };
                var consequent_9 = ($$anchor5) => {
                  var fragment_12 = comment();
                  var node_16 = first_child(fragment_12);
                  snippet(node_16, () => $$props.infoIcon ?? noop);
                  append($$anchor5, fragment_12);
                };
                if_block(node_11, ($$render) => {
                  if ($$props.toast.icon) $$render(consequent_5);
                  else if (get(toastType) === "success") $$render(consequent_6, 1);
                  else if (get(toastType) === "error") $$render(consequent_7, 2);
                  else if (get(toastType) === "warning") $$render(consequent_8, 3);
                  else if (get(toastType) === "info") $$render(consequent_9, 4);
                });
              }
              append($$anchor4, fragment_7);
            };
            if_block(node_10, ($$render) => {
              if ($$props.toast.type !== "loading") $$render(consequent_10);
            });
          }
          reset(div_1);
          template_effect(($0) => set_class(div_1, 1, $0), [
            () => clsx(cn(get(classes)?.icon, $$props.toast?.classes?.icon))
          ]);
          append($$anchor3, div_1);
        };
        if_block(node_6, ($$render) => {
          if ((get(toastType) || $$props.toast.icon || $$props.toast.promise) && $$props.toast.icon !== null && (get(icon) !== null || $$props.toast.icon)) $$render(consequent_11);
        });
      }
      var div_2 = sibling(node_6, 2);
      var div_3 = child(div_2);
      var node_17 = child(div_3);
      {
        var consequent_13 = ($$anchor3) => {
          var fragment_13 = comment();
          var node_18 = first_child(fragment_13);
          {
            var consequent_12 = ($$anchor4) => {
              const Title = user_derived(() => $$props.toast.title);
              var fragment_14 = comment();
              var node_19 = first_child(fragment_14);
              component(node_19, () => get(Title), ($$anchor5, Title_1) => {
                Title_1($$anchor5, spread_props(() => $$props.toast.componentProps));
              });
              append($$anchor4, fragment_14);
            };
            var alternate_2 = ($$anchor4) => {
              var text$1 = text();
              template_effect(() => set_text(text$1, $$props.toast.title));
              append($$anchor4, text$1);
            };
            if_block(node_18, ($$render) => {
              if (typeof $$props.toast.title !== "string") $$render(consequent_12);
              else $$render(alternate_2, -1);
            });
          }
          append($$anchor3, fragment_13);
        };
        if_block(node_17, ($$render) => {
          if ($$props.toast.title) $$render(consequent_13);
        });
      }
      reset(div_3);
      var node_20 = sibling(div_3, 2);
      {
        var consequent_15 = ($$anchor3) => {
          var div_4 = root_20();
          var node_21 = child(div_4);
          {
            var consequent_14 = ($$anchor4) => {
              const Description = user_derived(() => $$props.toast.description);
              var fragment_16 = comment();
              var node_22 = first_child(fragment_16);
              component(node_22, () => get(Description), ($$anchor5, Description_1) => {
                Description_1($$anchor5, spread_props(() => $$props.toast.componentProps));
              });
              append($$anchor4, fragment_16);
            };
            var alternate_3 = ($$anchor4) => {
              var text_1 = text();
              template_effect(() => set_text(text_1, $$props.toast.description));
              append($$anchor4, text_1);
            };
            if_block(node_21, ($$render) => {
              if (typeof $$props.toast.description !== "string") $$render(consequent_14);
              else $$render(alternate_3, -1);
            });
          }
          reset(div_4);
          template_effect(($0) => set_class(div_4, 1, $0), [
            () => clsx(cn(descriptionClass(), get(toastDescriptionClass), get(classes)?.description, $$props.toast.classes?.description))
          ]);
          append($$anchor3, div_4);
        };
        if_block(node_20, ($$render) => {
          if ($$props.toast.description) $$render(consequent_15);
        });
      }
      reset(div_2);
      var node_23 = sibling(div_2, 2);
      {
        var consequent_18 = ($$anchor3) => {
          var fragment_18 = comment();
          var node_24 = first_child(fragment_18);
          {
            var consequent_16 = ($$anchor4) => {
              var fragment_19 = comment();
              var node_25 = first_child(fragment_19);
              component(node_25, () => $$props.toast.cancel, ($$anchor5, toast_cancel) => {
                toast_cancel($$anchor5, {});
              });
              append($$anchor4, fragment_19);
            };
            var consequent_17 = ($$anchor4) => {
              var button_1 = root_25();
              var text_2 = child(button_1, true);
              reset(button_1);
              template_effect(
                ($0) => {
                  set_style(button_1, $$props.toast.cancelButtonStyle ?? cancelButtonStyle());
                  set_class(button_1, 1, $0);
                  set_text(text_2, $$props.toast.cancel.label);
                },
                [
                  () => clsx(cn(get(classes)?.cancelButton, $$props.toast?.classes?.cancelButton))
                ]
              );
              delegated("click", button_1, (event2) => {
                if (!isAction($$props.toast.cancel)) return;
                if (!get(dismissible)) return;
                $$props.toast.cancel?.onClick?.(event2);
                deleteToast();
              });
              append($$anchor4, button_1);
            };
            var d = user_derived(() => isAction($$props.toast.cancel));
            if_block(node_24, ($$render) => {
              if (typeof $$props.toast.cancel === "function") $$render(consequent_16);
              else if (get(d)) $$render(consequent_17, 1);
            });
          }
          append($$anchor3, fragment_18);
        };
        if_block(node_23, ($$render) => {
          if ($$props.toast.cancel) $$render(consequent_18);
        });
      }
      var node_26 = sibling(node_23, 2);
      {
        var consequent_21 = ($$anchor3) => {
          var fragment_20 = comment();
          var node_27 = first_child(fragment_20);
          {
            var consequent_19 = ($$anchor4) => {
              var fragment_21 = comment();
              var node_28 = first_child(fragment_21);
              component(node_28, () => $$props.toast.action, ($$anchor5, toast_action) => {
                toast_action($$anchor5, {});
              });
              append($$anchor4, fragment_21);
            };
            var consequent_20 = ($$anchor4) => {
              var button_2 = root_28();
              var text_3 = child(button_2, true);
              reset(button_2);
              template_effect(
                ($0) => {
                  set_style(button_2, $$props.toast.actionButtonStyle ?? actionButtonStyle());
                  set_class(button_2, 1, $0);
                  set_text(text_3, $$props.toast.action.label);
                },
                [
                  () => clsx(cn(get(classes)?.actionButton, $$props.toast?.classes?.actionButton))
                ]
              );
              delegated("click", button_2, (event2) => {
                if (!isAction($$props.toast.action)) return;
                $$props.toast.action?.onClick(event2);
                if (event2.defaultPrevented) return;
                deleteToast();
              });
              append($$anchor4, button_2);
            };
            var d_1 = user_derived(() => isAction($$props.toast.action));
            if_block(node_27, ($$render) => {
              if (typeof $$props.toast.action === "function") $$render(consequent_19);
              else if (get(d_1)) $$render(consequent_20, 1);
            });
          }
          append($$anchor3, fragment_20);
        };
        if_block(node_26, ($$render) => {
          if ($$props.toast.action) $$render(consequent_21);
        });
      }
      template_effect(
        ($0, $1) => {
          set_class(div_2, 1, $0);
          set_class(div_3, 1, $1);
        },
        [
          () => clsx(cn(get(classes)?.content, $$props.toast?.classes?.content)),
          () => clsx(cn(get(classes)?.title, $$props.toast?.classes?.title))
        ]
      );
      append($$anchor2, fragment_3);
    };
    if_block(node_4, ($$render) => {
      if ($$props.toast.component) $$render(consequent_2);
      else $$render(alternate_4, -1);
    });
  }
  reset(li);
  bind_this(li, ($$value) => set(toastRef, $$value), () => get(toastRef));
  template_effect(
    ($0, $1, $2) => {
      set_class(li, 1, $0);
      set_attribute(li, "aria-live", $$props.toast.important ? "assertive" : "polite");
      set_attribute(li, "data-rich-colors", $$props.toast.richColors ?? defaultRichColors());
      set_attribute(li, "data-styled", !($$props.toast.component || $$props.toast.unstyled || unstyled()));
      set_attribute(li, "data-mounted", get(mounted));
      set_attribute(li, "data-promise", $1);
      set_attribute(li, "data-swiped", get(isSwiped));
      set_attribute(li, "data-removed", get(removed));
      set_attribute(li, "data-visible", get(isVisible));
      set_attribute(li, "data-y-position", get(coords)[0]);
      set_attribute(li, "data-x-position", get(coords)[1]);
      set_attribute(li, "data-index", $$props.index);
      set_attribute(li, "data-front", get(isFront));
      set_attribute(li, "data-swiping", get(swiping));
      set_attribute(li, "data-dismissible", get(dismissible));
      set_attribute(li, "data-type", get(toastType));
      set_attribute(li, "data-invert", get(invert));
      set_attribute(li, "data-swipe-out", get(swipeOut));
      set_attribute(li, "data-swipe-direction", get(swipeOutDirection));
      set_attribute(li, "data-expanded", $2);
      styles = set_style(li, `${$$props.style} ${$$props.toast.style}`, styles, {
        "--index": $$props.index,
        "--toasts-before": $$props.index,
        "--z-index": toastState.toasts.length - $$props.index,
        "--offset": `${get(removed) ? get(offsetBeforeRemove) : get(offset)}px`,
        "--initial-height": $$props.expandByDefault ? "auto" : `${get(initialHeight)}px`
      });
    },
    [
      () => clsx(cn($$props.class, get(toastClass), get(classes)?.toast, $$props.toast?.classes?.toast, get(classes)?.[get(toastType)], $$props.toast?.classes?.[get(toastType)])),
      () => Boolean($$props.toast.promise),
      () => Boolean($$props.expanded || $$props.expandByDefault && get(mounted))
    ]
  );
  delegated("pointermove", li, handlePointerMove);
  delegated("pointerup", li, handlePointerUp);
  delegated("pointerdown", li, handlePointerDown);
  event("dragend", li, handleDragEnd);
  append($$anchor, li);
  pop();
}
delegate(["pointermove", "pointerup", "pointerdown", "click"]);
var root$5 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-success-icon=""><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`);
function SuccessIcon($$anchor) {
  var svg = root$5();
  append($$anchor, svg);
}
var root$4 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-error-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`);
function ErrorIcon($$anchor) {
  var svg = root$4();
  append($$anchor, svg);
}
var root$3 = from_svg(`<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" data-sonner-warning-icon="" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`);
function WarningIcon($$anchor) {
  var svg = root$3();
  append($$anchor, svg);
}
var root$2 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20" data-sonner-info-icon=""><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`);
function InfoIcon($$anchor) {
  var svg = root$2();
  append($$anchor, svg);
}
var root$1 = from_svg(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-sonner-close-icon=""><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
function CloseIcon($$anchor) {
  var svg = root$1();
  append($$anchor, svg);
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const DARK = "dark";
const LIGHT = "light";
function getOffsetObject(defaultOffset, mobileOffset) {
  const styles = {};
  [defaultOffset, mobileOffset].forEach((offset, index2) => {
    const isMobile = index2 === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      ["top", "right", "bottom", "left"].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      ["top", "right", "bottom", "left"].forEach((key) => {
        const value = offset[key];
        if (value === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] = typeof value === "number" ? `${value}px` : value;
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
var root_2 = from_html(`<ol></ol>`);
var root = from_html(`<section aria-live="polite" aria-relevant="additions text" aria-atomic="false" class="svelte-nbs0zk"><!></section>`);
function Toaster($$anchor, $$props) {
  push($$props, true);
  function getInitialTheme(t) {
    if (t !== "system") return t;
    if (typeof window !== "undefined") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return DARK;
      }
      return LIGHT;
    }
    return LIGHT;
  }
  let invert = prop($$props, "invert", 3, false), position = prop($$props, "position", 3, "bottom-right"), hotkey = prop($$props, "hotkey", 19, () => ["altKey", "KeyT"]), expand = prop($$props, "expand", 3, false), closeButton = prop($$props, "closeButton", 3, false), offset = prop($$props, "offset", 3, VIEWPORT_OFFSET), mobileOffset = prop($$props, "mobileOffset", 3, MOBILE_VIEWPORT_OFFSET), theme = prop($$props, "theme", 3, "light"), richColors = prop($$props, "richColors", 3, false), duration = prop($$props, "duration", 3, TOAST_LIFETIME), visibleToasts = prop($$props, "visibleToasts", 3, VISIBLE_TOASTS_AMOUNT), toastOptions = prop($$props, "toastOptions", 19, () => ({})), dir = prop($$props, "dir", 7, "auto"), gap = prop($$props, "gap", 3, GAP), pauseWhenPageIsHidden = prop($$props, "pauseWhenPageIsHidden", 3, false), containerAriaLabel = prop($$props, "containerAriaLabel", 3, "Notifications"), closeButtonAriaLabel = prop($$props, "closeButtonAriaLabel", 3, "Close toast"), restProps = rest_props($$props, [
    "$$slots",
    "$$events",
    "$$legacy",
    "invert",
    "position",
    "hotkey",
    "expand",
    "closeButton",
    "offset",
    "mobileOffset",
    "theme",
    "richColors",
    "duration",
    "visibleToasts",
    "toastOptions",
    "dir",
    "gap",
    "pauseWhenPageIsHidden",
    "loadingIcon",
    "successIcon",
    "errorIcon",
    "warningIcon",
    "closeIcon",
    "infoIcon",
    "containerAriaLabel",
    "class",
    "closeButtonAriaLabel",
    "onblur",
    "onfocus",
    "onmouseenter",
    "onmousemove",
    "onmouseleave",
    "ondragend",
    "onpointerdown",
    "onpointerup"
  ]);
  function getDocumentDirection() {
    if (dir() !== "auto") return dir();
    if (typeof window === "undefined") return "ltr";
    if (typeof document === "undefined") return "ltr";
    const dirAttribute = document.documentElement.getAttribute("dir");
    if (dirAttribute === "auto" || !dirAttribute) {
      untrack(() => dir(window.getComputedStyle(document.documentElement).direction ?? "ltr"));
      return dir();
    }
    untrack(() => dir(dirAttribute));
    return dirAttribute;
  }
  const possiblePositions = user_derived(() => Array.from(new Set([
    position(),
    ...toastState.toasts.filter((toast2) => toast2.position).map((toast2) => toast2.position)
  ].filter(Boolean))));
  let expanded = state(false);
  let interacting = state(false);
  let actualTheme = state(proxy(getInitialTheme(theme())));
  let listRef = state(void 0);
  let lastFocusedElementRef = state(null);
  let isFocusWithin = state(false);
  const hotkeyLabel = user_derived(() => hotkey().join("+").replace(/Key/g, "").replace(/Digit/g, ""));
  user_effect(() => {
    if (toastState.toasts.length <= 1) {
      set(expanded, false);
    }
  });
  user_effect(() => {
    const toastsToDismiss = toastState.toasts.filter((toast2) => toast2.dismiss && !toast2.delete);
    if (toastsToDismiss.length > 0) {
      const updatedToasts = toastState.toasts.map((toast2) => {
        const matchingToast = toastsToDismiss.find((dismissToast) => dismissToast.id === toast2.id);
        if (matchingToast) {
          return { ...toast2, delete: true };
        }
        return toast2;
      });
      toastState.toasts = updatedToasts;
    }
  });
  user_effect(() => {
    return () => {
      if (get(listRef) && get(lastFocusedElementRef)) {
        get(lastFocusedElementRef).focus({ preventScroll: true });
        set(lastFocusedElementRef, null);
        set(isFocusWithin, false);
      }
    };
  });
  onMount(() => {
    toastState.reset();
    const handleKeydown = (event2) => {
      const isHotkeyPressed = hotkey().every((key) => event2[key] || event2.code === key);
      if (isHotkeyPressed) {
        set(expanded, true);
        get(listRef)?.focus();
      }
      if (event2.code === "Escape" && (document.activeElement === get(listRef) || get(listRef)?.contains(document.activeElement))) {
        set(expanded, false);
      }
    };
    return on(document, "keydown", handleKeydown);
  });
  user_effect(() => {
    if (theme() !== "system") {
      set(actualTheme, theme());
    }
    if (typeof window !== "undefined") {
      if (theme() === "system") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          set(actualTheme, DARK);
        } else {
          set(actualTheme, LIGHT);
        }
      }
      const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
      const changeHandler = ({ matches }) => {
        if (theme() !== "system") return;
        set(actualTheme, matches ? DARK : LIGHT, true);
      };
      if ("addEventListener" in mediaQueryList) {
        mediaQueryList.addEventListener("change", changeHandler);
      } else {
        mediaQueryList.addListener(changeHandler);
      }
    }
  });
  const handleBlur = (event2) => {
    $$props.onblur?.(event2);
    if (get(isFocusWithin) && !event2.currentTarget.contains(event2.relatedTarget)) {
      set(isFocusWithin, false);
      if (get(lastFocusedElementRef)) {
        get(lastFocusedElementRef).focus({ preventScroll: true });
        set(lastFocusedElementRef, null);
      }
    }
  };
  const handleFocus = (event2) => {
    $$props.onfocus?.(event2);
    const isNotDismissable = event2.target instanceof HTMLElement && event2.target.dataset.dismissible === "false";
    if (isNotDismissable) return;
    if (!get(isFocusWithin)) {
      set(isFocusWithin, true);
      set(lastFocusedElementRef, event2.relatedTarget, true);
    }
  };
  const handlePointerDown = (event2) => {
    $$props.onpointerdown?.(event2);
    const isNotDismissable = event2.target instanceof HTMLElement && event2.target.dataset.dismissible === "false";
    if (isNotDismissable) return;
    set(interacting, true);
  };
  const handleMouseEnter = (event2) => {
    $$props.onmouseenter?.(event2);
    set(expanded, true);
  };
  const handleMouseLeave = (event2) => {
    $$props.onmouseleave?.(event2);
    if (!get(interacting)) {
      set(expanded, false);
    }
  };
  const handleMouseMove = (event2) => {
    $$props.onmousemove?.(event2);
    set(expanded, true);
  };
  const handleDragEnd = (event2) => {
    $$props.ondragend?.(event2);
    set(expanded, false);
  };
  const handlePointerUp = (event2) => {
    $$props.onpointerup?.(event2);
    set(interacting, false);
  };
  sonnerContext.set(new SonnerState());
  var section = root();
  set_attribute(section, "tabindex", -1);
  var node = child(section);
  {
    var consequent_10 = ($$anchor2) => {
      var fragment = comment();
      var node_1 = first_child(fragment);
      each(node_1, 18, () => get(possiblePositions), (position2) => position2, ($$anchor3, position2, index2, $$array) => {
        const computed_const = user_derived(() => {
          const [y, x] = position2.split("-");
          return { y, x };
        });
        const offsetObject = user_derived(() => getOffsetObject(offset(), mobileOffset()));
        var ol = root_2();
        attribute_effect(
          ol,
          ($0) => ({
            tabindex: -1,
            dir: $0,
            class: $$props.class,
            "data-sonner-toaster": true,
            "data-sonner-theme": get(actualTheme),
            "data-y-position": get(computed_const).y,
            "data-x-position": get(computed_const).x,
            style: $$props.style,
            onblur: handleBlur,
            onfocus: handleFocus,
            onmouseenter: handleMouseEnter,
            onmousemove: handleMouseMove,
            onmouseleave: handleMouseLeave,
            ondragend: handleDragEnd,
            onpointerdown: handlePointerDown,
            onpointerup: handlePointerUp,
            ...restProps,
            [STYLE]: {
              "--front-toast-height": `${toastState.heights[0]?.height}px`,
              "--width": `${TOAST_WIDTH}px`,
              "--gap": `${gap()}px`,
              "--offset-top": get(offsetObject)["--offset-top"],
              "--offset-right": get(offsetObject)["--offset-right"],
              "--offset-bottom": get(offsetObject)["--offset-bottom"],
              "--offset-left": get(offsetObject)["--offset-left"],
              "--mobile-offset-top": get(offsetObject)["--mobile-offset-top"],
              "--mobile-offset-right": get(offsetObject)["--mobile-offset-right"],
              "--mobile-offset-bottom": get(offsetObject)["--mobile-offset-bottom"],
              "--mobile-offset-left": get(offsetObject)["--mobile-offset-left"]
            }
          }),
          [() => getDocumentDirection()],
          void 0,
          void 0,
          "svelte-nbs0zk"
        );
        each(ol, 23, () => toastState.toasts.filter((toast2) => !toast2.position && get(index2) === 0 || toast2.position === position2), (toast2) => toast2.id, ($$anchor4, toast2, index3, $$array_1) => {
          {
            const successIcon = ($$anchor5) => {
              var fragment_2 = comment();
              var node_2 = first_child(fragment_2);
              {
                var consequent = ($$anchor6) => {
                  var fragment_3 = comment();
                  var node_3 = first_child(fragment_3);
                  snippet(node_3, () => $$props.successIcon ?? noop);
                  append($$anchor6, fragment_3);
                };
                var consequent_1 = ($$anchor6) => {
                  SuccessIcon($$anchor6);
                };
                if_block(node_2, ($$render) => {
                  if ($$props.successIcon) $$render(consequent);
                  else if ($$props.successIcon !== null) $$render(consequent_1, 1);
                });
              }
              append($$anchor5, fragment_2);
            };
            const errorIcon = ($$anchor5) => {
              var fragment_5 = comment();
              var node_4 = first_child(fragment_5);
              {
                var consequent_2 = ($$anchor6) => {
                  var fragment_6 = comment();
                  var node_5 = first_child(fragment_6);
                  snippet(node_5, () => $$props.errorIcon ?? noop);
                  append($$anchor6, fragment_6);
                };
                var consequent_3 = ($$anchor6) => {
                  ErrorIcon($$anchor6);
                };
                if_block(node_4, ($$render) => {
                  if ($$props.errorIcon) $$render(consequent_2);
                  else if ($$props.errorIcon !== null) $$render(consequent_3, 1);
                });
              }
              append($$anchor5, fragment_5);
            };
            const warningIcon = ($$anchor5) => {
              var fragment_8 = comment();
              var node_6 = first_child(fragment_8);
              {
                var consequent_4 = ($$anchor6) => {
                  var fragment_9 = comment();
                  var node_7 = first_child(fragment_9);
                  snippet(node_7, () => $$props.warningIcon ?? noop);
                  append($$anchor6, fragment_9);
                };
                var consequent_5 = ($$anchor6) => {
                  WarningIcon($$anchor6);
                };
                if_block(node_6, ($$render) => {
                  if ($$props.warningIcon) $$render(consequent_4);
                  else if ($$props.warningIcon !== null) $$render(consequent_5, 1);
                });
              }
              append($$anchor5, fragment_8);
            };
            const infoIcon = ($$anchor5) => {
              var fragment_11 = comment();
              var node_8 = first_child(fragment_11);
              {
                var consequent_6 = ($$anchor6) => {
                  var fragment_12 = comment();
                  var node_9 = first_child(fragment_12);
                  snippet(node_9, () => $$props.infoIcon ?? noop);
                  append($$anchor6, fragment_12);
                };
                var consequent_7 = ($$anchor6) => {
                  InfoIcon($$anchor6);
                };
                if_block(node_8, ($$render) => {
                  if ($$props.infoIcon) $$render(consequent_6);
                  else if ($$props.infoIcon !== null) $$render(consequent_7, 1);
                });
              }
              append($$anchor5, fragment_11);
            };
            const closeIcon = ($$anchor5) => {
              var fragment_14 = comment();
              var node_10 = first_child(fragment_14);
              {
                var consequent_8 = ($$anchor6) => {
                  var fragment_15 = comment();
                  var node_11 = first_child(fragment_15);
                  snippet(node_11, () => $$props.closeIcon ?? noop);
                  append($$anchor6, fragment_15);
                };
                var consequent_9 = ($$anchor6) => {
                  CloseIcon($$anchor6);
                };
                if_block(node_10, ($$render) => {
                  if ($$props.closeIcon) $$render(consequent_8);
                  else if ($$props.closeIcon !== null) $$render(consequent_9, 1);
                });
              }
              append($$anchor5, fragment_14);
            };
            let $0 = user_derived(() => toastOptions()?.duration ?? duration());
            let $1 = user_derived(() => toastOptions()?.class ?? "");
            let $2 = user_derived(() => toastOptions()?.descriptionClass || "");
            let $3 = user_derived(() => toastOptions()?.style ?? "");
            let $4 = user_derived(() => toastOptions().classes || {});
            let $5 = user_derived(() => toastOptions().unstyled ?? false);
            let $6 = user_derived(() => toastOptions()?.cancelButtonStyle ?? "");
            let $7 = user_derived(() => toastOptions()?.actionButtonStyle ?? "");
            let $8 = user_derived(() => toastOptions()?.closeButtonAriaLabel ?? closeButtonAriaLabel());
            Toast$1($$anchor4, {
              get index() {
                return get(index3);
              },
              get toast() {
                return get(toast2);
              },
              get defaultRichColors() {
                return richColors();
              },
              get duration() {
                return get($0);
              },
              get class() {
                return get($1);
              },
              get descriptionClass() {
                return get($2);
              },
              get invert() {
                return invert();
              },
              get visibleToasts() {
                return visibleToasts();
              },
              get closeButton() {
                return closeButton();
              },
              get interacting() {
                return get(interacting);
              },
              get position() {
                return position2;
              },
              get style() {
                return get($3);
              },
              get classes() {
                return get($4);
              },
              get unstyled() {
                return get($5);
              },
              get cancelButtonStyle() {
                return get($6);
              },
              get actionButtonStyle() {
                return get($7);
              },
              get closeButtonAriaLabel() {
                return get($8);
              },
              get expandByDefault() {
                return expand();
              },
              get expanded() {
                return get(expanded);
              },
              get pauseWhenPageIsHidden() {
                return pauseWhenPageIsHidden();
              },
              get loadingIcon() {
                return $$props.loadingIcon;
              },
              successIcon,
              errorIcon,
              warningIcon,
              infoIcon,
              closeIcon,
              $$slots: {
                successIcon: true,
                errorIcon: true,
                warningIcon: true,
                infoIcon: true,
                closeIcon: true
              }
            });
          }
        });
        reset(ol);
        bind_this(ol, ($$value) => set(listRef, $$value), () => get(listRef));
        template_effect(() => ol.dir = ol.dir);
        append($$anchor3, ol);
      });
      append($$anchor2, fragment);
    };
    if_block(node, ($$render) => {
      if (toastState.toasts.length > 0) $$render(consequent_10);
    });
  }
  reset(section);
  template_effect(() => set_attribute(section, "aria-label", `${containerAriaLabel() ?? ""} ${get(hotkeyLabel) ?? ""}`));
  append($$anchor, section);
  pop();
}
function Toast($$anchor) {
  Toaster($$anchor, {});
}
export {
  CLASS as C,
  STYLE as S,
  Toast as T,
  set_attribute as a,
  to_class as b,
  clsx as c,
  attr as d,
  escape_html as e,
  toast as f,
  set_style as g,
  attribute_effect as h,
  each as i,
  index as j,
  set_class as k,
  clsx$1 as l,
  snippet as s,
  to_style as t
};
//# sourceMappingURL=BTO0BmSa.js.map
