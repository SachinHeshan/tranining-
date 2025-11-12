<?php
mb_internal_encoding("UTF-8");
$flash_problem_num_list = '';
$game_problem_num_list = '';
$page = '';
$mprint = '';
$type = '';

if(isset($_POST["flash_problem_num_list"])) {
	$flash_problem_num_list = '<dt>flash_problem_num_list</dt><dd>'. $_POST["flash_problem_num_list"].'</dd>';
}
if(isset($_POST["game_problem_num_list"])) {
	$game_problem_num_list = '<dt>game_problem_num_list</dt><dd>'. $_POST["game_problem_num_list"].'</dd>';
}
if(isset($_POST["page"])) {
	$page = $_POST["page"];
}
if(isset($_POST["mprint"])) {
	$mprint = $_POST["mprint"];
}
if(isset($_POST["type"])) {
	$type = $_POST["type"];
}
echo <<<EOD
<div class="center width-400">
	<h3>ログを送るためのページ</h3>
	$flash_problem_num_list
	$game_problem_num_list
	<dt>page</dt><dd>$page</dd>
	<dt>mprint</dt><dd>$mprint</dd>
	<dt>type</dt><dd>$type</dd>
</div>
EOD;
?>