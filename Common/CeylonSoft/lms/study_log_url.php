<?php
mb_internal_encoding("UTF-8");
$flashProblemNum = "";
$flashAnswer = "";
$flashSuccess = "";
$flash_count = "";

$gameProblemNum = "";
$gameAnswer = "";
$gameSuccess = "";
$game_count = "";

$game_clear = "";

$type = "";
$isJudged = "";

if(isset($_POST["flash_problem_num"])) {
	$flashProblemNum = $_POST["flash_problem_num"];
}
if(isset($_POST["flash_answer"])) {
	$flashAnswer = $_POST["flash_answer"];
}
if(isset($_POST["flash_success"])) {
	$flashSuccess = $_POST["flash_success"];
}
if(isset($_POST["flash_count"])) {
	$flash_count = $_POST["flash_count"];
}

if(isset($_POST["game_problem_num"])) {
	$gameProblemNum = $_POST["game_problem_num"];
}
if(isset($_POST["game_answer"])) {
	$gameAnswer = $_POST["game_answer"];
}
if(isset($_POST["game_success"])) {
	$gameSuccess = $_POST["game_success"];
}
if(isset($_POST["game_count"])) {
	$game_count = $_POST["game_count"];
}

if(isset($_POST["game_clear"])) {
	$game_clear = $_POST["game_clear"];
}

if(isset($_POST["type"])) {
	$type = $_POST["type"];
}
echo <<<EOD
<div class="center width-400">
	<h3>学習ログを送るためのページ</h3>
	<dt>flash_problem_num</dt><dd>$flashProblemNum</dd>
	<dt>flash_answer</dt><dd>$flashAnswer</dd>
	<dt>flash_success</dt><dd>$flashSuccess</dd>
	<dt>flash_count</dt><dd>$flash_count</dd>
	<dt>game_problem_num</dt><dd>$gameProblemNum</dd>
	<dt>game_answer</dt><dd>$gameAnswer</dd>
	<dt>game_success</dt><dd>$gameSuccess</dd>
	<dt>game_count</dt><dd>$game_count</dd>
	<dt>game_clear</dt><dd>$game_clear</dd>
	<dt>type</dt><dd>$type</dd>
</div>
EOD;
?>