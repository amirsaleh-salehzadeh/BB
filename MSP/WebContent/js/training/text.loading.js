var textnumber = 0;
var numberOfWords = 0;
var numberOfParagraphs = 0;
var paintingWordsTimer;
var colorCode = "green";
var coloredWordCounter = 0;
var readingPadWidth = 0;
var tenPercWidth = 0;
var lastTop = -1;
var noOfRows = 0;

function loadText(textnumber) {
	// textnumber++;
	$("#textContainer").load('text' + textnumber + '.html', function() {
		$("#questionnaireFormDIV").css("display", "none").trigger('create');
		$("#textContainer").trigger("create");
		$("#textContainer").find("p").each(function() {
			var lines = $(this).context.offsetHeight / 20;
		});
		return;
	}).trigger('create');
}