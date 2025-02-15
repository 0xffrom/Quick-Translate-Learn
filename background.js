/* global browser */
browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === 'saveWord') {
        try {
            const { learnedWords } = await browser.storage.local.get({ learnedWords: [] });
            if (!learnedWords.some(item => item.word === message.word)) {
                learnedWords.push({ word: message.word, translation: message.translation });
                await browser.storage.local.set({ learnedWords });
            } else {
                console.log('Word already exists:', message.word);
            }
            return Promise.resolve({ status: 'ok' });
        } catch (err) {
            console.error('Error saving word:', err);
            return Promise.resolve({ status: 'error', error: err });
        }
    }
});
