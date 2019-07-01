function copyURL() {
    document.getElementById("input-url").select();
    document.execCommand("copy");
    console.log(location.href)
}

$(document).ready(function () {
    
    var initialOpts = {
        seed: getUrlParameter('seed') || Math.ceil(999999 * Math.random()).toString(),
        mode: getUrlParameter('mode') || 'normal',
        lang: getUrlParameter('lang') || 'name'
    };
    
    history.pushState({}, "seed for card", '?seed=' + initialOpts.seed + '&mode=' + initialOpts.mode);

    console.log(initialOpts.seed)

    $('.seed-link').click(function () {
        $("#input-url").val(location.href);
        console.log(document.getElementById("input-url").value);
        copyURL();
        $("#copied").fadeIn("slow")
        $("#copied").fadeOut("slow")
    });
});