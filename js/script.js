function copyURL() {
    document.getElementById("input-url").select();
    document.execCommand("copy");
    console.log(location.href)
}

$(document).ready(function () {
    $('.seed-link').click(function () {
        $("#input-url").val(location.href);
        console.log(document.getElementById("input-url").value);
        copyURL();
    });
});