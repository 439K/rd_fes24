// 初期設定
let audio = new Audio();
let isRepeating = false; // リピート機能のフラグ
const playButton = document.getElementById('play-button');
const repeatButton = document.getElementById('repeat-button');
const seekBar = document.getElementById('seek-bar');
const currentTimeElement = document.querySelector('.current-time');
const totalTimeElement = document.querySelector('.total-time');
const footerSongTitleElement = document.querySelector('.footer-song-title'); // フッターの曲タイトル
const songArtistElement = document.querySelector('.song-artist');

// 初期状態のフッターに「未選択」と「楽曲を選択してください」を表示
footerSongTitleElement.textContent = '未選択';
songArtistElement.textContent = '楽曲を選択してください';

// 各曲の要素を取得してクリックイベントを追加
document.querySelectorAll('.music-item').forEach(item => {
    const button = item.querySelector('.music-button');
    const audioElement = item.querySelector('audio');
    
    button.addEventListener('click', function () {
        // 再生中の曲を押した場合の処理
        if (button.classList.contains('playing')) {
            if (!audio.paused) {
                audio.pause();
                button.textContent = '一時停止中'; // ボタンのテキストを「一時停止中」に変更
                playButton.querySelector('img').src = 'src/bar/play.png'; // 再生アイコンに切り替え
            } else {
                audio.play();
                button.textContent = '再生中'; // 再生を再開したら「再生中」に変更
                playButton.querySelector('img').src = 'src/bar/pause.png'; // 一時停止アイコンに切り替え
            }
            return; // ここで処理を終了し、再生中の曲をリロードしない
        }

        const songTitle = item.querySelector('.song-title').textContent;
        const songFile = audioElement.querySelector('source').getAttribute('src');
        
        // 親要素の `profile-item` から作曲者名を取得
        const composerName = item.closest('.profile-item').querySelector('.profile-details h1').textContent;

        // フッターの曲タイトルとアーティストを更新
        footerSongTitleElement.textContent = songTitle;  // フッターに曲タイトルを反映
        songArtistElement.textContent = composerName;    // フッターに作曲者名を反映

        // 他のボタンの状態をリセット
        document.querySelectorAll('.music-button').forEach(btn => {
            btn.textContent = '再生';
            btn.classList.remove('playing');
            btn.style.background = '#f4fabc'; // デフォルトのボタンカラー
        });

        // このボタンの状態を更新
        button.textContent = '再生中';
        button.classList.add('playing');
        button.style.background = '#ffcc00'; // 再生開始時のボタンの色
        audio.play();
        
        // オーディオファイルを新しいものに変更
        audio.src = songFile;
        audio.load();

        // 再生時間やシークバーの初期化
        audio.addEventListener('loadedmetadata', () => {
            totalTimeElement.textContent = formatTime(audio.duration);
            seekBar.max = Math.floor(audio.duration);
        });

        audio.play();
        playButton.querySelector('img').src = 'src/bar/pause.png'; // 一時停止アイコンに切り替え
    });
});

// 再生バーの時間更新処理
audio.addEventListener('timeupdate', () => {
    seekBar.value = Math.floor(audio.currentTime);
    currentTimeElement.textContent = formatTime(audio.currentTime);

    // 再生中のボタンの色を進行に応じて変化させる
    const playingButton = document.querySelector('.music-button.playing');
    if (playingButton) {
        const progress = (audio.currentTime / audio.duration) * 100;
        playingButton.style.background = `linear-gradient(to right, #ffcc00 ${progress}%, #cccccc ${progress}%)`; // 進捗色を#ffcc00に変更
    }
});

// 曲が終了したときの処理
audio.addEventListener('ended', () => {
    if (isRepeating) {
        // リピートモードの場合、同じ曲を最初から再生
        audio.currentTime = 0;
        audio.play();
    } else {
        playButton.querySelector('img').src = 'src/bar/play.png'; // 再生アイコンに切り替え
        // 再生中ボタンの状態を元に戻す
        const playingButton = document.querySelector('.music-button.playing');
        if (playingButton) {
            playingButton.textContent = '再生';
            playingButton.style.background = '#f4fabc'; // デフォルトカラーに戻す
            playingButton.classList.remove('playing');
        }
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
        playButton.querySelector('img').src = 'src/bar/pause.png'; // 一時停止アイコンに切り替え
    } else {
        audio.pause();
        playButton.querySelector('img').src = 'src/bar/play.png'; // 再生アイコンに切り替え
    }

    // 再生/一時停止に応じてボタンのテキストも変更
    const playingButton = document.querySelector('.music-button.playing');
    if (playingButton) {
        if (audio.paused) {
            playingButton.textContent = '一時停止中'; // 一時停止中に変更
        } else {
            playingButton.textContent = '再生中'; // 再生中に変更
        }
    }
});

// リピートボタンの制御
repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    if (isRepeating) {
        repeatButton.querySelector('img').src = 'src/bar/1repeat-on.png'; // リピートオン画像
    } else {
        repeatButton.querySelector('img').src = 'src/bar/1repeat.png'; // リピートオフ画像
    }
});

// スペースキーまたはEnterキーで再生/一時停止をトグル
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault(); // デフォルトの動作（スクロールなど）を防ぐ

        if (audio.paused) {
            audio.play();
            playButton.querySelector('img').src = 'src/bar/pause.png'; // 一時停止アイコンに切り替え
        } else {
            audio.pause();
            playButton.querySelector('img').src = 'src/bar/play.png'; // 再生アイコンに切り替え
        }

        // 再生/一時停止に応じてボタンのテキストも変更
        const playingButton = document.querySelector('.music-button.playing');
        if (playingButton) {
            if (audio.paused) {
                playingButton.textContent = '一時停止中'; // 一時停止中に変更
            } else {
                playingButton.textContent = '再生中'; // 再生中に変更
            }
        }
    }

    // rキーが押された場合、リピートのオン/オフを切り替える
    if (event.code === 'KeyR') {
        isRepeating = !isRepeating;  // リピート状態をトグル
        if (isRepeating) {
            repeatButton.querySelector('img').src = 'src/bar/1repeat-on.png'; // リピートオン画像に切り替え
        } else {
            repeatButton.querySelector('img').src = 'src/bar/1repeat.png'; // リピートオフ画像に切り替え
        }
    }
});

// 時間フォーマット関数
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
