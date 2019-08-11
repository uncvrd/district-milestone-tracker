const { google } = require('googleapis');
const functions = require('firebase-functions');
var moment = require('moment');
var mjml = require('mjml');
const sgMail = require('@sendgrid/mail');
import { Video } from './models/video.model';
import { User } from './models/user.model';

const admin = require('firebase-admin');
admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

var db = admin.firestore();

const youtubeAPI = google.youtube({
    version: 'v3',
    auth: functions.config().google.key,
});

const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '512MB'
}

export const milestoneTrackerV2 = functions.runWith(runtimeOpts).https.onRequest(async (req: any, res: any) => {

    console.log('hi');

    try {
        let usersQuery = await db.collection('users').get();

        let users: User[] = usersQuery.docs.map((doc: any) => {
            return doc.data();
        });

        for (const user of users) {
            const youtubeVideos: Video[] | undefined = await getPlaylistVideos(user.uploadPlaylistId);
            const videoIds: string[] = youtubeVideos.map((video) => {
                return video.videoId
            });

            const youtubeVideoStats: Video[] | undefined = await getVideoStats(videoIds);

            let uploadedVideos: Video[] = [];

            youtubeVideos.forEach((video, index) => {
                uploadedVideos.push(Object.assign({}, video, youtubeVideoStats[index]))
            })

            if (user.milestones.length > 0) {
                let fsQuery = await db.collection('uploads')
                    .doc(user.uid)
                    .collection('videos')
                    .get();

                let fsVideos: Video[] = fsQuery.docs.map((doc: any) => {
                    return doc.data();
                });

                let newMilestones: Video[] = [];
                var newMilestoneBatch = db.batch();

                for (const uploadedVid of uploadedVideos) {
                    let matchedFsVid: Video | undefined = fsVideos.find(v => v.videoId === uploadedVid.videoId);

                    if (matchedFsVid) {

                        let goal: any = uploadedVid.views;
                        var closestMilestone: string = user.milestones.reduce((prev: any, curr: any) => {
                            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                        });

                        if (((uploadedVid.views || "0") >= closestMilestone) && ((matchedFsVid.views || "0") <= closestMilestone)) {

                            var vidUpdateRef = db.collection('uploads')
                                .doc(user.uid)
                                .collection('videos')
                                .doc(matchedFsVid.videoId)

                            // set new view count in fs
                            await vidUpdateRef.set({
                                views: uploadedVid.views
                            }, { merge: true });

                            uploadedVid.date = moment.utc().unix();
                            uploadedVid.milestone = closestMilestone;

                            var newMilestonRef = db.collection('recent-milestones')
                                .doc(user.uid)
                                .collection('videos')
                                .doc(uploadedVid.videoId);

                            newMilestoneBatch.set(newMilestonRef, uploadedVid);
                            newMilestones.push(uploadedVid);
                        }
                    } else {
                        // vid doesn't exist in fs, add it now for tracking
                        var vidCreateRef = db.collection('uploads')
                            .doc(user.uid)
                            .collection('videos')
                            .doc(uploadedVid.videoId);

                        await vidCreateRef.set({
                            ...uploadedVid
                        })
                    }
                }

                if (newMilestones.length > 0) {

                    try {
                        await newMilestoneBatch.commit();
                        await sendEmail(user, newMilestones);
                    } catch (error) {
                        console.log(error);
                    }

                }

            }
        }
    } catch (error) {
        console.log(error);
    }

    res.end();
});

var videos: Video[] = [];
var videoStats: Video[] = [];

async function getPlaylistVideos(playlistId: string, pageToken = null): Promise<Video[]> {
    try {
        const res = await youtubeAPI.playlistItems.list({
            part: 'snippet',
            playlistId: playlistId,
            maxResults: 50,
            pageToken: pageToken
        });

        const mappedVideos: Video[] = res.data.items.map((item: any) => {
            console.log(item.snippet);
            return {
                title: item.snippet.title,
                thumbnail: getThumbnailURL(item.snippet.thumbnails),
                videoId: item.snippet.resourceId.videoId
            }
        })

        videos.push(...mappedVideos);

        if ('nextPageToken' in res.data) {
            return await getPlaylistVideos(playlistId, res.data.nextPageToken)
        } else {
            return videos;
        }
    } catch (error) {
        console.log(error)
        return new Promise((resolve) => {
            resolve([] as Video[])
        })
    }
}

var minId = 0;
var maxId = 50;

async function getVideoStats(videoIds: string[]): Promise<Video[]> {

    const videoIdLength = videoIds.length;
    const subsetIds = videoIds.slice(minId, maxId);

    try {
        const res = await youtubeAPI.videos.list({
            part: 'statistics',
            id: subsetIds.join(","),
            maxResults: 50
        });

        const mappedVideoStats: Video[] = res.data.items.map((item: any) => {
            return {
                videoId: item.id,
                views: item.statistics.viewCount
            }
        });

        videoStats.push(...mappedVideoStats);

        const diff = videoIdLength - (maxId + 1);

        if (diff > 0) {
            minId += 50;
            maxId += 50;
            return await getVideoStats(videoIds);
        } else {
            return videoStats;
        }
    } catch (error) {
        console.log(error)
        return new Promise((resolve) => {
            resolve([] as Video[])
        })
    }

}

async function sendEmail(user: User, emailVideos: Video[]) {
    const msg = {
        to: user.email,
        from: 'support@uncvrd.co',
        subject: 'YouTube Milestone Update',
        html: formatEmailHtml(user, emailVideos),
    };

    try {
        return await sgMail.send(msg);
    } catch (error) {

    }
}

function formatEmailHtml(user: User, emailVideos: Video[]): string {

    var emailBody = "";

    emailVideos.forEach((vid: Video) => {
        emailBody += `
		<mj-section padding="10px 0" background-color="white">
		<!-- Left image -->
		<mj-column>
		  <mj-image href="https://youtu.be/${vid.videoId}" width="200px" src="${vid.thumbnail}" />
		</mj-column>
		<!-- right paragraph -->
		<mj-column>
		  <mj-text font-size="20px" align="center" color="#626262">
			${vid.title}
		  </mj-text>
		  <mj-text font-size="16px" align="center" color="#ff0000">
			🎉 ${vid.milestone} Views</mj-text>
		</mj-column>
	  </mj-section>`
    })

    const htmlOutput = mjml(`<mjml>
	<mj-body>
	  <mj-section background-color="#f0f0f0">
		<mj-column>
		  <mj-text align="center" font-style="bold" font-size="20px" color="#626262">
			YouTube Milestone Updates
		  </mj-text>
		</mj-column>
	  </mj-section>
		  <mj-section>
		<mj-column>
		  <mj-text line-height="20px" font-size="16px" color="#626262">
			Hi, ${user.displayName}! Here are the videos that hit your milestones today. 
		  </mj-text>
		</mj-column>
	  </mj-section>
	  ${emailBody}
	  <mj-section>
      <mj-column>
        <mj-text align="center" font-style="bold" font-size="16px" color="#626262">
          Made with ❤️ by Jordan Lewallen
        </mj-text>
      </mj-column>
    </mj-section>
	</mj-body>
  </mjml>`)

    return htmlOutput.html
}

function getThumbnailURL(thumbnails: any): string {
    var thumbnailProps = ['maxres', 'standard', 'high', 'medium', 'default'];

    var thumbnailURL = '';

    for (var prop of thumbnailProps) {
        if (prop in thumbnails) {
            thumbnailURL = thumbnails[prop].url
            break;
        }
    }

    return thumbnailURL

}

