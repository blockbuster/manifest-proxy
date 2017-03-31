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

                // Remove the first qualitylevel from orignal, set index to 0 and set QualityLevels 1
                levels = cloned_node.find('.//QualityLevel');
                levels[1].attr('Index').value("0");
                levels[0].remove();
                cloned_node.attr('QualityLevels').value("1");

                // Fix name of cloned node
                cloned_node.attr('Name').value(cloned_node.attr('Name').value() + "_1")

                // Add cloned element after current
                streamIndexes[i].addNextSibling(cloned_node);
            }
        }
    }

    // Enable paragraph below to strip f tags
    /*felements = xmlDoc.find('//f');
    for (var i = 0, len = felements.length; i < len; i++) {
        felements[i].remove()
    }/**/

    process.stdout.write(xmlDoc.toString(true));
});