export class Behavior {
    private readonly name: string;
    private parts: ((id: number, idx: number) => string)[] = [];
    private postParts: Record<number, ((id: number, idx: number) => string)[]> = {};
    private helpers: string[] = [];
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
     * Adds a helper method/variable to this behavior.
     * @param val {string} - is the helper.
     */
    public addHelper(val: string) : void {
        this.helpers.push(val);
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
    public compilePost(id: number, actions: Record<number, string[]>, prefix: string) : void {
        if(!this.finalized) throw new Error("A behavior must be finalized before it can be used!");

        for(const val of this.helpers) {
            if(!actions.hasOwnProperty(-10000)) actions[-10000] = [];
            actions[-10000].push(val);
        }

        //Only register helpers once.
        this.helpers = [];

        for(const key in this.postParts) {
            if(!actions.hasOwnProperty(key)) actions[key] = [];
            actions[key].push(prefix);
            actions[key].push(...this.postParts[key].map((part, idx) => part(id, idx)));
        }
    }
}