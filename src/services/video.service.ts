import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { createMovie, updateMovieStatus } from '../repositories/movie.repository';

interface Resolution {
    width: number;
    height: number;
    bitrate: number; // in kbps
}

const resolutions: Resolution[] = [
    { width: 1920, height: 1080, bitrate: 2000 }, // 1080p
    { width: 1280, height: 720, bitrate: 1000 }, // 720p
    { width: 854, height: 480, bitrate: 600 }, // 480p
    { width: 640, height: 360, bitrate: 400 }, // 360p
    { width: 256, height: 144, bitrate: 200 }, // 144p
]

export const processVideoForHLS = (
    inputPath: string, 
    outputPath: string, 
    callback: (error: Error | null, masterPlaylist?: string) => void
): void => {

    createMovie(outputPath);

    fs.mkdirSync(outputPath, { recursive: true }); // Create output directory if it doesn't exist

    const masterPlaylist = `${outputPath}/master.m3u8`; // Path to the master playlist file
    const masterContent: string[] = [];
    let processingCount = 0;

    resolutions.forEach((res, index) => {
        const variantOutput = `${outputPath}/${res.height}p`;
        const variantPlaylist = `${variantOutput}/playlist.m3u8`; // Path to the variant playlist file

        fs.mkdirSync(variantOutput, { recursive: true }); // Create variant directory

        ffmpeg(inputPath)
            .outputOptions([
                `-vf scale=w=${res.width}:h=${res.height}`,
                `-b:v ${res.bitrate}k`,
                `-codec:v libx264`,
                `-codec:a aac`,
                `-hls_time 10`,
                `-hls_playlist_type vod`,
                `-hls_segment_filename ${variantOutput}/segment_%03d.ts`
            ])
            .output(variantPlaylist)
            .on('end', () => {
                // When the processing of this variant is done, add it to the master playlist
                masterContent.push(
                    `#EXT-X-STREAM-INF:BANDWIDTH=${res.bitrate * 1000},RESOLUTION=${res.width}x${res.height}\n${res.height}p/playlist.m3u8`
                )
                processingCount++;
                if (processingCount === resolutions.length) {
                    console.log('All variants processed. Writing master playlist.');
                    fs.writeFileSync(masterPlaylist, `#EXTM3U\n${masterContent.join('\n')}`);
                    callback(null, masterPlaylist); // Call the callback with the path to the master playlist

                    updateMovieStatus(outputPath, "COMPLETED");
                }
            })
            .on('error', (err) => {
                console.error(`Error processing ${res.height}p:`, err);
                callback(err); // Call the callback with the error
            })
            .run();
    });
}