import {EventDispatcher} from "./EventDispatcher";

export class Client {

    private eventMap: {[topic: string]: EventDispatcher<any>};

    private hubUrl: URL;

    constructor(hubUrl: string) {
        this.eventMap = {};
        this.hubUrl = new URL(hubUrl);

        if (!EventSource) {
            // TODO: UsePolyfill
            throw new Error("The EventSource polyfill is not yet available");
        }
    }

    public subscribe<EventType>(forTopic: string): EventDispatcher<EventType> {
        if (this.eventMap.hasOwnProperty(forTopic)) {
            return this.eventMap[forTopic];
        }

        // TODO: update connection

        const dispatcher = new EventDispatcher<EventType>();
        this.eventMap[forTopic] = dispatcher;
        return dispatcher;
    }

    public unSubscribe(forTopic: string) {
        if (!this.eventMap.hasOwnProperty(forTopic)) {
            return;
        }

        // TODO: update connection

        // TODO: notify dispatcher that it got deleted
        delete this.eventMap[forTopic];
    }

    private listensToTopic(topic: string): boolean {
        return this.eventMap.hasOwnProperty(topic);
    }

    private getTopics(): string[] {
        let topics = [];
        for (const topic in this.eventMap) {
            if (!this.listensToTopic(topic)) {
                continue;
            }
            topics.push(topic);
        }
        return topics;
    }

    private async start(): Promise<void> {
        const topics = this.getTopics();
        const url = this.hubUrl.searchParams.
    }

}