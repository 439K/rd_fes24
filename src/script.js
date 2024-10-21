// 初期設定
let audio = new Audio();
let isRepeating = false; // リピート機能のフラグ
const playButton = document.getElementById('play-button');
const repeatButton = document.getElementById('repeat-button');
const seekBar = document.getElementById('seek-bar');
const currentTimeElement = document.querySelector('.current-time');
const totalTimeElement = document.querySelector('.total-time');
const songTitleElement = document.querySelector('.song-title');
const songArtistElement = document.querySelector('.song-artist');

// 初期状態のフッター
songTitleElement.textContent = '未選択';
songArtistElement.textContent = '楽曲を選択してください';

// 各曲の要素を取得してクリックイベントを追加
document.querySelectorAll('.music-item').forEach(item => {
    item.addEventListener('click', function () {
        const songTitle = this.querySelector('p').textContent;
        const songFile = this.querySelector('audio source').getAttribute('src');
        
        // 親要素の `profile-item` から作曲者名を取得
        const composerName = this.closest('.profile-item').querySelector('.profile-details h1').textContent;

        // 曲のタイトルとアーティストを更新
        songTitleElement.textContent = songTitle;
        songArtistElement.textContent = composerName; // 作曲者名をフッターに反映

        // オーディオファイルを新しいものに変更
        audio.src = songFile;
        audio.load();

        // 再生時間やシークバーの初期化
        audio.addEventListener('loadedmetadata', () => {
            totalTimeElement.textContent = formatTime(audio.duration);
            seekBar.max = Math.floor(audio.duration);
        });

        audio.play();
        playButton.querySelector('img').src = '../src/bar/pause.png'; // 一時停止アイコンに切り替え
    });
});

// 再生バーの時間更新処理
audio.addEventListener('timeupdate', () => {
    seekBar.value = Math.floor(audio.currentTime);
    currentTimeElement.textContent = formatTime(audio.currentTime);
});

// 曲が終了したときの処理
audio.addEventListener('ended', () => {
    if (isRepeating) {
        // リピートモードの場合、同じ曲を最初から再生
        audio.currentTime = 0;
        audio.play();
    } else {
        playButton.querySelector('img').src = '../src/bar/play.png'; // 再生アイコンに切り替え
    }
});

// シークバーを操作したときの処理
seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
});

// 再生ボタンの制御
playButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playButton.querySelector('img').src = '../src/bar/pause.png'; // 一時停止アイコンに切り替え
    } else {
        audio.pause();
        playButton.querySelector('img').src = '../src/bar/play.png'; // 再生アイコンに切り替え
    }
});

// リピートボタンの制御
repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    if (isRepeating) {
        repeatButton.querySelector('img').src = '../src/bar/1repeat-on.png'; // リピートオン画像
    } else {
        repeatButton.querySelector('img').src = '../src/bar/1repeat.png'; // リピートオフ画像
    }
});


// 時間フォーマット関数
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
