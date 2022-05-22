/**
 * "#!if" nested in "#!if"
 */

module.exports.C_NESTED_IF_IF = `
// #!if foo === 1
foo = 1
    // #!if bar === 1
    bar = 1
    // #!endif
foo_2 = 1
// #!endif
baz = 1
`;

module.exports.R_NESTED_IF_IF_1_1 = `
foo = 1
    bar = 1
foo_2 = 1
baz = 1
`;
module.exports.R_NESTED_IF_IF_1_2 = `
foo = 1
foo_2 = 1
baz = 1
`;
module.exports.R_NESTED_IF_IF_2_1 = `
baz = 1
`;
module.exports.R_NESTED_IF_IF_2_2 = `
baz = 1
`;

/** 
 * "#!if/#!else" nested in "#!if/#!elseif"
 */

module.exports.C_NESTED_IF_ELSE = `
// #!if foo === 1
foo = 1
    // #!if bar === 1
    bar = 1
    // #!else
    bar = 2
    // #!endif
foo_2 = 1
// #!else
foo = 2
    // #!if bar === 1
    bar = 1
    // #!else
    bar = 2
    // #!endif
foo_2 = 2
// #!endif
baz = 1
`;

module.exports.R_NESTED_IF_ELSE_1_1 = `
foo = 1
    bar = 1
foo_2 = 1
baz = 1
`;
module.exports.R_NESTED_IF_ELSE_1_2 = `
foo = 1
    bar = 2
foo_2 = 1
baz = 1
`;
module.exports.R_NESTED_IF_ELSE_2_1 = `
foo = 2
    bar = 1
foo_2 = 2
baz = 1
`;
module.exports.R_NESTED_IF_ELSE_2_2 = `
foo = 2
    bar = 2
foo_2 = 2
baz = 1
`;

/**
 * #!if/#!elseif/#!else nested in #!if/#!elseif/#!else
 */

module.exports.C_NESTED_IF_ELSEIF_ELSE = `
// #!if foo === 1
foo = 1
    // #!if bar === 1
    bar = 1
    // #!elseif bar === 2
    bar = 2
    // #!else
    bar = 3
    // #!endif
foo_2 = 1
// #!elseif foo === 2
foo = 2
    // #!if bar === 1
    bar = 1
    // #!elseif bar === 2
    bar = 2
    // #!else
    bar = 3
    // #!endif
foo_2 = 2
// #!else
foo = 3
    // #!if bar === 1
    bar = 1
    // #!elseif bar === 2
    bar = 2
    // #!else
    bar = 3
    // #!endif
foo_2 = 3
// #!endif
baz = 1
`;

module.exports.R_NESTED_IF_ELSEIF_ELSE_1_1 = `
foo = 1
    bar = 1
foo_2 = 1
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_1_2 = `
foo = 1
    bar = 2
foo_2 = 1
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_1_3 = `
foo = 1
    bar = 3
foo_2 = 1
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_2_1 = `
foo = 2
    bar = 1
foo_2 = 2
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_2_2 = `
foo = 2
    bar = 2
foo_2 = 2
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_2_3 = `
foo = 2
    bar = 3
foo_2 = 2
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_3_1 = `
foo = 3
    bar = 1
foo_2 = 3
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_3_2 = `
foo = 3
    bar = 2
foo_2 = 3
baz = 1
`;
module.exports.R_NESTED_IF_ELSEIF_ELSE_3_3 = `
foo = 3
    bar = 3
foo_2 = 3
baz = 1
`;
