// input_cat & input_mode: relate types
export const MultiDatetimeSelectorInputModeFrom = "from";
export const MultiDatetimeSelectorInputModeTo = "to";
export const MultiDatetimeSelectorInputCatWork = "work";
export const MultiDatetimeSelectorInputCatRest = "rest";

export type MultiDatetimeSelectorInputModeFromType = typeof MultiDatetimeSelectorInputModeFrom;
export type MultiDatetimeSelectorInputModeToType = typeof MultiDatetimeSelectorInputModeTo;
export type MultiDatetimeSelectorInputCatWorkType = typeof MultiDatetimeSelectorInputCatWork;
export type MultiDatetimeSelectorInputCatRestType = typeof MultiDatetimeSelectorInputCatRest;

export type MultiDatetimeSelectorInputModeTypes = MultiDatetimeSelectorInputModeFromType | MultiDatetimeSelectorInputModeToType;
export type MultiDatetimeSelectorInputCatTypes = MultiDatetimeSelectorInputCatWorkType | MultiDatetimeSelectorInputCatRestType;


// user input action: relate types
export type MultiDatetimeSelectorInputTimesType = { [ keys in MultiDatetimeSelectorInputCatTypes ]: { [ keys in MultiDatetimeSelectorInputModeTypes ]: { h: number, m: number } } };

// component props: relate types
export type MultiDatetimeSelectorValuesFormat = {
    type: MultiDatetimeSelectorInputCatTypes,
    title: string,
    isMultiple: boolean,
    submodes: Array < {
        type: MultiDatetimeSelectorInputModeTypes,
        text: string
    }>
}

export type MultiDatetimeSelectorValuesType = Array<MultiDatetimeSelectorValuesFormat>;