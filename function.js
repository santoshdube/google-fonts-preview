/** code by webdevtrick ( https://webdevtrick.com) **/
const content = document.querySelector('#content');
const fontListElement = document.querySelector('#fonts');
const copyBtn = document.querySelector('#copy-this-font');
const controls_selectedFont = document.querySelector('.selected-font');
let fontListFragment = document.createDocumentFragment();


fetch('https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyD2XlgdSV2aMaFApwYwRZPGty_5PDSUaZA')
  .then((r) => r.json())
  .then((fontsObject) => {
    for (font of fontsObject.items) {
      let fontFamily = font.family;
      let li = document.createElement('li');
      li.classList.add('font');
      li.setAttribute('data-value', fontFamily);
      li.setAttribute('tabindex', 0);
      li.innerText = fontFamily;
      li.style.fontFamily = fontFamily;

      fontListFragment.appendChild(li);
    }

    fontListElement.appendChild(fontListFragment);

  
    let chunkedFonts = chunk(fontsObject.items, 12);

    let importStatements = chunkedFonts
      .map((chunkedFontsArr) => {
        return `@import "https://fonts.googleapis.com/css?family=${chunkedFontsArr
          .map((f) => f.family)
          .join('|')}"`;
      })
      .join(';');

    let fontsStyle = document.createElement('style');
    fontsStyle.type = 'text/css';
    fontsStyle.innerHTML = importStatements;
    document.getElementsByTagName('head')[0].appendChild(fontsStyle);
  });

fontListElement.addEventListener('click', (e) => {
  if (isFontListItem(e.srcElement)) {
    let li = e.srcElement;
    let fontFamily = li.dataset.value;
    content.style.fontFamily = fontFamily;
    selectedFont(fontFamily);
    copyButton(fontFamily);
    e.stopPropagation();
  }
});

fontListElement.addEventListener('keyup', (e) => {
  if (e.keyCode == 9 && isFontListItem(e.target)) document.activeElement.click();
});

function isFontListItem(clickedElm) {
  return clickedElm.classList.contains('font');
}

function chunk(ar, size) {
  let buffer = [];
  return ar.reduce((acc, item, i) => {
    let isLast = i === ar.length - 1;

    if (buffer.length === size) {
      let theChunk = [...buffer];
      buffer = [item];
      return [...acc, theChunk];
    } else {
      buffer.push(item);
      if (isLast) {
        return [...acc, buffer];
      } else {
        return acc;
      }
    }
  }, []);
}

function searchFonts() {
  var input, filter, font, i, txtValue;
  input = document.querySelector("#font-search");
  filter = input.value.toUpperCase();
  font = document.getElementsByTagName("li");
  for (i = 0; i < font.length; i++) {
      txtValue = font[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          font[i].style.display = "";
      } else {
          font[i].style.display = "none";
      }
  }
}

function selectedFont(fontName) {
  controls_selectedFont.innerText = fontName;
}

function checkSpace(font) {
  return font.replace(/\s/g, '+');
}

function copyButton(fontName) { 
  copyBtn.addEventListener('click',function() {
   
    let copiedFont = checkSpace(fontName);
    var el = document.createElement('textarea');
    el.value = `<link href="https://fonts.googleapis.com/css?family=${copiedFont}" rel="stylesheet">`
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    
    copyBtn.innerHTML = `Copied`
    setTimeout(function() {
      copyBtn.innerHTML = `Copy Font`
    }, 500)
  })
}


function init() {
  controls_selectedFont.innerText = 'Please select a font...';
}
init();