"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { IoMdHeartEmpty } from "react-icons/io";
import { db } from "@/context/Firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { CiCirclePlus } from "react-icons/ci";
import { PiFunnel } from "react-icons/pi";
import { GoComment } from "react-icons/go";
import { GoShareAndroid } from "react-icons/go";
import Heart from "react-heart";
import Link from "next/link";

interface Reply {
  user: any;
  userId: string;
  displayName: string;
  userPhotoURL: string;
  content: string;
  timestamp: Timestamp;
  likes: string[];
}

interface ForumPost {
  user: any;
  imageURL: string;
  date: ReactNode;
  id: string;
  title: string;
  content: string;
  userId: string;
  displayName: string;
  userPhotoURL: string;
  university: string;
  timestamp: Timestamp;
  tags: string;
  replies: Reply[];
  likes: string[];
}

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const { user, loading: authLoading } = useAuth();
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [likedPosts, setLikedPosts] = useState({}); // To track liked posts by ID

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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    if (value.includes(" ")) {
      const newTag = value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
      setTagsInput("");
    }
  };

  useEffect(() => {
    if (authLoading) return;

    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp || Timestamp.now(),
          replies: data.replies || [],
          likes: data.likes || [],
        } as ForumPost;
      });

      postsData.sort((a, b) => {
        if (b.replies.length !== a.replies.length) {
          return b.replies.length - a.replies.length;
        }
        return b.timestamp.toMillis() - a.timestamp.toMillis();
      });
      setPosts(postsData);
      setLoadingPosts(false);
    });

    return unsubscribe;
  }, [authLoading]);

  const checkUserAuthenticated = () => {
    if (!user) {
      toast.error("Please sign in first.");
      return false;
    }
    return true;
  };

  const handlePostLike = async (postId: string) => {
    if (!checkUserAuthenticated()) return;

    const postRef = doc(db, "posts", postId);
    const post = posts.find((post) => post.id === postId);
    const isLiked = post?.likes.includes(user.uid);

    const updatedLikes = isLiked
      ? post?.likes.filter((id) => id !== user.uid)
      : [...(post?.likes || []), user.uid];

    // Update the local state for the like status and count
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !isLiked, // Toggle the like status
    }));

    // Update the post's like count in the database
    try {
      await updateDoc(postRef, { likes: updatedLikes });
      toast.success(isLiked ? "Like removed" : "Liked!");
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleReplyLike = async (postId: string, replyIndex: number) => {
    if (!checkUserAuthenticated()) return;

    const postRef = doc(db, "posts", postId);
    const post = posts.find((post) => post.id === postId);
    if (!post) return;

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

  const handlePostSubmit = async () => {
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error("Please fill in both Title and Content fields.");
      return;
    }
    if (!checkUserAuthenticated()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "posts"), {
        title: newTitle,
        content: newBody,
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
        profileImage: user.photoURL || "/default-avatar.png",
        university: "Sample University",
        timestamp: Timestamp.now(),
        replies: [],
        tags: tags, // Save the tags with the post
        likes: [],
      });
      setNewTitle("");
      setNewBody("");
      setTags([]); // Clear tags after posting
      toast.success("Post created successfully!");
      const closeButton = document.querySelector(
        '.btn-close[data-bs-dismiss="modal"]'
      ) as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    } catch (error) {
      console.error("Error posting document:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!checkUserAuthenticated()) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleReplySubmit = async (postId: string, replyContent: string) => {
    if (!checkUserAuthenticated() || !replyContent.trim()) return;

    const postRef = doc(db, "posts", postId);
    try {
      await updateDoc(postRef, {
        replies: [
          ...(posts.find((post) => post.id === postId)?.replies || []),
          {
            userId: user.uid,
            displayName: user.displayName || "Anonymous",
            profileImage: user.photoURL || "/default-avatar.png",
            content: replyContent,
            timestamp: Timestamp.now(),
            likes: [],
          },
        ],
      });
      toast.success("Reply added successfully.");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteReply = async (postId: string, replyIndex: number) => {
    const postRef = doc(db, "posts", postId);
    try {
      const post = posts.find((post) => post.id === postId);
      const updatedReplies = post?.replies.filter(
        (_, index) => index !== replyIndex
      );

      await updateDoc(postRef, { replies: updatedReplies });
      toast.success("Reply deleted successfully.");
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="container-fluid d-flex flex-column p-4">
        <div className="d-flex flex-column flex-md-row gap-4 justify-content-between align-items-center">
          <h2 className="fw-bold text-center text-md-start">Student Forum's</h2>
          <div className="d-flex gap-3 align-items-center justify-content-center justify-content-md-end">
            <button className="btn-filter rounded gap-2 d-flex align-items-center">
              <PiFunnel size={20} />
              Filter
            </button>
            <button
              type="button"
              className="d-flex gap-2 align-items-center rounded btn-post"
              data-bs-toggle="modal"
              data-bs-target="#createPostModal"
            >
              <CiCirclePlus size={23} /> Add Post
            </button>
          </div>
          {/* modal section */}
          <div
            className="modal fade"
            id="createPostModal"
            tabIndex={-1}
            aria-labelledby="createPostModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "600px" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="createPostModalLabel">
                    Create New Post
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div>
                    <p>Title</p>
                    <input
                      type="text"
                      className="form-control"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="What's your question about?"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tagsInput" className="form-label">
                      Tags (Hit Space to enter)
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      <input
                        type="text"
                        id="tagsInput"
                        className="form-control"
                        placeholder="Enter tags"
                        value={tagsInput}
                        onChange={handleTagsChange}
                      />
                      <div className="d-flex gap-2 flex-wrap">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`badge rounded-pill text-dark text-bg-${
                              btnColors[index % btnColors.length]
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p>Content</p>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newBody}
                      onChange={(e) => setNewBody(e.target.value)}
                      placeholder="Provide more details about your question.."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePostSubmit}
                    disabled={posting}
                  >
                    {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* forums section */}
        <div className="container pt-5">
          <div className="mx-2 pt-3 p-4 px-4 rounded">
            {loadingPosts ? (
              <div>Loading...</div>
            ) : posts.length === 0 ? (
              <div>No posts available.</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="shadow rounded mb-5 p-3">
                  <div className="d-flex align-items-start">
                    <img
                      src={user?.photoURL || 'Hi'}
                      alt={user?.displayName || "User Profile"}
                      width="35"
                      height="35"
                      style={{ borderRadius: "50%" }}
                    />
                    <div className="px-3 w-100">
                    <Link href={`/forums/${post.id}`}>
                    <h2 className="fs-4 fw-normal">{post.title}</h2>
                    </Link>
                      <div className="d-flex align-items-center flex-wrap">
                        <small className="text-muted me-3">
                          Posted at {post.timestamp.toDate().toLocaleString()}
                        </small>
                        <div className="d-flex flex-wrap gap-2">
                          {(Array.isArray(post.tags) ? post.tags : []).map(
                            (tag, index) => (
                              <span
                                key={index}
                                className={`badge rounded-pill text-light text-bg-${
                                  btnColors[index % btnColors.length]
                                }`}
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <p className="mt-2">{post.content}</p>
                    </div>
                  </div>
                  <div className="d-flex mx-5 justify-content-between align-items-center">
                    <div className="d-flex text-muted gap-3 align-items-center">
                      <div
                        onClick={() => handlePostLike(post.id)}
                        className=""
                      >
                        <Heart style={{width:"16px"}}
                           isActive={
                            likedPosts[post.id] || post.likes.includes(user?.uid)
                          } 
                          onClick={() =>
                            setLikedPosts((prev) => ({
                              ...prev,
                              [post.id]: !prev[post.id],
                            }))
                          } 
                        /> &nbsp; {post.likes.length} Likes
                      </div>
                      <div className="">
                        <GoShareAndroid size={22} /> Share
                      </div>
                    </div>
                    <button
                      className="btn btn-link"
                      data-bs-toggle="collapse"
                      data-bs-target={`#replies-${post.id}`}
                      aria-expanded="false"
                      aria-controls={`replies-${post.id}`}
                    >
                      {post.replies.length} Replies
                    </button>
                  </div>
                  <div className="collapse" id={`replies-${post.id}`}>
                    {post.replies.map((reply, index) => (
                      <div key={index} className="mt-2 border p-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={reply.user.photoURL || ''}
                            alt={reply.displayName}
                            className="rounded-circle"
                            style={{
                              width: "30px",
                              height: "30px",
                              marginRight: "5px",
                            }}
                          />
                          <div>
                            <h6 className="m-0">{reply.displayName}</h6>
                            <small className="text-muted">
                              {reply.timestamp.toDate().toLocaleString()}
                            </small>
                          </div>
                        </div>
                        <p>{reply.content}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <button
                            onClick={() => handleReplyLike(post.id, index)}
                            className={`btn ${
                              reply.likes.includes(user?.uid)
                                ? "btn-danger"
                                : "btn-outline-danger"
                            } me-2`}
                          >
                            <IoMdHeartEmpty /> {reply.likes.length}
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteReply(post.id, index)}
                          >
                            <GoShareAndroid size={23} /> Share
                          </button>
                        </div>
                      </div>
                    ))}
                    <textarea
                      className="form-control mb-2"
                      placeholder="Write a reply..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReplySubmit(
                            post.id,
                            (e.target as HTMLTextAreaElement).value
                          );
                          (e.target as HTMLTextAreaElement).value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForumPage;
