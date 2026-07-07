document.addEventListener('DOMContentLoaded', function () {

    if (!document.getElementById('textDisplay')) return;

    const startBtn = document.getElementById('startBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const poemText = document.getElementById('textDisplay');
    const authorBtn = document.getElementById('authorBtn');
    const modal = document.getElementById('author-modal');
    const closeModal = document.getElementById('close-modal');

    const poem = `
Пишу тебе письмо на небеса...
Мне остаётся только лишь молиться...
Я, как ребёнок, верю в чудеса
Что смерти нет, а наши души - птицы...

Сейчас не пишут письма "от руки".
Мгновенно долетают смс-ки.
Но хочется услышать мне гудки,
Набрав любимый номер, если честно...

Сынок, я часто плачу по ночам.
А днём живу простой обычной жизнью.
Злюсь на себя, порою, сгоряча,
Что отпустила на войну...мальчишку...

Я верю - долетят на небеса
Моей душой написанные письма...
Пока жива, я верю в чудеса
Что смерти НЕТ! А наши души - птицы!
`;

    let spans = [];
    let index = 0;
    let interval = null;

    // ===== ФУНКЦИЯ ПОЛУЧЕНИЯ АУДИО =====
    function getAudio() {
        // Каждый раз ищем элемент заново
        const audio = document.getElementById('poemAudio');
        if (!audio) {
            console.warn('Аудио-элемент не найден на странице.');
        }
        return audio;
    }

    // ===== ПОДГОТОВКА ТЕКСТА =====
    function prepare() {
        const lines = poem.split('\n');

        poemText.innerHTML = lines.map(line => {
            if (line.trim() === '') {
                return `<div class="line empty"></div>`;
            }
            const words = line.split(/(\s+)/);
            return `<div class="line">
                ${words.map(w => `<span>${w}</span>`).join('')}
            </div>`;
        }).join('');

        spans = poemText.querySelectorAll('span');
    }

    // ===== ЗАПУСК =====
    function start() {
        clearInterval(interval);
        index = 0;
        spans.forEach(s => s.classList.remove('highlight'));

        // ==========================================
        // СУПЕР ФИКС: берем аудио только сейчас
        // ==========================================
        const poemAudio = getAudio();
        if (poemAudio) {
            try {
                poemAudio.currentTime = 0;
                const playPromise = poemAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.log('Автовоспроизведение заблокировано браузером:', error);
                    });
                }
            } catch (e) {
                console.log('Ошибка работы с аудио:', e.message);
            }
        }

        interval = setInterval(() => {
            if (index < spans.length) {
                spans[index].classList.add('highlight');
                index++;
            } else {
                clearInterval(interval);
            }
        }, 260);
    }

    // ===== ПОВТОР =====
    function repeat() {
        clearInterval(interval);
        index = 0;
        spans.forEach(s => s.classList.remove('highlight'));

        prepare();

        const poemAudio = getAudio();
        if (poemAudio) {
            try {
                poemAudio.pause();
                poemAudio.currentTime = 0;
            } catch (e) {
                console.log('Ошибка при работе с аудио:', e.message);
            }
        }

        start();
    }

    // ===== СОБЫТИЯ =====
    startBtn.addEventListener('click', start);
    repeatBtn.addEventListener('click', repeat);

    authorBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // ===== СТАРТ =====
    prepare();
});