export class Client {

    private hub: URL;

    constructor(hubUrl: string) {
        this.hub = new URL(hubUrl);
    }

    public start() {
        const source = new EventSource(this.hub.href);
        source.onmessage = this.onMessage.bind(this);
        source.onerror = (err: Event) => {
            console.log("error:", err);
        };
    }

    private onMessage(this: Client, message: MessageEvent) {
        console.log(typeof this, "message:", message);
    }

}
