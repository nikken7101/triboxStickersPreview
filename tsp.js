'use strict';
var sticker = {};

function getColorsFromUrl() {
    var colors = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        var face = hash[0];
        var color = hash[1];
        if (face == 'U' || face == 'D' || face == 'L' || face == 'F' || face == 'R' || face == 'B') {
            colors[face] = color.replace("%20", " ");
        }
    }
    if (Object.keys(colors).length === 0) {
        return defaultColor;
    } else {
        for (var j = 0; j < faceList.length; j++) {
            if (typeof(colors[faceList[j]]) == "undefined") {
                colors[faceList[j]] = "";
            }
        }
        return colors;
    }
}

function getBodyColorFromUrl() {
    var colors = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (hash[0] == 'bc') {
            if (bodyColorList.indexOf(hash[1]) >= 0) {
                return hash[1];
            } else {
                return "black";
            }
        }
    }
    return "black"
}

function parseInput() {
    var input = $.trim($("#stickerInput").val());
    var splitedInput = input.split("\n");
    var colors = {};
    for (var i = 0, len = splitedInput.length; i < len; i++) {
        var colorPair = splitedInput[i].split(":").map($.trim);
        var face = colorPair[0];
        var color = colorPair[1];
        colors[face] = color;
    }
    return colors
}

function applyColors(colors) {
    for (var face in colors) {
        var color = colors[face];
        var rgba = colorList[color]['rgba'];
        sticker[face].css("background-color", "rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + "," + rgba[3] + ") ");
    }
}

function changeUrl(colors, bc) {
    var query = "?" +
        "U=" + colors["U"] + "&" +
        "D=" + colors["D"] + "&" +
        "L=" + colors["L"] + "&" +
        "F=" + colors["F"] + "&" +
        "R=" + colors["R"] + "&" +
        "B=" + colors["B"] + "&" +
        "bc=" + bc;
    history.pushState(null, null, query);

    $("#twitterShare").html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + location.href + '" data-size="large" data-count="none" data-hashtags="triboxStickersPreview">Tweet</a>');
    twttr.widgets.load()
}

function validateColors(colors) {
    try {
        if (typeof(colors["U"]) == "undefined" ||
            typeof(colors["D"]) == "undefined" ||
            typeof(colors["L"]) == "undefined" ||
            typeof(colors["F"]) == "undefined" ||
            typeof(colors["R"]) == "undefined" ||
            typeof(colors["B"]) == "undefined") {
            return false;
        }

        for (var face in colors) {
            var color = colors[face];
            if (typeof(colorList[color]) == "undefined") {
                return false;
            }
        }
    } catch (e) {
        return false;
    }

    return true;
}

function changeInputForm(colors, bc) {
    var text = "";
    for (var i = 0; i < faceList.length; i++) {
        var face = faceList[i];
        text += face + ": " + colors[face] + "\n"
    }
    $("#stickerInput").val($.trim(text));
    $("#bodyColorSelect").val(bc);
}

function toggleInvalidNotice(isValid) {
    if (isValid) {
        $("#previewButton").prop("disabled", false);
        $("#invalid-notice").hide();
    } else {
        $("#previewButton").prop("disabled", true);
        $("#invalid-notice").show();
    }
}

function applyBodyColor(bc) {
    for (var i = 0, len = bodyColorList.length; i < len; i++) {
        $("g-cube").removeClass(bodyColorList[i]);
    }
    $('g-cube').addClass(bc);
}

$(function () {
    $("#previewButton").click(function () {
        var colors = parseInput();
        var bc = $("#bodyColorSelect").val();
        if (validateColors(colors)) {
            changeUrl(colors, bc);
            changeInputForm(colors, bc);
            $('g-cube').fadeOut(150, function () {
                applyColors(colors);
                applyBodyColor(bc);
            });
            $('g-cube').fadeIn(150);
        }
    });
    sticker["U"] = $(".sticker.orange");
    sticker["D"] = $(".sticker.red");
    sticker["L"] = $(".sticker.green");
    sticker["F"] = $(".sticker.white");
    sticker["R"] = $(".sticker.blue");
    sticker["B"] = $(".sticker.yellow");

    $("#g-cube-container").css("height", $("#g-cube-container").width());

    var colors = getColorsFromUrl();
    var bc = getBodyColorFromUrl();
    changeInputForm(colors, bc);
    var isValid = validateColors(colors);
    toggleInvalidNotice(isValid);
    if (isValid) {
        applyColors(colors);
        applyBodyColor(bc);
    }

    $("#stickerInput").keyup(function () {
        var colors = parseInput();
        var isValid = validateColors(colors);
        toggleInvalidNotice(isValid);
    });

});

// for iOS Safari
$(window).load(function () {
    if (sticker["U"].length == 0) {
        sticker["U"] = $(".sticker.orange");
        sticker["D"] = $(".sticker.red");
        sticker["L"] = $(".sticker.green");
        sticker["F"] = $(".sticker.white");
        sticker["R"] = $(".sticker.blue");
        sticker["B"] = $(".sticker.yellow");
        var colors = getColorsFromUrl();
        var bc = getBodyColorFromUrl();
        changeInputForm(colors, bc);
        var isValid = validateColors(colors);
        toggleInvalidNotice(isValid);
        if (isValid) {
            applyColors(colors);
            applyBodyColor(bc);
        }
    }
});
