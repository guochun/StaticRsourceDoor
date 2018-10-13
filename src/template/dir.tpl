<!DOCTYPE html>
<html lang="zh-Hans">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
    <style>
        body {
            margin: 30px;
        }

        a {
            font-size: 20px;
            display: flex;
            flex-direction: column;
            margin-top: 20px;
            width: fit-content;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
        }

        a:active {
            color: black;
        }
    </style>
</head>

<body>

    {{#each files}}
    <a href="{{../dir}}/{{file}}">[{{icon}}] {{file}}</a>
    {{/each}}
</body>

</html>
