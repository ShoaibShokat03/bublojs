<?php
function handleApiRequest()
{
    $request = $_SERVER['REQUEST_URI'];
    if (strpos($request, "/api/") !== false) {
        $file = str_replace("/apps/js/bublojs/api/", "", $request);
        return file_get_contents($file);
    }
    return null;
}

$apiResponse = handleApiRequest();
if ($apiResponse !== null) {
    echo $apiResponse;
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A fast and scalable SPA built with a custom vanilla JS framework">
    <meta name="keywords" content="SPA, vanilla JS, fast, scalable, SEO">
    <meta name="robots" content="index, follow">
    <title>BUBLOJS - Modern Vanilla JavaScript SPA Framework</title>
    <link rel="stylesheet" href="./bublo_src/styles/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script type="module" src="./bublo_src/app/main.js"></script>
</head>

<body>
    <div id="app"></div>
</body>

</html>