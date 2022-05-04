// This file contains general helpers for navigation/history tests.
// The goal is to make tests more imperative and ordered, instead of requiring lots of nested
// callbacks and jumping back and forth.

window.setupAndWaitForIframe = async (url = "/common/blank.html") => {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  document.body.append(iframe);

  await waitForIframeLoad(iframe);

  return iframe;
};

window.setupAndWaitForSrcdocIframe = async () => {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = `<script>window.parent.postMessage("srcdoc ready", "*")</scr` + `ipt>`;
  document.body.append(iframe);

  assert_equals(await waitForMessage(iframe.contentWindow), "srcdoc ready");

  return iframe;
};

window.waitForIframeLoad = iframe => {
  return new Promise(resolve => {
    iframe.addEventListener("load", () => resolve(), { once: true });
  });
};

window.waitForMessage = expectedSource => {
  return new Promise(resolve => {
    window.addEventListener("message", ({ source, data }) => {
      if (source === expectedSource) {
        resolve(data);
      }
    });
  });
};

window.failOnMessage = expectedSource => {
  return new Promise((_, reject) => {
    window.addEventListener("message", ({ source, data }) => {
      if (source === expectedSource) {
        reject(new Error(`Received message "${data}" but expected to receive no message`));
      }
    });
  });
};
