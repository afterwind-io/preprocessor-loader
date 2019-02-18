module.exports.C_JS = `
// I'm a normal single line comment
/* I'm a normal multiple line comment */

/*
 * I'm a normal multiple line comment, with real multi-line
 */
function wow() {
    // #!debug
    let oops;

    /* #!debug */
    let discarded;

    // #!if stage === 'product'
    const status = ready_to_go;
    /*
     * #!elseif stage === 'release'
     */
    const status = almost_there;
    /*
     * Look mom I have a comment!
     * #!else
     */
    // There are still some bu... I mean optimizations.
    const status = still_buggy;
    // I have a comment too. #!endif

    let i_am_still_alive;
}
`;

module.exports.R_JS = `
// I'm a normal single line comment
/* I'm a normal multiple line comment */

/*
 * I'm a normal multiple line comment, with real multi-line
 */
function wow() {


    // There are still some bu... I mean optimizations.
    const status = still_buggy;

    let i_am_still_alive;
}
`;
