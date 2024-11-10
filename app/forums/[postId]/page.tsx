"use client";
import React, { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useParams } from "next/navigation";
import { IoMdHeartEmpty } from "react-icons/io";
import { db } from "@/context/Firebase";
import Heart from "react-heart";
import { AiOutlineDelete } from "react-icons/ai";
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { GoShareAndroid } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";

interface Reply {
  userId: string;
  displayName: string;
  userPhotoURL: string;
  content: string;
  timestamp: Timestamp;
  likes: string[];
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  userId: string;
  displayName: string;
  userPhotoURL: string;
  timestamp: Timestamp;
  tags: string[];
  replies: Reply[];
  likes: string[];
}

const PostPage: React.FC = () => {
  const router = useRouter();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [newReply, setNewReply] = useState("");
  const { user } = useAuth();
  const params = useParams();
  const postId = params?.postId as string;
  const [imgError, setImgError] = useState(false);

  const btnColors = [
    "primary",
    "info",
    "secondary",
    "warning",
    "danger",
    "success",
    "light",
    "dark",
  ];

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = onSnapshot(doc(db, "posts", postId), (doc) => {
      if (doc.exists()) {
        setPost({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp || Timestamp.now(),
          replies: doc.data().replies || [],
          likes: doc.data().likes || [],
        } as ForumPost);
        setLoadingPost(false);
      } else {
        setPost(null);
        setLoadingPost(false);
      }
    });

    return unsubscribe;
  }, [postId]);

  const checkUserAuthenticated = () => {
    if (!user) {
      toast.error("Please sign in first.");
      return false;
    }
    return true;
  };

  const [likedPosts, setLikedPosts] = useState({});

  const handlePostLike = async (postId) => {
    if (!checkUserAuthenticated() || !post) return;

    const postRef = doc(db, "posts", postId);
    const isLiked = post.likes.includes(user.uid);
    const updatedLikes = isLiked
      ? post.likes.filter((id) => id !== user.uid)
      : [...post.likes, user.uid];

    try {
      await updateDoc(postRef, { likes: updatedLikes });
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
      toast.success(isLiked ? "Like removed" : "Liked!");
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleReplyLike = async (replyIndex: number) => {
    if (!checkUserAuthenticated() || !post) return;

    const postRef = doc(db, "posts", post.id);
    const replies = [...post.replies];
    const reply = replies[replyIndex];
    const isLiked = reply.likes.includes(user.uid);

    replies[replyIndex] = {
      ...reply,
      likes: isLiked
        ? reply.likes.filter((id) => id !== user.uid)
        : [...reply.likes, user.uid],
    };

    try {
      await updateDoc(postRef, { replies });
      toast.success(isLiked ? "Like removed from reply" : "Liked reply!");
    } catch (error) {
      console.error("Error updating reply like:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!user || !post || user.uid !== post.userId) return;
    try {
      router.push("/forums");
      toast.success("Post deleted successfully.");
      await deleteDoc(doc(db, "posts", post.id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleReplySubmit = async () => {
    if (!checkUserAuthenticated() || !newReply.trim() || !post) return;

    const postRef = doc(db, "posts", post.id);
    try {
      await updateDoc(postRef, {
        replies: [
          ...post.replies,
          {
            userId: user.uid,
            displayName: user.displayName || "Anonymous",
            userPhotoURL: user.photoURL || "/default-avatar.png",
            content: newReply,
            timestamp: Timestamp.now(),
            likes: [],
          },
        ],
      });
      setNewReply("");
      toast.success("Reply added successfully.");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="container shadow mt-5 mb-5 rounded p-4">
        {loadingPost ? (
          <div>Loading post...</div>
        ) : post ? (
          <div className=" p-3 rounded mb-4 ">
             <div className="d-flex gap-2 w-100 flex-wrap">
      {/* Profile Picture or Placeholder */}
      <div className="user-icon me-2">
        {!imgError ? (
          <Image
            src={user?.photoURL}
            alt="User Profile"
            width={40}
            height={40}
            style={{ borderRadius: '50%' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <CgProfile size={40} />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="fs-5 mb-0 me-2">{post.title}</h2>
          {/* Delete Button on the Right */}
          {user?.uid === post.userId && (
            <button
              className="btn-delete  ms-auto"
              onClick={handleDeletePost}
            >
              <AiOutlineDelete size={20} />
            </button>
          )}
        </div>

        {/* Post Metadata */}
        <div className="d-flex align-items-center flex-wrap mt-2">
          <small className="text-muted me-3">
            Posted at {post.timestamp.toDate().toLocaleString()}
          </small>
          <div className="d-flex flex-wrap gap-2">
            {(Array.isArray(post.tags) ? post.tags : []).map((tag, index) => (
              <span
                key={index}
                className={`badge rounded-pill text-light text-bg-${
                  btnColors[index % btnColors.length]
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <p className="post-content fs-5 text-black mt-2">{post.content}</p>
      </div>
    </div>
            <div className="d-flex mx-5 px-2 gap-3 text-muted">
              <div className="like-container">
                <Heart
                  style={{ width: "16px" }}
                  onClick={() => handlePostLike(post.id)}
                  isActive={
                    likedPosts[post.id] || post.likes.includes(user?.uid)
                  }
                />
                &nbsp; {post.likes.length} Likes
              </div>
              <div>
                <div className="">
                  <GoShareAndroid size={18} /> Share
                </div>
              </div>
            </div>
            <div className="comments mt-4">
              <h4 className="fs-6 mb-3">Replies</h4>
              {post.replies.map((reply, index) => (
                <div key={index} className="reply p-2  rounded mb-2">
                  <p className="mb-1">{reply.content}</p>
                  <button
                    className="btn btn-light btn-sm d-flex align-items-center"
                    onClick={() => handleReplyLike(index)}
                  >
                    <IoMdHeartEmpty className="me-1" />
                    {reply.likes.length}
                  </button>
                </div>
              ))}
              <div className="reply-input mt-4">
                <textarea
                  className="form-control mb-2"
                  placeholder="Write a reply..."
                  onChange={(e) => setNewReply(e.target.value)}
                  value={newReply}
                  rows={2}
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleReplySubmit}
                  disabled={!newReply.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>Post not found.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PostPage;
