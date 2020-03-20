import S3 from "common/s3";
import Config from "common/s3-config";
import moment from "moment";
import Axios from "axios";

export const uploadPhotos = (event, username, currentPortfolio) => {
    let errors = [];
    if (event.target.files && event.target.files[0]) {
        const blob = event.target.files[0];
        if (blob.size / 1024 / 1024 >= 2) {
            // Greater Than 2 MB,
            errors.push({msg: "File size exceeds 2MB"});
        } else {
            const splitBlobName = blob.name.split(".");
            const extension = splitBlobName[splitBlobName.length-1];
    
            const fileName = username + moment(new Date()) + "." + extension;
            const params = { Body: blob, Bucket: `${Config.bucketName}`, Key: fileName};
            //Sending the file to the Spaces
            S3.putObject(params).on('build', request => {
                request.httpRequest.headers.Host = `${Config.digitalOceanSpaces}`;
                request.httpRequest.headers['Content-Length'] = blob.size;
                request.httpRequest.headers['Content-Type'] = blob.type;
                request.httpRequest.headers['x-amz-acl'] = 'public-read';
            }).send((err) => {
                if (err) {
                    console.log(err)
                } else {
                    // If there is no error updating the editor with the imageUrl
                    const imageUrl = `${Config.digitalOceanSpaces}` + fileName
                    Axios.patch("/api/photographers/" + username + '/', {
                        photographer_photos: [
                            ...currentPortfolio,
                            {
                                photo_link: imageUrl
                            }
                        ]
                    }).then(res => window.location.reload())
                }
            })
        }
    }
    return {
        errors
    }
}

export const removePhoto = async (key, currentPortfolio, username) => {
    // Remove from spaces
    const f = currentPortfolio[key].photo_link.split("/");
    const fileName = f[f.length-1];
    const params = { Bucket: `${Config.bucketName}`, Key: fileName};
    await S3.deleteObject(params).on('build', request => {
        request.httpRequest.headers.Host = `${Config.digitalOceanSpaces}`;
    }).send((err) => {
        if (err) {
            console.log(err);
        }
        Axios.patch("/api/photographers/" + username + '/', {
            photographer_photos: [
                ...currentPortfolio.slice(0,key),
                ...currentPortfolio.slice(key+1)
            ]
        })
        window.location.reload();
    })
}