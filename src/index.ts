import {Mercure} from "./Mercure";

async function init() {
    const mercure = new Mercure();
    const hub = await mercure.connect("http://localhost:8123/hub");

    const top1 = await hub.subscribe<string>("topic");
    top1.on((msg) => {
        console.log(msg);
    });
    top1.once((msg) => {
        console.log(msg);
    });
    //top1.publish();

    top1.startListening();
    setTimeout(() => {
        top1.stopListening();
    }, 10000);
}

init();
