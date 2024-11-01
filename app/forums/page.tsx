"use client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { db } from "@/context/Firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import Button from "@/components/Button";

const ForumPage = () => {
  const [posts, setPosts] = useState<any[]>([]); // Update the type of posts
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoadingPosts(false);
    });

    return unsubscribe;
  }, [authLoading]);

  const handlePostSubmit = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }

    setPosting(true);
    try {
      await addDoc(collection(db, "posts"), {
        title: newTitle,
        content: newBody,
        userId: user.uid || "unknown-user",
        displayName: user.displayName || "Anonymous",
        profileImage: user.photoURL || "/default-avatar.png",
        university: "Sample University",
        timestamp: new Date(),
        replies: [],
      });
      setNewTitle("");
      setNewBody("");
    } catch (error) {
      console.error("Error posting document:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }

    try {
      await deleteDoc(doc(db, "posts", postId));
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleReplySubmit = async (postId: string, replyContent: string) => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }
    if (!replyContent.trim()) return;

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
            timestamp: new Date(),
          },
        ],
      });
      toast.success("Reply added successfully.");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Update the input for adding replies
  const handleReplyKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    postId: string
  ) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement; // Type assertion
      handleReplySubmit(postId, target.value);
      target.value = ""; // Clear the input
    }
  };

  const handleDeleteReply = async (postId: string, replyIndex: number) => {
    const postRef = doc(db, "posts", postId);
    try {
      const post = posts.find((post) => post.id === postId);
      const updatedReplies = post.replies.filter(
        (_: any, index: number) => index !== replyIndex
      );

      await updateDoc(postRef, {
        replies: updatedReplies,
      });
      toast.success("Reply deleted successfully.");
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-md-3 col-lg-2">
            <div className="card mb-4" style={{ width: "100%" }}>
              <img src="..." className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#createPostModal"
                >
                  Create Post
                </button>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">An item</li>
                <li className="list-group-item">A second item</li>
                <li className="list-group-item">A third item</li>
              </ul>
              <div className="card-body">
                <a href="#" className="card-link">
                  Card link
                </a>
                <a href="#" className="card-link">
                  Another link
                </a>
              </div>
            </div>
            {/* Modal for Create Post */}
            <div
              className="modal fade"
              id="createPostModal"
              tabIndex={-1}
              aria-labelledby="createPostModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="createPostModalLabel">
                      Create Post
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter heading or question"
                    />
                    <textarea
                      className="form-control mb-2"
                      rows={3}
                      value={newBody}
                      onChange={(e) => setNewBody(e.target.value)}
                      placeholder="Enter content"
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
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

          <div className="col-md-6 col-lg-8">
            <div className="forum-container">
              <h3 className="mb-4">Forum</h3>
              {authLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {loadingPosts ? (
                    <p>Loading posts...</p>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="card mb-4">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-2">
                            <img
                              src={post.profileImage}
                              alt="Profile"
                              className="rounded-circle me-2"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <div>
                              <h5 className="card-title mb-0">
                                {post.displayName}
                              </h5>
                              <small className="text-muted">
                                {post.university}
                              </small>
                            </div>
                          </div>
                          <h2 className="card-title">{post.title}</h2>
                          <p className="card-text">{post.content}</p>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete Post
                          </button>

                          {/* Replies Section */}
                          <div className="mt-4">
                            <h6>Replies</h6>
                            {post.replies &&
                              post.replies.map(
                                (
                                  reply: {
                                    profileImage: string;
                                    displayName: string;
                                    content: string;
                                    userId: string;
                                  },
                                  index: number
                                ) => (
                                  <div key={index} className="card mt-2">
                                    <div className="card-body">
                                      <div className="d-flex align-items-center">
                                        <img
                                          src={reply.profileImage}
                                          alt="Reply Profile"
                                          className="rounded-circle me-2"
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                          }}
                                        />
                                        <div>
                                          <h6 className="card-title mb-0">
                                            {reply.displayName}
                                          </h6>
                                        </div>
                                      </div>
                                      <p className="card-text mt-2">
                                        {reply.content}
                                      </p>
                                      {reply.userId === user?.uid && (
                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={() =>
                                            handleDeleteReply(post.id, index)
                                          }
                                        >
                                          Delete Reply
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            <input
                              type="text"
                              className="form-control mt-2"
                              placeholder="Write a reply..."
                              onKeyDown={(e) => handleReplyKeyDown(e, post.id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-md-3 col-lg-2">
            {/* Sidebar content */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Sidebar Title</h5>
                <p className="card-text">Some content for the sidebar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForumPage;
