const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { spawnWithPipe, checkBounds, GetAudioError, ffprobeTempfile } = require('./util');
const { mp3Path, tempMp3Path, infoPath } = require('./paths');

const logger = require('../logger')('RADIO', 'info');


if (!fs.existsSync(mp3Path)) {
    logger.info('MP3 path not exists, creating');

    fs.mkdirSync(mp3Path, { recursive: true });
}

if (!fs.existsSync(tempMp3Path)) {
    logger.info('Temp MP3 path not exists, creating');

    fs.mkdirSync(tempMp3Path, { recursive: true });
}

if (!fs.existsSync(infoPath)) {
    logger.info('Info path not exists, creating');

    fs.mkdirSync(infoPath, { recursive: true });
}

function getHash(buffer) {
    const hasher = crypto.createHash('sha256');
    hasher.update(buffer);

    const hash = hasher.digest('hex');

    return hash;
}

async function checkIsAdded(songHash) {
    return fs.existsSync(path.join(mp3Path, songHash))
}

async function getSavedSongInfo(songHash) {
    if (!checkIsAdded(songHash)) {
        throw new Error('song not found');
    }

    const songInfoPath = path.join(infoPath, songHash);
    const songInfo = JSON.parse(await fsp.readFile(songInfoPath));

    return songInfo
}

function getSongStream(songHash, isTempSong) {
    const songMp3Path = path.join((isTempSong ? tempMp3Path : mp3Path), songHash);
    const stream = fs.createReadStream(songMp3Path);
    return stream
}

async function ffprobe_getAudioInfo(audioBuffer, audioFileName) {
    const respBuf = await ffprobeTempfile(audioBuffer);    

    const json = JSON.parse(respBuf.toString());
    if (!json.format) {
        throw new GetAudioError('empty response (stream error)');
    }

    const sanProps = {};

    if (json.streams[0].codec_name !== 'mp3') {
        throw new GetAudioError('the file is not mp3 stream');
    }

    // use metadata tags if present
    if (json.format?.tags?.title && json.format?.tags?.artist) {
        sanProps.title = `${json.format?.tags?.artist} - ${json.format?.tags?.title}`.slice(0, 64);
    } else {
        sanProps.title = audioFileName.slice(0, 32);
    }

    const sampleRate = json.streams[0].sample_rate;
    if (!checkBounds(+sampleRate, 8000, 96000)) {
        throw new GetAudioError('malformed sample rate');
    }

    const bitrate = json.streams[0].bit_rate;
    if (!checkBounds(+bitrate, 32_000, 320_000)) {
        throw new GetAudioError('malformed bitrate');
    }

    // const channels = json.streams[0].channels;
    // // for some reason it is already a number
    // if (channels !== 2) {
    //     throw new GetAudioError('only 2 channel audio is supported');
    // }

    // ffmpeg will convert it to 2channel anyway
    const channels = 2;

    const duration = json.format.duration;
    if (!checkBounds(+duration, 1, 60 * 7)) {
        throw new GetAudioError('track is too short or too long (<1s or >7min)');
    }

    Object.assign(sanProps, {
        sampleRate: +sampleRate,
        bitrate: +bitrate,
        channels,
        duration: +duration
    });

    return sanProps;
}

async function addMp3(songBuffer, songInfo) {
    const { isOneTime, hash } = songInfo;

    const outPath = path.join((isOneTime ? tempMp3Path : mp3Path), hash);

    await fsp.writeFile(outPath, songBuffer);
}

async function delMp3(songHash, isTemp){
    const mp3FilePath = path.join(isTemp ? tempMp3Path : mp3Path, songHash);
    
    // unlink and rm does not work ...
    await spawnWithPipe('rm', [mp3FilePath], null);
}

async function cliRm(){

}

async function clearTemp() {
    logger.info('Clearing temp folder...');

    const files = fs.readdirSync(tempMp3Path).map((p) => path.join(tempMp3Path, p));
    for (let file of files) {
        try {
            await fsp.unlink(file);
        } catch (error) {
            logger.error(`Cannot unlink temp file ...${file.slice(-20)}: ${error.message}`);
        }
    }
}
clearTemp();

module.exports = {
    getHash,
    getSavedSongInfo,
    ffprobe_getAudioInfo,
    addMp3,
    delMp3,
    getSongStream
}