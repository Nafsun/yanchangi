navigator.serviceWorker.register('worker.js').catch((e) => console.log("Error: ", e));

navigator.serviceWorker.ready.then((reg) => {
    console.log("Service Worker is Ready");
}).catch((e) => console.log("Error: ", e));