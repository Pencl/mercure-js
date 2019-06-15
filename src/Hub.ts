import {ITopic, Topic} from "./Topic";

export class Hub implements IHub {

    private hub: string;

    // TODO: move to jwt lib or use own type
    private jwt: string | undefined;

    constructor(hub: string, jwt?: string) {
        this.hub = hub;
        this.jwt = jwt;
    }

    public subscribe<EventType>(name: string): ITopic<EventType> {
        return new Topic(this.hub, name, this.jwt);
    }

    /**
     * Ping the mercure server to ensure url and credentials are ok and server is alive
     * This method uses the 'ping' topic which is not covered by the standard
     */
    public async ping(): Promise<boolean> {
        const fetchOptions: RequestInit = {};
        if (this.jwt) {
            fetchOptions.headers = {
                Authorization: `Bearer: ${this.jwt}`,
            };
        }

        const hubUrl = new URL(this.hub);
        // TODO: not use the ping topic if jwt is set. Instead extract one topic from the token and if none is set, expect a 401 unstead of 'ok'
        hubUrl.searchParams.append("topic", "ping");

        try {
            // TODO: use fetch polyfill
            return (await window.fetch(hubUrl.href, fetchOptions)).ok;
        } catch (_) {
            return false;
        }
    }
}

export interface IHub {
    subscribe<EventType>(name: string): ITopic<EventType>
    ping(): Promise<boolean>
}