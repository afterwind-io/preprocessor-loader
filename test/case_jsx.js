module.exports.C_JSX = `
function My_Component(props) {
    return (
        <div>
            {/* I'm a normal single line comment */}
            {/*
                I'm a normal multiple line comment
            */}

            {/* #!debug */}
            <Button>oops</Button>

            <Button
                // #!debug
                onclick={alert('wow!')}
                color="white"
                ></Button>

            {/* #!if stage === 'product' */}
            <Button
                color="red">Ready to go</Button>
            {/*
                #!elseif stage === 'release'
            */}
            <Button
                color="green">Almost there</Button>
            {/*
                Look mom I have a comment!
                #!else
            */}
            {/* There are still some bu... I mean optimizations. */}
            <Button
                color="blue">Still buggy</Button>
            {/* I have a comment too. #!endif */}
            
            <p>I am still alive.</p>
        </div>
    )
}
`;

module.exports.R_JSX = `
function My_Component(props) {
    return (
        <div>
            {/* I'm a normal single line comment */}
            {/*
                I'm a normal multiple line comment
            */}


            <Button
                color="white"
                ></Button>

            {/* There are still some bu... I mean optimizations. */}
            <Button
                color="blue">Still buggy</Button>
            
            <p>I am still alive.</p>
        </div>
    )
}
`;
