/* global browser */
browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === 'saveWord') {
        try {
            const { learnedWords } = await browser.storage.local.get({ learnedWords: [] });
            if (!learnedWords.some(item => item.word.toLowerCase() === message.word.toLowerCase())) {
                learnedWords.push({ word: message.word, translation: message.translation });
                await browser.storage.local.set({ learnedWords });
            }
            return Promise.resolve({ status: 'ok' });
        } catch (err) {
            return Promise.resolve({ status: 'error', error: err });
        }
    }
});
