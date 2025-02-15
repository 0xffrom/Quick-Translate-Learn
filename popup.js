document.addEventListener('DOMContentLoaded', function() {
    const targetLangInput = document.getElementById('targetLang');
    const saveLangBtn = document.getElementById('saveLangBtn');
    const wordsDiv = document.getElementById('words');
    const exportBtn = document.getElementById('exportBtn');
    browser.storage.local.get({ targetLang: 'en' }).then(result => {
        targetLangInput.value = result.targetLang;
    });
    saveLangBtn.addEventListener('click', function() {
        const newLang = targetLangInput.value.trim() || 'en';
        browser.storage.local.set({ targetLang: newLang }).then(() => {
            alert('Target language saved: ' + newLang);
        });
    });
    function updateWordList() {
        browser.storage.local.get({ learnedWords: [] }).then(result => {
            const words = result.learnedWords;
            wordsDiv.innerHTML = '';
            if (words.length === 0) {
                wordsDiv.textContent = 'No saved words.';
                return;
            }
            words.forEach(pair => {
                const div = document.createElement('div');
                div.className = 'word-pair';
                div.innerHTML = '<span class="word">' + pair.word + '</span>: ' + pair.translation;
                wordsDiv.appendChild(div);
            });
        });
    }
    updateWordList();
    exportBtn.addEventListener('click', function() {
        browser.storage.local.get({ learnedWords: [] }).then(result => {
            const words = result.learnedWords;
            if (words.length === 0) {
                alert('No saved words to export.');
                return;
            }
            const exportText = words.map(pair => pair.word + "\t" + pair.translation).join("\n");
            const blob = new Blob([exportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'learned_words.txt';
            a.click();
            URL.revokeObjectURL(url);
            browser.storage.local.set({ learnedWords: [] }).then(() => { updateWordList(); });
            window.open('https://quizlet.com/latest', '_blank');
        });
    });
});
