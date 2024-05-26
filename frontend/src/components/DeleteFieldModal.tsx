const DeleteFieldModal = ({ onClose, onDelete }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-lg transition-all w-100 p-2">
                <div className="bg-white px-4 pb-4 pt-5">
                    <p>Are you sure you want to delete this field?</p>
                </div>
                <div className="px-4 py-3 flex justify-end">
                    <button 
                        onClick={() => {
                            onDelete();
                            onClose();
                        }}
                        type="button" 
                        className="inline-flex justify-center rounded-md bg-[#1976D2] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-80 mr-3"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={onClose} 
                        type="button" 
                        className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteFieldModal;
