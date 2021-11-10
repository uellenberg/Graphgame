export class Behavior {
    private readonly name: string;
    private parts: ((id: number) => string)[] = [];
    private postParts: ((id: number) => string)[] = [];
    private finalized: boolean = false;

    public constructor(name: string) {
        this.name = name;
    }
    
    /**
     * Add a new part to the behavior.
     */
    public add(val: (id: number) => string) : void {
        this.parts.push(val);
    }

    /**
     * Add a new post part to the behavior.
     */
    public addPost(val: (id: number) => string) : void {
        this.postParts.push(val);
    }

    /**
     * Mark the behavior as finalized.
     */
    public finalize() : void {
        this.finalized = true;
    }

    /**
     * Compiles the behavior for a specific object.
     */
    public compile(id: number) : string {
        if(!this.finalized) throw new Error("A behavior must be finalized before it can be used!");
        return this.parts.map(part => part(id)).join("\n");
    }

    /**
     * Compiles the post behavior for a specific object.
     */
    public compilePost(id: number) : string {
        if(!this.finalized) throw new Error("A behavior must be finalized before it can be used!");
        return this.postParts.map(part => part(id)).join("\n");
    }
}