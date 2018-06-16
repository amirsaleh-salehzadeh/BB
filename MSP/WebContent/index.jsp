<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>CCI Demo</title>
<link rel="icon" type="image/png" href="images/th.jpg">
<link rel="stylesheet"
	href="css/themes/default/jquery.mobile.icons.min.css">
<link rel="stylesheet"
	href="css/themes/default/jquery.mobile.structure-1.4.5.min.css">
<link rel="stylesheet"
	href="css/themes/default/jquery.mobile.icons-1.4.5.min.css">
<link rel="stylesheet" href="css/training.webgazer.css">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/training.progress.bars.css">
<link rel="stylesheet" href="css/themes/default/theme-classic.css">
<!-- <script src="js/training/precision_store_points.js"></script> -->
<script async="async" type="text/javascript"
	src="js/webGazer/webgazer.js"></script>
<script src="js/jquery.js"></script>
<script src="js/jquery.mobile-1.4.5.min.js"></script>
<script src="js/training/highlight.words.js"></script>
<script src="js/training/text.loading.js"></script>
<script src="js/training/main.js"></script>
<script src="js/webGazer/precision.js"></script>
<script src="js/training/calibration.js"></script>
<script src="js/training/precision_calculation.js"></script>
<script src="js/training/popup.mind.wandering.js"></script>
<script src="js/training/sweetalert.min.js"></script>
<script src="js/training/resize_canvas.js"></script>
<script type="text/javascript"
	src="js/voiceRecorder/voice.training.stream.js"></script>
<script type="text/javascript" src="js/training/labeling.reading.js"></script>
<script type="text/javascript" src="js/training/stream.data.receive.js"></script>
</head>
<body>
	<div data-role="page" id="mainPage" data-theme="b">
		<div data-role="header" data-fullscreen="true"
			data-position-fixed="true" data-position="fixed">
			<div data-role="controlgroup" data-type="horizontal"
				style="margin-left: 75px; margin-top: 5px;">
				<a href="#" data-role="button"><img alt="battery"
					src="images/batt.png" width="44%"></a> <a href="#"
					data-role="button" style="color: green;" id="battVal">--%</a> <a
					href="#" data-role="button" id="hs1" class="horseShoes"
					style="color: white;">TP9</a> <a href="#" data-role="button"
					id="hs2" class="horseShoes" style="color: white;">Fp1</a><a
					href="#" data-role="button" id="hs3" class="horseShoes"
					style="color: white;">&nbsp;</a> <a href="#" data-role="button"
					id="hs4" class="horseShoes" style="color: white;">Fp2</a> <a
					href="#" data-role="button" id="hs5" class="horseShoes"
					style="color: white;">TP10</a> <a href="#leftSidePanel"
					data-role="button" id="leftSideMenuBTN" role="button"
					class="ui-btn ui-icon-bars ui-btn-icon-notext ui-shadow ui-corner-all">&nbsp;</a>
				<a href="#" data-role="button" onclick="Restart()"
					class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-eye">Calibrate</a>
				<a href="#" data-role="button"
					class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-eye"
					onclick="eyeTrackerPS()" data-icon="eye">Eye Tracker
					Pause/Start</a><a href="#" data-role="button"
					onclick="connectToHeadband()"
					class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-eye">Connect</a>
				<a href="#" data-role="button" onclick="readingStart()"
					class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-arrow-d-r">Start</a>
				<a href="#" data-role="button" onclick="readingPause()"
					class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-eye">Pause</a>
				<a href="#" data-role="button" onclick="finishRecording()"
					class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-eye">End</a>
				<a href="#" data-role="button" style="padding: 0;"> <img alt="blink"
					id="blinkContainer" style="visibility: hidden;"
					src="images/eye.png" width="63%">
				</a> <a href="#" data-role="button" style="padding: 0; margin: 0;"><img
					alt="" src="images/th.jpg" style="width: 15%;"> CCI <span
					id="timerSpan"></span></a>
			</div>
		</div>
		<div data-role="panel" data-position="left" data-display="overlay"
			id="leftSidePanel" class="ui-bar"></div>
		<div role="main" class="ui-content" id="pageContents" data-theme="c">
			<canvas id="plotting_canvas" width="100%" height="100%"
				style="position: fixed; left: 0; right: 0; top: 0; bottom: 0;"></canvas>
			<div class="ui-block-solo" id="textContainer"></div>
			<a href="#" data-role="button" role="button"
				style="position: fixed; bottom: 11px; right: 11px;"
				class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-btn-icon-left ui-icon-star"
				onclick="openMWpopup()">Action</a>
		</div>
		<div data-role="footer" id="footerBar" data-position="fixed"
			class="ui-bar">
			<div class="ui-grid-c">
				<div class="ui-block-a">
					<div class="ui-block-solo">
						<span id="noOfWords"></span>&nbsp;Words
					</div>
					<div class="ui-block-solo">
						<span id="speadOfReading"></span>&nbsp;words/min
					</div>
					<div class="ui-block-solo">
						<span id="noOfLines"></span>&nbsp;Lines
					</div>
				</div>
				<div class="ui-block-b">
					<div class="ui-block-solo">
						<span id="noiseEnvPrediction"></span>
					</div>
					<div class="ui-block-solo">
						Distracted By&nbsp;<span id="speadOfReading">Cell Phone</span>
					</div>
					<div class="ui-block-solo">
						<span id="noOfLines">Speaking with Someone/Reading</span>
					</div>
				</div>
				<div class="ui-block-c">
					<div class="ui-block-solo">
						<span id="noiseEnvPrediction">Happy/Sleepy/Tired</span>
					</div>
					<div class="ui-block-solo">
						<span id="speadOfReading">Male/Female</span>
					</div>
					<div class="ui-block-solo">
						<span id="noOfLines"></span>
					</div>
				</div>
				<div class="ui-block-d">
					<div class="hprogress large" style="background-color: #FF0000;">
						<div class="hprogress-bar slideInDown" role="progressbar"
							aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"
							id="RNNPrediction"></div>
						<div class="text-center p-absolute">
							<i class="fa">RNN</i>
						</div>
					</div>
					<div class="hprogress large" style="background-color: #FF0000;">
						<div class="hprogress-bar slideInDown" role="progressbar"
							aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"
							id="ANNPrediction"></div>
						<div class="text-center p-absolute">
							<i class="fa">ANN</i>
						</div>
					</div>
					<div class="hprogress large" style="background-color: #FF0000;">
						<div class="hprogress-bar slideInDown" role="progressbar"
							aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"
							id="SVMPrediction"></div>
						<div class="text-center p-absolute">
							<i class="fa">SVM</i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="helpModal" data-role="popup">
			<div class="ui-block-solo">
				<img src="images/th.jpg" width="64" height="64"
					alt="webgazer demo instructions">Eye Tracking Calibration
			</div>
			<div class="modal-footer">
				<button id="closeBtn" type="button" class="btn btn-default"
					data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" data-dismiss="modal"
					onclick="Restart()">Calibrate</button>
			</div>
		</div>
		<div id="distractionPopup" data-role="popup">
			<a href="#" data-rel="back"
				class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			<div class="ui-block-solo">
				<img src="images/th.jpg" width="64" height="64"
					alt="webgazer demo instructions"> Has Your Mind Wandered?
			</div>
			<fieldset data-role="controlgroup" data-type="horizontal">
				     <a href="#" onclick="openReasonPopup()"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-check">Yes</a>
				    <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-right ui-icon-back"
					data-rel="back">No</a>
			</fieldset>
		</div>
		<div id="MWpopup" data-role="popup">
			<a href="#" data-rel="back"
				class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			<div class="ui-block-solo">
				<img src="images/th.jpg" width="64" height="64"
					alt="webgazer demo instructions"> What was the reason?
			</div>
			<fieldset data-role="controlgroup" data-type="horizontal">
				<a href="#" onclick="openReasonPopup()"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-phone">Cell
					Phone</a>     <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-cloud"
					onclick="openDayDreamingPopup()">Day Dreaming</a>  <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-user">Someone
					else</a>  <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-check">My
					choice</a>  <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-back"
					data-rel="back">Back</a>
			</fieldset>
		</div>
		<div id="dreamingPopup" data-role="popup">
			<a href="#" data-rel="back"
				class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>
			<div class="ui-block-solo">
				<img src="images/th.jpg" width="64" height="64"
					alt="webgazer demo instructions">
			</div>
			<fieldset data-role="controlgroup" data-type="horizontal">
				<legend>What you were dreaming about?</legend>
				<a href="#" onclick="openReasonPopup()"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-arrow-l">About
					Past</a><a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-arrow-r"
					onclick="openDayDreamingPopup()">About Future</a>  <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-user">A
					Task I Should Do</a>  <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-check">Some
					Ideas Related To Text</a>  <a href="#"
					class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-back"
					data-rel="back">Back</a>
			</fieldset>
		</div>
		<form id="dataClassificationLabels">
			<!-- 		MIND WANDERING -->
			<input type="hidden" name="MW" id="MW" value="0"
				class="classificationLabelValue">
			<!-- 		MIND WANDERING -->
			<input type="hidden" name="G" id="gender" value="1"
				class="classificationLabelValue">
			<!-- 		DISTRACTION REASON -->
			<input type="hidden" name="DR" id="dr" value="0"
				class="classificationLabelValue">
			<!-- 		MOOD -->
			<input type="hidden" name="M" id="mood" value="0"
				class="classificationLabelValue">
		</form>



		<!-- 		CALIBRATION DIV -->



		<div class="calibrationDiv">
			<input type="button" class="Calibration" id="Pt1"
				style="display: none;" data-role="none"> <input
				type="button" class="Calibration" id="Pt2" style="display: none;"
				data-role="none"> <input type="button" class="Calibration"
				id="Pt3" style="display: none;" data-role="none"> <input
				type="button" class="Calibration" id="Pt4" style="display: none;"
				data-role="none"> <input type="button" class="Calibration"
				id="Pt5" style="display: none;" data-role="none"> <input
				type="button" class="Calibration" id="Pt6" style="display: none;"
				data-role="none"> <input type="button" class="Calibration"
				id="Pt7" style="display: none;" data-role="none"> <input
				type="button" class="Calibration" id="Pt8" style="display: none;"
				data-role="none"> <input type="button" class="Calibration"
				id="Pt9" style="display: none;" data-role="none">
		</div>
	</div>
</body>
</html>