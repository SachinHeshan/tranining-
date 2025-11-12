<?php
mb_internal_encoding("UTF-8");
$page = '';


if(isset($_POST["page"])) {
	$page = $_POST["page"];
}

echo <<<EOD
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../../css/default.css"></link>
	</head>
	<body style="height:500px;width:70%">
		<h1>最終ページ</h1>
		<dt>page</dt><dd>$page</dd>
	</body>
</html>
EOD;
?>