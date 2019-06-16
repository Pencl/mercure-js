import {Hub, IHub} from "./Hub";

export class Mercure {

    async connect(hub: string, jwt?: string): Promise<IHub> {
        try {
            new URL(hub);
        } catch (_) {
            throw new Error("The given Hub-URL is not a valid url");
        }

        // TODO: check jwt
        return new Hub(hub, jwt);
    }

}