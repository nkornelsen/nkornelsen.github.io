/// <reference lib="webworker" />

const wasmPromise = import("../../../vector-to-mesh-uv/pkg");

addEventListener('message', ({ data }) => {
  wasmPromise.then(wasm => {

    let output = wasm.generate_images(data.fileResult, data.selectedOutput, data.width, data.height);
    postMessage(output);
  }).catch(err => console.error(err));
});
