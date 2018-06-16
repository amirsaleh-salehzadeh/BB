function openMWpopup() {
	$("#distractionPopup").popup("open").trigger("create");
}

function openReasonPopup() {
	$("#distractionPopup").on("popupafterclose", function() {
		setTimeout(function() {
			$("#MWpopup").popup("open");
		}, 100);
	});
	$("#distractionPopup").popup("close");
}

function openDayDreamingPopup() {
	$("#MWpopup").on("popupafterclose", function() {
		setTimeout(function() {
			$("#dreamingPopup").popup("open");
		}, 100);
	});
	$("#MWpopup").popup("close");
}