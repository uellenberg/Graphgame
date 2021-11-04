import {GameObject} from "../GameObject";
import {Behavior} from "../Behavior";
import {SemiMutable} from "../SemiMutable";

export interface TemplateState {
    graphgame: {
        objects: {
            [key: number]: GameObject
        },
        behaviors: {
            [key: number]: Behavior
        },
        actions: {
            [key: string]: string
        },
        finalActions: string[],
        finalized: boolean
    }
}