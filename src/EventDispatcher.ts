export class EventDispatcher<EventType> {

    public async dispatch(event: EventType): Promise<void> {
        console.log(event);
    }

    public on(listener: (event: EventType) => void) {
        console.log(listener);
    }

    public off(listener: (event: EventType) => void) {
        console.log(listener);
    }

}