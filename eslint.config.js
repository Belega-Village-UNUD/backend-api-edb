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
      indent: ["warn", 2],
      semi: ["warn", "always"],
      quotes: ["warn", "double"],

      /** No Secrets Rules**/
      "no-secrets/no-secrets": "warn",

      /** ScanJS rules **/
      "scanjs-rules/accidental_assignment": "warn",
      "scanjs-rules/assign_to_hostname": "warn",
      "scanjs-rules/assign_to_href": "warn",
      "scanjs-rules/assign_to_location": "warn",
      "scanjs-rules/assign_to_onmessage": "warn",
      "scanjs-rules/assign_to_pathname": "warn",
      "scanjs-rules/assign_to_protocol": "warn",
      "scanjs-rules/assign_to_search": "warn",
      "scanjs-rules/assign_to_src": "warn",
      "scanjs-rules/call_Function": "warn",
      "scanjs-rules/call_addEventListener": "warn",
      "scanjs-rules/call_addEventListener_deviceproximity": "warn",
      "scanjs-rules/call_addEventListener_message": "warn",
      "scanjs-rules/call_connect": "warn",
      "scanjs-rules/call_eval": "warn",
      "scanjs-rules/call_execScript": "warn",
      "scanjs-rules/call_hide": "warn",
      "scanjs-rules/call_open_remote=true": "warn",
      "scanjs-rules/call_parseFromString": "warn",
      "scanjs-rules/call_setImmediate": "warn",
      "scanjs-rules/call_setInterval": "warn",
      "scanjs-rules/call_setTimeout": "warn",
      "scanjs-rules/identifier_indexedDB": "warn",
      "scanjs-rules/identifier_localStorage": "warn",
      "scanjs-rules/identifier_sessionStorage": "warn",
      "scanjs-rules/new_Function": "warn",
      "scanjs-rules/property_addIdleObserver": "warn",
      "scanjs-rules/property_createContextualFragment": "warn",
      "scanjs-rules/property_crypto": "warn",
      "scanjs-rules/property_geolocation": "warn",
      "scanjs-rules/property_getUserMedia": "warn",
      "scanjs-rules/property_indexedDB": "warn",
      "scanjs-rules/property_localStorage": "warn",
      "scanjs-rules/property_mgmt": "warn",
      "scanjs-rules/property_sessionStorage": "warn",

      /** no-unsanitized rules **/
      "no-unsanitized/method": "warn",
      "no-unsanitized/property": "warn",

      /** no-secrets rules **/
      "no-secrets/no-secrets": ["warn", { tolerance: 5 }],

      /** prototype-pollution-security-rules rules **/
      "prototype-pollution-security-rules/detect-merge": "warn",
      "prototype-pollution-security-rules/detect-merge-objects": "warn",
      "prototype-pollution-security-rules/detect-merge-options": "warn",
      "prototype-pollution-security-rules/detect-deep-extend": "warn",

      /** no-wildcard-postmessage (NodeJS) rules **/
      "no-wildcard-postmessage/no-wildcard-postmessage": "warn",

      /** nodejs rules **/
      "security-node/non-literal-reg-expr": "off", // To avoid duplicates.
      "security-node/detect-absence-of-name-option-in-exrpress-session": "warn",
      "security-node/detect-buffer-unsafe-allocation": "warn",
      "security-node/detect-child-process": "warn",
      "security-node/detect-crlf": "warn",
      "security-node/detect-dangerous-redirects": "warn",
      "security-node/detect-eval-with-expr": "off", // To avoid dulicates.
      "security-node/detect-html-injection": "warn",
      "security-node/detect-insecure-randomness": "warn",
      "security-node/detect-non-literal-require-calls": "off", // To avoid duplicates.
      "security-node/detect-nosql-injection": "warn",
      "security-node/detect-option-multiplestatements-in-mysql": "warn",
      "security-node/detect-option-rejectunauthorized-in-nodejs-httpsrequest":
        "warn",
      "security-node/detect-option-unsafe-in-serialize-javascript-npm-package":
        "warn",
      "security-node/detect-possible-timing-attacks": "warn",
      "security-node/detect-runinthiscontext-method-in-nodes-vm": "warn",
      "security-node/detect-security-missconfiguration-cookie": "warn",
      "security-node/detect-sql-injection": "warn",
      "security-node/disable-ssl-across-node-server": "warn",

      /** security plugin rules**/
      "security/detect-unsafe-regex": "warn",
      "security/detect-buffer-noassert": "warn",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "warn",
      "security/detect-eval-with-expression": "off", // To avoid duplicates.
      "security/detect-no-csrf-before-method-override": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-object-injection": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "warn",
    },
  },
];
