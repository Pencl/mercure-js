import {Mercure} from "./Mercure";
import {Hub} from "./Hub";

it("Checks for valid urls", () => {
    const m = new Mercure();

    expect(m.connect("invlid")).rejects.toMatch("error");
    expect(m.connect("http://localhost:80")).resolves.toBeInstanceOf(Hub);
});