import { Request, Response } from "express";
import { processVideoForHLS } from "../services/video.service";
import fs from 'fs';

export const uploadVideoController = async(req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const videoPath = req.file.path;
    const outputPath = `outputs/${Date.now()}`;

    processVideoForHLS(videoPath, outputPath, (err, masterPlaylistPath) => {
        if (err) {
            res
            .status(500)
            .json({ 
                success: false, 
                message: 'Error processing video'
            });
            return;
        }

        fs.unlink(videoPath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting uploaded video:', unlinkErr);
            } else {
                console.log('Uploaded video deleted successfully');
            }
        });

        res.status(200).json({
            success: true,
            message: 'Video processed successfully',
            data: {
                masterPlaylistPath
            }
        });

    });
}