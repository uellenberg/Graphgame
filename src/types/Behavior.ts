import {getFullVariableName} from "../util";

export class Behavior {
    private readonly name: string;
    private parts: ((id: number, idx: number) => string)[] = [];
    private postParts: Record<number, ((id: number, idx: number) => string)[]> = {};
    private helpers: Record<number, string[]> = {};
    private displays: Record<number, string[]> = {};
    private finalized: boolean = false;

    private nextId: number = 1;

    public constructor(name: string) {
        this.name = name;
        //Increment and store the id for each gameobject that the behavior is added to.
        this.parts.push((id: number) => `selectID!(${id});
        setValSelect!("${name}.id", ${this.nextId++});
        selectID!();`);
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
     * @param priority {number} - is the priority of the helper.
     */
    public addHelper(val: string, priority: number) : void {
        if(!this.helpers.hasOwnProperty(priority)) this.helpers[priority] = [];
        this.helpers[priority].push(val);
    }

    /**
     * Adds a display property to this behavior.
     * @param val {string} - is the display property.
     * @param priority {number} - is the priority of the display property.
     */
    public addDisplay(val: string, priority: number) : void {
        if(!this.displays.hasOwnProperty(priority)) this.displays[priority] = [];
        this.displays[priority].push(val);
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

        for(const priority in this.helpers) {
            if(!actions.hasOwnProperty(priority)) actions[priority] = [];
            actions[priority].push(...this.helpers[priority]);
        }

        //Only register helpers once.
        this.helpers = {};

        for(const key in this.postParts) {
            if(!actions.hasOwnProperty(key)) actions[key] = [];
            actions[key].push(prefix);
            actions[key].push(...this.postParts[key].map((part, idx) => part(id, idx)));
        }
    }

    public compileDisplay(display: Record<number, string[]>) : void {
        if(!this.finalized) throw new Error("A behavior must be finalized before it can be used!");

        for(const priority in this.displays) {
            if(!display.hasOwnProperty(priority)) display[priority] = [];
            display[priority].push(...this.displays[priority]);
        }
    }
}