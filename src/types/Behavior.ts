export class Behavior {
    private readonly name: string;
    private parts: ((id: number, idx: number) => string)[] = [];
    private postParts: Record<number, ((id: number, idx: number) => string)[]> = {};
    private finalized: boolean = false;

    public constructor(name: string) {
        this.name = name;
    }
    
    /**
     * Add a new part to the behavior.
     */
    public add(val: (id: number, idx: number) => string) : void {
        this.parts.push(val);
    }

    /**
     * Add a new post part to the behavior.
     */
    public addPost(val: (id: number, idx: number) => string, priority: number) : void {
        if(!this.postParts.hasOwnProperty(priority)) this.postParts[priority] = [];
        this.postParts[priority].push(val);
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
        return this.parts.map((part, idx) => part(id, idx)).join("\n");
    }

    /**
     * Compiles the post behavior for a specific object.
     */
    public compilePost(id: number) : string {
        if(!this.finalized) throw new Error("A behavior must be finalized before it can be used!");
        return Object.keys(this.postParts).sort().map(idx => this.postParts[idx].map((part, idx) => part(id, idx)).join("\n")).join("\n");
    }
}