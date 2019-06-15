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
    const dispatcher = new EventDispatcher<null>();
    dispatcher.once(onceHandler);
    dispatcher.on(onHandler);
    dispatcher.dispatch( null);
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

test("it handles errors in callbacks gracefully", (done) => {
    const dispatcher = new EventDispatcher();
    const errorHandler = () => {
        throw new Error("Something bad happened");
    };
    const handler = jest.fn();
    const errorLogger = console.error;
    console.error = () => {};

    dispatcher.on(handler);
    dispatcher.on(errorHandler);
    dispatcher.on(handler);

    dispatcher.once(handler);
    dispatcher.once(errorHandler);
    dispatcher.once(handler);

    dispatcher.dispatch(null);

    expect(handler).toBeCalledTimes(4);

    console.error = errorLogger;
    done();
});
