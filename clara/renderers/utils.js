function __removeDemoNodes() {
    var elements = document.getElementsByClassName('demo');
    if (elements) {
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
}

function createNodes(title, names, processFunction) {
    document.getElementById('graphs-title').innerHTML = title;
    var section = document.getElementById('graphs-section');
    __removeDemoNodes();
    for (var i = 0; i < names.length; i++) {
        var demoText = `
          <div class="demo">
            <div id="` + names[i] + `-graph" data-servicename="` + title + `"></div>
          </div>`;
        section.insertAdjacentHTML('beforeend', demoText);
    }
    processFunction(title);
}

function getProbableServicesList() {
    yaml = require('js-yaml');
    fs = require('fs');
    // Get document, or throw exception on error
    try {
        console.log(__dirname)
        var doc = yaml.safeLoad(fs.readFileSync(__dirname + '/../../info/services.yml', 'utf8'));
        return doc.services;
    } catch (e) {
        console.log(e);
        return e
    }
}

function getLocalRegistrarAddress() {
    var myip = require('quick-local-ip');
    return 'tcp://' + myip.getLocalIP4() + ':7775';
}

exports.probServices = getProbableServicesList();
exports.createNodes = createNodes;
