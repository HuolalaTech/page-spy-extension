"use strict";

import "./popup.less";
import { getVersion } from "./version";

(function () {
  const defaultValue = {
    "deploy-url": "",
    ssl: "on",
    api: "",
    clientOrigin: "",
    project: "",
    title: "",
    autoRender: "yes",
    rules: "",
    open: "on",
    DataHarbor_open: "off",
    DataHarbor_maximum: 0,
    DataHarbor_saveAs: "indexedDB",
    DataHarbor_caredData: "",
    RRWeb_open: "off",
  };
  const form = document.querySelector("#form");
  const deployUrlEl = document.querySelector("#deploy-url");
  const sslEl = document.querySelector("#enable-ssl");
  const apiEl = document.querySelector("#api");
  const clientOriginEl = document.querySelector("#clientOrigin");
  const projectEl = document.querySelector("#project");
  const titleEl = document.querySelector("#title");
  const autoRenderEl = document.querySelector("#yes");
  const manualRenderEl = document.querySelector("#no");
  const rulesEl = document.querySelector("#rules");
  const openEl = document.querySelector("#enable-open");

  const DataHarbor_openEl = document.querySelector("#DataHarbor_open");
  const DataHarbor_maximumEl = document.querySelector("#DataHarbor_maximum");
  const DataHarbor_saveAsEl = document.querySelector("#DataHarbor_saveAs");
  const DataHarbor_caredDataEl = document.querySelector(
    "#DataHarbor_caredData"
  );
  const RRWeb_openEl = document.querySelector("#RRWeb_open");

  const storage = {
    get: (cb) => {
      chrome.storage.local.get(["pagespy"], (result) => {
        cb(result.pagespy);
      });
    },
    set: (value, cb = () => {}) => {
      chrome.storage.local.set(
        {
          pagespy: value,
        },
        () => {
          cb();
        }
      );
    },
  };

  // 比较两个对象的指定键对应的值是否相同
  const isSameValue = (objA, objB, keys) => {
    return Object.values(keys).every((i) => objA[i] === objB[i]);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const result = {};
    data.forEach((value, key) => {
      result[key] = value.trim();
    });
    storage.get((cache) => {
      const noChanges = isSameValue(cache, result, [
        "deploy-url",
        "api",
        "clientOrigin",
        "project",
        "title",
        "autoRender",
        "DataHarbor_maximum",
        "DataHarbor_saveAs",
        "DataHarbor_caredData",
      ]);
      if (!noChanges) {
        chrome.runtime.sendMessage("remove-cache");
      }
      storage.set(result);
    });
  });

  function setupFormFields(initialValue = defaultValue) {
    const {
      ssl,
      api,
      clientOrigin,
      project,
      title,
      autoRender,
      rules,
      open,
      DataHarbor_open,
      DataHarbor_maximum,
      DataHarbor_saveAs,
      DataHarbor_caredData,
      RRWeb_open
    } = initialValue;
    deployUrlEl.value = initialValue["deploy-url"];
    sslEl.checked = ssl === "on";
    openEl.checked = open === "on";
    apiEl.value = api;
    clientOriginEl.value = clientOrigin;
    projectEl.value = project;
    titleEl.value = title;
    if (autoRender === "yes") {
      autoRenderEl.checked = true;
    } else {
      manualRenderEl.checked = true;
    }
    rulesEl.value = rules;
    DataHarbor_openEl.checked = DataHarbor_open === "on";
    DataHarbor_maximumEl.value = DataHarbor_maximum;
    DataHarbor_saveAsEl.value = DataHarbor_saveAs;
    DataHarbor_caredDataEl.value = DataHarbor_caredData;
    RRWeb_openEl.checked = RRWeb_open === "on";
  }

  function restoreCounter() {
    storage.get((value) => {
      console.log("value:", value);
      if (typeof value === "undefined") {
        storage.set(defaultValue);
        setupFormFields(defaultValue);
      } else {
        setupFormFields(value);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    restoreCounter();
    getVersion();
  });
})();
