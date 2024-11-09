'use client';  // Make sure to keep this for client-side component

import { useSearchParams } from 'next/navigation';  // Use this hook instead of useRouter
import React, { useState, useEffect } from 'react';
import { db } from '@/context/Firebase';  // Ensure this path matches your firebase.js file
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';  // Adjust the path if needed

const PostPage = () => {
  const searchParams = useSearchParams();  // Use this to access query parameters
  const postId = searchParams.get('postId');  // Get postId from the URL query params
  const { user } = useAuth(); // Assuming `useAuth` provides current user information
  
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);  // Loading state to track loading status

  useEffect(() => {
    if (!postId) {
      setLoading(false);  // If there's no postId, stop loading
      return;
    }

    const fetchPost = async () => {
      setLoading(true);  // Set loading to true before fetching data
      try {
        // Correcting the Firestore document reference
        const postDocRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postDocRef);

        if (postDoc.exists()) {
          setPost(postDoc.data());
        } else {
          console.log('No such document!');
        }

        // Fetch replies for the post
        const repliesQuery = query(collection(db, 'replies'), where('postId', '==', postId));
        const repliesSnapshot = await getDocs(repliesQuery);
        const repliesList = repliesSnapshot.docs.map(doc => doc.data());
        setReplies(repliesList);
      } catch (error) {
        console.error('Error fetching post data: ', error);
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchPost();
  }, [postId]);

  // Show loading message if still loading
  if (loading) return <div>Loading...</div>;

  // Show the post content if it's loaded
  return (
    <div className="post-page-container">
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
      
      {/* Display user profile info if available */}
      {user && (
        <div className="user-profile">
          <img src={user.profilePicture} alt={user.displayName} className="user-profile-picture" />
          <span>{user.displayName}</span>
        </div>
      )}

      <div>
        <h2>Replies</h2>
        {replies.length > 0 ? (
          <ul>
            {replies.map((reply, index) => (
              <li key={index}>
                <strong>{reply.username}</strong>: {reply.replyText}
              </li>
            ))}
          </ul>
        ) : (
          <p>No replies yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostPage;
