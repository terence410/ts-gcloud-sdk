
export function camelToDash(value: string) {
    return value.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase();
}

export function camelToDotCapitalize(value: string) {
    return value.replace( /([a-z])([A-Z])/g, "$1.$2" ).toUpperCase();
}

export function camelToSnakeCapitalize(value: string) {
    return value.replace( /([a-z])([A-Z])/g, "$1_$2" ).toUpperCase();
}

export function camelToSnakeCapitalizeWithoutUnderscore(value: string) {
    return value.replace( /([a-z])([A-Z])/g, "$1 $2" ).toUpperCase();
}

export function escapeQuotes(value: string) {
    return value.replace(/"/g, "\\\"");
}
