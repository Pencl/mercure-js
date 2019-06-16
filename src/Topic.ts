import {EventDispatcher, IEventDispatcher} from "./EventDispatcher";

export class Topic<EventType> extends EventDispatcher<BaseEvent<EventType>> implements ITopic<EventType> {

    private hub: URL;

    // TODO: send jwt
    //private jwt: string | undefined;

    private topic: string;

    private eventSource: EventSource | null = null;

    constructor(hub: string, topic: string, jwt?: string) {
        super();
        this.hub = new URL(hub);
        this.hub.searchParams.append("topic", topic);
        this.topic = topic;
        jwt;
        //this.jwt = jwt;
    }

    get listening(): boolean {
        return !!this.eventSource && this.eventSource.readyState == this.eventSource.OPEN;
    }

    get name(): string {
        return this.topic;
    }

    public async startListening(): Promise<void> {
        // TODO: use EventSource polyfill
        // TODO: set JWT Cookie
        this.eventSource = new EventSource(this.hub.href);
        this.eventSource.onmessage = this.onEventSourceMessage.bind(this);
        return new Promise<void>((resolve, reject) => {
            if (!this.eventSource) {
                reject("The Eventsource has gone away");
                return;
            }
            this.eventSource.onopen = () => {
                resolve();
            }
        });
    }

    public async stopListening(): Promise<void> {
        if (!this.eventSource) {
            return;
        }
        this.eventSource.close();
        this.eventSource = null;
    }

    private onEventSourceMessage(this: Topic<EventType>, evt: MessageEvent) {
        let data: EventType;
        console.log(evt);
        try {
            data = JSON.parse(evt.data);
        } catch (e) {
            console.warn(
                "Malformed message payload:",
                evt.data,
                `message: ${evt.lastEventId}`,
                e
            );
            return;
        }

        this.dispatch({
            data,
            id: evt.lastEventId,
            topic: this.name,
        });
    }

}

export interface ITopic<EventType> extends IEventDispatcher<BaseEvent<EventType>> {
    name: string;
    listening: boolean;
    startListening(): Promise<void>;
    stopListening(): Promise<void>;
}


export interface BaseEvent<EventType> {
    data: EventType;
    id: string;
    topic: string;
}