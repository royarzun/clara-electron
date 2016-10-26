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


exports.createNodes = createNodes;
