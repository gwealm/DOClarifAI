import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "PDF"];

export function DragDrop({ children }) {
    const [file, setFile] = useState(null);
    // const [uploaded,setUpload] = useState(false);
    const handleChange = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const url = "http://localhost:8081/upload-file";
        fetch(url, {
            method: "POST",
            mode: 'cors',
            body: formData,
        })
        .then((response) => response.json())
        .catch((error) => console.error(`Error: ${error}`))
        .finally(() => console.log("File uploaded successfully"));
        
        setFile(file);
    };
    return (
        <FileUploader handleChange={handleChange} name="file" types={fileTypes}>
            {children}
        </FileUploader>
    );
}
