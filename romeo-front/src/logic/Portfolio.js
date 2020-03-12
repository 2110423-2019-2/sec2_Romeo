import S3 from "common/s3";
import Config from "common/s3-config";
import { getCurrentClient } from "logic/Client";
import moment from "moment";

export const uploadPhotos = (event) => {
    // TODO: Move all this to backend
    let errors = [];
    let warnings = []
    if (event.target.files && event.target.files[0]) {
        if (event.target.files.length > 5) {
            errors.push({msg: "You can only upload a maximum number of 5 images at a time"})
            return {
                errors,
                warnings
            };
        }
        for (let i = 0; i < event.target.files.length ; i++) {
            const blob = event.target.files[i];
            if (blob.size / 1024 / 1024 >= 2) {
                // Greater Than 2 MB,
                warnings.push({msg: "One or more files are larger than 2MB. Please refresh the page to see uploaded photos."});
            } else {
                const splitBlobName = blob.name.split(".");
                const extension = splitBlobName[splitBlobName.length-1];
        
                const fileName = getCurrentClient().username + moment(new Date()) + "-" + i + "." + extension;
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
                        addPhoto([imageUrl]);
                        return {
                            errors,
                            warnings
                        };
                    }
                })
            }
        }
    }
    return {
        errors,
        warnings
    };
}

export const getPortfolio = (client) => {
    return client.photographer_photos;

}

export const addPhoto = (links) => {
    // TODO: Connect to Backend
    const currentPortfolio = getPortfolio();
    localStorage.setItem("portfolio", JSON.stringify({
        ...currentPortfolio,
        photos: [
            ...currentPortfolio.photos,
            ...links
        ]
    }));
}

export const setHilights = (indexes) => {
    // TODO: Connect to Backend
    const currentPortfolio = getPortfolio();
    localStorage.setItem("portfolio", JSON.stringify({
        ...currentPortfolio,
        hilights: indexes
    }));
}

export const removePhoto = async (key) => {
    // Remove from spaces
    const currentPortfolio = getPortfolio();

    const f = currentPortfolio.photos[key].split("/");
    const fileName = f[f.length-1];
    const params = { Bucket: `${Config.bucketName}`, Key: fileName};
    await S3.deleteObject(params).on('build', request => {
        request.httpRequest.headers.Host = `${Config.digitalOceanSpaces}`;
    }).send((err) => {
        if (err) {
            console.log(err);
        }
        localStorage.setItem("portfolio", JSON.stringify({
            ...currentPortfolio,
            photos: [
                ...currentPortfolio.photos.slice(0,key),
                ...currentPortfolio.photos.slice(key+1, currentPortfolio.photos.length)
            ]
        }));
        window.location.reload();
    })
}