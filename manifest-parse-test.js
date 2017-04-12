var fs = require('fs');
var libxmljs = require("libxmljs");

fs.readFile('/dev/stdin', function (err, data) {
    if (err) {
        throw err;
    }

    // Parse document
    var xmlDoc = libxmljs.parseXmlString(data.toString('utf8'), { noblanks: true });

    // Optain all <StreamIndex> tags and start looking for audio tracks
    streamIndexes = xmlDoc.find('//StreamIndex')
    for (var i = 0, len = streamIndexes.length; i < len; i++) {
        if (streamIndexes[i].attr('Type').value() === "audio") {

            // Only process if we have more than one audio track
            if (streamIndexes[i].attr('QualityLevels').value() >= 2) {
                // console.log("Multiple audio qualities found, need to split");

                // Clone the streamIndex node
                cloned_node = streamIndexes[i].clone();

                // Remove the last QualityLevel from original, and set QualityLevels to 1
                streamIndexes[i].find('.//QualityLevel')[1].remove();
                streamIndexes[i].attr('QualityLevels').value("1");

                // Remove the first qualitylevel from clone, set index to 0 and set QualityLevels 1
                levels = cloned_node.find('.//QualityLevel');
                levels[1].attr('Index').value("0");
                levels[0].remove();
                cloned_node.attr('QualityLevels').value("1");

                // Fix name of cloned node
                cloned_node.attr('Name').value(cloned_node.attr('Name').value() + "_1")

                // Add cloned element after current if channel == 2
                //levels = cloned_node.find('.//QualityLevel');
                //if (levels[0].attr('Channels')==="1"||levels[0].attr('Channels')==="2") {
                //    streamIndexes[i].addNextSibling(cloned_node);
                //}

                // Always add cloned element
                levels = cloned_node.find('.//QualityLevel');
                streamIndexes[i].addNextSibling(cloned_node);
            }
        }
        else if (streamIndexes[i].attr('Type').value() === "video") {
            // Strip any bitrate over 5mbit
            levels = streamIndexes[i].find('.//QualityLevel');
            for (var x = 0, xlen = levels.length; x < xlen; x++) {
                if (parseInt(levels[x].attr('Bitrate').value()) > 5000000) {
                    levels[x].remove();
                }
            }
        }
    }

    // Enable paragraph below to strip f tags
    felements = xmlDoc.find('//f');
    for (var i = 0, len = felements.length; i < len; i++) {
        felements[i].remove()
    }/**/

    process.stdout.write(xmlDoc.toString(true));
});