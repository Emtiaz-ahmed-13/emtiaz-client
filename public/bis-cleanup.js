(function () {
  if (typeof window === "undefined") return;

  var BAD_PREFIXES = ["bis_", "__processed_"];
  var BAD_NAMES = [
    "bis_skin_checked",
    "bis_register",
    "data-new-gr-c-s-check-loaded",
    "data-gr-ext-installed",
    "cz-shortcut-listen",
    "data-extension-id",
  ];

  function isBad(name) {
    if (!name) return false;
    if (BAD_NAMES.indexOf(name) !== -1) return true;
    for (var i = 0; i < BAD_PREFIXES.length; i++) {
      if (name.indexOf(BAD_PREFIXES[i]) === 0) return true;
    }
    return false;
  }

  function cleanNode(node) {
    if (!node || node.nodeType !== 1 || !node.attributes) return;
    for (var i = node.attributes.length - 1; i >= 0; i--) {
      var a = node.attributes[i];
      if (a && isBad(a.name)) {
        try {
          node.removeAttribute(a.name);
        } catch (_) {}
      }
    }
  }

  function deepClean(root) {
    cleanNode(root);
    if (root && root.querySelectorAll) {
      var all = root.querySelectorAll("*");
      for (var i = 0; i < all.length; i++) cleanNode(all[i]);
    }
  }

  try {
    deepClean(document.documentElement);

    if (typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (
            m.type === "attributes" &&
            m.attributeName &&
            isBad(m.attributeName)
          ) {
            try {
              m.target.removeAttribute(m.attributeName);
            } catch (_) {}
          } else if (m.type === "childList") {
            m.addedNodes.forEach(deepClean);
          }
        }
      });
      obs.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
  } catch (_) {}
})();
