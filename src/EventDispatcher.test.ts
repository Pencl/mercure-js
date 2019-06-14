import {EventDispatcher} from "./EventDispatcher";

interface IMyEvent {
    message: string;
}

test("it constructs and initializes", (done) => {
    const dispatcher = new EventDispatcher();
    expect(dispatcher).toBeInstanceOf(EventDispatcher);
    done();
});

test("it handles once and on subscriptions correctly", (done) => {
    const onceHandler = jest.fn();
    const onHandler = jest.fn();
    const dispatcher = new EventDispatcher();
    dispatcher.once(onceHandler);
    dispatcher.on(onHandler);
    dispatcher.dispatch(null);
    dispatcher.dispatch(null);

    expect(onceHandler).toHaveBeenCalledTimes(1);
    expect(onHandler).toHaveBeenCalledTimes(2);

    done();
});

test("it forwards messages correctly", (done) => {
    const event: IMyEvent = {
        message: "Test",
    };
    const dispatcher = new EventDispatcher<IMyEvent>();

    dispatcher.on((msg) => {
        expect(msg).toBe(event);
        done();
    });
    dispatcher.dispatch(event);
});

test("it turns handlers off again", (done) => {
    const dispatcher = new EventDispatcher();
    const handler = jest.fn();

    dispatcher.on(handler);
    dispatcher.once(handler);
    dispatcher.off(handler);
    dispatcher.dispatch(null);

    expect(handler).toBeCalledTimes(0);
    done();
});
