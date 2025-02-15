/* global browser */
(function() {
    let popup = null;
    document.addEventListener('mouseup', function(e) {
        if (popup && popup.contains(e.target)) return;
        const selection = window.getSelection().toString().trim();
        if (!selection) return;
        popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.left = e.pageX + 'px';
        popup.style.top = e.pageY + 'px';
        popup.style.backgroundColor = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '8px';
        popup.style.zIndex = 10000;
        popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
        popup.style.maxWidth = '300px';
        popup.textContent = 'Translating...';
        document.body.appendChild(popup);
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + encodeURIComponent(selection);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let translatedText = '';
                if (data && Array.isArray(data[0])) {
                    data[0].forEach(item => { if (item[0]) translatedText += item[0]; });
                }
                popup.innerHTML = '<div><strong>' + selection + '</strong></div><div>' + translatedText + '</div>';
                const learnBtn = document.createElement('button');
                learnBtn.textContent = 'Learn';
                learnBtn.style.marginTop = '5px';
                learnBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    browser.runtime.sendMessage({
                        action: 'saveWord',
                        word: selection,
                        translation: translatedText
                    })
                        .then(response => { console.log('Word saved:', response); })
                        .catch(err => { console.error('Save error:', err); });
                    learnBtn.textContent = 'Saved!';
                    if (window.getSelection) window.getSelection().removeAllRanges();
                    setTimeout(() => { if (popup) { popup.remove(); popup = null; } }, 1000);
                });
                popup.appendChild(learnBtn);
            })
            .catch(err => { popup.textContent = 'Translation error'; console.error(err); });
    });
    document.addEventListener('mousedown', function(e) { if (popup && !popup.contains(e.target)) { popup.remove(); popup = null; } });
})();
