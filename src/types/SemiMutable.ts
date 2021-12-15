export class SemiMutable {
    private readonly varName: string;
    private readonly id: number;
    private val: number;
    private mutable: boolean = false;
    private inlined: boolean = false;
    private incrementID: number = 0;
    private variableIDs: number[] = [];

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
        if(this.inlined && !this.mutable) throw new Error("An inlined variable cannot be marked as mutable!");
        this.mutable = true;
    }

    /**
     * Returns if this is mutable.
     */
    public isMut(): boolean {
        return this.mutable;
    }

    /**
     * Makes a SemiMutable inlined.
     */
    public inline(): void {
        if(!this.inlined && this.mutable) throw new Error("A mutable variable cannot be marked as inlined!");
        this.mutable = true;
        this.inlined = true;
    }

    /**
     * Returns if this is inlined.
     */
    public isInline(): boolean {
        return this.inlined;
    }

    /**
     * Sets the value.
     */
    public set(val: number): void {
        if(this.mutable) throw new Error("A mutable variable can only be set from an action. Consider setting its value before making it mutable.");
        this.val = val;
    }

    /**
     * Gets the value. If supplied, an offset is added to the increment.
     */
    public get(offset: number = 0): string {
        if(this.mutable) return this.name(false, offset) + (this.incrementID+offset > 0 && !this.variableIDs.includes(this.incrementID+offset) ? "()" : "");
        return this.val.toString();
    }

    /**
     * Gets the variable name. If supplied, an offset is added to the increment.
     */
    public name(noIncrement: boolean = false, offset: number = 0): string {
        if(!this.mutable) throw new Error("mut() must be called before the name can be accessed.");
        return "g_raphgameobject" + this.id + this.varName + (noIncrement ? "" : Math.max(0, this.incrementID+offset) || "");
    }

    /**
     * Increment the value's identifier.
     * @param variable {boolean} - is a value indicating whether this increment should be treated as a variable and not a function.
     */
    public increment(variable: boolean = false): void {
        if(!this.mutable) throw new Error("A variable must be marked as mutable before it can be used in an action!");
        this.incrementID++;

        if(variable) this.variableIDs.push(this.incrementID);
    }

    /**
     * Decrement the value's identifier.
     */
    public decrement(): void {
        if(!this.mutable) throw new Error("A variable must be marked as mutable before it can be used in an action!");
        this.incrementID--;
    }
}