import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox,faSkullCrossbones, faCheck ,faCircle} from '@fortawesome/free-solid-svg-icons';
const fileTypes = ["JPG", "PNG", "PDF"];

export function DragDrop() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('noupload');
    const handleChange = (file) => {
        setUploadStatus('uploading');
        const formData = new FormData();
        formData.append("file", file);
        const url = "http://localhost:8081/upload-file";
        fetch(url, {
            method: "POST",
            mode: 'cors',
            body: formData,
        })
            .then((response) => {
                response.json();
                setUploadStatus('success');
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                setUploadStatus('error');
            })
            .finally(() => console.log("File uploaded successfully"));

        setFile(file);
    };
    const map = {
        'noupload':{
            icon: <FontAwesomeIcon icon={faBox} bounce size="2x" style={{ color: 'gray' }} />,
            text: "Upload a file"
        },
        'error': {
            icon: <FontAwesomeIcon icon={faSkullCrossbones} bounce size="2x" style={{ color: 'red' }} />,
            text: "Error uploading a file"
        },
        'success': {
            icon: <FontAwesomeIcon icon={faCheck} bounce size="2x" style={{ color: 'green' }} />,
            text: "File uploaded successfully!"
        },
        'uploading': {
            icon: <FontAwesomeIcon icon={faCircle} bounce size="2x" style={{ color: 'yellow' }} />,
            text: "Uploading..."
        }
    }
    return (
        <FileUploader handleChange={handleChange} name="file" types={fileTypes}>
            <div className="flex flex-col h-40 items-center justify-center border-2 border-dashed border-blue-300 text-gray-700 rounded-md p-6 mb-4 w-3/4 mx-auto">
                <div className="mb-4">
                    {map[uploadStatus].icon}
                    <p>{map[uploadStatus].text}</p>
                </div>
            </div>
        </FileUploader>
    );
}
