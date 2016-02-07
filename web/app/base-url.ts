export var BASEURL = findCanonical();

function findCanonical()
{
    var links = document.getElementsByTagName('link');
    for (var i=0; i<links.length;i++) {
        var link = links[i];
        if (link.rel == 'canonical') {
            return link.href;
        }
    }
}
