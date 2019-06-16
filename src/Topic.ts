import {EventDispatcher, IEventDispatcher} from "./EventDispatcher";

export class Topic<EventType> extends EventDispatcher<BaseEvent<EventType>> implements ITopic<EventType> {

    private hub: URL;

    // TODO: send jwt when subscribing
    private jwt: string | undefined;

    private topic: string;

    private eventSource: EventSource | null = null;

    constructor(hub: string, topic: string, jwt?: string) {
        super();
        this.hub = new URL(hub);
        this.hub.searchParams.append("topic", topic);
        this.topic = topic;
        this.jwt = jwt;
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

    public async publish(message: EventType, options: IPublishOptions): Promise<void> {
        if(!this.jwt) {
            console.warn("Publishing without a valid jwt-token is not allowed. No message will be sent");
            return;
        }

        const body = new FormData();
        body.append("data", JSON.stringify(message));
        body.append("topic", this.topic);

        if(options.id) {
            body.append("id", options.id);
        }

        if (options.retry) {
            body.append("retry", `${options.retry}`);
        }

        const response = await fetch(this.hub.origin, {
            headers: {
                Authorization: `Bearer ${this.jwt}`
            },
            body: body,
        });

        if (!response.ok) {
            throw new Error(`Error posting message: ${response.statusText}`);
        }
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

export interface IPublishOptions {
    id?: string;
    // TODO: ad target support (Issue #)
    // targets?: string[];
    retry?: number;
    // TODO: add type support (SSE event types)
    // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Fields
    // type?: string;
}