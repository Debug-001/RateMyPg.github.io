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
import { CgProfile } from "react-icons/cg";
import { IoHome } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import Link from "next/link";
import { TiLocationArrow } from "react-icons/ti";
import { TiLocationArrowOutline } from "react-icons/ti";
import { RiSearchEyeLine } from "react-icons/ri";
import { RiSearchEyeFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";

interface Reply {
  userId: string;
  displayName: string;
  profileImage: string;
  content: string;
  timestamp: Timestamp;
  likes: string[];
}

interface ForumPost {
  date: ReactNode;
  id: string;
  title: string;
  content: string;
  userId: string;
  displayName: string;
  profileImage: string;
  university: string;
  timestamp: Timestamp;
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

  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isPopularActive, setIsPopularActive] = useState(false);
  const [isExploreActive, setIsExploreActive] = useState(false);

  const handlePostLike = async (postId: string) => {
    if (!checkUserAuthenticated()) return;

    const postRef = doc(db, "posts", postId);
    const post = posts.find((post) => post.id === postId);
    const isLiked = post?.likes.includes(user.uid);

    const updatedLikes = isLiked
      ? post?.likes.filter((id) => id !== user.uid)
      : [...(post?.likes || []), user.uid];

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
    if (!newTitle.trim() || !newBody.trim() || !checkUserAuthenticated())
      return;

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
        likes: [],
      });
      setNewTitle("");
      setNewBody("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error posting document:", error);
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

  const getActiveClass = (isActive: any) =>
    isActive ? "bg-secondary text-white" : "text-dark";

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="container-fluid p-4">
        <div className="row pt-5">
          <div className="col-md-4 col-lg-3 mx-4">
            <div className="card mb-4 shadow" style={{ width: "100%" }}>
              <ul className="list-group list-group-flush">
                <div
                  className="gap-4 p-3 d-flex flex-column align-items-start"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    onClick={() => setIsHomeActive(!isHomeActive)}
                    onMouseEnter={() => setIsHomeActive(true)}
                    onMouseLeave={() => setIsHomeActive(false)}
                    className={`px-3 py-2 d-flex align-items-center gap-2 rounded ${getActiveClass(
                      isHomeActive
                    )}`}
                    style={{ width: "200px" }}
                  >
                    <Link
                      href="/"
                      className="d-flex align-items-center gap-2 w-100"
                      style={{ color: isHomeActive ? "white" : "black" }}
                    >
                      {isHomeActive ? (
                        <IoHome size={21} />
                      ) : (
                        <IoHomeOutline size={21} />
                      )}
                      <span className="d-none d-md-block fs-5">Home</span>
                    </Link>
                  </div>

                  <div
                    onClick={() => setIsPopularActive(!isPopularActive)}
                    onMouseEnter={() => setIsPopularActive(true)}
                    onMouseLeave={() => setIsPopularActive(false)}
                    className={`px-3 py-2 d-flex align-items-center gap-2 rounded ${getActiveClass(
                      isPopularActive
                    )}`}
                    style={{ width: "200px" }} // Same fixed width
                  >
                    <Link
                      href="/"
                      className="d-flex align-items-center gap-2 w-100"
                      style={{ color: isPopularActive ? "white" : "black" }}
                    >
                      {isPopularActive ? (
                        <TiLocationArrow size={25} />
                      ) : (
                        <TiLocationArrowOutline size={25} />
                      )}
                      <span className="d-none d-md-block fs-5">Popular</span>
                    </Link>
                  </div>

                  <div
                    onClick={() => setIsExploreActive(!isExploreActive)}
                    onMouseEnter={() => setIsExploreActive(true)}
                    onMouseLeave={() => setIsExploreActive(false)}
                    className={`px-3 py-2 d-flex align-items-center gap-2 rounded ${getActiveClass(
                      isExploreActive
                    )}`}
                    style={{ width: "200px" }} // Same fixed width
                  >
                    <Link
                      href="/"
                      className="d-flex align-items-center gap-2 w-100"
                      style={{ color: isExploreActive ? "white" : "black" }}
                    >
                      {isExploreActive ? (
                        <RiSearchEyeFill size={24} />
                      ) : (
                        <RiSearchEyeLine size={24} />
                      )}
                      <span className="d-none d-md-block fs-5">Explore</span>
                    </Link>
                  </div>
                </div>
              </ul>
              <div className="card-body">
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Create a Post
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <button
                          type="button"
                          className="d-flex gap-2 align-items-center rounded mt-2 btn-custom"
                          data-bs-toggle="modal"
                          data-bs-target="#createPostModal"
                        >
                        <CiCirclePlus size={23}/>  Add your Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="list-group list-group-flush">
                <h2 className="fs-4 p-2 mx-3 mt-3">Communities:</h2>
                {posts.slice(0, 3).map((post) => (
                  <li
                    key={post.id}
                    className="list-group-item d-flex align-items-center gap-3 py-3 px-2 flex-wrap"
                  >
                    <div className="mx-2">
                      <div className="d-flex align-items-start gap-2">
                        <CgProfile
                          size={24}
                          className="text-secondary flex-shrink-0"
                        />

                        <div style={{ maxWidth: "100%" }}>
                          <h6
                            className="mb-1 fw-bold text-truncate"
                            style={{ lineHeight: "1.2", maxWidth: "250px" }}
                          >
                            {post.title}
                          </h6>
                          <small className="text-muted">
                            Posted on:{" "}
                            {post.timestamp.toDate().toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* modal code */}
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
                      Create your Post
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
                      placeholder="Enter your Question...."
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
          <div className="col-md-9 col-lg-8 mx-2 shadow pt-3 p-4 px-4 rounded">
            <h2 className="mb-4  fw-bold">Student Forum's</h2>
            {loadingPosts ? (
              <div>Loading...</div>
            ) : posts.length === 0 ? (
              <div>No posts available.</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="mb-4 border p-3">
                  <div className="d-flex align-items-start">
                    <img
                      src={post.profileImage}
                      alt={post.displayName}
                      className="rounded-circle"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                      }}
                    />
                    <div className="p-2">
                      <h2 className="fs-4 fw-bold mt-2">{post.title}</h2>
                      <small className="text-muted">
                        Posted by {post.displayName} on{" "}
                        {post.timestamp.toDate().toLocaleString()}
                      </small>
                      <p className="mt-2">{post.content}</p>
                    </div>
                  </div>

                  <p className="px-5 mx-3 pt-3">{post.content}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <button
                        onClick={() => handlePostLike(post.id)}
                        className={`btn ${
                          post.likes.includes(user?.uid)
                            ? "btn-danger"
                            : "btn-outline-danger"
                        } me-2`}
                      >
                        <IoMdHeartEmpty /> {post.likes.length}
                      </button>
                      {user?.uid === post.userId && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </button>
                      )}
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
                            src={reply.profileImage}
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
                          {user?.uid === reply.userId && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteReply(post.id, index)}
                            >
                              Delete Reply
                            </button>
                          )}
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
