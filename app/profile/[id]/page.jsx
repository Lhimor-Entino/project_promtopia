"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const username = searchParams.get("name");
  const userId = params.id; //FORM THE URL

  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    const response = await fetch(`/api/users/${userId}/posts`);
    const data = await response.json();

    setPosts(data);
  };

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, []);

  return (
    <div>
      <Profile
        name={session?.user.id === userId ? "My" : username.toUpperCase()}
        desc={`Welcome to ${username} personalized profile page. Explore ${username} exceptional prompts and be inspired by the  power of their imagination`}
        data={posts}
      />
    </div>
  );
};

export default UserProfile;
