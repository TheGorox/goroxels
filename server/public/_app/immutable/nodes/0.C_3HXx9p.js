import { a as append, f as from_html } from "../chunks/CsnEtAjo.js";
import { c as create_text, b as block, H as HEAD_EFFECT, E as EFFECT_PRESERVED, h as hydrating, C as COMMENT_NODE, g as get_next_sibling, s as set_hydrating, a as set_hydrate_node, d as hydrate_node, f as get_first_child, i as first_child, t as template_effect, j as sibling } from "../chunks/BYvYazV4.js";
import { s as snippet, T as Toast, a as set_attribute } from "../chunks/DGvTukkS.js";
function head(hash, render_fn) {
  let previous_hydrate_node = null;
  let was_hydrating = hydrating;
  var anchor;
  if (hydrating) {
    previous_hydrate_node = hydrate_node;
    var head_anchor = get_first_child(document.head);
    while (head_anchor !== null && (head_anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */
    head_anchor.data !== hash)) {
      head_anchor = get_next_sibling(head_anchor);
    }
    if (head_anchor === null) {
      set_hydrating(false);
    } else {
      var start = (
        /** @type {TemplateNode} */
        get_next_sibling(head_anchor)
      );
      head_anchor.remove();
      set_hydrate_node(start);
    }
  }
  if (!hydrating) {
    anchor = document.head.appendChild(create_text());
  }
  try {
    block(() => render_fn(anchor), HEAD_EFFECT | EFFECT_PRESERVED);
  } finally {
    if (was_hydrating) {
      set_hydrating(true);
      set_hydrate_node(
        /** @type {TemplateNode} */
        previous_hydrate_node
      );
    }
  }
}
const ssr = false;
const prerender = false;
const _layout$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  prerender,
  ssr
}, Symbol.toStringTag, { value: "Module" }));
const favicon = "data:image/webp;base64,UklGRjoFAABXRUJQVlA4WAoAAAAIAAAAHwAAHwAAVlA4IDwEAABQFgCdASogACAAABgIJ7ACdMoRwN4B+AH5Ac4ZoF2AyQPnvxV+oDxAP7hugP1u/1XWA9ADpAPQA8tH9mfgd/Z79rvaGuwL47+KHVldj/UP9jctZ8e/HnRJf0D8Zvy5zhT4N/JPxo/qusAf1r8lNkM/jH9g/mf69/2v4EPzv8ZvUF8ef2z8qvoA/hv8S/n/9a/Yj+uf+nlH/0qPHiaXkVhudFBDll/IRUGM/Y6QhYhg7aslxOgkH7OcjBSAAN5n/+UBzs9xszDOWY9RchwjXdO3eSXkHNNmzcultXgf3xK68/br/8nai6U9ClAJmBks9uP5hypb/DpMPYrfHNW7/8hjzb+RBcK11kVgtPWVtHCkPpqLL3DCwv2S0n5PSLk4yCJ1oS68HVbBwtRD8xdDv6Un/+ojVJP/adbVvTQ+f+31pT34G47j8a4ClsESNTGm2JO7dz/wuu5jO1cYMlGpRz//ZtvLVBiz+cddZprqR45rOY+19t/xIvoT54J/P/9//V7/zHAReIWkQQv/wIJAkbCMSS8eIHlGhGSHwTbIDuGYbeYf86Ju85HUoJAqwL0F3pIAcRf/+Vl//zPxSwUuv/TGF+LxQ4OFoR88G6o9oln/y4tvRVYaxDEzzK6uBgYF4YScQk2UBBhTAbCTBE8S//kHr+mOD6ehOxT4bGR9M2LT+ue3KROX/5otCu4bV8od88LB/+dmSCoa8MUM2iz//2DLGB+1YX3W6UM/B3YJd6WPIpjueQPF+KEv//2Ez9U79pLl+Zg/MqQJWJ7QKU3DB3Bg4NbCzXKDxt5FHakUdDTwamQtlZDD85QGmJlmaonJQV+7gTS3KuhigOkrHsdLeFZ0eshM6q7zOYtG7d9CjatYJSvrTi8uZWFCCqs3A0QLF8fdeX//J7bLoKpUJYkX1xhnSPY7sPAS9SrZPCQiAJ7OPqv9dMvz/VXlrW0UYtgbep+Grip4fuwVdKhBJsARb5Enx0n+tuCjTJ6Mtq5K0s4uJh/+0TUoVX1GA/v9J7uGwnCbQAH3bwZ3FZbMPHK5kcGRslWUlcTRxhLxkbkzgGbUwhNOY+7iPjjhQ6/eVkf75xUJYf1rbYiyb2u6d/bNZBvm3qI6/LxCr/opCa/3ouxTAw2M0O9i8lj47dN0u74MLAsAII9nqzoqINbnjTRJlrsAfArMzs/fv/PDhSVb/z4z+473vX5DmwXBHDpywbQOlV0QWNa4Q5U9KlD2uQIl/s5cQC0xZ44hGVx9U8LJPRgfb0NYoQfd9peb0fDqcORcn6QQ1yGBmCTuHms7yJ/Nt9RgzmOAjyO3PrUL4uOXJ3msPcZl7vPh0vdMeETNN0XtDRDZfRs7BRFdQBN5WCMB0H7vhEiddRluze6p6H5naAnP8PvDluKmPdFa1d47Yp+zE8H+sThsxa+AuqqAkEHXkydIeYp2pWRA+wqkAAAARVhJRtgAAABJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAMQECABEAAABmAAAAaYcEAAEAAAB4AAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjEyAAAFAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAKgBAABAAAAIAAAAAOgBAABAAAAIAAAAAWgBAABAAAAugAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAA=";
var root_1 = from_html(`<link rel="icon"/>`);
var root = from_html(`<!> <!>`, 1);
function _layout($$anchor, $$props) {
  var fragment = root();
  head("12qhfyh", ($$anchor2) => {
    var link = root_1();
    template_effect(() => set_attribute(link, "href", favicon));
    append($$anchor2, link);
  });
  var node = first_child(fragment);
  snippet(node, () => $$props.children);
  var node_1 = sibling(node, 2);
  Toast(node_1);
  append($$anchor, fragment);
}
export {
  _layout as component,
  _layout$1 as universal
};
//# sourceMappingURL=0.C_3HXx9p.js.map
