<?php
mb_internal_encoding("UTF-8");
$again_sco_url = "";

if(isset($_POST["again_sco_url"])) {
	$again_sco_url = $_POST["again_sco_url"];
}

echo <<<EOD
<div class="center width-400">
	<h3>学習ログを送るためのページ</h3>
	<dt>again_sco_url</dt><dd>$again_sco_url</dd>
</div>
EOD;
?>