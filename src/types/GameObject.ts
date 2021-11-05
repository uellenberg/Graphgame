import {SemiMutable} from "./SemiMutable";

export class GameObject {
    private readonly id: number;

    public x: SemiMutable;
    public y: SemiMutable;
    public width: SemiMutable;
    public height: SemiMutable;
    public rotation: SemiMutable;
    public shape: SemiMutable;

    public constructor(id: number) {
        this.id = id;

        this.x = new SemiMutable("x", this.id, 0);
        this.y = new SemiMutable("y", this.id, 0);
        this.width = new SemiMutable("width", this.id, 1);
        this.height = new SemiMutable("height", this.id, 1);
        this.rotation = new SemiMutable("rotation", this.id, 0);
        this.shape = new SemiMutable("shape", this.id, 0);
    }
}