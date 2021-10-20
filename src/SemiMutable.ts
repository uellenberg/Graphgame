export class SemiMutable {
    private readonly varName: string;
    private readonly id: number;
    private val: number;
    private mutable: boolean = false;

    /**
     * Creates a SemiMutable, which stores an immutable value until it is made mutable.
     * Once it is made mutable, it gets converted to a variable, and all mutations can
     * only be done from Desmos.
     * @param varName {string} - is the variable name of this variable.
     * @param id {number} - is the ID of the GameObject that this is attached to.
     * @param val {number} - is the default value.
     */
    public constructor(varName: string, id: number, val: number) {
        this.varName = varName;
        this.id = id;
        this.val = val;
    }

    /**
     * Makes a SemiMutable mutable.
     */
    public mut(): void {
        if(this.mutable) throw new Error("Only set a variable as mutable once!");
        this.mutable = true;
    }

    /**
     * Returns if this is mutable.
     */
    public isMut(): boolean {
        return this.mutable;
    }

    /**
     * Sets the value.
     */
    public set(val: number): void {
        if(this.mutable) throw new Error("A mutable variable can only be set from an action. Consider setting its value before making it mutable.");
        this.val = val;
    }

    /**
     * Gets the value.
     */
    public get(): string {
        if(this.mutable) return this.name();
        return this.val.toString();
    }

    /**
     * Gets the variable name.
     */
    public name(): string {
        if(!this.mutable) throw new Error("mut() must be called before the name can be accessed.");
        return "g_raphgameobject" + this.id + this.varName;
    }
}