
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

export function stripAnsi(value: string) {
    return value.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}
