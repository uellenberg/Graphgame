import {SemiMutable} from "./SemiMutable";

export class GameObject {
    private readonly id: number;

    /**
     * A list of the names of every behavior on this GameObject.
     */
    public behaviors: string[] = [];

    public constructor(id: number) {
        this.id = id;
    }
}