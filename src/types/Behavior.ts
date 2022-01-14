import {getFullVariableName} from "../util";

export class Behavior {
    private readonly name: string;
    //setVal, setInline, setMut
    private parts: Record<0 | 1 | 2, ((id: number, idx: number) => string)[]> = [[], [], [], []];
    private postParts: Record<number, ((id: number, idx: number) => string)[]> = {};
    private helpers: Record<number, string[]> = {};
    private displays: Record<number, string[]> = {};

    private nextId: number = 1;

    public muts: string[] = [];

    public constructor(name: string) {
        this.name = name;
        //Increment and store the id for each gameobject that the behavior is added to.
        this.parts[0].push((id: number) => `selectID!(${id});
        setValSelect!("${name}.id", ${this.nextId++});
        selectID!();`);
    }
    
    /**
     * Add a new part to the behavior.
     */
    public add(val: (id: number, idx: number) => string, layer: 0 | 1 | 2) : void {
        this.parts[layer].push(val);
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
     * Compiles the behavior for a specific object.
     */
    public compile(id: number, values: Record<0 | 1 | 2, string[]>) {
        for (const layer in this.parts) {
            values[layer].push(this.parts[layer].map((part, idx) => part(id, idx)).join("\n"));
        }

        values[2].push(`handleMuts!(${id}, \"${this.name}\");`);
    }

    /**
     * Compiles the post behavior for a specific object.
     */
    public compilePost(id: number, actions: Record<number, string[]>, prefix: string) : void {
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
        for(const priority in this.displays) {
            if(!display.hasOwnProperty(priority)) display[priority] = [];
            display[priority].push(...this.displays[priority]);
        }
    }
}