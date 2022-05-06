import React, {Suspense} from 'react';
import ProfileSkeleton from "./ProfileSkeleton";
import ReactLazyPreload from "../../utils/ReactLazyPreload";

const ProfilePage = ReactLazyPreload(()=>import("./ProfilePage"));

const ProfilePageSimple = (props) => {
	return (
		<div>
			<Suspense fallback={<ProfileSkeleton />}>
				<ProfilePage {...props} />
			</Suspense>
		</div>
	);
};

export default ProfilePageSimple;