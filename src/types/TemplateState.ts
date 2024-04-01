import {GameObject} from "./GameObject";
import {Behavior} from "./Behavior";
import {SemiMutable} from "./SemiMutable";
import {TemplateArgs} from "logimat";

export interface TemplateState {
    logimat: {
        files: string[]
    };
    graphgame: {
        objects: {
            [key: number]: GameObject
        },
        behaviors: {
            [key: string]: Behavior
        },
        actions: {
            [key: string]: string
        },
        finalActions: string[],
        finalized: boolean,
        lastObjectBehaviorId: number,
        lastObjectBehaviorArgs: TemplateArgs,
        postActions: ((state: TemplateState) => string)[],
        currentObjectId: number,
        postInit: boolean,
        prefabs: ((id: number, args: TemplateArgs) => string)[],
        toIncrement: SemiMutable,
        currentBehavior: string,
        currentPrefab: string,
        currentObject: number,
        nextObjectId: number,
        nextVariableId: number,
        customName: string | null,
        customDisplay: string | null,
        globalDefaultDisplay: string | null,
    };
}