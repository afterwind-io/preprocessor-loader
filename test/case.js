module.exports.C_IF_ENDIF = `
// #!if foo === 1
const a = 1;
// #!endif
`;

module.exports.R_IF_ENDIF = `
const a = 1;
`;

module.exports.C_IF_ELSE_ENDIF = `
// #!if foo === 1
const a = 1;
// #!else
const a = 2;
// #!endif
`;

module.exports.R_IF_ELSE_ENDIF = `
const a = 2;
`;
