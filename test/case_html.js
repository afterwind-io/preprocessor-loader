module.exports.C_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Document</title>
</head>
<body>
    <!-- I am a normal single line comment -->
    <!--
        I am a normal multiple line comment
    -->

    <!-- #!debug -->
    <p>oops</p>

    <!-- I am a inline commented directive! #!debug -->
    <p>discarded</p>

    <!--
        I am a multiline commented directive!
        #!debug
    -->
    <p>Discarded</p>

    <!-- #!if stage === 'product' -->
    <script>alert('Ready to go.')</script>
    <!--
        #!elseif stage === 'release'
    -->
    <script>alert('Almost there.')</script>
    <!--
        Look mom I have a comment!
        #!else
    -->
    <script>alert('There are still some bu... I mean optimizations.')</script>
    <!-- I have a comment too. #!endif -->

    <p>I am still alive.</p>    
</body>
</html>
`;

module.exports.R_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Document</title>
</head>
<body>
    <!-- I am a normal single line comment -->
    <!--
        I am a normal multiple line comment
    -->




    <script>alert('There are still some bu... I mean optimizations.')</script>

    <p>I am still alive.</p>    
</body>
</html>
`;
