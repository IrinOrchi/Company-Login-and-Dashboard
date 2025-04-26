export interface GenericAPIRequest {
    collectionName: string;
    projections:    string[];
    filters:        Filter[];
    orderBy:        OrderBy[];
    page:           number;
    pageSize:       number;
}

export interface Filter {
    operator:   string;
    attributes: Attribute[];
}

export interface Attribute {
    fieldName:        string;
    equalityOperator: string;
    value:            string;
    valueType:        string;
}

export interface OrderBy {
    key:   string;
    value: boolean;
}
