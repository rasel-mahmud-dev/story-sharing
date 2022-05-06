import React, {Suspense} from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import PostDetailSkeleton from "./PostDetailSkeleton";


const PostDetails = ReactLazyPreload(()=>import("./PostDetails"))

const PostDetailSimple = () => {
    return (
        <div>
            <Suspense fallback={<PostDetailSkeleton />}>
                <PostDetails />
            </Suspense>
        </div>
    );
};

export default PostDetailSimple;