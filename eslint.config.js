const pluginSecurity = require("eslint-plugin-security");
const jsoncExtend = require("eslint-plugin-jsonc");
const html = require("eslint-plugin-html");
const scanJS = require("eslint-plugin-scanjs-rules");
const noUnsanitized = require("eslint-plugin-no-unsanitized");
const noWildCardPostMessage = require("eslint-plugin-no-wildcard-postmessage");
const pollutionSecurityRules = require("eslint-plugin-prototype-pollution-security-rules");
const noSecrets = require("eslint-plugin-no-secrets");
const security = require("eslint-plugin-security");
const securityNode = require("eslint-plugin-security-node");
const prettier = require("eslint-config-prettier");

module.exports = [
  ...jsoncExtend.configs["flat/recommended-with-jsonc"],
  pluginSecurity.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 8,
      sourceType: "module",
    },
    ignores: ["package-lock.json"],
    settings: {
      "html/html-extensions": [".html", ".htm"],
    },
    plugins: {
      "no-secrets": noSecrets,
      html: html,
      // Standard Rules
      "scanjs-rules": scanJS,
      "no-unsanitized": noUnsanitized,
      "no-wildcard-postmessage": noWildCardPostMessage,
      "prototype-pollution-security-rules": pollutionSecurityRules,
      "no-secrets": noSecrets,
      // NodeJS Rules
      security: security,
      "security-node": securityNode,
    },
    rules: {
      semi: [2, "always"],
      quotes: [2, "double"],

      /** No Secrets Rules**/
      "no-secrets/no-secrets": "error",

      /** ScanJS rules **/
      // "scanjs-rules/accidental_assignment": "error",
      // "scanjs-rules/assign_to_hostname": "warn",
      // "scanjs-rules/assign_to_href": "error",
      // "scanjs-rules/assign_to_location": "error",
      // "scanjs-rules/assign_to_onmessage": "error",
      // "scanjs-rules/assign_to_pathname": "error",
      // "scanjs-rules/assign_to_protocol": "error",
      // "scanjs-rules/assign_to_search": "error",
      // "scanjs-rules/assign_to_src": "error",
      // "scanjs-rules/call_Function": "warn",
      // "scanjs-rules/call_addEventListener": "warn",
      // "scanjs-rules/call_addEventListener_deviceproximity": "error",
      // "scanjs-rules/call_addEventListener_message": "error",
      // "scanjs-rules/call_connect": "warn",
      // "scanjs-rules/call_eval": "error",
      // "scanjs-rules/call_execScript": "error",
      // "scanjs-rules/call_hide": "error",
      // "scanjs-rules/call_open_remote=true": "error",
      // "scanjs-rules/call_parseFromString": "error",
      // "scanjs-rules/call_setImmediate": "error",
      // "scanjs-rules/call_setInterval": "error",
      // "scanjs-rules/call_setTimeout": "warn",
      // "scanjs-rules/identifier_indexedDB": "error",
      // "scanjs-rules/identifier_localStorage": "error",
      // "scanjs-rules/identifier_sessionStorage": "error",
      // "scanjs-rules/new_Function": "error",
      // "scanjs-rules/property_addIdleObserver": "error",
      // "scanjs-rules/property_createContextualFragment": "error",
      // "scanjs-rules/property_crypto": "error",
      // "scanjs-rules/property_geolocation": "error",
      // "scanjs-rules/property_getUserMedia": "error",
      // "scanjs-rules/property_indexedDB": "error",
      // "scanjs-rules/property_localStorage": "error",
      // "scanjs-rules/property_mgmt": "error",
      // "scanjs-rules/property_sessionStorage": "error",

      /** no-unsanitized rules **/
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error",

      /** no-secrets rules **/
      "no-secrets/no-secrets": ["warn", { tolerance: 5 }],

      /** prototype-pollution-security-rules rules **/
      "prototype-pollution-security-rules/detect-merge": "warn",
      "prototype-pollution-security-rules/detect-merge-objects": "warn",
      "prototype-pollution-security-rules/detect-merge-options": "warn",
      "prototype-pollution-security-rules/detect-deep-extend": "warn",

      /** no-wildcard-postmessage (NodeJS) rules **/
      "no-wildcard-postmessage/no-wildcard-postmessage": "error",

      /** nodejs rules **/
      "security-node/non-literal-reg-expr": "off", // To avoid duplicates.
      "security-node/detect-absence-of-name-option-in-exrpress-session":
        "error",
      "security-node/detect-buffer-unsafe-allocation": "error",
      "security-node/detect-child-process": "error",
      "security-node/detect-crlf": "warn",
      "security-node/detect-dangerous-redirects": "error",
      "security-node/detect-eval-with-expr": "off", // To avoid dulicates.
      // "security-node/detect-helmet-without-nocache": "warn",
      "security-node/detect-html-injection": "error",
      "security-node/detect-insecure-randomness": "error",
      "security-node/detect-non-literal-require-calls": "off", // To avoid duplicates.
      "security-node/detect-nosql-injection": "error",
      "security-node/detect-option-multiplestatements-in-mysql": "error",
      "security-node/detect-option-rejectunauthorized-in-nodejs-httpsrequest":
        "error",
      "security-node/detect-option-unsafe-in-serialize-javascript-npm-package":
        "error",
      "security-node/detect-possible-timing-attacks": "warn",
      "security-node/detect-runinthiscontext-method-in-nodes-vm": "error",
      "security-node/detect-security-missconfiguration-cookie": "error",
      "security-node/detect-sql-injection": "error",
      "security-node/disable-ssl-across-node-server": "error",

      /** security plugin rules**/
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-eval-with-expression": "off", // To avoid duplicates.
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-object-injection": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "error",
    },
  },
];
