import React, {Suspense} from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import AddPostSkeleton from "./AddPostSkeleton";
const AddPost = ReactLazyPreload(()=>import("src/pages/admin/AddPost"));

const AddPostSimple = (props) => {
    return (
        <div>
            <Suspense fallback={<AddPostSkeleton />}>
                <AddPost {...props} />
            </Suspense>
        </div>
    );
};

export default AddPostSimple;

