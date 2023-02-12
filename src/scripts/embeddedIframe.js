

var desmosIframe = document.getElementById("desmos1");
// console.log(desmosIframe)

// desmosIframe.contentWindow.document.getElementsByTagName("html")

document.querySelectorAll('iframe').forEach( item =>
    console.log(item.contentWindow.document.body.querySelectorAll('a'))
)
// console.log(desmosIframe.contentWindow.document)

// console.log(desmosIframe.contentWindow.document.getElementsByClassName("dcg-center"));

{/* <div class="dcg-thumb" role="slider" tabindex="0" disablescroll="true" style="left:0%" aria-label="&quot;s_peed&quot;" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="0"><div class="dcg-graphic"></div><div class="dcg-center"></div></div> */}