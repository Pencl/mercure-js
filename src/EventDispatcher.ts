export class EventDispatcher<EventType> implements IEventDispatcher<EventType>{

    private listeners: EventHandler<EventType>[];

    private onceListeners: EventHandler<EventType>[];

    constructor() {
        this.listeners = [];
        this.onceListeners = [];
    }

    public async dispatch(event: EventType): Promise<void> {
        for(const listener of this.listeners) {
            try{
                listener(event);
            } catch (e) {
                console.error(e);
            }
        }
        for(const listener of this.onceListeners) {
            try{
                listener(event);
            } catch (e) {
                console.error(e);
            }
        }
        this.onceListeners = [];
    }

    public on(listener: EventHandler<EventType>) {
        this.listeners.push(listener);
    }

    public off(listener: EventHandler<EventType>) {
        this.listeners = this.listeners.filter((handler) => {
            return handler !== listener;
        });
        this.onceListeners = this.onceListeners.filter((handler) => {
            return handler !== listener;
        });
    }

    public once(listener: EventHandler<EventType>) {
        this.onceListeners.push(listener);
    }
}

type EventHandler<EventType> = (event: EventType) => void;

export interface IEventDispatcher<EventType> {
    dispatch(event: EventType): Promise<void>;
    on(listener: (event: EventType) => void): void;
    off(listener: (event: EventType) => void): void;
}