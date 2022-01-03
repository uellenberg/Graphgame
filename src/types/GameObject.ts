import {SemiMutable} from "./SemiMutable";

export class GameObject {
    private readonly id: number;

    /**
     * A list of the names of every behavior on this GameObject.
     */
    public behaviors: string[] = [];

    /**
     * A record of every behavior-specific post action that needs to be output when this object compiles.
     */
    public behaviorPostActions: Record<number, string[]> = [];

    /**
     * A record of all the display properties for this object.
     */
    public displayProperties: Record<number, string[]> = [];

    public constructor(id: number) {
        this.id = id;
    }
}